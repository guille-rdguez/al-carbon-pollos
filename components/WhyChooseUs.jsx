import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLanguage } from '../hooks/useLanguage';
import { revealStyle } from '../utils/revealStyle';
import burgerImage from '../assets/burger.webp';

const VALUE_ICONS = [
  (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.974 7.974 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
    </svg>
  ),
  (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
];

function ValueCard({ val, index }) {
  const [ref, visible] = useScrollReveal(0.08);

  return (
    <div
      ref={ref}
      className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.055] p-6 transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.08]"
      style={revealStyle(visible, { delay: index * 100 })}
    >
      <div className="flex h-12 w-12 items-center justify-center bg-primary text-white">
        {val.icon}
      </div>
      <div>
        <h3 className="mb-2 font-display text-3xl uppercase leading-none tracking-[0.03em] text-white">{val.title}</h3>
        <p className="text-sm leading-7 text-white/50">{val.desc}</p>
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  const [titleRef, titleVisible] = useScrollReveal();
  const [showcaseRef, showcaseVisible] = useScrollReveal(0.08);
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-coal-950 py-20 text-white md:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div
          ref={titleRef}
          className="relative mb-12 max-w-3xl"
          style={revealStyle(titleVisible, { y: 24 })}
        >
          <span className="mb-3 inline-block text-sm font-black uppercase tracking-[0.32em] text-primary">{t.why.eyebrow}</span>
          <h2 className="mb-4 font-display text-5xl uppercase leading-[0.88] tracking-[0.03em] text-white md:text-7xl">
            {t.why.title}
          </h2>
          <p className="max-w-2xl text-base leading-8 text-white/50">
            {t.why.copy}
          </p>
        </div>

        <div
          ref={showcaseRef}
          className="mb-12 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]"
          style={revealStyle(showcaseVisible, { y: 28, duration: 0.7 })}
        >
          <figure className="relative min-h-[420px] overflow-hidden rounded-[15px] border border-white/10 bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
            <img
              src={burgerImage}
              alt={t.why.imageAlt}
              className="absolute inset-0 h-full w-full rounded-[15px] object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <div className="grid content-between gap-5 border-y border-white/10 py-6 lg:border-y-0 lg:border-l lg:py-0 lg:pl-7">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-primary">{t.why.showcaseEyebrow}</p>
              <h3 className="mt-3 font-display text-5xl uppercase leading-[0.86] tracking-[0.03em] text-white">
                {t.why.showcaseTitle}
              </h3>
              <p className="mt-5 text-sm leading-7 text-white/50">
                {t.why.showcaseCopy}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6">
              {t.why.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-4xl uppercase text-primary">{stat.value}</p>
                  <p className="mt-1 text-sm text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.why.values.map((val, idx) => (
            <ValueCard key={val.title} val={{ ...val, icon: VALUE_ICONS[idx] }} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
