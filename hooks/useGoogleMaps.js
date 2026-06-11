// Lazy loader for the Google Maps JS API "places" library, used to power the
// custom address autocomplete in the delivery flow. The library only loads the
// first time it's needed (when the delivery modal opens).
//
// Requires VITE_GOOGLE_MAPS_API_KEY. When it's missing the delivery flow falls
// back to browser geolocation + manual branch selection, so the feature still
// works without a key (just without address search).

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let placesPromise = null;

// Official Google Maps inline bootstrap loader — installs google.maps.importLibrary.
function bootstrap(key) {
  ((g) => {
    let h, a, k, p = 'The Google Maps JavaScript API', c = 'google', l = 'importLibrary',
      q = '__ib__', m = document, b = window;
    b = b[c] || (b[c] = {});
    const d = b.maps || (b.maps = {}), r = new Set(), e = new URLSearchParams(),
      u = () => h || (h = new Promise(async (f, n) => {
        await (a = m.createElement('script'));
        e.set('libraries', [...r] + '');
        for (k in g) e.set(k.replace(/[A-Z]/g, (tt) => '_' + tt[0].toLowerCase()), g[k]);
        e.set('callback', c + '.maps.' + q);
        a.src = 'https://maps.googleapis.com/maps/api/js?' + e;
        d[q] = f;
        a.onerror = () => (h = n(Error(p + ' could not load.')));
        a.nonce = m.querySelector('script[nonce]')?.nonce || '';
        m.head.append(a);
      }));
    d[l]
      ? console.warn(p + ' only loads once. Ignoring:', g)
      : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
  })({ key, v: 'weekly' });
}

// True when an API key is configured (address autocomplete is available).
export function hasGoogleMapsKey() {
  return Boolean(API_KEY);
}

// Resolves with the loaded Places library: { AutocompleteSuggestion,
// AutocompleteSessionToken, Place, ... }. Rejects if no key is configured.
export function loadPlaces() {
  if (!API_KEY) return Promise.reject(new Error('Missing VITE_GOOGLE_MAPS_API_KEY'));
  if (placesPromise) return placesPromise;
  placesPromise = (async () => {
    if (!(window.google && window.google.maps && window.google.maps.importLibrary)) {
      bootstrap(API_KEY);
    }
    return window.google.maps.importLibrary('places');
  })();
  return placesPromise;
}
