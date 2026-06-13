import { useEffect } from 'react';
import { LOCATIONS } from '../constants/locations';
import { interpolate, useLanguage } from '../hooks/useLanguage';
import { useDelivery } from '../hooks/useDelivery';

const ArrowIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const LocationIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function OrderLocationsModal() {
  const { t } = useLanguage();
  const { isPickupOpen, closePickup } = useDelivery();
  const tx = t.orderFlow;

  useEffect(() => {
    if (!isPickupOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => { document.body.style.overflow = previousOverflow; };
  }, [isPickupOpen]);

  useEffect(() => {
    if (!isPickupOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closePickup(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPickupOpen, closePickup]);

  if (!isPickupOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-coal-950/70 backdrop-blur-sm sm:items-center"
      onClick={closePickup}
      role="dialog"
      aria-modal="true"
      aria-label={tx.title}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-lg flex-col bg-white text-coal-900 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-coal-100 px-6 py-5">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-primary">
              <span className="h-2 w-2 bg-primary" />
              {tx.eyebrow}
            </span>
            <h3 className="mt-2 font-display text-3xl uppercase leading-[0.9] tracking-[0.03em]">
              {tx.title}
            </h3>
          </div>
          <button
            onClick={closePickup}
            className="-mr-1 px-3 py-1.5 text-lg font-bold text-coal-400 transition-colors hover:text-coal-900"
            aria-label={tx.close}
          >
            x
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-sm leading-7 text-coal-500">{tx.subtitle}</p>
          <p className="mb-3 mt-6 text-[11px] font-black uppercase tracking-[0.18em] text-coal-400">
            {tx.prompt}
          </p>

          <div className="grid gap-2.5">
            {LOCATIONS.map((location) => (
              <a
                key={location.name}
                href={location.cloverUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closePickup}
                aria-label={interpolate(tx.orderAt, { location: location.orderLabel ?? location.name })}
                className="group flex items-center gap-4 border border-coal-200 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary/10 text-primary">
                  <LocationIcon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-2xl uppercase leading-none tracking-[0.02em] text-coal-900">
                    {location.orderLabel ?? location.name}
                  </span>
                  <span className="mt-1.5 block truncate text-xs text-coal-500">{location.compactAddress}</span>
                  <span className="mt-2 inline-flex border border-coal-200 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-coal-600">
                    {tx.phoneLabel}: {location.phone}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-primary">
                  <span className="hidden text-[11px] font-black uppercase tracking-[0.14em] sm:inline">
                    {tx.openMenu}
                  </span>
                  <ArrowIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
