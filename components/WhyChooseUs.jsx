import { useScrollReveal } from '../hooks/useScrollReveal';
import { revealStyle } from '../utils/revealStyle';

const VALUES = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.974 7.974 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
    title: 'Carbon de verdad',
    desc: 'La promesa central de la marca: pollo asado sobre brasas reales, con ese sabor directo que se siente desde la primera mordida.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: 'Sabores de Monterrey',
    desc: 'No solo es pollo. Tambien hay Monterrey Burger, salchichas especiales, parrilladas y la Papa Nortena en el menu oficial.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: '5 puntos en SATX',
    desc: 'Culebra #1, Culebra #2, Nacogdoches, Alamo Ranch y Marbach llevan la marca a zonas clave de San Antonio.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Pickup y delivery',
    desc: 'Drive thru en Culebra #1 y delivery por Uber Eats o DoorDash en cuatro sucursales. Servicio real, no relleno de template.',
  },
];

function ValueCard({ val, index }) {
  const [ref, visible] = useScrollReveal(0.08);

  return (
    <div
      ref={ref}
      className="flex flex-col gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-white/8 transition-all duration-300"
      style={revealStyle(visible, { delay: index * 100 })}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
        {val.icon}
      </div>
      <div>
        <h3 className="font-bold text-white text-base mb-1">{val.title}</h3>
        <p className="text-neutral-400 text-sm leading-relaxed">{val.desc}</p>
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  const [titleRef, titleVisible] = useScrollReveal();
  const [showcaseRef, showcaseVisible] = useScrollReveal(0.08);

  return (
    <section className="relative overflow-hidden bg-neutral-900 py-16 md:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-12 h-48 w-48 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-orange-400/10 blur-3xl" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div
          ref={titleRef}
          className="relative text-center mb-12"
          style={revealStyle(titleVisible, { y: 24 })}
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-widest mb-2">Por Que Al Carbon</span>
          <h2 className="font-display text-5xl uppercase leading-[0.92] tracking-[0.03em] text-white mb-3 md:text-6xl">
            Mucho mas que pollo.
          </h2>
          <p className="text-neutral-400 text-base max-w-md mx-auto">
            La diferencia esta en la mezcla: brasas, repertorio regio y una operacion pensada para moverse por toda la ciudad.
          </p>
        </div>

        <div
          ref={showcaseRef}
          className="mb-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]"
          style={revealStyle(showcaseVisible, { y: 28, duration: 0.7 })}
        >
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
            <img
              src="/assets/whole-chicken.avif"
              alt="Pollo al carbon servido con cebolla asada, chile toreado y limon"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/45 to-black/80" />
            <div className="absolute left-6 top-6 inline-flex rounded-full border border-white/20 bg-black/25 px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-white backdrop-blur-sm">
              Pollo al carbon
            </div>
            <div className="absolute bottom-6 left-6 max-w-sm">
              <h3 className="font-display text-4xl uppercase leading-[0.92] tracking-[0.03em] text-white sm:text-5xl">
                Una imagen que si abre el apetito.
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 sm:text-base">
                Piel dorada, brasas reales, cebolla asada, chile toreado y limon. Este tipo de visual hace que el sitio se sienta restaurante de verdad.
              </p>
            </div>
            <div className="absolute right-5 top-5 hidden w-40 overflow-hidden rounded-[1.4rem] border border-white/15 bg-black/20 shadow-[0_20px_40px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:block">
              <img
                src="/assets/half-chicken.webp"
                alt="Medio pollo al carbon"
                className="h-32 w-full object-cover"
              />
              <div className="px-4 py-3">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-primary">Signature</p>
                <p className="mt-1 font-display text-2xl uppercase tracking-[0.03em] text-white">Half Chicken</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-primary">Visual Direction</p>
              <h3 className="mt-3 font-display text-4xl uppercase leading-[0.92] tracking-[0.03em] text-white">
                Menos template. Mas cocina, mas fuego, mas producto.
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-400">
                Cuando el producto se ve asi de cerca, el sitio se vuelve mas creible y mas memorable. Ya no parece menu generico, parece una marca que sabe vender su plato estrella.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-neutral-500">Textura</p>
                <p className="mt-3 text-white text-base font-semibold">Rojo del pollo, carbon en la piel y verdes acidos del chile y el limon.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-neutral-500">Presentacion</p>
                <p className="mt-3 text-white text-base font-semibold">Platillos hero como protagonistas visuales, no solo como thumbnails de menu.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((val, idx) => (
            <ValueCard key={val.title} val={val} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
