// Vercel Function: GET /api/menu?location=<slug>
// Proxies the Clover API server-side so tokens stay secret and the response
// is cacheable at the edge (Clover geo-blocks non-US visitors; Vercel runs in the US).

import { fetchMenu, resolveMerchant } from '../server/clover.mjs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const merchant = resolveMerchant(searchParams.get('location'));

  if (!merchant) {
    return Response.json({ error: 'Unknown location' }, { status: 400 });
  }

  try {
    const menu = await fetchMenu(merchant, process.env);
    return Response.json(menu, {
      headers: {
        // 5 min fresh at the edge, serve stale up to 1h while revalidating
        'Cache-Control': 's-maxage=300, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Clover menu fetch failed:', error);
    return Response.json({ error: 'Clover request failed' }, { status: 502 });
  }
}
