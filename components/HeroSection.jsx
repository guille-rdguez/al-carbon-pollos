import { useEffect, useState } from 'react';
import { PICKUP_URL, DELIVERY_URL } from '../constants/urls';

const HERO_SLIDES = [
  '/assets/cover.avif',
  '/assets/whole-chicken.avif',
  '/assets/half-chicken.webp',
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, index) => (
          <img
            key={slide}
            src={slide}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-24 w-full">
        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold tracking-[0.24em] uppercase px-3.5 py-1.5 rounded-full mb-6 animate-fade-in shadow-cta">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Los Originales de Monterrey
          </div>

          <h1
            className="font-display text-[2.9rem] uppercase sm:text-[3.9rem] md:text-[5rem] font-black text-white leading-[0.94] tracking-[0.01em] mb-5 animate-fade-in delay-100"
          >
            Pollo al carbon<br />
            <span className="text-primary-light">para todo San Antonio.</span>
          </h1>

          <p
            className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed mb-8 animate-fade-in delay-200"
          >
            Brasas reales, sabor regio y pickup o delivery en San Antonio.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 animate-fade-in delay-300">
            <a
              href={PICKUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-primary text-white font-bold text-lg shadow-cta hover:bg-primary-dark hover:shadow-cta-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Ordenar Pickup
            </a>
            <a
              href={DELIVERY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/15 backdrop-blur-sm text-white font-bold text-lg border-2 border-white/50 hover:bg-white hover:text-primary hover:border-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Pedir Delivery
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/72 animate-fade-in delay-400">
            <span>5 ubicaciones</span>
            <span className="h-1 w-1 rounded-full bg-white/35" />
            <span>11AM - 9PM</span>
            <span className="h-1 w-1 rounded-full bg-white/35" />
            <span>Drive thru en Culebra #1</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 text-xs animate-bounce-soft">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
