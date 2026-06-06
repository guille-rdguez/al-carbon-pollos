import { useEffect, useMemo, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../hooks/useLanguage';
import { useCloverMenu } from '../hooks/useCloverMenu';
import { useCart, lineKey } from '../hooks/useCart';
import { revealStyle } from '../utils/revealStyle';
import { buildDisplayCategories } from '../utils/menuCategories';
import { LOCATIONS } from '../constants/locations';
import ModifierModal from './ModifierModal';

// Branded tile for items without a photo (Clover's own page does the same).
const LOGO_IMG = '/assets/logo.png';

// Generic photo for unmatched items in categories where one image fits all
// (unmatched drinks are almost always canned sodas; sized drinks are matched).
const CATEGORY_FALLBACK_IMG = {
  drinks: '/assets/canned-soda-12oz.avif',
};

function titleCase(name) {
  return name.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

function LiveMenuCard({ item, index, categoryLabel, onCustomize }) {
  const [ref, visible] = useScrollReveal(0.06);
  const { t } = useLanguage();
  const cart = useCart();
  const qty = cart.qtyOf(item.id);
  const hasPhoto = Boolean(item.img);
  const hasOptions = (item.modifierGroups?.length ?? 0) > 0;

  return (
    <div
      ref={ref}
      className="group flex flex-col overflow-hidden rounded-lg border border-coal-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover"
      style={revealStyle(visible, { y: 28, duration: 0.55, delay: (index % 9) * 65 })}
    >
      <div className="relative h-52 flex-shrink-0 overflow-hidden bg-coal-900">
        <img
          src={item.img || LOGO_IMG}
          alt={item.displayName}
          className={hasPhoto
            ? 'w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out'
            : 'w-full h-full object-contain p-12 opacity-50'}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = LOGO_IMG;
            e.currentTarget.className = 'w-full h-full object-contain p-12 opacity-50';
          }}
        />
        <div className="absolute bottom-3 right-3 bg-primary px-3 py-1.5 text-sm font-black text-white shadow-cta">
          {item.priceFormatted}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.24em] text-primary">{categoryLabel}</p>
          <h3 className="font-display text-3xl uppercase leading-[0.9] tracking-[0.03em] text-coal-900">{item.displayName}</h3>
        </div>
        {item.displayDesc && (
          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-coal-500">{item.displayDesc}</p>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-coal-100 pt-4">
          {hasOptions ? (
            <div className="flex items-center gap-2">
              {qty > 0 && (
                <span className="flex h-7 min-w-7 items-center justify-center bg-coal-900 px-2 text-xs font-black text-white">
                  {qty}
                </span>
              )}
              <button
                onClick={() => onCustomize(item)}
                className="bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-cta transition-colors hover:bg-primary-dark"
              >
                {t.cart.customize}
              </button>
            </div>
          ) : qty > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => cart.setQty(lineKey(item.id, []), qty - 1)}
                className="h-9 w-9 border border-coal-200 text-sm font-black hover:border-primary hover:text-primary"
                aria-label="−"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-bold">{qty}</span>
              <button
                onClick={() => cart.setQty(lineKey(item.id, []), qty + 1)}
                className="h-9 w-9 border border-coal-200 text-sm font-black hover:border-primary hover:text-primary"
                aria-label="+"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => cart.add(item)}
              className="bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-cta transition-colors hover:bg-primary-dark"
            >
              {t.cart.add}
            </button>
          )}
          <span className="h-px w-12 bg-primary/50" />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-lg border border-coal-100 bg-white shadow-card">
      <div className="h-52 bg-coal-100" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-3 w-20 bg-coal-100" />
        <div className="h-8 w-3/4 bg-coal-100" />
        <div className="h-4 w-full bg-coal-100" />
        <div className="h-4 w-2/3 bg-coal-100" />
      </div>
    </div>
  );
}

export default function LiveMenu() {
  const { t } = useLanguage();
  const cart = useCart();
  const [titleRef, titleVisible] = useScrollReveal();
  const [modalItem, setModalItem] = useState(null);
  // Priority: ?location= deep link (e.g. from a sucursal card) → persisted
  // cart location (so returning users keep their saved lines) → first location.
  const [locationSlug, setLocationSlug] = useState(() => {
    const fromQuery = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('location')
      : null;
    if (LOCATIONS.some((l) => l.cloverSlug === fromQuery)) return fromQuery;
    if (LOCATIONS.some((l) => l.cloverSlug === cart.location)) return cart.location;
    return LOCATIONS.find((l) => l.cloverSlug)?.cloverSlug ?? 'culebra-1';
  });
  const [activeCategory, setActiveCategory] = useState(null);
  const { status, data, retry } = useCloverMenu(locationSlug);

  const location = LOCATIONS.find((l) => l.cloverSlug === locationSlug);

  // Keep cart bound to the selected merchant (switching location clears it).
  useEffect(() => {
    cart.setLocation(locationSlug);
  }, [locationSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const categories = useMemo(() => {
    if (!data) return [];
    // Re-bucket into the site's curated categories (the POS tags loosely,
    // e.g. Charro Beans under CHICKEN); labels come from the i18n dictionary.
    return buildDisplayCategories(data.categories).map((bucket) => ({
      ...bucket,
      label: t.menu.categories[bucket.key] ?? titleCase(bucket.name),
      items: bucket.items.map((item) => {
        const localized = item.catalog && !item.catalog.partial ? t.menu.items[item.catalog.localId] : null;
        return {
          ...item,
          displayName: localized?.name ?? item.name,
          displayDesc: localized?.desc ?? item.description,
          img: item.catalog?.img ?? CATEGORY_FALLBACK_IMG[bucket.key] ?? null,
        };
      }),
    }));
  }, [data, t]);

  const active = categories.find((cat) => cat.key === activeCategory) ?? categories[0] ?? null;

  // Once the live menu arrives, refresh saved cart lines (prices/names) against it.
  useEffect(() => {
    if (status === 'ready' && categories.length > 0) {
      const seen = new Set();
      const allItems = [];
      for (const cat of categories) {
        for (const item of cat.items) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            allItems.push(item);
          }
        }
      }
      cart.sync(allItems);
    }
  }, [status, categories]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="live-menu" className="bg-coal-50 py-20 text-coal-900 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div
          ref={titleRef}
          className="mx-auto mb-10 max-w-3xl text-center"
          style={revealStyle(titleVisible, { y: 24 })}
        >
          <span className="mb-3 inline-block text-sm font-black uppercase tracking-[0.32em] text-primary">{t.liveMenu.eyebrow}</span>
          <h2 className="mb-4 font-display text-5xl uppercase leading-[0.88] tracking-[0.03em] text-coal-900 md:text-7xl">{t.liveMenu.title}</h2>
          <p className="mx-auto max-w-2xl text-base leading-8 text-coal-500">{t.liveMenu.copy}</p>
        </div>

        {/* Location picker */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-[11px] font-black uppercase tracking-[0.24em] text-coal-400">{t.liveMenu.branch}</span>
          {LOCATIONS.filter((l) => l.cloverSlug).map((loc) => (
            <button
              key={loc.cloverSlug}
              onClick={() => { setLocationSlug(loc.cloverSlug); setActiveCategory(null); }}
              className={`px-4 py-2.5 text-sm font-bold transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                locationSlug === loc.cloverSlug
                  ? 'bg-coal-900 text-white shadow-cta'
                  : 'border border-coal-200 bg-white text-coal-600 hover:border-primary hover:text-primary'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

        {/* Category tabs (live from Clover) */}
        {categories.length > 0 && (
          <div className="relative mb-8">
            <div
              className="flex items-center gap-2 overflow-x-auto px-1 py-3 snap-x snap-mandatory md:flex-wrap md:justify-center md:overflow-visible"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex-shrink-0 snap-start px-4 py-2.5 text-sm font-bold transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                    active?.key === cat.key
                      ? 'bg-primary text-white shadow-cta'
                      : 'border border-coal-200 bg-white text-coal-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {status === 'loading' && (
          <div className="grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {status === 'error' && (
          <div className="mx-auto max-w-md py-16 text-center">
            <p className="mb-6 text-base text-coal-500">{t.liveMenu.error}</p>
            <button
              onClick={retry}
              className="bg-primary px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-cta transition-colors hover:bg-primary-dark"
            >
              {t.liveMenu.retry}
            </button>
          </div>
        )}

        {status === 'ready' && active && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-coal-500">{active.items.length} {t.menu.dishes}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3">
              {active.items.map((item, idx) => (
                <LiveMenuCard
                  key={item.id}
                  item={item}
                  index={idx}
                  categoryLabel={active.label}
                  onCustomize={setModalItem}
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-10 border-t border-coal-200 pt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-coal-400">
            {t.liveMenu.synced}
          </p>
        </div>
      </div>

      {modalItem && (
        <ModifierModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onAdd={(item, modifiers) => cart.add(item, modifiers)}
        />
      )}
    </section>
  );
}
