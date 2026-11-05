# AI Transformation Brunch: build brief

Two responsive pages in plain HTML, CSS and a little JavaScript:

1. **Invite** (`index.html`): the invitation landing page with the "Reserve your place" form.
2. **Confirmation** (`confirmed.html`): the same page after someone accepts. The form box is replaced by "Invitation accepted".

The design is final and approved. The job is to build it as it is, not to redesign it.

## What's in this folder

```
README.md          this brief
site/              working reference build: open site/index.html in a browser
  index.html       invite page
  confirmed.html   confirmation page
  css/neurony-base.css   Neurony website design system rules this page uses (tokens, type, sizing, button, field, checkbox, icons, footer)
  css/brunch.css         page styles (prefix br-)
  js/brunch.js           scroll-to-form, form validation, submit placeholder
  img/             invite card images, fan illustration, footer badges
  fonts/           icon font (UIcons regular rounded)
screenshots/       the approved design at 402, 768, 1024, 1512 and 1920 for both pages, plus the form error state
```

`site/` already matches the approved design. I compared it against the design file screenshot by screenshot at 402, 768, 1024, 1512, 1728, 1920 and 2400px wide. Page heights are identical, and the only pixel differences are sub-pixel text rendering. **Use it as the starting point.** Tidy it and wire the form, but keep the visual output the same. If you rewrite markup or CSS, check the result against `screenshots/` at every width listed below.

## How to run it

It's a static site. Serve the `site/` folder with any static server, e.g. `npx serve site` or `python3 -m http.server -d site`, and open it. Opening the file directly also works, apart from the fonts' cross-origin rules in some browsers.

Fonts come from Google Fonts: **Fira Sans** 500/600/700 for headings and buttons, and **Montserrat** 500/600/700 for body text. Both need the Latin Extended subset for the Romanian names, which Google serves automatically.

## Page flow

- Invite page: the visitor enters an email, keeps the consent box ticked and presses "Accept invitation".
- The script validates the email and consent, calls `submitRsvp()`, and on success goes to `confirmed.html`.
- The large "Accept invitation" button at the bottom of the agenda section scrolls up to the form and puts the cursor in the email field.
- Confirmation page: same page; the white box shows a check icon, "Invitation accepted" and the thank-you text.

## The form placeholder (needs wiring)

The email isn't sent anywhere yet. In `site/js/brunch.js`, replace the body of `submitRsvp(data)`:

- It receives `{ email, consent: true, event: 'ai-transformation-brunch-2026-11-17' }`.
- It must return a Promise. Resolve it to go to the confirmation page. Reject it to show "Something went wrong..." under the form and re-enable the button.
- There's a commented `fetch('/api/rsvp', ...)` example in the function.

Choose the destination (form service, CRM, own endpoint) with the team. Nothing else in the page depends on it.

## Breakpoints and layout

The layout is driven by **container queries on `.nw-page`** (container name `nw`), not media queries. The page is always full browser width, so in practice they behave like width breakpoints.

| Page width | What happens |
|---|---|
| above 1920px | Nothing grows any further. Content stays centred at its 1920 size, and the hero background fills the width. |
| 1513 to 1920px | Everything scales up smoothly with the page (see Sizing). |
| 1280 to 1512px | Desktop layout at its designed size (designed at 1512). |
| below 1280px | Tablet layout (designed at 1024). Smaller type and spacing; the schedule and "You will leave with" sit side by side while there's room, then wrap. |
| below 960px | The footer badges spread edge to edge, the contact links stack, and the legal links stack and centre above a centred copyright bar. |
| below 944px | The "You will leave with" card fills the full content width. |
| below 886px | The date / time / venue strip under the form stacks into a list (icon left, text right), so items never wrap onto two lines while side by side. |
| below 768px | Mobile layout (designed at 402). The form stacks with a full-width button, the hosts stack, the "You will leave with" visual becomes a compact list with a smaller arc, the bottom button is full width, and the footer is centred. |

Design widths to check: **402, 768, 1024, 1512, 1920**. Also check in between, especially 880 to 890, 940 to 950, 1279/1280 and 1700.

## Sizing system (important)

Every length in both CSS files is written as a design number times `--s`, e.g. `calc(24 * var(--s))`.

- `--s` is `1px` up to a 1512px page.
- From 1513 to 1919px it's `100cqi / 1512`, so the whole design scales with the page.
- From 1920px up it's fixed at `1920px / 1512` (about 1.27px).
- Tablet and mobile don't change `--s`. They change the type and spacing variables (`--fs-*`, `--lh-*`, `--g-*`, `--sec-*`) and use their own rules.

`--s` is registered with `@property` as a length at the top of `neurony-base.css`. **Keep that line.** Without it, any element that becomes a size container (`container-type`) makes everything inside it measure `--s` against its own width instead of the page's. Between 1513 and 1919px that shrinks the contents. This happened once during design.

## Content

All copy is final and in the HTML. Take care with:

- **Ana Opriță**: ă and ț with a comma below (U+021B), not a cedilla.
- **Athénée Palace, Bucharest**: both accents.
- Times use an en dash: 10:00–13:00, 10:00–10:15 and so on.
- "Neurony Copyright © 2024" in the footer comes from the shared website footer. Check with the team whether it should be 2026.

## Assets

- `img/brunch-invite-front.webp`, `img/brunch-invite-agenda.webp`: the two invitation cards in the hero.
- `img/brunch-fan.webp`: the fan illustration. It's used blurred as a glow behind the cards, and in the bottom-right of the "You will leave with" card.
- `img/badges/*.png`: footer award badges, shown in greyscale by CSS.
- The Neurony logo, the "You will leave with" icons, the checkbox tick and the confirmation check icon are inline SVG in the HTML.
- The date, time and venue icons use the UIcons icon font (`fonts/uicons-regular-rounded.woff2`, `.nw-icon[data-icon=...]`).

## Not in the design: decide or keep as is

- **Form error message**: I added a small red line under the form for "invalid email", "consent not ticked" and "sending failed" (see `screenshots/form-error-1512.jpg`). It wasn't designed. Keep it, or have design review it.
- **T&C and Privacy Policy links**, and the footer's legal links, point to `#`. They need real URLs.
- **The bottom "Accept invitation" button on the confirmation page** is in the design, and it scrolls up to the confirmation message. Consider hiding it or changing its label there.
- **Opening `confirmed.html` directly** shows the confirmation without submitting. That's fine for a static build. Add a check only if it matters.
- No favicon or social share image (Open Graph) was designed.

## Accessibility notes already in the build

- The email field has an accessible name. The visible placeholder is a styled span that hides once the field has text.
- Errors use `role="alert"`, and the field with the problem gets `aria-invalid` and focus.
- The scroll respects `prefers-reduced-motion`.
- Decorative images use empty `alt` text; the invitation cards have a text description.

## Done when

- [ ] Both pages match `screenshots/` at 402, 768, 1024, 1512 and 1920, with no horizontal scrolling at any width from 320px up.
- [ ] Above 1920 nothing grows. Between 1513 and 1919 everything, including the text inside the form box, scales with the page.
- [ ] The date / time / venue strip never shows an item on two lines while it is a row. On very narrow phones (about 320px) the venue may wrap inside the stacked list, which is fine.
- [ ] Empty or invalid email and unticked consent each show their message and block submit.
- [ ] A valid submit calls the real `submitRsvp`, then lands on the confirmation page. A failed call shows the error and lets the visitor retry.
- [ ] The bottom button scrolls to the form and focuses the email field.
- [ ] Ana Opriță and Athénée render correctly.
