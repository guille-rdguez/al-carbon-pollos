// "Order Pickup" links out to Clover's brand ordering page (order.online), which
// lets the customer pick which location to order from — the external flow used
// before the in-site checkout. Per-branch "Order" buttons go straight to each
// location's Clover page (`cloverUrl` in constants/locations.js). Delivery stays
// on the in-site flow (DeliveryModal -> nearest branch's Uber/DoorDash/Grubhub).
export const PICKUP_URL = 'https://order.online/business/al-carbon-pollos-asados-11409668';
