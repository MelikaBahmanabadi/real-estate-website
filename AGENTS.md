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

## Publishing (two build modes)

- `npm run build` — full site. `server/index.js` serves `dist/` (with an index
  fallback for deep links) plus `/api/*` on `$PORT`, so one process is a complete
  deployment. Without a `dist/` it stays API-only for local dev.
- `npm run build:static` — `vite build --mode static`; `.env.static` sets
  `VITE_STATIC_BUILD=1`, which makes `src/lib/api.ts` read the bundled
  `src/data/catalogue.ts` (same `server/data/properties.js`, same enrichment the
  API applies) and turn the forms into `mailto:` links. Nothing posts anywhere,
  so an enquiry is only sent if the visitor actually sends the opened email.
- GitHub Pages lives under `/<repo>/`: the page base comes from `--base` /
  `VITE_BASE` in `vite.config.ts`, and `src/main.tsx` hands
  `import.meta.env.BASE_URL` to `BrowserRouter` so the basename always matches.
  `dist/index.html` copied to `dist/404.html` is what makes deep links survive a
  refresh; `.github/workflows/deploy-pages.yml` does both automatically and
  derives the base path from the repository name.

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

## Hero scroll video

The home hero is a scroll-scrubbed clip: `src/components/sections/Hero.tsx`
renders a 300vh wrapper with a `sticky` 100svh stage, and
`src/hooks/useScrollScrubVideo.ts` drives `video.currentTime` from the scroll
position. The clip never plays — no `play()`, no `loop`, no `autoplay` — the
user's scroll is the only thing that moves the timeline. The scroll handler only
records a target progress; one `requestAnimationFrame` loop eases toward it and
writes `currentTime` only when the target moves at least half a frame.

Sources live in `public/hero/` (`-desktop` 1080×1920, `-mobile` the source's native
480×854, plus a poster frame taken from the first frame). Both are loaded fully
into memory via `fetch` before scrubbing, so seeking never waits on the network;
the hero shows a thin progress line until the first frame is painted. If the
fetch/decode fails, the original Unsplash hero image is shown. With
`prefers-reduced-motion: reduce` nothing is fetched and the static hero is used.
The mobile master is chosen at load time with `(max-width: 767px)`.

The current source is a 480×854 portrait clip, so the landscape desktop master is
a 2.25× lanczos upscale with light unsharpening — the browser would scale it to
full-bleed anyway, and doing it once in ffmpeg keeps the full-bleed frame from
looking blocky. Sharpness is capped by the 480 px source.

Re-encode with a keyframe on **every** frame — that is what makes scrubbing smooth
(a normal 2–10s keyframe interval stalls on every seek). At 4s the all-intra
masters are 4.5 MB (desktop) and 1.4 MB (mobile), so nothing heavier is needed.

```bash
# desktop 1080x1920, ~4.5 MB for 4s
ffmpeg -i source.mp4 -map 0:v:0 -an \
  -vf "scale=1080:1920:flags=lanczos,unsharp=5:5:0.4:5:5:0.0" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 22 -preset slow \
  -g 1 -keyint_min 1 -sc_threshold 0 -movflags +faststart \
  public/hero/horizon-hero-desktop.mp4
# mobile — the source resolution, just re-encoded all-intra
ffmpeg -i source.mp4 -map 0:v:0 -an \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 21 -preset slow \
  -g 1 -keyint_min 1 -sc_threshold 0 -movflags +faststart \
  public/hero/horizon-hero-mobile.mp4
ffmpeg -i public/hero/horizon-hero-desktop.mp4 -frames:v 1 -q:v 4 \
  public/hero/horizon-hero-poster.jpg
```

All-intra came out smaller than an equivalent VP9/WebM encode, so no WebM
variant is shipped.

## Images

Photography is served from Unsplash CDN URLs stored with the property data.
Swap an entry for a local file or a DAM URL and the UI picks it up (non-Unsplash
URLs bypass the responsive `srcset` builder).
