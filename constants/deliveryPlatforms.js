// Delivery platform registry. Logos live in /public/assets/delivery (official
// brand marks) and are referenced by the delivery flow. `color` is the brand
// color used as an accent on the white modal cards.
export const DELIVERY_PLATFORMS = {
  doorDash: { id: 'doorDash', name: 'DoorDash',  logo: '/assets/delivery/doordash.svg', color: '#FF3008' },
  uberEats: { id: 'uberEats', name: 'Uber Eats', logo: '/assets/delivery/ubereats.svg', color: '#06C167' },
  grubhub:  { id: 'grubhub',  name: 'Grubhub',   logo: '/assets/delivery/grubhub.svg',  color: '#F63440' },
};

// Display order when a location offers more than one app.
export const PLATFORM_ORDER = ['doorDash', 'uberEats', 'grubhub'];

// Platforms a given location offers, in display order, resolved to full entries.
export function platformsForLocation(location) {
  const delivery = location?.delivery ?? {};
  return PLATFORM_ORDER
    .filter((id) => delivery[id])
    .map((id) => ({ ...DELIVERY_PLATFORMS[id], url: delivery[id] }));
}
