const MONTH_MS = 1000 * 60 * 60 * 24 * 31;

function zonedOffsetMs(utcMs, timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p = Object.fromEntries(
    dtf.formatToParts(new Date(utcMs)).map((x) => [x.type, x.value])
  );
  const asUTC = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour),
    Number(p.minute),
    Number(p.second)
  );
  return asUTC - utcMs;
}

export function wallTimeToInstant(y, mo, d, h, mi, timeZone) {
  let utc = Date.UTC(y, mo - 1, d, h, mi);
  for (let i = 0; i < 2; i++) utc = Date.UTC(y, mo - 1, d, h, mi) - zonedOffsetMs(utc, timeZone);
  return new Date(utc);
}

export function parseClassTime(raw, timeZone) {
  if (!raw) return null;
  const m = String(raw)
    .trim()
    .match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*([ap]m)$/i);
  if (!m) return null;
  const [, mo, d, y, hh, mi, ap] = m;
  let hour = Number(hh) % 12;
  if (ap.toLowerCase() === "pm") hour += 12;
  return wallTimeToInstant(Number(y), Number(mo), Number(d), hour, Number(mi), timeZone);
}

function dayKey(instant, timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

function minutesOfDay(instant, timeZone) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(instant)
      .map((x) => [x.type, x.value])
  );
  return Number(p.hour) * 60 + Number(p.minute);
}

function expectedSessionCount(course) {
  const m = String(course.sessions || "").match(/(\d+)/);
  if (m) return Number(m[1]);
  return 1;
}

/**
 * Groups a course's events into offerings. A course whose `Sessions` field says
 * more than one runs as a set: same instructor, same clock time, consecutive days.
 * Anything that doesn't complete a set is emitted on its own and reported.
 */
export function groupOfferings(events, course, timeZone) {
  const want = expectedSessionCount(course);
  const sorted = [...events].sort((a, b) => a.instant - b.instant);
  if (want <= 1) return { offerings: sorted.map((e) => ({ sessions: [e] })), orphans: [] };

  const offerings = [];
  const orphans = [];
  const used = new Set();

  for (let i = 0; i < sorted.length; i++) {
    if (used.has(i)) continue;
    const set = [sorted[i]];
    used.add(i);

    while (set.length < want) {
      const last = set[set.length - 1];
      const lastDay = dayKey(last.instant, timeZone);
      const lastMin = minutesOfDay(last.instant, timeZone);
      let foundIdx = -1;

      for (let j = i + 1; j < sorted.length; j++) {
        if (used.has(j)) continue;
        const cand = sorted[j];
        if (cand.instructor !== last.instructor) continue;
        if (minutesOfDay(cand.instant, timeZone) !== lastMin) continue;
        const gap = Math.round(
          (Date.parse(dayKey(cand.instant, timeZone)) - Date.parse(lastDay)) / 86400000
        );
        if (gap !== 1) continue;
        foundIdx = j;
        break;
      }

      if (foundIdx === -1) break;
      used.add(foundIdx);
      set.push(sorted[foundIdx]);
    }

    if (set.length === want) offerings.push({ sessions: set });
    else {
      orphans.push(...set);
      offerings.push({ sessions: set, incomplete: true });
    }
  }

  offerings.sort((a, b) => a.sessions[0].instant - b.sessions[0].instant);
  return { offerings, orphans };
}

export function buildPayload({ courseRecords, eventRecords, config, now = new Date() }) {
  const tz = config.timezone;
  const warnings = [];

  const courses = new Map();
  for (const r of courseRecords) {
    const f = r.fields || {};
    const code = f["Code"];
    if (!code) continue;
    courses.set(code, {
      code,
      name: f["Name"] || code,
      description: f["Description"] || "",
      language: f["Language"] || "",
      sessions: f["Sessions"] || "",
      duration: f["Duration"] || "",
      topics: f["Topics"] || "",
      category: f["Trimester / Category"] || "",
      image: f["Image"] || "",
      bookingLink: f["Booking Link"] || "",
    });
  }

  const byCourse = new Map();
  let dropped = { past: 0, status: 0, unlinked: 0, unparsed: 0 };

  for (const r of eventRecords) {
    const f = r.fields || {};
    const code = f["Class Type"];
    const instant = parseClassTime(f["Class Time"], tz);

    if (!instant) {
      dropped.unparsed++;
      continue;
    }
    if (instant < now) {
      dropped.past++;
      continue;
    }

    const status = f["Status"] == null ? "" : String(f["Status"]);
    if (!config.includeStatuses.includes(status)) {
      dropped.status++;
      continue;
    }
    if (!courses.has(code)) {
      dropped.unlinked++;
      if (!config.includeUnlinkedEvents) continue;
    }

    if (!byCourse.has(code)) byCourse.set(code, []);
    byCourse.get(code).push({
      instant,
      instructor: f["Instructor"] || "",
    });
  }

  if (dropped.unlinked && !config.includeUnlinkedEvents) {
    warnings.push(
      `${dropped.unlinked} event(s) skipped: no matching course record (e.g. AH Induction, Community Sessions).`
    );
  }

  const out = [];
  for (const [code, course] of courses) {
    const events = byCourse.get(code) || [];
    const { offerings, orphans } = groupOfferings(events, course, tz);

    if (orphans.length) {
      warnings.push(
        `${course.name} (${code}): ${orphans.length} date(s) could not be paired into a complete ` +
          `${expectedSessionCount(course)}-session set. Add a "Session group" field to make this exact.`
      );
    }

    const override = Object.prototype.hasOwnProperty.call(config.bookingLinkOverrides, code)
      ? config.bookingLinkOverrides[code]
      : undefined;
    const bookingLink = override !== undefined && override !== null ? override : course.bookingLink;

    if (!bookingLink && offerings.length) {
      warnings.push(`${course.name} (${code}): ${offerings.length} offering(s) with no booking link.`);
    }

    out.push({
      code,
      name: course.name,
      description: course.description,
      language: course.language,
      sessions: course.sessions,
      duration: course.duration,
      topics: course.topics,
      category: course.category,
      image: course.image,
      bookingLink: bookingLink || null,
      offerings: offerings.map((o) => ({
        incomplete: Boolean(o.incomplete),
        instructor: o.sessions[0].instructor,
        sessions: o.sessions.map((s) => s.instant.toISOString()),
      })),
    });
  }

  const order = config.courseOrder || [];
  out.sort((a, b) => {
    const ia = order.indexOf(a.code);
    const ib = order.indexOf(b.code);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  const horizon = new Date(now.getTime() + MONTH_MS * 4);
  return {
    payload: {
      generatedAt: now.toISOString(),
      timezone: tz,
      horizon: horizon.toISOString(),
      courses: out.filter((c) => c.offerings.length > 0),
    },
    warnings,
    dropped,
  };
}
