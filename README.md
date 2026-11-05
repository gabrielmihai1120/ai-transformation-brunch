# AI Transformation Brunch · Neurony

Invitation landing page for Neurony's **AI Transformation Brunch** (17 November 2026, Athénée Palace, Bucharest).
Plain HTML, CSS and a little JavaScript. No build step and no dependencies. It's published with GitHub Pages.

- `index.html`: the invite with the "Reserve your place" form
- `confirmed.html`: the "Invitation accepted" state. After a successful RSVP the invite page switches to it in place
  (no page load) and updates the address to `confirmed.html`, so a reload shows it too.

## Folder layout

```
site/                    ← everything that gets published
  index.html, confirmed.html
  css/neurony-base.css   Neurony design-system rules (tokens, type, button, field, footer)
  css/brunch.css         page styles (prefix br-)
  js/brunch.js           scroll-to-form, validation, RSVP submit
  img/                   invite cards, fan illustration, badges, og-image.jpg (link preview)
  fonts/                 UIcons icon font
  favicon.svg, favicon-32.png, apple-touch-icon.png
design/
  BRIEF.md               original build brief from Claude Design (breakpoints, sizing system, content notes)
  screenshots/           approved design at 402 / 768 / 1024 / 1512 / 1920
  og-image.html          source of site/img/og-image.jpg
  icons.html             source of the PNG favicons
.github/workflows/pages.yml   deploys site/ to GitHub Pages on every push to main
```

## Run it locally

```bash
python3 -m http.server 4173 -d site
```

Then open http://localhost:4173. `npx serve site` works too.

## ⚠️ Before sharing the link: wire the RSVP form

**The form is still a placeholder.** Visitors see "Invitation accepted", but their email isn't sent or stored anywhere.

Replace the body of `submitRsvp(data)` in [site/js/brunch.js](site/js/brunch.js). It receives
`{ email, consent: true, event: 'ai-transformation-brunch-2026-11-17' }` and must return a Promise.
Resolve it to switch the page to the confirmation. Reject it to show "Something went wrong…" and let the visitor retry.

GitHub Pages can't receive form posts itself, so point it at an outside service. Two free options:

- **Google Sheet + Apps Script**: no limits, and the team shares one list. Post with `Content-Type: text/plain` to avoid CORS preflight.
- **Formspree**: `fetch('https://formspree.io/f/<id>', { method: 'POST', headers: { Accept: 'application/json' }, body: JSON.stringify(data) })`.
  The free tier allows 50 submissions a month.

## Publish on GitHub Pages

The repo is **public** on a personal account, because free GitHub Pages needs a public repo. (Members of the `neurony`
org can't create repos there. An org admin could move it into the org later, as a private repo, using **Settings → Transfer**.
If they do, update the URLs below and in the link-preview tags.)

- Repo: https://github.com/gabrielmihai1120/ai-transformation-brunch
- Site: https://gabrielmihai1120.github.io/ai-transformation-brunch/
- Every push to `main` redeploys `site/` through `.github/workflows/pages.yml`. Watch it under the repo's **Actions** tab.
- Pages is set in **Settings → Pages → Build and deployment → Source: GitHub Actions**.

While it's only a preview for colleagues, `site/index.html` has a `noindex` tag so search engines skip it.
Remove that line when the page goes public.

**Link previews:** `og:url` and `og:image` in the `<head>` of `site/index.html` must be absolute URLs.
They're set to `https://gabrielmihai1120.github.io/ai-transformation-brunch/`. If the account, repo name or domain
changes, update those two lines. For a custom domain later, add a `site/CNAME` file containing the domain, then
add a DNS CNAME record pointing it to `<account>.github.io`.

## Editing notes

- Every length is written as `calc(<design px> * var(--s))`. Keep the `@property --s` line at the top of
  `neurony-base.css`. The sizing system and all breakpoints are described in `design/BRIEF.md`.
- Layout uses container queries on `.nw-page`, not media queries.
- After changing layout, check against `design/screenshots/` at 402, 768, 1024, 1512 and 1920px.
- Content details: **Ana Opriță** uses ț with a comma below, **Athénée** has both accents, and time ranges use an en dash (10:00–13:00).

### Regenerating the share image and icons

Render with headless Chrome from the repo root (each command can take a few seconds; press Ctrl+C if Chrome doesn't exit):

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=1 --allow-file-access-from-files --virtual-time-budget=4000 --window-size=1200,630 --screenshot=og.png "file://$PWD/design/og-image.html"
sips -s format jpeg -s formatOptions 85 og.png --out site/img/og-image.jpg && rm og.png
```

For the icons, use `design/icons.html?size=180&bg=1` → `site/apple-touch-icon.png` and `design/icons.html?size=32` → `site/favicon-32.png`,
with `--default-background-color=00000000` and a matching `--window-size`.

## Still open

- [ ] Wire `submitRsvp()` (see above).
- [ ] T&C and Privacy Policy links in the form, and the footer legal links, still point to `#`.
- [ ] The form error line (invalid email, consent not ticked, sending failed) wasn't in the design. Get a quick design review.
