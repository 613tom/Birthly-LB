import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildPayload } from "./transform.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const TOKEN = process.env.AIRTABLE_TOKEN;
if (!TOKEN) {
  console.error("AIRTABLE_TOKEN is not set. Add it as a repository secret.");
  process.exit(1);
}

/**
 * Fields that must never reach the published JSON. The repo being private does
 * not protect these — the JSON is served publicly, so the only real protection
 * is not selecting them in the first place.
 */
const SCHEDULE_FIELDS = ["Class Time", "Class Type", "Instructor", "Status"];
const COURSE_FIELDS = [
  "Code",
  "Name",
  "Description",
  "Language",
  "Sessions",
  "Duration",
  "Topics",
  "Trimester / Category",
  "Booking Link",
  "Image",
];

async function fetchAll(baseId, tableId, viewId, fields) {
  const records = [];
  let offset;

  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
    url.searchParams.set("view", viewId);
    url.searchParams.set("pageSize", "100");
    for (const f of fields) url.searchParams.append("fields[]", f);
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });

    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 1500));
      continue;
    }
    if (!res.ok) {
      throw new Error(`Airtable ${tableId} returned ${res.status}: ${await res.text()}`);
    }

    const body = await res.json();
    records.push(...body.records);
    offset = body.offset;
  } while (offset);

  return records;
}

const config = JSON.parse(await readFile(join(ROOT, "config.json"), "utf8"));
const { baseId, scheduleTableId, scheduleViewId, coursesTableId, coursesViewId } = config.airtable;

console.log("Fetching courses…");
const courseRecords = await fetchAll(baseId, coursesTableId, coursesViewId, COURSE_FIELDS);
console.log(`  ${courseRecords.length} course record(s)`);

console.log("Fetching schedule…");
const eventRecords = await fetchAll(baseId, scheduleTableId, scheduleViewId, SCHEDULE_FIELDS);
console.log(`  ${eventRecords.length} schedule record(s)`);

const { payload, warnings, dropped } = buildPayload({ courseRecords, eventRecords, config });

const serialised = JSON.stringify(payload);
for (const needle of ["@gmail", "@yahoo", "@hotmail", "@outlook", "Email"]) {
  if (serialised.includes(needle)) {
    console.error(`Refusing to write: output contains "${needle}".`);
    process.exit(1);
  }
}

await mkdir(join(ROOT, "public"), { recursive: true });
const outPath = join(ROOT, "public", "classes.json");

/**
 * `generatedAt` changes on every run, so writing unconditionally would produce a
 * commit every hour even when nothing about the schedule moved — which on
 * Cloudflare Pages means a rebuild every hour, and the free tier allows 500 a
 * month. Compare everything except the timestamp and leave the file alone if the
 * schedule is unchanged.
 */
const meaningful = (o) => JSON.stringify({ ...o, generatedAt: null, horizon: null });

let unchanged = false;
try {
  const existing = JSON.parse(await readFile(outPath, "utf8"));
  unchanged = meaningful(existing) === meaningful(payload);
} catch {
  unchanged = false;
}

if (unchanged) {
  console.log("\nSchedule unchanged — leaving public/classes.json as is.");
} else {
  await writeFile(outPath, JSON.stringify(payload, null, 2));
  console.log(`\nWrote public/classes.json`);
}

const totalOfferings = payload.courses.reduce((n, c) => n + c.offerings.length, 0);
console.log(`\nWrote public/classes.json`);
console.log(`  ${payload.courses.length} course(s), ${totalOfferings} bookable offering(s)`);
console.log(
  `  skipped — past: ${dropped.past}, status: ${dropped.status}, ` +
    `no course record: ${dropped.unlinked}, unparseable date: ${dropped.unparsed}`
);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const w of warnings) console.log(`  - ${w}`);
}
