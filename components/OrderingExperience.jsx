import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { revealStyle } from '../utils/revealStyle';
import { DELIVERY_URL, PICKUP_URL } from '../constants/urls';
import { BRAND_FACTS, LOCATIONS } from '../constants/locations';
import { useLanguage } from '../hooks/useLanguage';

const CHICKEN_FRAME_COUNT = 80;
const chickenFrameSrc = (index) => `/assets/chicken-scroll/frame-${String(index + 1).padStart(3, '0')}.jpg`;

const STEPS = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    kicker: 'Elige',
    title: 'Carta directa',
    desc: 'Pollo entero, medio pollo, parrilladas, burgers y postres organizados para decidir rapido sin perder apetito.',
    meta: 'Menu visual',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    kicker: 'Confirma',
    title: 'Pago claro',
    desc: 'Agrega tu orden, revisa el total y confirma pickup o delivery desde el celular con un flujo sencillo.',
    meta: 'Checkout agil',
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    kicker: 'Recibe',
    title: 'Sale caliente',
    desc: 'Pasa por tu pedido o pidelo a domicilio. La experiencia conserva el foco en comida recien salida de la parrilla.',
    meta: 'Pickup y delivery',
  },
];

function StepCard({ step, index }) {
  const [ref, visible] = useScrollReveal(0.1);

  return (
    <article
      ref={ref}
      className="group flex min-h-[21rem] flex-col rounded-lg border border-white/10 bg-white/[0.055] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white/[0.08]"
      style={revealStyle(visible, { y: 30, duration: 0.65, delay: index * 110 })}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center bg-primary text-white shadow-cta">
          {step.icon}
        </div>
        <span className="font-display text-5xl uppercase leading-none text-white/8">
          0{index + 1}
        </span>
      </div>

      <div className="mt-7">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.3em] text-primary">
          {step.kicker}
        </p>
        <h3 className="mt-3 font-display text-[2.3rem] uppercase leading-[0.9] tracking-[0.03em] text-white">
          {step.title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-white/50">
          {step.desc}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-7">
        <span className="border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white/70">
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
    </article>
  );
}

function ScrollFrameShowcase() {
  const wrapperRef = useRef(null);
  const loadedFramesRef = useRef(new Set([0]));
  const [targetFrame, setTargetFrame] = useState(0);
  const [displayFrame, setDisplayFrame] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof window === 'undefined') return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setTargetFrame(0);
      return undefined;
    }

    let rafId = 0;

    const updateFrame = () => {
      rafId = 0;
      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const start = viewportHeight * 0.85;
      const end = -rect.height * 0.25;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      const nextFrame = Math.round(progress * (CHICKEN_FRAME_COUNT - 1));

      setTargetFrame((current) => (current === nextFrame ? current : nextFrame));
    };

    const scheduleUpdate = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateFrame);
      }
    };

    updateFrame();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (loadedFramesRef.current.has(targetFrame)) {
      setDisplayFrame(targetFrame);
      return undefined;
    }

    const frame = new Image();
    frame.onload = () => {
      loadedFramesRef.current.add(targetFrame);
      if (!cancelled) {
        setDisplayFrame(targetFrame);
      }
    };
    frame.src = chickenFrameSrc(targetFrame);

    return () => {
      cancelled = true;
    };
  }, [targetFrame]);

  useEffect(() => {
    const preloadIndexes = [0, 1, 2, CHICKEN_FRAME_COUNT - 1];

    for (let offset = -3; offset <= 8; offset += 1) {
      const next = displayFrame + offset;
      if (next >= 0 && next < CHICKEN_FRAME_COUNT) {
        preloadIndexes.push(next);
      }
    }

    preloadIndexes.forEach((index) => {
      if (loadedFramesRef.current.has(index)) return;
      const frame = new Image();
      frame.onload = () => loadedFramesRef.current.add(index);
      frame.src = chickenFrameSrc(index);
    });
  }, [displayFrame]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 bg-black">
      <img
        src={chickenFrameSrc(displayFrame)}
        alt="Pollo al carbon sobre la parrilla"
        className="h-full w-full object-cover"
        draggable="false"
      />
    </div>
  );
}

export default function OrderingExperience() {
  const [titleRef, titleVisible] = useScrollReveal();
  const [imageRef, imageVisible] = useScrollReveal(0.12);
  const [ctaRef, ctaVisible] = useScrollReveal(0.12);
  const { t } = useLanguage();

  return (
    <section id="order" className="relative overflow-hidden bg-black py-20 text-white md:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div
            ref={titleRef}
            className="max-w-2xl"
            style={revealStyle(titleVisible, { y: 26 })}
          >
            <span className="inline-flex items-center gap-3 border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-white/70">
              <span className="h-2 w-2 bg-primary" />
              {t.ordering.eyebrow}
            </span>
            <h2 className="mt-6 font-display text-5xl uppercase leading-[0.88] tracking-[0.03em] text-white sm:text-6xl">
              {t.ordering.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/50 sm:text-lg">
              {t.ordering.copy}
            </p>
          </div>

          <figure
            ref={imageRef}
            className="relative min-h-[26rem] overflow-hidden rounded-lg border border-white/10 bg-coal-900 shadow-[0_26px_70px_rgba(0,0,0,0.38)]"
            style={revealStyle(imageVisible, { y: 30, duration: 0.7, delay: 120 })}
          >
            <ScrollFrameShowcase />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <figcaption className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Pollo al carbon</p>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
                La brasa en primer plano: piel dorada, fuego alto y ese acabado regio que sostiene toda la experiencia.
              </p>
            </figcaption>
          </figure>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3 xl:gap-6">
          {STEPS.map((step, idx) => (
            <StepCard key={step.title} step={step} index={idx} />
          ))}
        </div>

        <div
          ref={ctaRef}
          className="mt-14 grid gap-8 border-y border-white/10 py-8 lg:grid-cols-[1fr_auto]"
          style={revealStyle(ctaVisible, { y: 24, duration: 0.65 })}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BRAND_FACTS.map((item) => (
              <div key={item.label}>
                <p className="font-display text-3xl uppercase tracking-[0.04em] text-white">{item.value}</p>
                <p className="mt-1 text-sm text-white/50">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href={PICKUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary px-7 py-4 text-base font-bold text-white shadow-cta transition-all duration-200 hover:scale-[1.02] hover:bg-primary-dark hover:shadow-cta-hover active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
            >
              {t.common.pickup}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href={DELIVERY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/20 bg-white/[0.06] px-7 py-4 text-base font-bold text-white transition-all duration-200 hover:border-white/40 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              {t.common.delivery}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
          {LOCATIONS.map((location) => (
            <span key={location.name} className="border border-white/10 px-3 py-2">
              {location.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
