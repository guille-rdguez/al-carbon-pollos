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

function normalizeTaxRate(rate) {
  if (!rate || rate.deletedTime) return null;

  const normalized = { name: rate.name };
  if (rate.id) normalized.id = rate.id;
  if (typeof rate.rate === 'number' && Number.isFinite(rate.rate) && rate.rate > 0) {
    normalized.rate = rate.rate;
  }
  if (typeof rate.taxAmount === 'number' && Number.isFinite(rate.taxAmount) && rate.taxAmount > 0) {
    normalized.taxAmount = rate.taxAmount;
  }

  return normalized.rate || normalized.taxAmount ? normalized : null;
}

function normalizeTaxRates(rates) {
  return (rates?.elements ?? rates ?? [])
    .map(normalizeTaxRate)
    .filter(Boolean);
}

function modifierSum(modifiers) {
  return (modifiers ?? []).reduce((sum, mod) => sum + mod.price, 0);
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

  const [categories, items, rawGroups, rawTaxRates] = await Promise.all([
    fetchAll(`${CLOVER_BASE}/merchants/${merchantId}/categories`, headers),
    fetchAll(`${CLOVER_BASE}/merchants/${merchantId}/items?expand=categories,modifierGroups,taxRates`, headers),
    fetchAll(`${CLOVER_BASE}/merchants/${merchantId}/modifier_groups?expand=modifiers`, headers),
    fetchAll(`${CLOVER_BASE}/merchants/${merchantId}/tax_rates`, headers),
  ]);
  const defaultTaxRates = normalizeTaxRates(rawTaxRates.filter((rate) => rate.isDefault));

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

    const itemTaxRates = normalizeTaxRates(item.taxRates);
    const taxRates = itemTaxRates.length > 0
      ? itemTaxRates
      : (item.defaultTaxRates !== false ? defaultTaxRates : []);

    const normalized = {
      id: item.id,
      name: item.onlineName || item.name,
      description: item.description || '',
      price: item.price,
      priceFormatted: formatPrice(item.price),
      modifierGroups: itemGroups,
      requiresModifiers: itemGroups.some((group) => group.minRequired > 0),
      taxRates,
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

// Creates a Clover Hosted Checkout session. Prices, modifiers, and taxes are
// resolved server-side from the live Clover catalog before checkout is made.
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

  // Build the cart as itemized lines and fold tax into explicit line items.
  //
  // Hosted Checkout is NOT linked to Clover inventory, which causes two issues:
  //  (a) it rounds per-line taxRates independently, summing a cent short of the
  //      materialized order's aggregate tax — the "$0.01 remaining"; and
  //  (b) the merchant's default catalog tax is never applied to these ad-hoc
  //      lines (per Clover docs).
  // So we compute the tax exactly the way the POS does — group the taxable base
  // by rate, round ONCE — and emit it as its own line item, with NO per-line
  // taxRates. Then the amount charged equals the order total to the penny.
  // We also emit one line per unit, with the chosen modifiers in the name, so
  // the kitchen sees the order itemized instead of merged into one line.
  const lineItems = [];
  const taxByRate = new Map(); // key -> { name, rate, taxableSubtotal, flat }

  for (const { id, qty, modifiers, note } of lines) {
    const unitQty = Math.floor(Number(qty));
    if (!ITEM_ID_PATTERN.test(id ?? '') || !Number.isFinite(unitQty) || unitQty < 1 || unitQty > 50) {
      throw invalidLine();
    }
    const item = itemsById.get(id);
    if (!item) throw invalidLine();

    const submitted = Array.isArray(modifiers) ? modifiers : [];
    if (submitted.length > 30) throw invalidLine();

    const groupOfModifier = new Map();
    const modifiersById = new Map();
    for (const group of item.modifierGroups) {
      for (const mod of group.modifiers) {
        groupOfModifier.set(mod.id, group.id);
        modifiersById.set(mod.id, mod);
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

    const chosenModifiers = submitted.map((modifierId) => modifiersById.get(modifierId));
    const unitPrice = item.price + modifierSum(chosenModifiers);

    // Show chosen options on the line itself so they survive on a kitchen view
    // even if the note doesn't render; keep the note as a backup.
    const modSummary = chosenModifiers.map((mod) => mod.name).join(', ');
    const lineName = (modSummary ? `${item.name} (${modSummary})` : item.name).slice(0, 127);
    const cleanNote = String(note ?? '').replace(/\s+/g, ' ').trim().slice(0, 255);

    // Accumulate the taxable base per distinct rate; Clover taxes the subtotal
    // of same-rate items and rounds once — we mirror that after the loop.
    for (const rate of item.taxRates ?? []) {
      if (typeof rate.rate === 'number' && Number.isFinite(rate.rate) && rate.rate > 0) {
        const key = rate.id ?? `${rate.name}:${rate.rate}`;
        const entry = taxByRate.get(key)
          ?? { name: rate.name || 'Sales Tax', rate: rate.rate, taxableSubtotal: 0, flat: 0 };
        entry.taxableSubtotal += unitPrice * unitQty;
        taxByRate.set(key, entry);
      } else if (typeof rate.taxAmount === 'number' && Number.isFinite(rate.taxAmount) && rate.taxAmount > 0) {
        const key = `flat:${rate.id ?? rate.name}`;
        const entry = taxByRate.get(key)
          ?? { name: rate.name || 'Fee', rate: 0, taxableSubtotal: 0, flat: 0 };
        entry.flat += rate.taxAmount * unitQty;
        taxByRate.set(key, entry);
      }
    }

    for (let unit = 0; unit < unitQty; unit += 1) {
      const line = { name: lineName, price: unitPrice, unitQty: 1 };
      if (cleanNote) line.note = cleanNote;
      lineItems.push(line);
    }
  }

  // Emit tax as explicit line items (no taxRates), rounded once per rate so the
  // charge matches the materialized order's total exactly — no leftover cent.
  for (const entry of taxByRate.values()) {
    const amount = entry.flat || Math.round((entry.taxableSubtotal * entry.rate) / 10_000_000);
    if (amount > 0) lineItems.push({ name: entry.name, price: amount, unitQty: 1 });
  }

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
      shoppingCart: {
        lineItems,
      },
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

// ---------------------------------------------------------------------------
// Atomic Order flow (replaces Hosted Checkout). Unlike the Invoicing Checkout
// Service — whose line items are ad-hoc and NOT linked to Clover inventory —
// the Atomic Order endpoint creates a real, inventory-linked order. That fixes
// the three production issues at once:
//   • tax is computed once by Clover (same engine as the POS), so the charged
//     total equals the order total to the penny (no "$0.01 remaining");
//   • line items stay itemized (groupLineItems:false, one line per unit), so
//     the kitchen ticket is readable;
//   • items reference the catalog, so they carry the category→printer mapping
//     and structured modifiers, which is what lets them fire to the kitchen.
// Card payment is taken separately via the Ecommerce API (see chargeOrder).
// ---------------------------------------------------------------------------

// Online orders need a real, taxable order type so Clover applies catalog tax
// and the lines route to the kitchen printer. Resolved once per merchant.
const ORDER_TYPE_CACHE = new Map(); // merchantId -> { orderType, expires }
const ORDER_TYPE_TTL_MS = 5 * 60_000;
const ONLINE_TYPE_HINT = /online|pick.?up|to.?go|web|delivery/i;

async function resolveOrderType(merchant, env) {
  const token = env[merchant.tokenEnv];
  if (!token) throw new Error(`Missing ${merchant.tokenEnv} environment variable`);

  const { merchantId } = merchant;
  const cached = ORDER_TYPE_CACHE.get(merchantId);
  if (cached && cached.expires > Date.now()) return cached.orderType;

  const headers = { Authorization: `Bearer ${token}` };
  const types = await fetchAll(`${CLOVER_BASE}/merchants/${merchantId}/order_types`, headers);
  const usable = types.filter((type) => !type.isDeleted && !type.isHidden);
  // Prefer a taxable channel that looks like online/pickup, then the merchant
  // default, then any taxable type, then anything usable. A taxable order type
  // is what makes Clover apply each item's configured sales tax.
  const orderType =
    usable.find((type) => type.taxable && ONLINE_TYPE_HINT.test(type.label || '')) ||
    usable.find((type) => type.taxable && type.isDefault) ||
    usable.find((type) => type.taxable) ||
    usable.find((type) => type.isDefault) ||
    usable[0] ||
    null;

  ORDER_TYPE_CACHE.set(merchantId, { orderType, expires: Date.now() + ORDER_TYPE_TTL_MS });
  return orderType;
}

const ATOMIC_ORDER_URL = (merchantId) => `${CLOVER_BASE}/merchants/${merchantId}/atomic_order/orders`;

// Builds and creates a Clover order from a validated cart. Prices, modifiers,
// and taxes are resolved server-side from the live catalog — the client only
// sends item ids and modifier ids, never prices — so a tampered cart can't
// change what gets charged. Pass testMode:true to create a deletable, never-
// charged order for validation. Returns { orderId, total, currency }.
export async function createAtomicOrder(merchant, env, { customer, lines, testMode = false }) {
  const token = env[merchant.tokenEnv];
  if (!token) throw new Error(`Missing ${merchant.tokenEnv} environment variable`);

  if (!Array.isArray(lines) || lines.length === 0 || lines.length > 50) {
    throw Object.assign(new Error('Invalid cart'), { status: 400 });
  }

  const menu = await fetchMenu(merchant, env);
  const itemsById = new Map();
  for (const category of menu.categories) {
    for (const item of category.items) itemsById.set(item.id, item);
  }

  const invalidLine = () => Object.assign(new Error('Invalid cart line'), { status: 400 });

  // Each unit becomes its own line item so the kitchen sees them separated;
  // groupLineItems:false keeps identical lines ungrouped on the printed ticket.
  const lineItems = [];
  for (const { id, qty, modifiers, note } of lines) {
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
      for (const mod of group.modifiers) groupOfModifier.set(mod.id, group.id);
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

    const cleanNote = String(note ?? '').replace(/\s+/g, ' ').trim().slice(0, 255);
    const modifications = submitted.map((modifierId) => ({ modifier: { id: modifierId } }));

    for (let unit = 0; unit < unitQty; unit += 1) {
      const line = { item: { id } };
      if (modifications.length > 0) line.modifications = modifications;
      if (cleanNote) line.note = cleanNote;
      lineItems.push(line);
    }
  }

  const email = String(customer?.email ?? '').trim();
  const fullName = String(customer?.name ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    throw Object.assign(new Error('invalid_email'), { status: 400 });
  }
  if (!fullName) {
    throw Object.assign(new Error('missing_name'), { status: 400 });
  }

  const orderType = await resolveOrderType(merchant, env);

  const orderCart = {
    groupLineItems: false,
    note: `Online order — ${fullName}`.slice(0, 255),
    lineItems,
  };
  if (orderType?.id) orderCart.orderType = { id: orderType.id };
  if (testMode) orderCart.testMode = true;

  const response = await fetch(ATOMIC_ORDER_URL(merchant.merchantId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      // The Atomic Order endpoint requires a User-Agent header.
      'User-Agent': 'al-carbon-online/1.0',
    },
    body: JSON.stringify({ orderCart }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error(`Clover atomic order rejected (${response.status}):`, detail.slice(0, 500));
    if (response.status >= 400 && response.status < 500) {
      throw Object.assign(new Error('rejected_by_clover'), { status: 400 });
    }
    throw new Error(`Clover atomic order error ${response.status}`);
  }

  const order = await response.json();
  // order.total is Clover's authoritative total in cents (subtotal + tax),
  // computed exactly as the POS does — charge this amount and the order shows
  // fully paid, with no penny left over.
  return {
    orderId: order.id,
    total: order.total,
    currency: order.currency || 'USD',
    state: order.state,
  };
}
