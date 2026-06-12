import { PICKUP_URL } from '../constants/urls';
import { useLanguage } from '../hooks/useLanguage';
import { useDelivery } from '../hooks/useDelivery';

export default function HeroSection() {
  const { t } = useLanguage();
  const { openDelivery } = useDelivery();

  return (
    <section
      id="home"
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-black"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/pollo-cover.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/25" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.92))]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.95fr_0.55fr] lg:items-end">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex max-w-full items-center gap-3 border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm animate-fade-in sm:px-4 sm:text-xs sm:tracking-[0.28em]">
            <span className="h-2 w-2 bg-primary" />
            {t.hero.eyebrow}
          </div>

          <h1
            className="font-display mb-5 text-[4rem] font-black uppercase leading-[0.82] tracking-[0.03em] text-white animate-fade-in delay-100 sm:text-[6rem] md:text-[7.8rem]"
          >
            Al Carbon
            <span className="mt-3 block text-[1.65rem] leading-none tracking-[0.18em] text-primary sm:text-[2.35rem] md:text-[3rem]">
              {t.hero.subtitle}
            </span>
          </h1>

          <p
            className="mb-8 max-w-2xl text-lg leading-8 text-white/75 animate-fade-in delay-200 md:text-xl"
          >
            {t.hero.copy}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 animate-fade-in delay-300">
            <a
              href={PICKUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary px-7 py-4 text-lg font-bold text-white shadow-cta transition-all duration-200 hover:scale-[1.02] hover:bg-primary-dark hover:shadow-cta-hover active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t.common.pickup}
            </a>
            <button
              type="button"
              onClick={openDelivery}
              className="inline-flex items-center justify-center gap-2 border border-white/40 bg-white/10 px-7 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:border-white hover:bg-white hover:text-black active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {t.common.delivery}
            </button>
          </div>

          <div className="mt-9 grid max-w-2xl grid-cols-1 border-y border-white/10 text-white/75 animate-fade-in delay-400 sm:grid-cols-3">
            <div className="border-b border-white/10 py-4 sm:border-b-0 sm:pr-4">
              <p className="font-display text-3xl uppercase text-white">5</p>
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">{t.common.locations}</p>
            </div>
            <div className="border-b border-white/10 py-4 sm:border-x sm:border-b-0 sm:border-white/10 sm:px-4">
              <p className="font-display text-3xl uppercase text-white">11AM - 9PM</p>
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">{t.hero.hoursLabel}</p>
            </div>
            <div className="py-4 sm:pl-4">
              <p className="font-display text-3xl uppercase text-white">Drive Thru</p>
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">{t.hero.driveLabel}</p>
            </div>
          </div>
        </div>

        <aside className="hidden border-l border-white/20 pl-7 text-white/75 lg:block animate-fade-in delay-500">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-primary">{t.common.signature}</p>
          <h2 className="mt-4 font-display text-5xl uppercase leading-[0.88] tracking-[0.03em] text-white">
            {t.hero.signatureTitle}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/50">
            {t.hero.signatureDesc}
          </p>
          <div className="mt-6 flex items-center gap-4">
            <span className="font-display text-4xl uppercase text-primary">$23.25</span>
            <span className="h-px flex-1 bg-white/20" />
          </div>
        </aside>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 text-xs animate-bounce-soft">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
