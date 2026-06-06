// Maps live Clover item names to the site's existing photos and localized copy.
// localId points into TRANSLATIONS[lang].menu.items so live items reuse the
// curated names/descriptions; img reuses the photos already shipped in /assets.

const CATALOG = [
  { localId: 3, category: 'chicken',  img: '/assets/whole-chicken-only.avif',    aliases: ['whole chicken only'] },
  { localId: 1, category: 'chicken',  img: '/assets/whole-chicken.avif',         aliases: ['whole chicken'] },
  { localId: 4, category: 'chicken',  img: '/assets/half-chicken-only.avif',     aliases: ['half chicken only'] },
  { localId: 2, category: 'chicken',  img: '/assets/half-chicken.webp',          aliases: ['half chicken'] },
  { localId: 5, category: 'beef',  img: '/assets/1lb-beef-fajita.webp',       aliases: ['1 lb beef fajita'] },
  { localId: 6, category: 'beef',  img: '/assets/half-lb-beef-fajita.webp',   aliases: ['1/2 lb beef fajita', 'half lb beef fajita'] },
  { localId: 7, category: 'beef',  img: '/assets/1lb-short-ribs.avif',        aliases: ['1 lb short ribs'] },
  { localId: 8, category: 'beef',  img: '/assets/half-lb-short-ribs.webp',    aliases: ['1/2 lb short ribs', 'half lb short ribs'] },
  { localId: 9, category: 'parrilladas',  img: '/assets/parrillada-para-dos.webp',   aliases: ['parrillada para dos', 'parrillada para 2', 'parrillada for 2', 'parrillada for two'] },
  { localId: 10, category: 'parrilladas', img: '/assets/parrillada-familiar.webp',   aliases: ['parrillada familiar'] },
  { localId: 11, category: 'burgers', img: '/assets/classic-hamburger.webp',     aliases: ['classic hamburger', 'classic burger', 'hamburger'] },
  { localId: 12, category: 'burgers', img: '/assets/monterrey-burger.webp',      aliases: ['monterrey burger'] },
  { localId: 13, category: 'burgers', img: '/assets/salchiburger.avif',          aliases: ['salchiburger'] },
  { localId: 14, category: 'desserts', img: '/assets/pastel-tres-leches.webp',    aliases: ['pastel tres leches', 'pastel 3 leches', 'tres leches cake', 'tres leches'] },
  { localId: 15, category: 'desserts', img: '/assets/arroz-con-leche.webp',       aliases: ['arroz con leche'] },
  { localId: 16, category: 'drinks', img: '/assets/jarritos.avif',              aliases: ['32 oz drink', 'jarritos'] },
  { localId: 17, category: 'drinks', img: '/assets/16oz-drink.webp',            aliases: ['16 oz drink'] },
  { localId: 18, category: 'extras', img: '/assets/papa-asada.webp',            aliases: ['papa nortena', 'papa asada', 'loaded baked potato'] },
  { localId: 19, category: 'extras', img: '/assets/charro-beans-12oz.avif',     aliases: ['charro beans 12 oz', '12 oz charro beans'] },
  { localId: 20, category: 'extras', img: '/assets/charro-beans-32oz.webp',     aliases: ['charro beans 32 oz', '32 oz charro beans'] },
  { localId: 21, category: 'extras', img: '/assets/salchicha-asada.webp',       aliases: ['salchicha asada', 'grilled sausage'] },
  { localId: 22, category: 'desserts', img: '/assets/chocoflan.webp',             aliases: ['chocoflan'] },
  { localId: 23, category: 'desserts', img: '/assets/flan-de-queso.webp',         aliases: ['flan de queso', 'cheese flan'] },
  { localId: 24, category: 'desserts', img: '/assets/strawberry-cheesecake.avif', aliases: ['strawberry cheesecake'] },
  { localId: 25, category: 'drinks', img: '/assets/canned-soda-12oz.avif',      aliases: ['12 oz canned soda', 'canned soda 12 oz', 'canned soda'] },
];

const EXACT = new Map();
for (const entry of CATALOG) {
  for (const alias of entry.aliases) {
    EXACT.set(alias, entry);
  }
}

// Longest aliases first so "whole chicken only" wins over "whole chicken".
const PREFIXES = [...EXACT.keys()].sort((a, b) => b.length - a.length);

export function normalizeName(name) {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9/ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchCatalog(name) {
  const normalized = normalizeName(name);
  if (!normalized) return null;

  const exact = EXACT.get(normalized);
  if (exact) return exact;

  // Fallback for variants like "Salchiburger Pepsi Combo" → salchiburger photo.
  const prefix = PREFIXES.find((alias) => normalized.startsWith(alias));
  return prefix ? { ...EXACT.get(prefix), partial: true } : null;
}
