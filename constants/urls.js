// Pickup runs through the site's own ordering page (Clover API + hosted
// checkout). Delivery no longer links out to a single aggregator page —
// instead the in-site delivery flow (DeliveryModal) asks for the customer's
// address, finds their nearest branch, and routes them to that branch's app
// (Uber Eats / DoorDash / Grubhub). Per-branch URLs live in constants/locations.js.
export const PICKUP_URL = '/menu';
