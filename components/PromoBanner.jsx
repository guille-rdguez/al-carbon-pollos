import { useState } from 'react';
import { EVERYDAY_HOURS } from '../constants/locations';

export default function PromoBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative w-full overflow-hidden bg-neutral-900 text-white">
      {/* Animated warm stripe */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-orange-500 opacity-90" />

      <div className="relative max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center flex-wrap gap-x-2 gap-y-0.5 text-sm md:text-base font-semibold text-center">
          <span className="text-base">SA</span>
          <span>
            <strong>5 ubicaciones en San Antonio</strong> · Abierto diario {EVERYDAY_HOURS} · Pickup y delivery
          </span>
          <a
            href="#locations"
            className="hidden sm:inline-flex items-center gap-1 ml-1 px-3 py-0.5 bg-white text-primary text-xs font-bold rounded-full hover:bg-orange-50 transition-colors"
          >
            Ver ubicaciones →
          </a>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors focus:outline-none"
          aria-label="Cerrar promoción"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
