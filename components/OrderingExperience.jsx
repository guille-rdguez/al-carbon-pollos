import { useScrollReveal } from '../hooks/useScrollReveal';
import { revealStyle } from '../utils/revealStyle';
import { DELIVERY_URL, PICKUP_URL } from '../constants/urls';
import { BRAND_FACTS, LOCATIONS } from '../constants/locations';

const STEPS = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    kicker: 'Explora',
    title: 'Encuentra tu favorito',
    desc: 'Revisa combos, parrilladas, burgers y clásicos al carbón con una navegación clara y sin vueltas.',
    meta: 'Fotos, favoritos y combos',
    glowClass: 'from-orange-200/75 via-orange-100/35 to-transparent',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    kicker: 'Pago',
    title: 'Confirma en segundos',
    desc: 'Agrega tu orden, revisa el total y paga con confianza desde el celular. Rapido, seguro y sin friccion.',
    meta: 'Checkout agil y protegido',
    glowClass: 'from-primary/20 via-orange-100/20 to-transparent',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    kicker: 'Entrega',
    title: 'Recibelo como prefieras',
    desc: 'Pasa por tu pedido listo para pickup o pidelo a domicilio y recibelo caliente, recien salido de la parrilla.',
    meta: 'Listo, caliente y a tiempo',
    glowClass: 'from-orange-300/55 via-orange-100/25 to-transparent',
  },
];

function StepCard({ step, index }) {
  const [ref, visible] = useScrollReveal(0.1);

  return (
    <article className="group relative h-full">
      <div
        ref={ref}
        className="relative flex h-full min-h-[23rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(233,78,27,0.10)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/25 hover:shadow-[0_28px_80px_rgba(233,78,27,0.18)] sm:p-7"
        style={revealStyle(visible, { y: 34, duration: 0.7, delay: index * 120 })}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${step.glowClass} opacity-90 transition-opacity duration-500 group-hover:opacity-100`} />
        <div className="absolute -right-2 bottom-0 text-[5rem] font-black leading-none text-primary/[0.07] sm:text-[6rem]">
          0{index + 1}
        </div>
        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-lg animate-glow-pulse" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-400 text-white shadow-[0_20px_40px_rgba(233,78,27,0.28)] ring-1 ring-white/80">
                {step.icon}
              </div>
            </div>
            <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-primary font-display">
              Paso 0{index + 1}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.32em] text-neutral-400">
              {step.kicker}
            </p>
            <h3 className="mt-3 font-display text-[2rem] uppercase leading-[0.95] tracking-[0.03em] text-neutral-900">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              {step.desc}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-neutral-700">
              {step.meta}
            </span>
            <svg
              className="h-5 w-5 text-primary transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-5-5l5 5-5 5" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function OrderingExperience() {
  const [titleRef, titleVisible] = useScrollReveal();
  const [panelRef, panelVisible] = useScrollReveal(0.12);
  const [ctaRef, ctaVisible] = useScrollReveal(0.12);

  return (
    <section
      id="order"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_#fff8f1_0%,_#fff3e6_34%,_#fffaf5_70%,_#ffffff_100%)] py-20 md:py-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl animate-drift" />
        <div className="absolute right-0 top-16 h-56 w-56 rounded-full bg-orange-300/25 blur-3xl animate-glow-pulse" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-200/20 blur-3xl animate-float-soft" />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(233, 78, 27, 0.14) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent 78%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent 78%)',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div
            ref={titleRef}
            className="max-w-2xl"
            style={revealStyle(titleVisible, { y: 26 })}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-primary shadow-[0_12px_30px_rgba(233,78,27,0.08)] backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Como Funciona
            </span>
            <h2 className="mt-6 font-display text-5xl uppercase leading-[0.92] tracking-[0.02em] text-neutral-900 sm:text-6xl">
              Tu pedido, listo en 3 movimientos.
              <span className="block text-primary-light">Rapido, claro y sin friccion.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-neutral-600 sm:text-lg">
              Explora el menu, confirma en segundos y elige pickup o delivery. Una experiencia pensada para moverse tan rapido como tu antojo.
            </p>
          </div>

          <div
            ref={panelRef}
            className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-[0_20px_70px_rgba(233,78,27,0.12)] backdrop-blur-xl sm:p-7"
            style={revealStyle(panelVisible, { y: 30, duration: 0.7, delay: 120 })}
          >
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-300/25 blur-3xl" />
            <div className="absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative flex flex-col gap-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.32em] text-neutral-400">
                    Desde Culebra hasta Marbach
                  </p>
                  <h3 className="mt-3 font-display text-[2rem] uppercase leading-[0.95] tracking-[0.03em] text-neutral-900 sm:text-[2.25rem]">
                    5 sucursales reales. Misma llama. Mismo antojo.
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((location) => (
                    <span
                      key={location.name}
                      className="inline-flex rounded-full border border-orange-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-[0_10px_24px_rgba(233,78,27,0.08)]"
                    >
                      {location.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {BRAND_FACTS.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-orange-100 bg-white/80 px-4 py-5 shadow-[0_12px_30px_rgba(233,78,27,0.06)]"
                  >
                    <p className="font-display text-2xl uppercase tracking-[0.04em] text-neutral-900">{item.value}</p>
                    <p className="mt-1 text-sm text-neutral-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-14">
          <div aria-hidden="true" className="hidden md:block absolute left-[10%] right-[10%] top-10">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-primary/25" />
            <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/60 to-transparent bg-[length:200%_100%] animate-progress-line opacity-90" />
          </div>

          <div className="grid gap-5 md:grid-cols-3 xl:gap-6">
            {STEPS.map((step, idx) => (
              <StepCard key={step.title} step={step} index={idx} />
            ))}
          </div>
        </div>

        <div
          ref={ctaRef}
          className="mt-12 flex flex-col items-center gap-5"
          style={revealStyle(ctaVisible, { y: 24, duration: 0.65 })}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={PICKUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-lg font-bold text-white shadow-cta transition-all duration-200 hover:scale-[1.02] hover:bg-primary-dark hover:shadow-cta-hover active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Ordenar Pickup
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href={DELIVERY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-7 py-4 text-lg font-bold text-white shadow-[0_16px_32px_rgba(23,23,23,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
            >
              Pedir Delivery
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-neutral-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Pago rapido
            </span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>5 ubicaciones activas</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>Drive thru y delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
}
