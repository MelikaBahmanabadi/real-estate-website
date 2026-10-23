import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { agents, properties } from './data/properties.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const NEWSLETTER_FILE = path.join(DATA_DIR, 'newsletter.json');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '64kb' }));

/** Simple serialised JSON persistence so concurrent writes can't clobber. */
let writeQueue = Promise.resolve();

async function readList(file) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return [];
  }
}

function appendTo(file, entry) {
  writeQueue = writeQueue.then(async () => {
    const list = await readList(file);
    list.push(entry);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(list, null, 2));
  });
  return writeQueue;
}

const agentById = new Map(agents.map((agent) => [agent.id, agent]));

function withAgent(property) {
  return {
    ...property,
    location: `${property.city}, ${property.region}, ${property.country}`,
    agent: agentById.get(property.agentId) ?? null,
  };
}

const catalogue = properties.map(withAgent);

const isEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/properties', (_req, res) => {
  res.json({ properties: catalogue });
});

app.get('/api/properties/:slug', (req, res) => {
  const property = catalogue.find((item) => item.slug === req.params.slug);
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  res.json({ property });
});

const INQUIRY_KINDS = new Set(['agent', 'viewing', 'contact']);

app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, message, propertySlug, kind, preferredDate } = req.body ?? {};

  if (typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ error: 'Please share your name.' });
    return;
  }
  if (!isEmail(email)) {
    res.status(400).json({ error: 'Please share a valid email address.' });
    return;
  }
  if (typeof message !== 'string' || message.trim().length < 5) {
    res.status(400).json({ error: 'Please add a short message.' });
    return;
  }

  const entry = {
    id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    kind: INQUIRY_KINDS.has(kind) ? kind : 'contact',
    name: String(name).trim().slice(0, 120),
    email: String(email).trim().slice(0, 160),
    phone: typeof phone === 'string' ? phone.trim().slice(0, 40) : '',
    message: String(message).trim().slice(0, 2000),
    propertySlug: typeof propertySlug === 'string' ? propertySlug.slice(0, 120) : null,
    preferredDate: typeof preferredDate === 'string' ? preferredDate.slice(0, 40) : null,
    createdAt: new Date().toISOString(),
  };

  try {
    await appendTo(INQUIRIES_FILE, entry);
    res.status(201).json({ ok: true, id: entry.id });
  } catch (error) {
    console.error('Failed to store inquiry', error);
    res.status(500).json({ error: 'We could not send your request. Please try again.' });
  }
});

app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body ?? {};
  if (!isEmail(email)) {
    res.status(400).json({ error: 'Please share a valid email address.' });
    return;
  }
  try {
    const existing = await readList(NEWSLETTER_FILE);
    if (existing.some((item) => item.email === email.trim().toLowerCase())) {
      res.status(200).json({ ok: true, alreadySubscribed: true });
      return;
    }
    await appendTo(NEWSLETTER_FILE, {
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Failed to store newsletter signup', error);
    res.status(500).json({ error: 'Subscription failed. Please try again.' });
  }
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Self-hosting: after `npm run build`, this one process serves the site and the
// API on the same port. Without a build it degrades to API-only (dev uses Vite).
const DIST_DIR = path.join(__dirname, '..', 'dist');
let servesSite = false;
try {
  await fs.access(path.join(DIST_DIR, 'index.html'));
  servesSite = true;
} catch {
  servesSite = false;
}

if (servesSite) {
  app.use(express.static(DIST_DIR, { index: false }));
  app.get('*', (_req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));
}

const port = Number(process.env.PORT) || 8000;
app.listen(port, '0.0.0.0', () => {
  console.log(
    `Horizon Properties listening on :${port}${servesSite ? ' (site + API)' : ' (API only — run `npm run build` to serve the site)'}`,
  );
});
