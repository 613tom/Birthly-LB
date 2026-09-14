# Birthly class schedule embed

Pulls the live class schedule from Airtable, strips anything that shouldn't be public,
and publishes a small JSON file plus a drop-in embed for littlebelliesspa.com.

```
Airtable ──▶ scripts/build.mjs ──▶ public/classes.json ──▶ embed.js ──▶ Little Bellies page
   (private)     (Actions, hourly)       (public)            (public)
```

## Setup

1. **Add the Airtable token.** In Airtable, create a personal access token with the
   `data.records:read` scope, granted to base `appUQD5s85N9VIguX` only. In GitHub:
   Settings → Secrets and variables → Actions → New repository secret, named
   `AIRTABLE_TOKEN`. The token never appears in the code or in the published output.

2. **Turn on Pages.** Settings → Pages → Source: GitHub Actions.

3. **Run it once.** Actions → Build class schedule → Run workflow. Check the log — it
   prints how many offerings it found and warns about anything it had to skip.

4. **Embed it.** On the Little Bellies page, paste:

```html
<div
  data-birthly-classes
  data-src="https://YOUR-PAGES-URL/classes.json"
  data-logo-host="https://www.littlebelliesspa.com/wp-content/themes/little-bellies-spa/images/littlebellies-logo-hor.svg"
  data-logo-birthly="https://www.mybirthly.com/wp-content/uploads/2025/11/logo.svg"
  data-contact="mailto:info@littlebelliesspa.com"
  data-language="all"></div>
<script src="https://YOUR-PAGES-URL/embed.js" defer></script>
```

Set `data-language="Spanish"` on the Spanish version of the page and it opens filtered.

## File reference

Replace `ORG` with your GitHub account or org and `REPO` with the repository name. Only
what lives under `public/` is published — the workflow uploads that folder and nothing
else, so the config, the scripts, and this README stay unserved even on a public repo.

| File | Repo path | Public URL | How it's used |
|---|---|---|---|
| Embed script | `public/embed.js` | `https://ORG.github.io/REPO/embed.js` | `<script src="…" defer>` on the Little Bellies page |
| Schedule data | `public/classes.json` | `https://ORG.github.io/REPO/classes.json` | `data-src="…"` on the embed div; the script fetches it |
| Preview page | `public/index.html` | `https://ORG.github.io/REPO/` | Open to check a build. Not meant for customers |
| Settings | `config.json` | not served | Edit in the GitHub UI, commit, workflow reruns |
| Transform logic | `scripts/transform.mjs` | not served | Pairing, filtering, scrubbing |
| Airtable fetch | `scripts/build.mjs` | not served | Runs in Actions with the token |
| CSV test harness | `scripts/from-csv.mjs` | not served | Local only, no token needed |
| Workflow | `.github/workflows/build.yml` | not served | Actions → Build class schedule |

### Use the Pages URLs, not raw.githubusercontent.com

The raw URL is the one GitHub shows you when you click a file, so it's the natural thing
to paste — but it will not work for `embed.js`. Raw serves every file as `text/plain`
with `X-Content-Type-Options: nosniff`, so the browser refuses to execute it and the
embed silently does nothing.

jsDelivr (`https://cdn.jsdelivr.net/gh/ORG/REPO@main/public/embed.js`) sends the right
content type and is a fine alternative for `embed.js`. Don't use it for `classes.json`:
it caches branch URLs for around twelve hours, so an hourly rebuild wouldn't reach
anyone. Pages updates on every deploy and sends `Access-Control-Allow-Origin: *`, which
is what the cross-origin fetch from littlebelliesspa.com needs.

| URL scheme | `embed.js` | `classes.json` |
|---|---|---|
| GitHub Pages | works | works — use this |
| jsDelivr | works | too stale |
| raw.githubusercontent.com | blocked by MIME type | works but rate-limited |

## Repo visibility

The published `classes.json` is readable by anyone — it has to be, since the browser
fetches it. Privacy comes from the build script never selecting instructor emails, not
from the repo being private. Two consequences worth knowing:

- **A public repo is safe.** `AIRTABLE_TOKEN` lives in Actions secrets, which are not
  exposed to forks or to anyone reading the code.
- **A private repo cannot use GitHub Pages publicly.** Private Pages needs a paid plan
  and restricts who can view the site, which breaks the embed. If the repo must stay
  private, deploy `public/` to Cloudflare Pages or Netlify instead — both build from
  private repos and publish publicly on their free tiers.

The workflow also greps the output for anything resembling an email address and fails
the run rather than publishing it.

## Decisions live in `config.json`

| Key | What it controls |
|---|---|
| `includeStatuses` | Which `Status` values appear. `""` keeps the 7 blank-status Infant Safety dates — drop it to hide unconfirmed classes. |
| `includeUnlinkedEvents` | `false` hides AH Induction and the Community Sessions, which have no course record. |
| `bookingLinkOverrides` | Per-code booking URL. The three Spanish codes are `null` — set a URL and the card gets a real Book button. |
| `noBookingLinkFallback` | What a card shows while it has no booking link. |
| `courseOrder` | Display order. Codes not listed fall to the end. |
| `timezone` | `America/New_York`. All Airtable times are wall-clock Eastern. |

## Multi-session classes

The bootcamp runs as two sessions on consecutive days. Airtable stores those as two rows
with no field tying them together, so `transform.mjs` pairs them by matching class type,
instructor, clock time, and adjacent dates. On the current data that resolves all 32
`PEB/EN` rows into 16 clean offerings.

It is still inference. Adding a `Session group` text field in Airtable — the same value on
both halves of a pairing — would make it exact, and the build log already warns whenever a
set fails to pair.

## Local development

```bash
node scripts/from-csv.mjs      # rebuild classes.json from the CSV exports, no token needed
cd public && python3 -m http.server 8000
```

`scripts/from-csv.mjs` is for testing the transform only; the workflow never runs it.
