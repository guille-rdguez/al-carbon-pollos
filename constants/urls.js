// Pickup links out to Clover's native online ordering (the external flow used
// before the in-site checkout). Delivery stays on the in-site flow: the
// DeliveryModal asks for the customer's address, finds their nearest branch,
// and routes them to that branch's app (Uber Eats / DoorDash / Grubhub).
// Native per-branch pickup pages also live as `cloverUrl` in constants/locations.js.
export const PICKUP_URL = 'https://al-carbon-1-san-antonio.cloveronline.com/';
