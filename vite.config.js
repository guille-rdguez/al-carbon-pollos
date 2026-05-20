import { defineConfig } from 'vite';

export default defineConfig({
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
});
