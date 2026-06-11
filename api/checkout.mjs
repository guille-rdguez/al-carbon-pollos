// Vercel Function: POST /api/checkout
// Body: { location: <slug>, customer: { name, email, phone? }, lines: [{ id, qty }] }
// Creates a Clover Hosted Checkout session and returns its payment URL.

import { createCheckout, resolveMerchant } from '../server/clover.mjs';

// Light per-instance rate limit — every accepted call creates a real Clover
// checkout session. Fluid Compute reuses instances, so this catches bursts.
const RATE = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;

function rateLimited(ip) {
  const now = Date.now();
  const entry = RATE.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    if (RATE.size > 5000) RATE.clear();
    RATE.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const merchant = resolveMerchant(body?.location);
  if (!merchant) {
    return Response.json({ error: 'Unknown location' }, { status: 400 });
  }

  try {
    const session = await createCheckout(merchant, process.env, body);
    return Response.json(session);
  } catch (error) {
    if (error.status === 400) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error('Clover checkout failed:', error);
    return Response.json({ error: 'Checkout failed' }, { status: 502 });
  }
}
