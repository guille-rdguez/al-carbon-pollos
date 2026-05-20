import { useState } from 'react';
import { EVERYDAY_HOURS } from '../constants/locations';
import { interpolate, useLanguage } from '../hooks/useLanguage';

export default function PromoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { t } = useLanguage();
  if (dismissed) return null;

  return (
    <div className="relative w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="relative max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center flex-wrap gap-x-2 gap-y-0.5 text-sm md:text-base font-semibold text-center">
          <span className="text-xs uppercase tracking-[0.28em] text-primary">SATX</span>
          <span>
            <strong>{t.promo.lead}</strong> · {interpolate(t.promo.text, { hours: EVERYDAY_HOURS })}
          </span>
          <a
            href="/#locations"
            className="hidden sm:inline-flex items-center gap-1 ml-1 border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white transition-colors hover:border-primary hover:bg-primary"
          >
            {t.common.viewLocations} →
          </a>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors focus:outline-none"
          aria-label={t.common.closePromo}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
