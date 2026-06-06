// Server-side Clover API client — shared by the Vercel function (api/menu.mjs)
// and the Vite dev middleware (vite.config.js). Tokens NEVER reach the browser.

const CLOVER_BASE = 'https://api.clover.com/v3';

// slug → Clover merchant. Token env var per merchant (Clover issues one token per location).
export const MERCHANTS = {
  'culebra-1':   { merchantId: 'Q0H4WNJM3AKC1', tokenEnv: 'CLOVER_TOKEN_1', name: 'Culebra 1' },
  'culebra-2':   { merchantId: '9AZXR97QFT0N1', tokenEnv: 'CLOVER_TOKEN_2', name: 'Culebra 2' },
  'nacogdoches': { merchantId: 'G25J905ETG1P1', tokenEnv: 'CLOVER_TOKEN_3', name: 'Nacogdoches' },
  'alamo-ranch': { merchantId: 'KXFSQPCJ6B991', tokenEnv: 'CLOVER_TOKEN_4', name: 'Alamo Ranch' },
  'marbach':     { merchantId: '9380T7E7V33B1', tokenEnv: 'CLOVER_TOKEN_5', name: 'Marbach' },
};

export function resolveMerchant(slug) {
  return MERCHANTS[slug] ?? null;
}

// POS-only buckets that should never show on the public menu.
const EXCLUDED_CATEGORIES = /test|print/i;

// Public menu reads better leading with food; Clover's sortOrder leads with sodas.
const CATEGORY_ORDER = [
  'chicken', 'beef', 'parrilladas', 'papa nortena', 'burgers',
  'desserts', 'drinks', 'canned sodas', 'extras',
];

function normalizeName(name) {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function categoryRank(name) {
  const index = CATEGORY_ORDER.indexOf(normalizeName(name));
  return index === -1 ? CATEGORY_ORDER.length : index;
}

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

// Pages through a Clover collection endpoint — fixed limits silently truncate
// large catalogs (e.g. >200 modifier groups would drop required combo choices).
async function fetchAll(url, headers, limit = 500) {
  const all = [];
  for (let offset = 0; ; offset += limit) {
    const sep = url.includes('?') ? '&' : '?';
    const pageUrl = `${url}${sep}limit=${limit}&offset=${offset}`;
    let res = await fetch(pageUrl, { headers });
    if (res.status === 429) {
      // Clover rate limit — back off once and retry the page.
      await new Promise((resolve) => setTimeout(resolve, 1100));
      res = await fetch(pageUrl, { headers });
    }
    if (!res.ok) {
      throw new Error(`Clover API error ${res.status} for ${url.split('?')[0]}`);
    }
    const batch = (await res.json()).elements ?? [];
    all.push(...batch);
    if (batch.length < limit) return all;
  }
}

// Per-instance menu cache: /api/menu hits and per-checkout validation share
// it, keeping Clover API usage well under its rate limits.
const MENU_CACHE = new Map(); // merchantId -> { menu, expires }
const MENU_TTL_MS = 60_000;

export async function fetchMenu(merchant, env) {
  const token = env[merchant.tokenEnv];
  if (!token) throw new Error(`Missing ${merchant.tokenEnv} environment variable`);

  const { merchantId } = merchant;
  const cached = MENU_CACHE.get(merchantId);
  if (cached && cached.expires > Date.now()) return cached.menu;

  const headers = { Authorization: `Bearer ${token}` };

  const [categories, items, rawGroups] = await Promise.all([
    fetchAll(`${CLOVER_BASE}/merchants/${merchantId}/categories`, headers),
    fetchAll(`${CLOVER_BASE}/merchants/${merchantId}/items?expand=categories,modifierGroups`, headers),
    fetchAll(`${CLOVER_BASE}/merchants/${merchantId}/modifier_groups?expand=modifiers`, headers),
  ]);

  // Resolve modifier groups once per merchant; items reference them by id.
  const groupsById = new Map();
  for (const group of rawGroups) {
    if (group.deleted) continue;
    const modifiers = (group.modifiers?.elements ?? [])
      .filter((mod) => !mod.deleted && mod.available !== false && typeof mod.price === 'number' && Number.isFinite(mod.price))
      .map((mod) => ({
        id: mod.id,
        name: mod.name,
        price: mod.price,
        priceFormatted: formatPrice(mod.price),
      }));
    if (modifiers.length === 0) continue;
    const maxAllowed = group.maxAllowed ?? 0; // 0 = unlimited
    // Bad POS data with minRequired > maxAllowed would deadlock the picker UI.
    const minRequired = maxAllowed > 0
      ? Math.min(group.minRequired ?? 0, maxAllowed)
      : (group.minRequired ?? 0);
    groupsById.set(group.id, {
      id: group.id,
      name: group.name,
      minRequired,
      maxAllowed,
      sortOrder: group.sortOrder ?? 0,
      modifiers,
    });
  }

  const buckets = new Map();
  const parentOf = new Map();
  for (const cat of categories) {
    if (cat.deleted || EXCLUDED_CATEGORIES.test(cat.name)) continue;
    if (cat.parentCategory?.id) parentOf.set(cat.id, cat.parentCategory.id);
    buckets.set(cat.id, {
      id: cat.id,
      name: cat.name,
      sortOrder: cat.sortOrder ?? 0,
      items: [],
    });
  }

  for (const item of items) {
    if (item.deleted || item.hidden || item.available === false) continue;
    // Items without a usable price would render as $NaN and poison cart math.
    if (typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0) continue;

    const itemGroups = (item.modifierGroups?.elements ?? [])
      .map((group) => groupsById.get(group.id))
      .filter(Boolean)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const normalized = {
      id: item.id,
      name: item.onlineName || item.name,
      description: item.description || '',
      price: item.price,
      priceFormatted: formatPrice(item.price),
      modifierGroups: itemGroups,
      requiresModifiers: itemGroups.some((group) => group.minRequired > 0),
    };

    const catIds = (item.categories?.elements ?? [])
      .map((cat) => cat.id)
      .filter((id) => buckets.has(id));

    // When an item sits in both a parent and its child category (e.g. DRINKS
    // and CANNED SODAS), keep only the more specific child to avoid duplicates.
    const specific = catIds.filter((id) => !catIds.some((other) => parentOf.get(other) === id));

    for (const id of specific) {
      buckets.get(id).items.push({ ...normalized });
    }
  }

  const menuCategories = [...buckets.values()]
    .filter((cat) => cat.items.length > 0)
    .sort((a, b) => (categoryRank(a.name) - categoryRank(b.name)) || (a.sortOrder - b.sortOrder));

  for (const cat of menuCategories) {
    cat.items.sort((a, b) => a.name.localeCompare(b.name));
  }

  const menu = {
    merchantId,
    location: merchant.name,
    categories: menuCategories,
    fetchedAt: new Date().toISOString(),
  };
  MENU_CACHE.set(merchantId, { menu, expires: Date.now() + MENU_TTL_MS });
  return menu;
}

const CHECKOUT_URL = 'https://api.clover.com/invoicingcheckoutservice/v1/checkouts';
const ITEM_ID_PATTERN = /^[A-Z0-9]{13}$/;

// Creates a Clover Hosted Checkout session. Clover resolves prices/taxes from
// the item IDs server-side, so a tampered client can't change what gets charged.
export async function createCheckout(merchant, env, { customer, lines }) {
  const token = env[merchant.tokenEnv];
  if (!token) throw new Error(`Missing ${merchant.tokenEnv} environment variable`);

  if (!Array.isArray(lines) || lines.length === 0 || lines.length > 50) {
    throw Object.assign(new Error('Invalid cart'), { status: 400 });
  }

  // Resolve the live menu once and validate every line against it — the
  // client can't attach modifiers from other items, exceed a group's cap,
  // or skip a required choice. Prices stay authoritative on Clover's side.
  const menu = await fetchMenu(merchant, env);
  const itemsById = new Map();
  for (const category of menu.categories) {
    for (const item of category.items) {
      itemsById.set(item.id, item);
    }
  }

  const invalidLine = () => Object.assign(new Error('Invalid cart line'), { status: 400 });

  const lineItems = lines.map(({ id, qty, modifiers, note }) => {
    const unitQty = Math.floor(Number(qty));
    if (!ITEM_ID_PATTERN.test(id ?? '') || !Number.isFinite(unitQty) || unitQty < 1 || unitQty > 50) {
      throw invalidLine();
    }
    const item = itemsById.get(id);
    if (!item) throw invalidLine();

    const submitted = Array.isArray(modifiers) ? modifiers : [];
    if (submitted.length > 30) throw invalidLine();

    const groupOfModifier = new Map();
    for (const group of item.modifierGroups) {
      for (const mod of group.modifiers) {
        groupOfModifier.set(mod.id, group.id);
      }
    }

    const countByGroup = new Map();
    for (const modifierId of submitted) {
      const groupId = groupOfModifier.get(modifierId);
      if (!groupId) throw invalidLine(); // not a modifier of this item
      countByGroup.set(groupId, (countByGroup.get(groupId) ?? 0) + 1);
    }
    for (const group of item.modifierGroups) {
      const count = countByGroup.get(group.id) ?? 0;
      if (count < group.minRequired) throw invalidLine();
      if (group.maxAllowed > 0 && count > group.maxAllowed) throw invalidLine();
    }

    const line = { itemRefUuid: id, unitQty };
    if (submitted.length > 0) {
      line.modifications = submitted.map((modifierId) => ({ modifierRefUuid: modifierId }));
    }

    // Human-readable backup so the kitchen sees the choices on the order even
    // if a POS view doesn't surface structured modifications.
    const cleanNote = String(note ?? '').replace(/\s+/g, ' ').trim().slice(0, 255);
    if (cleanNote) line.note = cleanNote;

    return line;
  });

  const email = String(customer?.email ?? '').trim();
  const fullName = String(customer?.name ?? '').trim();
  // Clover rejects malformed emails with a 400 — catch the common typos here
  // (e.g. "user@gmail,com") so the UI can show a specific, actionable error.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    throw Object.assign(new Error('invalid_email'), { status: 400 });
  }
  if (!fullName) {
    throw Object.assign(new Error('missing_name'), { status: 400 });
  }
  const [firstName, ...rest] = fullName.split(/\s+/);

  const response = await fetch(CHECKOUT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Clover-Merchant-Id': merchant.merchantId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer: {
        email,
        firstName,
        lastName: rest.join(' ') || firstName,
        phoneNumber: String(customer?.phone ?? '').trim() || undefined,
      },
      shoppingCart: { lineItems },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error(`Clover checkout rejected (${response.status}):`, detail.slice(0, 500));
    // Clover 4xx = bad order data (e.g. invalid field) — surface as a client
    // error with a stable code instead of a misleading 502.
    if (response.status >= 400 && response.status < 500) {
      throw Object.assign(new Error('rejected_by_clover'), { status: 400 });
    }
    throw new Error(`Clover checkout error ${response.status}`);
  }

  const session = await response.json();
  return { url: session.href, sessionId: session.checkoutSessionId, expiresAt: session.expirationTime };
}
