# Horizon Properties

An editorial luxury real estate site: React + Vite frontend, Tailwind design
system, and a small Express API that serves the property register and records
enquiries. The home hero is a scroll-scrubbed video (see `AGENTS.md`).

There are two ways to publish it, and they come from the same source:

| | Full site (own host) | Light site (GitHub Pages) |
| --- | --- | --- |
| Build | `npm run build` | `npm run build:static` |
| Server | Express serves the site **and** the API | None — static files only |
| Property data | `GET /api/properties` | catalogue bundled into the JS |
| Enquiries / newsletter | saved to `server/data/*.json` | open the visitor's mail app |
| Best for | VPS, Render, Railway, Fly.io, Docker | `https://<user>.github.io/<repo>/` |

---

## Run locally

```bash
npm install
npm run dev:all        # Vite on :3000, Express API on :8000, /api proxied
```

`npm run dev` alone runs only the frontend (API calls will fail),
`npm run dev:api` only the API.

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | type-check + production build into `dist/` |
| `npm run build:static` | same, in static mode (no API) |
| `npm start` | Express on `$PORT` (default 8000); serves `dist/` when it exists |

---

## Deploy A — your own host (full site)

The Express server does double duty: it answers `/api/*` and serves the built
site, so one process and one port are all you need.

```bash
npm ci
npm run build
PORT=8000 npm start        # http://localhost:8000
```

- Keep the process alive with your usual runner (`pm2 start npm -- start`,
  `systemd`, Docker, or the platform's web-service command).
- Set `PORT` to whatever the host expects.
- Put nginx/Caddy/Cloudflare in front for TLS. Nothing else to configure — the
  browser only ever talks to that one port, so there is no CORS setup.
- Enquiries and newsletter signups are appended to `server/data/inquiries.json`
  and `server/data/newsletter.json`. **Those files are git-ignored and live
  inside the app directory**: mount a persistent volume there (or swap
  `server/index.js` for a database) before you point real traffic at it.
- Health check: `GET /api/health` → `{"status":"ok"}`.

Minimal Docker example (optional — this repo ships no Dockerfile):

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV PORT=8000
EXPOSE 8000
CMD ["npm", "start"]
```

---

## Deploy B — GitHub Pages (light, static)

GitHub Pages cannot run Node, so the static build bundles the property catalogue
at build time and swaps the API-backed forms for `mailto:` links.

```bash
npm run build:static -- --base=/<your-repo>/   # then upload dist/ anywhere static
```

### Automatic (recommended)

`.github/workflows/deploy-pages.yml` does it for you on every push to `main`:

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Push to `main` (or run the workflow manually). The base path is derived from
   the repository name, so a project site gets `/<repo>/` and a
   `<user>.github.io` repository gets `/`.
4. The site appears at `https://<user>.github.io/<repo>/`.

The workflow also copies `index.html` to `404.html`, which is how deep links
such as `/properties/villa-name` survive a page refresh on Pages.

### Manual

```bash
npm ci
npm run build:static -- --base=/<your-repo>/
cp dist/index.html dist/404.html
```

Then publish the contents of `dist/` (drag-and-drop onto your host, or push to a
`gh-pages` branch).

### What changes in static mode

- **Property data** — `server/data/properties.js` is still the single source of
  truth; `src/data/catalogue.ts` bundles it with the same enrichment the API
  adds. Editing a listing and rebuilding updates the live site.
- **Enquiry + newsletter forms** — `mailto:` to the address in
  `src/data/site.ts`, so nothing is stored. If you would rather have enquiries
  delivered by a form service (Formspree, Basin, Cloudflare Workers…), replace
  the `STATIC_BUILD` branches in `src/lib/api.ts` with a `fetch` to your
  endpoint — the form components need no changes.
- **Base path** — `vite.config.ts` reads `VITE_BASE` (or `--base`), and
  `src/main.tsx` passes `import.meta.env.BASE_URL` to the router, so the same
  build works at `/` and at `/<repo>/`.

---

## Editing content

| What | Where |
| --- | --- |
| Listings, agents, prices, photos | `server/data/properties.js` |
| Phone, email, address, nav, services, team | `src/data/site.ts` |
| Hero video masters | `public/hero/` (encode recipe in `AGENTS.md`) |
| Palette, type scale, spacing | `tailwind.config.js`, `src/index.css` |

Images are Unsplash URLs by default; swap any `images` entry for a local file in
`public/` or your own CDN and the UI picks it up.
