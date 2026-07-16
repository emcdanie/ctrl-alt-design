# elleta.design — global conformance spec (authoritative)

_`_proto/_hero.html` is the visual reference; this doc is the global contract for EVERY page/component._
_Pairs with `portfolio-ia-spec.md` (navigation/IA). Updated 16 Jul 2026 after a deep code audit._

## 0. One implementation — NO duplicates (this is why changes "weren't sticking")
The audit found the live home page still rendering the OLD architecture while new work went into parallel
components. Enforce, permanently:
- **One home** = the dashboard (`app/page.tsx` renders the bubble board, NOT the old section stack).
- **One navigation** = the top nav. DELETE `WorkSidebar`. No second/side nav.
- **One card** = the image-led case card. DELETE `CaseStudyGrid` (the coloured blocks) + its swatch dots.
- **One case-study route tree.** DELETE the duplicate `app/case-study/*` (singular). Keep `app/case-studies/*`.
- **Delete dead routes/components:** `command-center`, and any section component not used by the new IA.
- Rule going forward: new work edits the LIVE component/route. If a second copy exists, delete it — never
  leave old + new both rendering. Grep for orphans before finishing.

## 1. Layout & spacing (global rule — stop having to ask for it)
- **Container:** content lives in a centred max-width of **1240px** with consistent horizontal padding
  (`--container-padding`); never full-bleed text. Same container on every page.
- **Vertical rhythm:** consistent section spacing on the scale (`--space-section` = 96px desktop),
  not ad-hoc. Case-study pages get the proto's top breathing room (~104px below the 70px header).
- **Body min 16px.** NO arbitrary `text-[Npx]` / hardcoded px in components — ramp + space tokens only.
- Cards fill the grid evenly (equal heights, consistent gaps); content sets to the container, not the viewport.

## 2. Cards (case studies)
- **Image-led, NOT coloured blocks.** Each card leads with a branded cover image (SVG cover art per case);
  remove the flat case-colour backgrounds and the colour-swatch dots. Case colour may appear only as a
  small accent (eyebrow/tag), never as the whole card fill. Palette = muted warm neutrals, not bright.
- One card component across dashboard + library.

## 3. Dark-mode contract (every surface, no exceptions)
- No hardcoded background/text/border. All from semantic tokens resolving via `[data-theme="dark"]`.
- Ground light `#F5F4EF` / dark `#1B1B40`; ink `#1A1720` / `#F4EFE6`; accent iris `#5B4BD1` / periwinkle `#A79CE2`.
- Fix: dark-mode keycap logo — the iris key must NOT bloom a heavy glow on navy; tone the plate/shadow.
- Note the cascade trap: BELLA's unlayered `:root` beats `@theme`; keep theme tokens in a layer that wins.

## 4. Type
- Proto type language site-wide. Unique = display only, **hero headline uses the BOLD (700) cut** (the light
  Regular is the wrong weight). Geist = body/UI/labels/headings. Geist Mono = eyebrows/kickers/meta. Body ≥16px.

## 5. Buttons
- One keycap Button system: neutral (light key) + primary (filled). 12px radius, upper-left light, press on
  active. Labels Geist/Geist Mono, never Unique. Card CTAs = one iris secondary, not per-case.

## 6. Reveal-card light & lighting
- Light: colour-trace border. Dark: soft case-colour edge glow only (16–28px, neg spread). Reduced-motion static.
- Bubble click = champagne fizz (tiny glassy bubbles rising, wobble, expand+pop; behind reduced-motion).
- One light source, upper-left: highlights top-left, shadows down-right (bubbles, keycaps, cards).

## Status
Dark-mode contract + type + buttons implemented; consolidation Steps 0–2 done (one home/nav/card/route,
orphans zero). OUTSTANDING: §1 globals collapse + 1240px container (Step 3), §2 real cover art (muted),
dark logo fix, headline 700 confirm.

## 7. Control taxonomy (one control per job)
The raised keycap signals "action / press". It is reserved for the brand logo
(inert) and TRUE actions, max ONE primary rendered per view. Everything else
is flat:

| Control | Job | Component | a11y |
| --- | --- | --- | --- |
| Button (keycap) | real actions: navigate, submit, open | `ui/Button` (`primary` filled iris / `secondary` neutral) | native button/link |
| SegmentedControl | mutually exclusive views | `ui/SegmentedControl` | ul>li>button, `aria-current` on active, Tab + Enter/Space |
| FilterChip | multi-select filters | `ui/FilterChip` | button + `aria-pressed`, >=24px (44px mobile) |
| Select | option lists (sort) | `ui/Select` | styled native select + chevron |
| Tag | non-interactive metadata | `ui/Tag` | span, visually distinct from FilterChip |
| StatusPill | status markers | `ui/StatusPill` | span, quiet accent |

`audit:controls` fails on: keycap used as filter/toggle/sort, more than one
primary per view, or a filter/toggle without `aria-pressed`/`aria-current`.
