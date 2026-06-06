import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { revealStyle } from '../utils/revealStyle';
import { DELIVERY_URL, PICKUP_URL } from '../constants/urls';
import { LOCATIONS } from '../constants/locations';
import { useLanguage } from '../hooks/useLanguage';

const CHICKEN_FRAME_COUNT = 80;
const chickenFrameSrc = (index) => `/assets/chicken-scroll/frame-${String(index + 1).padStart(3, '0')}.jpg`;

const STEP_ICONS = [
  (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
];

function StepCard({ step, index }) {
  const [ref, visible] = useScrollReveal(0.1);

  return (
    <article
      ref={ref}
      className="group flex min-h-[21rem] flex-col rounded-lg border border-white/10 bg-[#050505] p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-[#0a0a0a]"
      style={revealStyle(visible, { y: 30, duration: 0.65, delay: index * 110 })}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center bg-primary text-white shadow-cta">
          {step.icon}
        </div>
        <span className="font-display text-5xl uppercase leading-none text-white/45">
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
        <p className="mt-4 text-sm leading-7 text-white/55">
          {step.desc}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-7">
        <span className="border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white/80">
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

function ScrollFrameShowcase({ alt }) {
  return (
    <div className="absolute inset-0 bg-slate-100">
      <img
        src="/assets/pollo.webp"
        alt={alt}
        className="h-full w-full object-cover"
        draggable="false"
        loading="lazy"
        decoding="async"
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
    <section id="order" className="relative overflow-hidden bg-white py-20 text-slate-900 md:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div
            ref={titleRef}
            className="max-w-2xl"
            style={revealStyle(titleVisible, { y: 26 })}
          >
            <span className="inline-flex items-center gap-3 border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-primary">
              <span className="h-2 w-2 bg-primary" />
              {t.ordering.eyebrow}
            </span>
            <h2 className="mt-6 font-display text-5xl uppercase leading-[0.88] tracking-[0.03em] text-slate-900 sm:text-6xl">
              {t.ordering.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              {t.ordering.copy}
            </p>
          </div>

          <figure
            ref={imageRef}
            className="relative min-h-[26rem] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_26px_70px_rgba(15,23,42,0.08)]"
            style={revealStyle(imageVisible, { y: 30, duration: 0.7, delay: 120 })}
          >
            <ScrollFrameShowcase alt={t.ordering.figureAlt} />
          </figure>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3 xl:gap-6">
          {t.ordering.steps.map((step, idx) => (
            <StepCard key={step.title} step={{ ...step, icon: STEP_ICONS[idx] }} index={idx} />
          ))}
        </div>

        <div
          ref={ctaRef}
          className="mt-14 grid gap-8 border-y border-slate-200 py-8 lg:grid-cols-[1fr_auto]"
          style={revealStyle(ctaVisible, { y: 24, duration: 0.65 })}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.ordering.facts.map((item) => (
              <div key={item.label}>
                <p className="font-display text-3xl uppercase tracking-[0.04em] text-slate-900">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href={PICKUP_URL}
              className="inline-flex items-center justify-center gap-2 bg-primary px-7 py-4 text-base font-bold text-white shadow-cta transition-all duration-200 hover:scale-[1.02] hover:bg-primary-dark hover:shadow-cta-hover active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white"
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
              className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white px-7 py-4 text-base font-bold text-slate-900 transition-all duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-white"
            >
              {t.common.delivery}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
          {LOCATIONS.map((location) => (
            <span key={location.name} className="border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
              {location.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
