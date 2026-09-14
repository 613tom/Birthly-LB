import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildPayload } from "./transform.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  const s = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }

  const header = rows.shift();
  return rows
    .filter((r) => r.some((v) => v !== ""))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

const toRecords = (rows) =>
  rows.map((fields) => ({
    fields: Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== "")),
  }));

const config = JSON.parse(await readFile(join(ROOT, "config.json"), "utf8"));
const uploads = "/mnt/user-data/uploads";

const courseRecords = toRecords(
  parseCSV(await readFile(join(uploads, "Vimeo_OTT_Links-Grid_view.csv"), "utf8"))
);
const eventRecords = toRecords(
  parseCSV(await readFile(join(uploads, "Instructor_Schedule_Records-Future_Events__1_.csv"), "utf8"))
);

const now = new Date("2026-09-14T04:00:00Z");
const { payload, warnings, dropped } = buildPayload({ courseRecords, eventRecords, config, now });

await writeFile(join(ROOT, "public", "classes.json"), JSON.stringify(payload, null, 2));

console.log(`courses: ${courseRecords.length}  events: ${eventRecords.length}`);
console.log("dropped:", dropped);
console.log("");
for (const c of payload.courses) {
  const flag = c.bookingLink ? "" : "   [NO BOOKING LINK]";
  console.log(
    `${c.code.padEnd(8)} ${String(c.offerings.length).padStart(2)} offering(s)  ` +
      `${c.language.padEnd(8)} ${c.sessions}${flag}`
  );
}
console.log("\nwarnings:");
for (const w of warnings) console.log("  -", w);

const peb = payload.courses.find((c) => c.code === "PEB/EN");
console.log("\nPEB/EN first 3 offerings (pairing check):");
for (const o of peb.offerings.slice(0, 3)) {
  console.log("  ", o.instructor, o.sessions.join("  +  "), o.incomplete ? "INCOMPLETE" : "");
}

const blob = JSON.stringify(payload);
console.log("\ncontains any '@':", blob.includes("@"));
