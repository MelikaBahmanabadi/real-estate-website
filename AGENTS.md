# Horizon Properties

An editorial luxury real estate website: React + Vite frontend, Tailwind design
system, and a small Express API that serves the property register and stores
enquiries.

## Structure

- `src/` — React app (pages, reusable sections, property components).
- `src/data/site.ts` — services, team, contact details, navigation.
- `server/data/properties.js` — the property catalogue (single source of truth).
- `server/index.js` — API: `GET /api/properties`, `GET /api/properties/:slug`,
  `POST /api/inquiries`, `POST /api/newsletter`, `GET /api/health`.
- `server/data/*.json` — runtime enquiry/newsletter records (git-ignored).

## Running locally

```bash
npm install
npm run dev:all      # Vite on :3000, API on :8000 (Vite proxies /api)
```

`npm run build` type-checks and builds the frontend.

## Sandbox / Base44 preview notes

- `docker-compose.base44.yml` runs **both processes in one container**: Vite on
  host port 3000 and Express on 8000. The browser only ever talks to port 3000;
  Vite proxies `/api` to the API, so there are no cross-origin requests and no
  CORS configuration.
- The compose command installs from `package-lock.json` (`npm ci`) into a named
  volume on start, then runs `npm run dev:all`, so source edits hot-reload.
- Dependencies are never copied into an image; the repo is bind-mounted and the
  container runs the dev servers (no production build in preview).
- `BASE44_PREVIEW_MODE=1` (platform-supplied) extends Vite's dev-server host
  allowlist with `.<BASE44_SANDBOX_HOST_DOMAIN>`; unset, Vite keeps its defaults.
  No other application behaviour is gated on the flag.
- Healthcheck probes `:3000/` and `:8000/api/health` and prints which one failed.
- Enquiries are written to `server/data/inquiries.json`; replace the API layer
  with a database when one becomes available — the UI only reads via `src/lib/api.ts`.

## Images

Photography is served from Unsplash CDN URLs stored with the property data.
Swap an entry for a local file or a DAM URL and the UI picks it up (non-Unsplash
URLs bypass the responsive `srcset` builder).
