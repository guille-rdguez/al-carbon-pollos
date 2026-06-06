import { defineConfig, loadEnv } from 'vite';
import { createCheckout, fetchMenu, resolveMerchant } from './server/clover.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    esbuild: {
      jsxInject: "import React from 'react'",
    },
    root: '.',
    build: {
      outDir: 'dist',
    },
    server: {
      open: '/index.html',
    },
    plugins: [
      {
        // Mirrors api/menu.mjs so `npm run dev` serves /api/menu locally.
        // NOTE: local requests hit api.clover.com directly — from outside the US
        // they need an active US VPN. Production goes through Vercel (US) instead.
        name: 'clover-menu-dev-api',
        configureServer(server) {
          server.middlewares.use('/api/menu', async (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const url = new URL(req.url, 'http://localhost');
              const merchant = resolveMerchant(url.searchParams.get('location'));
              if (!merchant) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Unknown location' }));
                return;
              }
              const menu = await fetchMenu(merchant, env);
              res.end(JSON.stringify(menu));
            } catch (error) {
              console.error('Clover menu fetch failed:', error);
              res.statusCode = 502;
              res.end(JSON.stringify({ error: 'Clover request failed' }));
            }
          });

          server.middlewares.use('/api/checkout', async (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }
            try {
              let raw = '';
              for await (const chunk of req) raw += chunk;
              const body = JSON.parse(raw || '{}');
              const merchant = resolveMerchant(body?.location);
              if (!merchant) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Unknown location' }));
                return;
              }
              const session = await createCheckout(merchant, env, body);
              res.end(JSON.stringify(session));
            } catch (error) {
              console.error('Clover checkout failed:', error);
              res.statusCode = error.status === 400 ? 400 : 502;
              res.end(JSON.stringify({ error: error.status === 400 ? error.message : 'Checkout failed' }));
            }
          });
        },
      },
    ],
  };
});
