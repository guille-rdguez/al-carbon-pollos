import { useState, useMemo } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { revealStyle } from '../utils/revealStyle';
import { PICKUP_URL } from '../constants/urls';

const EMERALD = 'bg-emerald-600 text-white';

const MENU_ITEMS = [
  {
    id: 1,
    name: 'Whole Chicken',
    desc: '8 piezas de pollo asado al carbón con arroz, cebolla asada, chile toreado, limón, tortillas de maíz, salsa verde y roja.',
    price: '$23.25',
    img: '/assets/whole-chicken.avif',
    badge: 'Most Popular',
    category: 'chicken',
    featured: true,
  },
  {
    id: 2,
    name: 'Half Chicken',
    desc: '4 piezas de pollo asado al carbón con arroz, cebolla asada, chile toreado, limón, tortillas de maíz, salsa verde y roja.',
    price: '$14.50',
    img: '/assets/half-chicken.webp',
    badge: 'Fan Favorite',
    category: 'chicken',
    featured: true,
  },
  {
    id: 3,
    name: 'Whole Chicken Only',
    desc: '8 piezas de pollo asado al carbón — sin sides. Solo el puro pollo.',
    price: '$15.45',
    img: '/assets/whole-chicken-only.avif',
    badge: null,
    category: 'chicken',
    featured: false,
  },
  {
    id: 4,
    name: 'Half Chicken Only',
    desc: '4 piezas de pollo asado al carbón — sin sides. Solo el puro pollo.',
    price: '$10.25',
    img: '/assets/half-chicken-only.avif',
    badge: null,
    category: 'chicken',
    featured: false,
  },
  {
    id: 5,
    name: '1 lb Beef Fajita',
    desc: '1 lb fajita de res a la parrilla con arroz 12 oz, cebollas y pimientos asados, chile toreado, ensalada, tortillas, limón y salsas.',
    price: '$31.50',
    img: '/assets/1lb-beef-fajita.webp',
    badge: null,
    category: 'beef',
    featured: false,
  },
  {
    id: 6,
    name: '½ lb Beef Fajita',
    desc: '½ lb fajita de res a la parrilla con arroz 8 oz, cebollas y pimientos asados, chile toreado, ensalada, tortillas, limón y salsas.',
    price: '$17.85',
    img: '/assets/half-lb-beef-fajita.webp',
    badge: 'Best Seller',
    category: 'beef',
    featured: true,
  },
  {
    id: 7,
    name: '1 lb Short Ribs',
    desc: '1 lb short ribs a la parrilla con arroz 12 oz, cebollas y pimientos asados, chile toreado, ensalada, tortillas, limón y salsas.',
    price: '$22.75',
    img: '/assets/1lb-short-ribs.avif',
    badge: null,
    category: 'beef',
    featured: false,
  },
  {
    id: 8,
    name: '½ lb Short Ribs',
    desc: '½ lb short ribs a la parrilla con arroz 8 oz, cebollas y pimientos asados, chile toreado, ensalada, tortillas, limón y salsas.',
    price: '$15.50',
    img: '/assets/half-lb-short-ribs.webp',
    badge: null,
    category: 'beef',
    featured: false,
  },
  {
    id: 9,
    name: 'Parrillada Para Dos',
    desc: '½ lb fajita, ½ pollo, arroz, frijoles charros, ensalada, chile toreado, salchicha especial, 8 tortillas y salsas. ¡Para 2 personas!',
    price: '$29.99',
    img: '/assets/parrillada-para-dos.webp',
    badge: 'Para 2',
    category: 'parrilladas',
    featured: true,
  },
  {
    id: 10,
    name: 'Parrillada Familiar',
    desc: '1 lb fajita, 1 pollo entero, 2 arroces, 2 frijoles charros, 2 ensaladas, 2 chiles toreados, 2 salchichas, 16 tortillas y salsas. ¡Para toda la familia!',
    price: '$59.98',
    img: '/assets/parrillada-familiar.webp',
    badge: 'Best Value',
    category: 'parrilladas',
    featured: true,
  },
  {
    id: 11,
    name: 'Classic Hamburger',
    desc: '½ lb Angus beef patty con queso americano, pickles, mostaza, mayo, lechuga y tomate. Servida con papas Lays Classic.',
    price: '$10.99',
    img: '/assets/classic-hamburger.webp',
    badge: null,
    category: 'burgers',
    featured: false,
  },
  {
    id: 12,
    name: 'Monterrey Burger',
    desc: '½ lb Angus beef con jamón, queso Monterrey Jack, chile toreado, chipotle, cebolla asada, guacamole, lechuga y tomate. Con chips.',
    price: '$12.55',
    img: '/assets/monterrey-burger.webp',
    badge: 'Signature',
    category: 'burgers',
    featured: true,
  },
  {
    id: 13,
    name: 'Salchiburger',
    desc: '½ lb Angus beef con jamón, salchicha, queso Monterrey Jack, cebolla asada, guacamole, lechuga y tomate. Servida con chips.',
    price: '$12.95',
    img: '/assets/salchiburger.avif',
    badge: 'Fan Favorite',
    category: 'burgers',
    featured: false,
  },
  {
    id: 14,
    name: 'Pastel Tres Leches',
    desc: 'Clásico pastel de tres leches esponjoso y cremoso, cubierto con crema batida.',
    price: '$5.15',
    img: '/assets/pastel-tres-leches.webp',
    badge: 'Fan Favorite',
    category: 'desserts',
    featured: true,
  },
  {
    id: 15,
    name: 'Arroz con Leche',
    desc: 'Cremoso arroz con leche con canela. Un postre casero y reconfortante.',
    price: '$5.00',
    img: '/assets/arroz-con-leche.webp',
    badge: null,
    category: 'desserts',
    featured: false,
  },
  {
    id: 22,
    name: 'Chocoflan',
    desc: 'Irresistible combinación de pastel de chocolate y flan de vainilla. Cremoso, húmedo y lleno de sabor.',
    price: '$5.50',
    img: '/assets/chocoflan.webp',
    badge: null,
    category: 'desserts',
    featured: false,
  },
  {
    id: 23,
    name: 'Flan de Queso',
    desc: 'Suave flan de queso crema bañado en caramelo. Textura cremosa y sabor dulce e irresistible.',
    price: '$5.00',
    img: '/assets/flan-de-queso.webp',
    badge: null,
    category: 'desserts',
    featured: false,
  },
  {
    id: 24,
    name: 'Strawberry Cheesecake',
    desc: 'Cheesecake clásico con base de galleta, relleno cremoso y cobertura de fresas frescas.',
    price: '$6.00',
    img: '/assets/strawberry-cheesecake.avif',
    badge: null,
    category: 'desserts',
    featured: false,
  },
  {
    id: 16,
    name: '32 oz Drink',
    desc: 'Bebida de 32 oz a tu elección — refrescos, agua de limón o aguas frescas.',
    price: '$3.90',
    img: '/assets/jarritos.avif',
    badge: null,
    category: 'drinks',
    featured: false,
  },
  {
    id: 17,
    name: '16 oz Drink',
    desc: 'Bebida de 16 oz a tu elección — refrescos, agua de limón o aguas frescas.',
    price: '$2.25',
    img: '/assets/16oz-drink.webp',
    badge: null,
    category: 'drinks',
    featured: false,
  },
  {
    id: 25,
    name: 'Refresco 12 oz',
    desc: 'Lata de refresco de 12 oz — Coke, Sprite, Dr Pepper y más. El complemento perfecto para tu plato.',
    price: '$2.00',
    img: '/assets/canned-soda-12oz.avif',
    badge: null,
    category: 'drinks',
    featured: false,
  },
  {
    id: 18,
    name: 'Papa Norteña',
    desc: 'Papa al horno cargada con crema, mantequilla, salsa de queso Monterrey Jack y cheddar, tocino, carne asada, galletas saladas y jalapeños.',
    price: '$17.75',
    img: '/assets/menu-tacos-placeholder.jpg',
    badge: 'Must Try',
    category: 'extras',
    featured: false,
  },
  {
    id: 19,
    name: 'Frijoles Charros 12 oz',
    desc: 'Frijoles charros caseros, ricos y caldosos. El acompañamiento perfecto para tu plato.',
    price: '$3.95',
    img: '/assets/charro-beans-12oz.avif',
    badge: null,
    category: 'extras',
    featured: false,
  },
  {
    id: 20,
    name: 'Frijoles Charros 32 oz',
    desc: 'Frijoles charros en tamaño familiar — ideal para compartir con toda la mesa.',
    price: '$11.86',
    img: '/assets/charro-beans-32oz.webp',
    badge: null,
    category: 'extras',
    featured: false,
  },
  {
    id: 21,
    name: 'Salchicha Asada',
    desc: 'Salchicha especial asada al carbón. El toque extra auténtico que completa cualquier plato.',
    price: '$4.00',
    img: '/assets/menu-tacos-placeholder.jpg',
    badge: null,
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
  'Most Popular': 'bg-primary text-white',
  'Fan Favorite': 'bg-orange-500 text-white',
  'Best Value':   EMERALD,
  'Best Seller':  EMERALD,
  'Signature':    'bg-neutral-800 text-white',
  'Para 2':       'bg-blue-600 text-white',
  'Must Try':     'bg-purple-600 text-white',
  'New':          'bg-blue-600 text-white',
};

function MenuCard({ item, index }) {
  const [ref, visible] = useScrollReveal(0.06);

  return (
    <div
      ref={ref}
      className="bg-white rounded-3xl shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 overflow-hidden group flex flex-col"
      style={revealStyle(visible, { y: 28, duration: 0.55, delay: index * 65 })}
    >
      <div className="relative overflow-hidden h-48 flex-shrink-0">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = '/assets/menu-chicken-placeholder.jpg'; }}
        />
        <div className="absolute bottom-3 right-3 bg-neutral-900/80 backdrop-blur-sm text-white font-bold text-sm px-3 py-1 rounded-full">
          {item.price}
        </div>
        {item.badge && (
          <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow ${BADGE_STYLES[item.badge] ?? 'bg-neutral-800 text-white'}`}>
            {item.badge}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-base text-neutral-900 leading-snug">{item.name}</h3>
        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2 flex-1">{item.desc}</p>
        <a
          href={PICKUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-primary text-white font-semibold text-sm shadow-cta hover:bg-primary-dark hover:shadow-cta-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agregar al pedido
        </a>
      </div>
    </div>
  );
}

export default function FeaturedMenu() {
  const [active, setActive] = useState('all');
  const [titleRef, titleVisible] = useScrollReveal();

  const filtered = useMemo(
    () => active === 'all'
      ? MENU_ITEMS.filter((i) => i.featured)
      : MENU_ITEMS.filter((i) => i.category === active),
    [active],
  );

  return (
    <section id="menu" className="bg-neutral-50 py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div
          ref={titleRef}
          className="text-center mb-10"
          style={revealStyle(titleVisible, { y: 24 })}
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-widest mb-2">Menu de la Casa</span>
          <h2 className="font-display text-5xl uppercase leading-[0.92] tracking-[0.03em] text-neutral-900 mb-3 md:text-6xl">El Menu Real</h2>
          <p className="text-neutral-500 text-base max-w-md mx-auto">
            Pollo asado al carbón y más — hecho al momento, con ingredientes frescos.
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
                className={`flex-shrink-0 snap-start px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                  active === cat.key
                    ? 'bg-primary text-white shadow-cta'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary hover:text-primary'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-neutral-400 text-sm">
            {active === 'all' ? 'Favoritos de la casa' : `${filtered.length} platillo${filtered.length !== 1 ? 's' : ''}`}
          </p>
          {active === 'all' && (
            <button
              onClick={() => setActive('chicken')}
              className="text-primary text-sm font-semibold hover:underline"
            >
              Ver menu completo →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, idx) => (
            <MenuCard key={item.id} item={item} index={idx} />
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={PICKUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-neutral-900 text-white font-bold text-base shadow-md hover:bg-neutral-800 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ordenar menu completo
          </a>
        </div>
      </div>
    </section>
  );
}
