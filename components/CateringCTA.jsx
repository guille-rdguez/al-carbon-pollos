import { CONTACT_EMAIL } from '../constants/locations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { revealStyle } from '../utils/revealStyle';
import { useLanguage } from '../hooks/useLanguage';

export default function CateringCTA() {
  const [sectionRef, sectionVisible] = useScrollReveal(0.08);
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-black py-20 text-white md:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="absolute inset-0 opacity-60">
        <img
          src="/assets/parrillada-familiar.webp"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/50" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.82),rgba(0,0,0,0.55),rgba(0,0,0,0.9))]" />
      </div>

      <div
        ref={sectionRef}
        className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_0.75fr] lg:items-end"
        style={revealStyle(sectionVisible, { y: 26, duration: 0.7 })}
      >
        <div>
          <span className="inline-flex items-center gap-3 border border-white/15 bg-white/[0.08] px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-primary backdrop-blur-sm">
            <span className="h-2 w-2 bg-primary" />
            {t.cateringCta.eyebrow}
          </span>
          <h2 className="mt-6 max-w-3xl font-display text-5xl uppercase leading-[0.86] tracking-[0.03em] text-white md:text-7xl">
            {t.cateringCta.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            {t.cateringCta.copy}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/catering#catering-form"
              className="inline-flex items-center justify-center gap-2 bg-primary px-7 py-4 text-base font-bold text-white shadow-cta transition-all duration-200 hover:scale-[1.02] hover:bg-primary-dark hover:shadow-cta-hover active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
            >
              {t.cateringCta.quote}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Catering%20Al%20Carbon`}
              className="inline-flex items-center justify-center gap-2 border border-white/25 bg-white/[0.08] px-7 py-4 text-base font-bold text-white backdrop-blur-sm transition-all duration-200 hover:border-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              {t.common.emailTeam}
            </a>
          </div>
        </div>

        <div className="border-y border-white/10 py-6 lg:border-l lg:border-y-0 lg:pl-8">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-primary">{t.cateringCta.ideal}</p>
          <div className="mt-5 grid gap-3">
            {t.cateringCta.points.map((point) => (
              <div key={point} className="flex items-center gap-3 border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-sm">
                <span className="flex h-8 w-8 items-center justify-center bg-primary text-sm font-black text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm font-bold text-white/80">{point}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-white/50">
            {t.cateringCta.note}
          </p>
        </div>
      </div>
    </section>
  );
}
