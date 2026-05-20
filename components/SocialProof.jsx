import { CONTACT_EMAIL, EVERYDAY_HOURS, LOCATIONS, SIGNATURE_DISHES } from '../constants/locations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { revealStyle } from '../utils/revealStyle';

function LocationCard({ location, index }) {
  const [ref, visible] = useScrollReveal(0.1);

  return (
    <article
      ref={ref}
      className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.10] bg-white/[0.06] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-white/[0.08]"
      style={revealStyle(visible, { y: 24, duration: 0.65, delay: index * 100 })}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${location.accent} opacity-90 transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-primary">Sucursal</p>
            <h3 className="mt-3 font-display text-[2rem] uppercase leading-[0.92] tracking-[0.04em] text-white">
              {location.name}
            </h3>
          </div>
          <div className="rounded-2xl border border-white/[0.16] bg-white/[0.10] p-3 text-primary">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-neutral-300">{location.address}</p>
        <p className="mt-3 text-sm leading-7 text-neutral-400">{location.note}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {location.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded-full border border-white/[0.16] bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Horario</p>
            <p className="mt-1 text-sm font-semibold text-white">{EVERYDAY_HOURS}</p>
          </div>
          <a
            href={location.phoneHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-orange-300 transition-colors"
          >
            {location.phone}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

export default function SocialProof() {
  const [titleRef, titleVisible] = useScrollReveal();
  const [panelRef, panelVisible] = useScrollReveal(0.08);

  return (
    <section id="locations" className="relative overflow-hidden bg-neutral-900 py-16 md:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-10 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-orange-400/12 blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div
            ref={titleRef}
            className="max-w-xl"
            style={revealStyle(titleVisible, { y: 24 })}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Ubicaciones reales
            </span>
            <h2 className="mt-6 font-display text-5xl uppercase leading-[0.92] tracking-[0.03em] text-white md:text-6xl">
              San Antonio sabe donde caerle.
            </h2>
            <p className="mt-5 text-base leading-8 text-neutral-400 sm:text-lg">
              La marca no vive en una sola esquina. Se mueve entre Culebra, Nacogdoches, Alamo Ranch y Marbach con un menu que mezcla pollo al carbon, parrilladas y antojos bien regios.
            </p>

            <div
              ref={panelRef}
              className="mt-8 rounded-[1.75rem] border border-white/[0.10] bg-white/[0.06] p-6 backdrop-blur-sm"
              style={revealStyle(panelVisible, { y: 22, duration: 0.6, delay: 120 })}
            >
              <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">Puntos fuertes del menu</p>
              <div className="mt-5 grid gap-3">
                {SIGNATURE_DISHES.map((dish) => (
                  <div
                    key={dish.name}
                    className="rounded-2xl border border-white/[0.08] bg-black/18 px-4 py-4"
                  >
                    <p className="font-display text-2xl uppercase tracking-[0.04em] text-white">{dish.name}</p>
                    <p className="mt-2 text-sm leading-7 text-neutral-400">{dish.desc}</p>
                  </div>
                ))}
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-orange-300 transition-colors"
              >
                {CONTACT_EMAIL}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {LOCATIONS.map((location, idx) => (
              <LocationCard key={location.name} location={location} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
