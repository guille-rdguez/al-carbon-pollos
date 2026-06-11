import { useEffect, useRef, useState } from 'react';
import { interpolate, useLanguage } from '../hooks/useLanguage';
import { useDelivery } from '../hooks/useDelivery';
import { LOCATIONS } from '../constants/locations';
import { platformsForLocation } from '../constants/deliveryPlatforms';
import { rankByDistance, formatMiles } from '../utils/nearestLocation';
import { hasGoogleMapsKey, loadPlaces } from '../hooks/useGoogleMaps';

// Bias address suggestions toward San Antonio (where every branch lives).
const SAN_ANTONIO = { lat: 29.4241, lng: -98.4936 };

const PinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ArrowIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

// Small brand-logo links used in the "other branches" list.
function PlatformIcons({ location, ariaPrefix }) {
  return (
    <span className="flex items-center gap-1.5">
      {platformsForLocation(location).map((p) => (
        <a
          key={p.id}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`${ariaPrefix} ${p.name}`}
          className="flex h-8 w-8 items-center justify-center border border-coal-200 bg-white transition-colors hover:border-primary"
        >
          <img src={p.logo} alt={p.name} className="h-4 w-4 object-contain" loading="lazy" />
        </a>
      ))}
    </span>
  );
}

export default function DeliveryModal() {
  const { t } = useLanguage();
  const { language } = useLanguage();
  const { isOpen, closeDelivery } = useDelivery();

  const [step, setStep] = useState('address'); // 'address' | 'result'
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [geoStatus, setGeoStatus] = useState('idle'); // 'idle' | 'locating' | 'error'
  const [result, setResult] = useState(null); // { ranking, address, manual }
  const [showAll, setShowAll] = useState(false);

  const placesRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const debounceRef = useRef(null);
  const reqIdRef = useRef(0);
  const inputRef = useRef(null);

  const tx = t.deliveryFlow;
  const canSearch = hasGoogleMapsKey();

  // Lock body scroll + warm up the Places library while the modal is open.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (canSearch && !placesRef.current) {
      loadPlaces()
        .then((lib) => { placesRef.current = lib; })
        .catch((error) => console.warn('Google Places unavailable:', error));
    }

    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen, canSearch]);

  // Focus the address field when the search step opens.
  useEffect(() => {
    if (isOpen && step === 'address' && canSearch) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [isOpen, step, canSearch]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closeDelivery(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeDelivery]);

  if (!isOpen) return null;

  const goToResult = (point, address, manual = false) => {
    setResult({ ranking: rankByDistance(point), address, manual });
    setShowAll(false);
    setStep('result');
  };

  const runSearch = (value) => {
    const lib = placesRef.current;
    if (!lib || value.trim().length < 3) {
      setSuggestions([]);
      setSearching(false);
      return;
    }
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new lib.AutocompleteSessionToken();
    }
    const reqId = ++reqIdRef.current;
    setSearching(true);
    lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input: value,
      sessionToken: sessionTokenRef.current,
      includedRegionCodes: ['us'],
      locationBias: { center: SAN_ANTONIO, radius: 50000 },
      language: language === 'es' ? 'es' : 'en',
      region: 'us',
    })
      .then(({ suggestions: list }) => {
        if (reqId !== reqIdRef.current) return; // stale response
        setSuggestions((list ?? []).filter((s) => s.placePrediction));
        setSearching(false);
      })
      .catch((error) => {
        if (reqId !== reqIdRef.current) return;
        console.warn('Autocomplete failed:', error);
        setSuggestions([]);
        setSearching(false);
      });
  };

  const onQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => runSearch(value), 220);
  };

  const selectSuggestion = async (suggestion) => {
    if (!suggestion?.placePrediction) return;
    setSelecting(true);
    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({ fields: ['formattedAddress', 'location'] });
      const loc = place.location;
      const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
      const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
      setQuery(place.formattedAddress ?? suggestion.placePrediction.text?.text ?? '');
      setSuggestions([]);
      sessionTokenRef.current = null; // fetchFields ends the session
      goToResult({ lat, lng }, place.formattedAddress ?? null);
    } catch (error) {
      console.warn('Place details failed:', error);
    } finally {
      setSelecting(false);
    }
  };

  const onInputKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) { setGeoStatus('error'); return; }
    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoStatus('idle');
        goToResult({ lat: pos.coords.latitude, lng: pos.coords.longitude }, null);
      },
      () => setGeoStatus('error'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const pickLocation = (location) => {
    goToResult({ lat: location.lat, lng: location.lng }, null, true);
  };

  const backToAddress = () => {
    setStep('address');
    setShowAll(false);
  };

  const nearest = result?.ranking?.[0];
  const nearestPlatforms = nearest ? platformsForLocation(nearest.location) : [];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-coal-950/70 backdrop-blur-sm sm:items-center"
      onClick={closeDelivery}
      role="dialog"
      aria-modal="true"
      aria-label={tx.title}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-lg flex-col bg-white text-coal-900 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-coal-100 px-6 py-5">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-primary">
              <span className="h-2 w-2 bg-primary" />
              Delivery
            </span>
            <h3 className="mt-2 font-display text-3xl uppercase leading-[0.9] tracking-[0.03em]">{tx.title}</h3>
          </div>
          <button
            onClick={closeDelivery}
            className="-mr-1 px-3 py-1.5 text-lg font-bold text-coal-400 transition-colors hover:text-coal-900"
            aria-label={tx.close}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'address' ? (
            <div>
              <p className="text-sm leading-7 text-coal-500">{tx.subtitle}</p>

              {/* Use my current location */}
              <button
                onClick={useMyLocation}
                disabled={geoStatus === 'locating'}
                className="mt-5 flex w-full items-center justify-center gap-2.5 bg-primary px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-cta transition-all duration-200 hover:bg-primary-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <PinIcon className="h-5 w-5" />
                {geoStatus === 'locating' ? tx.locating : tx.useLocation}
              </button>
              {geoStatus === 'error' && (
                <p className="mt-2 text-xs font-bold text-primary">{tx.geoError}</p>
              )}

              {/* Address autocomplete (only when a Maps key is configured) */}
              {canSearch && (
                <div className="mt-5">
                  <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.18em] text-coal-400">
                    {tx.addressLabel}
                  </label>
                  <div className="relative">
                    <PinIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-coal-400" />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={onQueryChange}
                      onKeyDown={onInputKeyDown}
                      type="text"
                      autoComplete="off"
                      spellCheck="false"
                      placeholder={tx.addressPlaceholder}
                      className="w-full border border-coal-200 bg-white py-3.5 pl-11 pr-4 text-sm text-coal-900 placeholder:text-coal-400 focus:border-primary focus:outline-none"
                    />
                  </div>

                  {(searching || selecting || suggestions.length > 0) && (
                    <div className="mt-2 divide-y divide-coal-100 border border-coal-100">
                      {(searching || selecting) && (
                        <p className="px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-coal-400">
                          {tx.searching}
                        </p>
                      )}
                      {suggestions.map((s, idx) => {
                        const pred = s.placePrediction;
                        const main = pred.mainText?.text ?? pred.text?.text ?? '';
                        const secondary = pred.secondaryText?.text ?? '';
                        return (
                          <button
                            key={pred.placeId ?? idx}
                            onClick={() => selectSuggestion(s)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                              idx === activeIndex ? 'bg-primary/5' : 'hover:bg-coal-50'
                            }`}
                          >
                            <PinIcon className="h-4 w-4 shrink-0 text-primary" />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-bold text-coal-900">{main}</span>
                              {secondary && (
                                <span className="block truncate text-xs text-coal-500">{secondary}</span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-coal-300">{tx.poweredByGoogle}</p>
                </div>
              )}
              {!canSearch && (
                <p className="mt-4 border border-coal-100 bg-coal-50 px-4 py-3 text-xs leading-relaxed text-coal-500">
                  {tx.keyMissing}
                </p>
              )}

              {/* Manual branch picker */}
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px flex-1 bg-coal-100" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-coal-400">{tx.orPick}</span>
                  <span className="h-px flex-1 bg-coal-100" />
                </div>
                <ul className="grid gap-2">
                  {LOCATIONS.map((location) => (
                    <li key={location.name}>
                      <button
                        onClick={() => pickLocation(location)}
                        className="flex w-full items-center justify-between gap-3 border border-coal-200 px-4 py-3 text-left transition-colors hover:border-primary hover:bg-coal-50"
                      >
                        <span className="min-w-0">
                          <span className="block font-display text-xl uppercase leading-none tracking-[0.02em] text-coal-900">
                            {location.name}
                          </span>
                          <span className="mt-1 block truncate text-xs text-coal-500">{location.compactAddress}</span>
                        </span>
                        <PlatformIcons location={location} ariaPrefix={tx.orderPrompt} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            nearest && (
              <div>
                {/* Nearest branch */}
                <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-primary">
                  <PinIcon className="h-4 w-4" />
                  {tx.nearestEyebrow}
                </span>
                <h4 className="mt-2 font-display text-4xl uppercase leading-[0.88] tracking-[0.03em] text-coal-900">
                  {nearest.location.name}
                </h4>
                <p className="mt-2 text-sm text-coal-500">{nearest.location.compactAddress}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {!result.manual && (
                    <span className="border border-coal-200 bg-coal-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-coal-600">
                      {interpolate(tx.away, { distance: formatMiles(nearest.distance) })}
                    </span>
                  )}
                  <a
                    href={nearest.location.phoneHref}
                    className="border border-coal-200 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-coal-600 transition-colors hover:border-primary hover:text-primary"
                  >
                    {nearest.location.phone}
                  </a>
                </div>

                {result.address && (
                  <p className="mt-4 text-xs leading-relaxed text-coal-400">
                    <span className="font-bold uppercase tracking-[0.14em] text-coal-500">{tx.deliveringTo}:</span>{' '}
                    {result.address}
                  </p>
                )}

                {/* Delivery apps */}
                {nearestPlatforms.length > 0 ? (
                  <div className="mt-6">
                    <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-coal-400">{tx.orderPrompt}</p>
                    <div className="grid gap-2.5">
                      {nearestPlatforms.map((p) => (
                        <a
                          key={p.id}
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={interpolate(tx.orderOn, { platform: p.name })}
                          className="group flex items-center gap-4 border border-coal-200 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card"
                        >
                          <span
                            className="flex h-12 w-12 shrink-0 items-center justify-center"
                            style={{ backgroundColor: `${p.color}1A` }}
                          >
                            <img src={p.logo} alt={p.name} className="h-6 w-6 object-contain" />
                          </span>
                          <span className="flex-1 font-display text-2xl uppercase leading-none tracking-[0.02em] text-coal-900">
                            {p.name}
                          </span>
                          <ArrowIcon className="h-5 w-5 text-primary transition-transform duration-200 group-hover:translate-x-1" />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 border border-coal-100 bg-coal-50 px-4 py-4">
                    <p className="text-sm text-coal-600">{tx.noPlatforms}</p>
                    <a
                      href={nearest.location.phoneHref}
                      className="mt-3 inline-flex items-center gap-2 bg-primary px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white shadow-cta"
                    >
                      {tx.call} · {nearest.location.phone}
                    </a>
                  </div>
                )}

                {/* Secondary actions */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-coal-100 pt-4">
                  <button
                    onClick={backToAddress}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-coal-500 transition-colors hover:text-primary"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    {tx.changeAddress}
                  </button>
                  {result.ranking.length > 1 && (
                    <button
                      onClick={() => setShowAll((v) => !v)}
                      className="text-sm font-bold text-primary transition-colors hover:underline"
                    >
                      {showAll ? tx.hideBranches : tx.otherBranches}
                    </button>
                  )}
                </div>

                {/* Other branches */}
                {showAll && result.ranking.length > 1 && (
                  <ul className="mt-4 grid gap-2">
                    {result.ranking.slice(1).map(({ location, distance }) => (
                      <li
                        key={location.name}
                        className="flex items-center justify-between gap-3 border border-coal-100 px-4 py-3"
                      >
                        <span className="min-w-0">
                          <span className="block font-display text-lg uppercase leading-none tracking-[0.02em] text-coal-900">
                            {location.name}
                          </span>
                          <span className="mt-1 block text-xs text-coal-500">
                            {result.manual ? location.compactAddress : interpolate(tx.away, { distance: formatMiles(distance) })}
                          </span>
                        </span>
                        <PlatformIcons location={location} ariaPrefix={tx.orderPrompt} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
