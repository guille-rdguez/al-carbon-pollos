import { useState, useMemo } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../hooks/useLanguage';
import { revealStyle } from '../utils/revealStyle';

const DARK_BADGE = 'bg-coal-900 text-white';

const MENU_ITEMS = [
  {
    id: 1,
    price: '$23.25',
    img: '/assets/whole-chicken.avif',
    badgeKey: 'mostPopular',
    category: 'chicken',
    featured: true,
  },
  {
    id: 2,
    price: '$14.50',
    img: '/assets/half-chicken.webp',
    badgeKey: 'fanFavorite',
    category: 'chicken',
    featured: true,
  },
  {
    id: 3,
    price: '$15.45',
    img: '/assets/whole-chicken-only.avif',
    badgeKey: null,
    category: 'chicken',
    featured: false,
  },
  {
    id: 4,
    price: '$10.25',
    img: '/assets/half-chicken-only.avif',
    badgeKey: null,
    category: 'chicken',
    featured: false,
  },
  {
    id: 5,
    price: '$31.50',
    img: '/assets/1lb-beef-fajita.webp',
    badgeKey: null,
    category: 'beef',
    featured: false,
  },
  {
    id: 6,
    price: '$17.85',
    img: '/assets/half-lb-beef-fajita.webp',
    badgeKey: 'bestSeller',
    category: 'beef',
    featured: true,
  },
  {
    id: 7,
    price: '$22.75',
    img: '/assets/1lb-short-ribs.avif',
    badgeKey: null,
    category: 'beef',
    featured: false,
  },
  {
    id: 8,
    price: '$15.50',
    img: '/assets/half-lb-short-ribs.webp',
    badgeKey: null,
    category: 'beef',
    featured: false,
  },
  {
    id: 9,
    price: '$29.99',
    img: '/assets/parrillada-para-dos.webp',
    badgeKey: 'forTwo',
    category: 'parrilladas',
    featured: true,
  },
  {
    id: 10,
    price: '$59.98',
    img: '/assets/parrillada-familiar.webp',
    badgeKey: 'bestValue',
    category: 'parrilladas',
    featured: true,
  },
  {
    id: 11,
    price: '$10.99',
    img: '/assets/classic-hamburger.webp',
    badgeKey: null,
    category: 'burgers',
    featured: false,
  },
  {
    id: 12,
    price: '$12.55',
    img: '/assets/monterrey-burger.webp',
    badgeKey: 'signature',
    category: 'burgers',
    featured: true,
  },
  {
    id: 13,
    price: '$12.95',
    img: '/assets/salchiburger.avif',
    badgeKey: 'fanFavorite',
    category: 'burgers',
    featured: false,
  },
  {
    id: 14,
    price: '$5.15',
    img: '/assets/pastel-tres-leches.webp',
    badgeKey: 'fanFavorite',
    category: 'desserts',
    featured: true,
  },
  {
    id: 15,
    price: '$5.00',
    img: '/assets/arroz-con-leche.webp',
    badgeKey: null,
    category: 'desserts',
    featured: false,
  },
  {
    id: 22,
    price: '$5.50',
    img: '/assets/chocoflan.webp',
    badgeKey: null,
    category: 'desserts',
    featured: false,
  },
  {
    id: 23,
    price: '$5.00',
    img: '/assets/flan-de-queso.webp',
    badgeKey: null,
    category: 'desserts',
    featured: false,
  },
  {
    id: 24,
    price: '$6.00',
    img: '/assets/strawberry-cheesecake.avif',
    badgeKey: null,
    category: 'desserts',
    featured: false,
  },
  {
    id: 16,
    price: '$3.90',
    img: '/assets/jarritos.avif',
    badgeKey: null,
    category: 'drinks',
    featured: false,
  },
  {
    id: 17,
    price: '$2.25',
    img: '/assets/16oz-drink.webp',
    badgeKey: null,
    category: 'drinks',
    featured: false,
  },
  {
    id: 25,
    price: '$2.00',
    img: '/assets/canned-soda-12oz.avif',
    badgeKey: null,
    category: 'drinks',
    featured: false,
  },
  {
    id: 18,
    price: '$17.75',
    img: '/assets/papa-asada.webp',
    badgeKey: 'mustTry',
    category: 'extras',
    featured: false,
  },
  {
    id: 19,
    price: '$3.95',
    img: '/assets/charro-beans-12oz.avif',
    badgeKey: null,
    category: 'extras',
    featured: false,
  },
  {
    id: 20,
    price: '$11.86',
    img: '/assets/charro-beans-32oz.webp',
    badgeKey: null,
    category: 'extras',
    featured: false,
  },
  {
    id: 21,
    price: '$4.00',
    img: '/assets/salchicha-asada.webp',
    badgeKey: null,
    category: 'extras',
    featured: false,
  },
];

const CATEGORIES = [
  { key: 'all',         label: 'Featured' },
  { key: 'chicken',     label: 'Chicken' },
  { key: 'beef',        label: 'Beef' },
  { key: 'parrilladas', label: 'Parrilladas' },
  { key: 'burgers',     label: 'Burgers' },
  { key: 'desserts',    label: 'Desserts' },
  { key: 'drinks',      label: 'Drinks' },
  { key: 'extras',      label: 'Extras' },
];

const BADGE_STYLES = {
  mostPopular: 'bg-primary text-white',
  fanFavorite: 'bg-primary-dark text-white',
  bestValue: DARK_BADGE,
  bestSeller: DARK_BADGE,
  signature: 'bg-coal-800 text-white',
  forTwo: 'bg-coal-900 text-white',
  mustTry: 'bg-primary text-white',
};

function MenuCard({ item, index, officialLabel, categoryLabel }) {
  const [ref, visible] = useScrollReveal(0.06);

  return (
    <div
      ref={ref}
      className="group flex flex-col overflow-hidden rounded-lg border border-coal-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover"
      style={revealStyle(visible, { y: 28, duration: 0.55, delay: index * 65 })}
    >
      <div className="relative h-52 flex-shrink-0 overflow-hidden bg-coal-900">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
          decoding="async"
          onError={(e) => { e.currentTarget.src = '/assets/menu-chicken-placeholder.jpg'; }}
        />
        <div className="absolute bottom-3 right-3 bg-primary px-3 py-1.5 text-sm font-black text-white shadow-cta">
          {item.price}
        </div>
        {item.badgeLabel && (
          <div className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.16em] shadow ${BADGE_STYLES[item.badgeKey] ?? 'bg-coal-800 text-white'}`}>
            {item.badgeLabel}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.24em] text-primary">{categoryLabel}</p>
          <h3 className="font-display text-3xl uppercase leading-[0.9] tracking-[0.03em] text-coal-900">{item.name}</h3>
        </div>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-coal-500">{item.desc}</p>
        <div className="mt-3 flex items-center justify-between border-t border-coal-100 pt-4">
          <span className="text-[11px] font-black uppercase tracking-[0.24em] text-coal-400">{officialLabel}</span>
          <span className="h-px w-12 bg-primary/50" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedMenu() {
  const [active, setActive] = useState('all');
  const [titleRef, titleVisible] = useScrollReveal();
  const { t } = useLanguage();

  const menuItems = useMemo(
    () => MENU_ITEMS.map((item) => {
      const localized = t.menu.items[item.id];

      return {
        ...item,
        name: localized.name,
        desc: localized.desc,
        badgeLabel: item.badgeKey ? t.menu.badges[item.badgeKey] : null,
      };
    }),
    [t],
  );

  const filtered = useMemo(
    () => active === 'all'
      ? menuItems.filter((i) => i.featured)
      : menuItems.filter((i) => i.category === active),
    [active, menuItems],
  );

  return (
    <section id="menu" className="bg-coal-50 py-20 text-coal-900 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div
          ref={titleRef}
          className="mx-auto mb-10 max-w-3xl text-center"
          style={revealStyle(titleVisible, { y: 24 })}
        >
          <span className="mb-3 inline-block text-sm font-black uppercase tracking-[0.32em] text-primary">{t.menu.eyebrow}</span>
          <h2 className="mb-4 font-display text-5xl uppercase leading-[0.88] tracking-[0.03em] text-coal-900 md:text-7xl">{t.menu.title}</h2>
          <p className="mx-auto max-w-2xl text-base leading-8 text-coal-500">
            {t.menu.copy}
          </p>
        </div>

        <div className="relative mb-8">
          <div
            className="flex items-center gap-2 overflow-x-auto px-1 py-3 snap-x snap-mandatory md:flex-wrap md:justify-center md:overflow-visible"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActive(cat.key)}
                className={`flex-shrink-0 snap-start px-4 py-2.5 text-sm font-bold transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                  active === cat.key
                    ? 'bg-primary text-white shadow-cta'
                    : 'border border-coal-200 bg-white text-coal-600 hover:border-primary hover:text-primary'
                }`}
              >
                {t.menu.categories[cat.key]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-coal-500 text-sm">
            {active === 'all' ? t.menu.featured : `${filtered.length} ${t.menu.dishes}`}
          </p>
          {active === 'all' && (
            <a
              href="/menu"
              className="text-sm font-bold text-primary hover:underline"
            >
              {t.menu.viewFull} →
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, idx) => (
            <MenuCard
              key={item.id}
              item={item}
              index={idx}
              officialLabel={t.menu.officialShort}
              categoryLabel={t.menu.categories[item.category]}
            />
          ))}
        </div>

        <div className="mt-10 border-t border-coal-200 pt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-coal-400">
            {t.menu.official}
          </p>
        </div>
      </div>
    </section>
  );
}
