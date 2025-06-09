import { BskyAgent } from '@atproto/api';
import Parser from 'rss-parser';
import { CronJob } from 'cron';
import { readFile, writeFile } from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();                                 // .env in project root

// ---------------- configuration ----------------
const FEED_URL = 'https://www.whitehouse.gov/presidential-actions/executive-orders/feed';
const STATE_FILE = 'lastRead.json';
const CRON_DAILY = '0 14 * * *';  
// const CRON_EVERY_MIN = '* * * * *';             // dev: every minute
// const CRON_SCHEDULE = '0 */3 * * *';         // prod: every 3 h
const MAX_CHARS = 300;                          // Bluesky post limit :contentReference[oaicite:1]{index=1}
const DATE_INIT = '2025-01-01T00:00:00Z';       // default if file missing
// ------------------------------------------------

const agent = new BskyAgent({ service: 'https://bsky.social' });
const parser = new Parser();

// helper ▸ read or seed last-read timestamp
async function getLastRead(): Promise<Date> {
  try {
    const raw = await readFile(STATE_FILE, 'utf8');
    return new Date(JSON.parse(raw).lastRead);
  } catch {
    return new Date(DATE_INIT);
  }
}

// helper ▸ persist newest timestamp
async function setLastRead(d: Date) {
  await writeFile(STATE_FILE, JSON.stringify({ lastRead: d.toISOString() }, null, 2));
}

// helper ▸ truncate to 300 chars incl. link
function composePost(title: string, link: string) {
  const base = `Executive Order: ${title} – ${link}`;
  return base.length > MAX_CHARS ? base.slice(0, MAX_CHARS - 1) + '…' : base;
}

async function run() {
  // 1. fetch feed
  const feed = await parser.parseURL(FEED_URL);

  // 2. load last timestamp & filter new items
  const lastRead = await getLastRead();
  const fresh = feed.items
    .filter(i => i.isoDate && new Date(i.isoDate) > lastRead)
    .sort((a, b) => new Date(a.isoDate!).getTime() - new Date(b.isoDate!).getTime());

  if (!fresh.length) {
    console.log('Nothing new', new Date().toISOString());
    return;
  }

  // 3. login once per run
  await agent.login({
    identifier: process.env.BLUESKY_USERNAME!,
    password:   process.env.BLUESKY_PASSWORD!
  });

  // 4. post each EO in order
  for (const item of fresh) {
    const text = composePost(item.title ?? 'New Executive Order', item.link ?? '');
    await agent.post({ text });
    console.log('Posted:', text);
  }

  // 5. update state
  await setLastRead(new Date(fresh[fresh.length - 1].isoDate!));
}

// --- run immediately then on a cron timer ---
run().catch(console.error);
new CronJob(CRON_DAILY, () => run().catch(console.error)).start();
