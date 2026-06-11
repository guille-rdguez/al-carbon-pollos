import { LOCATIONS } from '../constants/locations';

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// Great-circle distance in miles between two { lat, lng } points (Haversine).
export function distanceMiles(a, b) {
  const R = 3958.8; // Earth radius, miles
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Locations that offer delivery, sorted nearest-first to `point`.
// Each entry: { location, distance } (distance in miles).
export function rankByDistance(point) {
  return LOCATIONS
    .filter((loc) => loc.delivery && Object.keys(loc.delivery).length > 0)
    .map((loc) => ({ location: loc, distance: distanceMiles(point, { lat: loc.lat, lng: loc.lng }) }))
    .sort((a, b) => a.distance - b.distance);
}

// Human-friendly miles label, e.g. "2.4 mi" / "11 mi".
export function formatMiles(miles) {
  if (miles == null || Number.isNaN(miles)) return '';
  if (miles < 0.1) return '0.1 mi';
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}
