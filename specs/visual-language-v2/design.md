# Visual language v2 — design

## What and why
Pull the hero's bubble language through every page open (one bubble-heading per page), make case colour a
scarce identity token, contain the constellation at every width, tighten the segmented control, and add a
Design System specimens page that documents BELLA live (the "site is the artifact" proof). Readability
rules keep case studies scannable. New rules land as conformance spec §8.

## 1. BubbleHeading (new primitive, one per page)
- `components/ui/BubbleHeading.tsx`: the page/case TITLE inside the existing glossy bubble recipe
  (radial face `circle at 36% 30%` hi->lo, upper-left gloss, down-right shadow), title in Unique 700,
  clamped to fit the bubble (display range narrows inside the circle: clamp(28px, 4vw, 56px); long titles
  wrap up to 3 lines, bubble diameter clamp(280px, 34vw, 420px)).
- Identity colour: case hi/lo for case pages (ink label, AA on worst stop); iris/peri (`--hub-hi/lo`) for
  About / Point of View / Contact.
- Connector: thin line (`--hero-link`, 1.5px) with an iris node, from the bubble's underside to the top of
  the first content block. Draws with a short stroke animation; `prefers-reduced-motion` renders it
  complete and static. aria-hidden.
- Consumers: CaseStudyShell replaces the current separate sphere + flat display title with ONE
  BubbleHeading (title inside the bubble; sidebar keeps eyebrow/summary/meta). PageHeader gains
  `variant="bubble"` used by About / POV / Contact. /work and home keep their existing devices (home hero
  IS the constellation; /work stays the flat display "WORK" to keep the library utilitarian) — flag: if you
  want /work bubbled too, say so at review.
- HARD LIMIT enforced in review + spec text: exactly one BubbleHeading per page; all other headings
  unchanged.

## 2. Colour as identity
Already mostly true; deltas: tags rendered ON a case's own page shift from neutral linen to that case's
subtle tint (`--case-*-text` on `--case-*-hi` @ ~20% mix; AA-checked); everything shared stays neutral
(work filter chips, table tags, nav, buttons, stats). No per-skill colours return.

## 3. About stats
Default to restraint: KEEP the quiet cards (a second bubble cluster next to the new About bubble-heading
reads as clutter). Decision reversible at review.

## 4. SegmentedControl
One connected container: remove inner gaps, hairline divider between segments
(`--color-border-medium`), selected segment filled (`--color-semantic-accent-subtle` + inset ring stays),
radius on the container only. Keyboard + aria-current unchanged.

## 5. Constellation containment
BubbleCluster stage becomes a fixed 640x640 design space scaled to its container: ResizeObserver measures
the wrapper, applies `transform: scale(w/640)` with top-left origin and sets wrapper height to 640*scale.
No bubble can cross the frame at any width; geometry values untouched (proto positions preserved). Mobile
(<860) keeps the existing wrap layout. Kills the current overflow-clip band-aid.

## 6. /design-system (specimens) + TokenInspector
- `app/design-system/page.tsx`: colour swatches (real token names, values read at runtime via
  getComputedStyle so the page cannot drift from BELLA), type specimens (Unique display / Geist / Geist
  Mono at ramp sizes), component specimens (Button both variants, FilterChip both states,
  SegmentedControl, glossy bubble, CaseCard, Tag/StatusPill), spacing + radius scales, and a short
  governance-gate section naming the five audits.
- `components/TokenInspector.tsx`: an interactive keycap + card where hovering/focusing any zone reveals
  the driving token (face -> --key-fill-*, radius -> --radius-lg, padding -> --spacing-*, label ->
  --font-mono). Keyboard accessible (zones are buttons), values live from computed styles.
- Embeddable mini-route `app/design-system/inspector/page.tsx` (chromeless) so the Code First case embeds
  it as its interactive evidence.
- Entry points: the colophon line in the footer becomes a link to /design-system; no 5th top-nav item.
- Dark-mode safe: swatches re-read on theme flip.

## 7. Case readability
Decision-block left-rule + kicker switch from generic iris to the case identity colour (`--case-*-text`).
No underlined body text anywhere (links in prose keep underline; body emphasis uses weight). Sections stay
short (content already shaped); one interactive proof per case preferred (Code First gets TokenInspector).

## Tokens/components touched
BubbleCluster (scale wrapper), CaseStudyShell (BubbleHeading), PageHeader (variant), SegmentedControl CSS,
tags CSS (case-page variant), new: BubbleHeading, TokenInspector, /design-system routes. No new colours;
mixes derive from existing case tokens.
