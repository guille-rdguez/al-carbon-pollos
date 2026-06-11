import { matchCatalog, normalizeName } from './cloverCatalog.js';

// The restaurant's POS tags items loosely (e.g. Charro Beans under CHICKEN).
// The public site re-buckets every known item into the original curated
// categories; unknown items fall back to the canonical equivalent of their
// Clover category, and truly unknown categories keep their own tab.

export const CANONICAL_ORDER = ['chicken', 'beef', 'parrilladas', 'burgers', 'desserts', 'drinks', 'extras'];

const CLOVER_TO_CANONICAL = {
  chicken: 'chicken',
  beef: 'beef',
  parrilladas: 'parrilladas',
  burgers: 'burgers',
  desserts: 'desserts',
  drinks: 'drinks',
  'canned sodas': 'drinks',
  extras: 'extras',
  'papa nortena': 'extras',
};

// serverCategories: the /api/menu categories array.
// Returns [{ key, name, items }] — key is a canonical slug or 'clover:<id>',
// each item appears exactly once and carries its catalog match (or null).
export function buildDisplayCategories(serverCategories) {
  const buckets = new Map();
  const ensureBucket = (key, name) => {
    if (!buckets.has(key)) buckets.set(key, { key, name, items: [] });
    return buckets.get(key);
  };
  const seen = new Set();

  for (const category of serverCategories) {
    const canonical = CLOVER_TO_CANONICAL[normalizeName(category.name)];
    for (const item of category.items) {
      if (seen.has(item.id)) continue;
      const catalog = matchCatalog(item.name);
      const key = catalog?.category ?? canonical ?? `clover:${category.id}`;
      seen.add(item.id);
      ensureBucket(key, category.name).items.push({ ...item, catalog });
    }
  }

  const ordered = [];
  for (const key of CANONICAL_ORDER) {
    const bucket = buckets.get(key);
    if (bucket?.items.length) ordered.push(bucket);
  }
  for (const [key, bucket] of buckets) {
    if (!CANONICAL_ORDER.includes(key) && bucket.items.length) ordered.push(bucket);
  }
  return ordered;
}
