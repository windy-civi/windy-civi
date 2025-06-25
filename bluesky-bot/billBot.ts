// billBot.ts
import { BskyAgent } from "@atproto/api";
import { CronJob } from "cron";
import { promises as fs } from "fs";
import path from "path";
import fg from "fast-glob";
import dotenv from "dotenv";

dotenv.config(); // expects BLUESKY_USERNAME / PASSWORD

// ---------- configuration ----------
const ROOT_DIR =
  "/Users/austinmclaughlin/Documents/windy-civi/ocd-blockchain-illinois/" +
  "country:us/state:il/sessions/ocd-session/country:us/state:il/" +
  "2025-2025/104th Regular Session";

const GLOB_PATTERN = path.join(ROOT_DIR, "bills/**/logs/*_entire_bill.json");

const STATE_FILE = "lastReadBillDate.json";
const DATE_INIT = "2024-01-01T00:00:00Z";
const CRON_DAILY = "0 15 * * *"; // 09:00 America/Chicago
const MAX_CHARS = 300;
// -------------------------------------

const agent = new BskyAgent({ service: "https://bsky.social" });

/* ───── helpers ─────────────────────────────────────────────────────────── */

async function getLastRead(): Promise<Date> {
  try {
    const raw = await fs.readFile(STATE_FILE, "utf8");
    return new Date(JSON.parse(raw).lastRead);
  } catch {
    return new Date(DATE_INIT);
  }
}

async function setLastRead(d: Date) {
  await fs.writeFile(
    STATE_FILE,
    JSON.stringify({ lastRead: d.toISOString() }, null, 2)
  );
}

/** return true ⇢ any sponsorship name contains ‘Huynh’ (case-insensitive) */
function isHuynhSponsored(bill: any) {
  return (bill.sponsorships ?? []).some((s: any) => /huynh/i.test(s.name));
}

function latestActionDesc(bill: any) {
  const a = bill.actions?.[bill.actions.length - 1];
  return a ? `${a.description} (${a.date})` : "No actions yet";
}

function composePost(bill: any) {
  const link = bill.versions?.[0]?.links?.[0]?.url ?? "https://ilga.gov"; // fallback
  const text = `🏛️ IL ${bill.identifier}: ${bill.title}
📝 Sponsor: Rep. Hoan Huynh
📌 ${latestActionDesc(bill)}
🔗 ${link}`;

  return text.length > MAX_CHARS ? text.slice(0, MAX_CHARS - 1) + "…" : text;
}

/* ───── core run ────────────────────────────────────────────────────────── */

async function run() {
  const lastRead = await getLastRead();

  // 1. find candidate files
  const files = await fg(GLOB_PATTERN, { absolute: true });

  // 2. parse + filter
  const freshBills: { data: any; time: Date }[] = [];

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const bill = JSON.parse(raw);
    if (isHuynhSponsored(bill) && new Date(bill.scraped_at) > lastRead) {
      freshBills.push({ data: bill, time: new Date(bill.scraped_at) });
    }
  }

  if (!freshBills.length) {
    console.log("Nothing new", new Date().toISOString());
    return;
  }

  // oldest ➜ newest
  freshBills.sort((a, b) => a.time.getTime() - b.time.getTime());

  // 3. login once
  await agent.login({
    identifier: process.env.BLUESKY_USERNAME!,
    password: process.env.BLUESKY_PASSWORD!,
  });

  // 4. post each bill
  for (const { data: bill } of freshBills) {
    const text = composePost(bill);
    await agent.post({ text });
    console.log("Posted:", bill.identifier);
  }

  // 5. persist newest timestamp
  await setLastRead(freshBills[freshBills.length - 1].time);
}

/* ───── start ───────────────────────────────────────────────────────────── */

run().catch(console.error);
new CronJob(CRON_DAILY, () => run().catch(console.error)).start();
