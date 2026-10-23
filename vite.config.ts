import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sandbox/preview only: extend the dev-server host allowlist with the sandbox's
// wildcard domain. Outside preview mode this stays empty and Vite keeps its
// secure defaults.
const previewMode = process.env.BASE44_PREVIEW_MODE === '1';
const sandboxHostDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN;
const allowedHosts =
  previewMode && sandboxHostDomain ? [`.${sandboxHostDomain}`] : undefined;

export default defineConfig({
  plugins: [react()],
  // GitHub Pages project sites are served from /<repo>/ — the Pages workflow
  // passes `--base` (or set VITE_BASE) when building for one.
  base: process.env.VITE_BASE || '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts,
    // Single-origin setup: the Express API runs beside Vite and is reached
    // through this proxy so cookies/session headers never cross origins.
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts,
  },
});
