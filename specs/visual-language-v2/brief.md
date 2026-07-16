# Visual language v2 — bubble-headings, colour-as-identity, stats, controls, clipping
(Verbatim brief from Elleta, 2026-07-16. Fresh session: read CLAUDE.md + docs/portfolio-*-spec.md +
docs/harness-and-baseline.md + docs/fixes/ first, then run this through the portfolio-spec skill.)

Content/visual-language pass. Keep BELLA tokens, the type system, the glossy-bubble recipe, one light
source. Baseline-first per docs/harness-and-baseline.md. All colour changes AA-checked by audit:contrast.
Record the new rules as §8 in the conformance spec.

## 1. Bubble-heading system (the "level across the whole site" rule)
Add ONE hero bubble-heading per page as the page/case title device:
- The page/case TITLE renders inside a glossy bubble (the existing recipe) in the Unique display cut, in
  the page's identity colour (case colour for cases; iris/periwinkle for About/POV/Contact).
- A thin connector line runs from the bubble to the top of the first paragraph (echoing the constellation
  connectors), so the bubble visibly "feeds" the content.
- Apply to: every case page, About, Point of View, Contact. One per page only.
- HARD LIMIT: only the top page/case title gets this treatment. Subheadings (Context, Decisions, Lessons,
  section headers) stay as normal scannable Unique/Geist headings. Do NOT bubble-ify every heading, that
  destroys scannability and is the navigation risk Elleta flagged.
- Reduced-motion: connector draws instantly; bubble static.

## 2. Colour as case identity (semantic, scarce)
Rule: a case colour is an IDENTITY token. Reuse it consistently across ONE case's surfaces; withhold it
from anything shared or generic.
- Case colour appears on: that case's bubble (home + map), its headline / hero bubble-heading, its card
  accent (eyebrow/rule, never full fill), and the tags shown ON that case's own page.
- Stays NEUTRAL: the shared CASE/SKILL filter chips in /work (a skill spans many cases, so no single
  colour), the table metadata tags, nav, buttons, stats, and all generic UI.
- Do NOT reintroduce a per-skill colour map (the deleted tagColor rainbow). Colour = case, nothing else.
- Verify every case-coloured text/tag passes AA in both themes (worst-gradient-stop check for bubble labels).

## 3. Stats as neutral bubbles (About)
The About stat cards (E2E / 2 / B2B / BCN) may become subtle bubbles for texture, but in the
neutral/iris token range only, NOT case colours (they aren't cases; case colour must keep meaning one
thing). If bubbles add clutter next to the new About hero bubble-heading, keep them as the current quiet
cards. Elleta's call; default to restraint.

## 4. Segmented control polish (/work TABLE·MAP·TIMELINE)
It's already a segmented control with aria-current. Tighten it to read as ONE connected control: a single
container, hairline dividers or connected segments, the selected segment clearly filled, unselected quiet.
Not three separate keycaps. Keep keyboard support (Tab + Enter/Space) and aria-current.

## 5. Map clipping (home + map view)
On home, the constellation overflows the frame on the right (Writing / Design Lab clip at the edge). Contain
the whole map within its container at every breakpoint: fit-and-scale the node layout so no bubble crosses
the frame, with breathing room. No bubble should ever be visually cut. Verify at 1440 / 1024 / 768 / 390.

## 6. Gate + proof
npm run gate (structure/copy/controls/contrast + NDA grep; copy gate already covers public/demos as of
3844d6f), tsc, all routes 200 light+dark. Screenshots: one case page, About, Point of View
(each showing the hero bubble-heading + connector), and home (constellation fully contained), desktop + 390px.
