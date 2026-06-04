import { useEffect, useRef, useState } from 'react';
import { EVERYDAY_HOURS, LOCATIONS } from '../constants/locations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { interpolate, useLanguage } from '../hooks/useLanguage';
import { revealStyle } from '../utils/revealStyle';

const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors &copy; CARTO';

const MARKER_ANCHORS = {
  'Culebra 1': [56, 24],
  'Culebra 2': [-8, 24],
};

let leafletLoadPromise;

function loadLeaflet() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window unavailable'));
  if (window.L) return Promise.resolve(window.L);
  if (leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS_URL}"]`)) {
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = LEAFLET_CSS_URL;
      document.head.appendChild(stylesheet);
    }

    const existingScript = document.querySelector(`script[src="${LEAFLET_JS_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.L), { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = LEAFLET_JS_URL;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return leafletLoadPromise;
}

function mapsHref(location) {
  if (location.mapsUrl) return location.mapsUrl;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `AL CARBON POLLOS ASADOS ${location.address}`,
  )}`;
}

function markerIcon(L, location, active) {
  return L.divIcon({
    className: 'al-carbon-leaflet-marker-wrap',
    html: `
      <span class="al-carbon-leaflet-marker${active ? ' is-active' : ''}">
        <img src="/assets/logo.png" alt="" />
      </span>
    `,
    iconSize: [48, 48],
    iconAnchor: MARKER_ANCHORS[location.name] ?? [24, 24],
    popupAnchor: [0, -26],
  });
}

function LocationsMap({ activeLocation, onSelect, labels }) {
  const mapEl = useRef(null);
  const map = useRef(null);
  const markers = useRef(new Map());
  const onSelectRef = useRef(onSelect);
  const [mapReady, setMapReady] = useState(true);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const element = mapEl.current;
    if (!element || typeof window === 'undefined') return undefined;
    if (!('IntersectionObserver' in window)) {
      setShouldLoadMap(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '320px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadMap) return undefined;

    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapEl.current || map.current) return;

        const instance = L.map(mapEl.current, {
          zoomControl: true,
          scrollWheelZoom: false,
          attributionControl: true,
        });

        L.tileLayer(TILE_URL, {
          attribution: TILE_ATTRIBUTION,
          maxZoom: 19,
        }).addTo(instance);

        const bounds = L.latLngBounds(LOCATIONS.map((location) => [location.lat, location.lng]));

        LOCATIONS.forEach((location) => {
          const nativeMarker = L.marker([location.lat, location.lng], {
            icon: markerIcon(L, location, activeLocation.name === location.name),
            title: location.name,
            zIndexOffset: activeLocation.name === location.name ? 1000 : 0,
          })
            .addTo(instance)
            .on('click', () => onSelectRef.current(location));

          nativeMarker.bindTooltip(location.name, {
            direction: 'top',
            offset: [0, -24],
            opacity: 0.95,
          });

          markers.current.set(location.name, nativeMarker);
        });

        instance.fitBounds(bounds, {
          padding: [42, 42],
          maxZoom: 12,
        });

        map.current = instance;
        window.setTimeout(() => instance.invalidateSize(), 150);
      })
      .catch(() => setMapReady(false));

    return () => {
      cancelled = true;
      markers.current.clear();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [shouldLoadMap]);

  useEffect(() => {
    const L = typeof window !== 'undefined' ? window.L : null;
    if (!L || !map.current) return;

    LOCATIONS.forEach((location) => {
      const nativeMarker = markers.current.get(location.name);
      const active = activeLocation.name === location.name;
      if (!nativeMarker) return;

      nativeMarker.setIcon(markerIcon(L, location, active));
      nativeMarker.setZIndexOffset(active ? 1000 : 0);
    });

    map.current.panTo([activeLocation.lat, activeLocation.lng], {
      animate: true,
      duration: 0.45,
    });
  }, [activeLocation]);

  return (
    <div className="relative h-[360px] overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a] md:h-[520px] lg:h-[560px]">
      <div ref={mapEl} className="locations-map h-full w-full" />

      {!mapReady && (
        <div className="absolute inset-0 flex flex-col justify-end bg-[#1a1a1a] p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-primary">{labels.unavailable}</p>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            {labels.unavailableCopy}
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/80 p-3 backdrop-blur-md">
        <p className="text-[10px] font-black uppercase tracking-[0.26em] text-primary">{labels.active}</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-display text-2xl uppercase leading-none tracking-[0.03em] text-white">
              {activeLocation.name}
            </h3>
            <p className="mt-1 max-w-sm text-[11px] leading-4 text-neutral-300">{activeLocation.address}</p>
          </div>
          <a
            href={mapsHref(activeLocation)}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex h-8 items-center justify-center bg-primary px-4 text-[11px] font-black text-white shadow-cta transition-colors hover:bg-primary-dark"
          >
            {labels.openMaps}
          </a>
        </div>
      </div>
    </div>
  );
}

function LocationCard({ location, index, active, onSelect, labels }) {
  const [ref, visible] = useScrollReveal(0.1);

  return (
    <article
      ref={ref}
      onClick={onSelect}
      onFocus={onSelect}
      onMouseEnter={onSelect}
      className={`group relative flex min-h-[14.75rem] w-full flex-col overflow-hidden rounded-lg border p-3 shadow-[0_18px_48px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 ${
        active ? 'border-primary/50 bg-[#2a1515]' : 'border-white/10 bg-[#2a2a2a]'
      }`}
      style={revealStyle(visible, { y: 20, duration: 0.55, delay: index * 80 })}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${location.accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-primary">{labels.branch}</p>
            <h3 className="mt-1.5 font-display text-[19px] uppercase leading-none tracking-[0.04em] text-white">
              {location.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onSelect}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-primary/40 bg-black/30 text-primary transition-colors hover:bg-primary hover:text-white"
            aria-label={`${labels.active}: ${location.name}`}
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-[11px] leading-4 text-neutral-300">{location.address}</p>
        <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-neutral-400">{labels.notes[location.noteKey]}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {location.tagKeys.map((tagKey) => (
            <span
              key={tagKey}
              className="inline-flex border border-white/15 bg-white/[0.08] px-2 py-1 text-[10px] font-semibold text-white"
            >
              {labels.tags[tagKey]}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3 text-[11px]">
          <div>
            <p className="uppercase tracking-[0.18em] text-neutral-500">{labels.hours}</p>
            <p className="mt-1 max-w-[6.4rem] font-semibold leading-4 text-white">{EVERYDAY_HOURS}</p>
          </div>
          <a
            href={location.phoneHref}
            className="max-w-[5.3rem] text-right font-bold leading-4 text-white transition-colors hover:text-primary"
          >
            {location.phone}
          </a>
        </div>

        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <a
            href={location.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center justify-center bg-primary px-3 text-[11px] font-black text-white shadow-cta transition-all duration-200 hover:bg-primary-dark hover:shadow-cta-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
          >
            {labels.orderNow}
          </a>
          <a
            href={mapsHref(location)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center justify-center border border-white/15 bg-white/[0.06] px-3 text-[11px] font-bold text-white transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
            aria-label={interpolate(labels.mapsAria, { location: location.name })}
          >
            Maps
          </a>
        </div>
      </div>
    </article>
  );
}

export default function SocialProof() {
  const [mapRef, mapVisible] = useScrollReveal();
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0]);
  const { t } = useLanguage();

  return (
    <section id="locations" className="relative overflow-hidden bg-black py-16 md:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(480px,500px)] xl:gap-7">
          <div
            ref={mapRef}
            className="lg:sticky lg:top-16 lg:self-start"
            style={revealStyle(mapVisible, { y: 24 })}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {t.locations.eyebrow}
            </span>
            <h2 className="mt-6 max-w-[28rem] font-display text-5xl uppercase leading-[0.92] tracking-[0.03em] text-white md:text-6xl">
              {t.locations.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-400">
              {t.locations.copy}
            </p>

            <div className="mt-6 rounded-lg shadow-[0_30px_80px_rgba(0,0,0,0.42)]">
              <LocationsMap activeLocation={activeLocation} onSelect={setActiveLocation} labels={t.locations} />
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3 self-start pt-1 sm:grid-cols-2 lg:grid-cols-2 lg:justify-start">
            {LOCATIONS.map((location, idx) => (
              <LocationCard
                key={location.name}
                location={location}
                index={idx}
                active={activeLocation.name === location.name}
                onSelect={() => setActiveLocation(location)}
                labels={t.locations}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
