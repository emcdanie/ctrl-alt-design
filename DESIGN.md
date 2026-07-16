# DESIGN.md — Layout & frame contract for elleta.design

Source of truth for every frame on the site. Conform every section to this;
never invent inline values. If a needed value does not exist here, add it as a
named token in this file (and the token source) first, then use the token.

> Status: codified 2026-07-15 from Elleta's layout-contract brief on
> `redesign/standout`. If the canonical `portfolio-layout-system.md` differs,
> paste it over this file — the audit tooling and skill point here.

Token sources: `lib/bella/bella.css` (BELLA primitives/semantic/component) and
`app/globals.css` `@theme` (app-level aliases). Both load on every page.

## Frames

| Frame | Rule | Token |
| --- | --- | --- |
| Card corner radius | ONE value everywhere | `--radius-2xl` (20px) |
| Card padding | all card bodies | `--spacing-6` (24px) |
| Card border | one per context, reused | glass edge: `1px solid var(--color-semantic-border-glass-edge)` + top `--color-semantic-border-glass-top`; opaque: `1px solid var(--color-semantic-border-subtle)` |
| Card shadow, resting | one tier | `--shadow-card-default` |
| Card shadow, raised/hover | one tier | `--shadow-card-elevated` |
| Featured/marketing panel | section-scale color block, NOT a card | radius `--radius-3xl` (24px), padding `--spacing-8` (32px), shadow `--shadow-soft` (recorded exception: `.feature-panel` only) |
| Panel-scale glass wrappers | `.glass-card` (About, featured testimonial) | radius `--radius-2xl` like cards; padding `--spacing-8` (panel tier) |
| Container | max width + side padding | `--container-width` (1200px) + `--container-padding` (32px) via `.layout-container` |
| Section vertical padding | desktop | `--spacing-20` (80px) via `.layout-section` |
| Section vertical padding | ≤640px | `--spacing-16` (64px) |
| Grid gap | everywhere | `--grid-gap` = `--spacing-8` (32px) |
| Touch targets | interactive elements | ≥ `--spacing-touch-target` (44px) |

## Rules

1. Cards share ONE radius: `--radius-2xl`. No 16 / 22 / 24px card corners.
2. Card body padding is `--spacing-6` on every side, every breakpoint.
3. One border + shadow tier per context. Interactive cards rest on
   `--shadow-card-default` and hover/raise to `--shadow-card-elevated`.
   Do not mix in `--shadow-hover`, ad-hoc rgba shadows, or per-card tiers.
4. Sections use `.layout-section` (or `SectionShell`); content sits in
   `.layout-container`. No per-section custom vertical padding.
5. Grids use `var(--grid-gap)`. No per-grid gap values.
6. Never write a raw px/hex where a token exists. A genuinely new value gets a
   named token here first.

## §5. Type ramp (canonical)

Sizes: **13 / 14 / 16 / 18 / 20 / 24 / 32 / 40 / 56** px, plus the hero
display step (see `--font-hero-unique`). Body text never below 16px. No
other sizes.

- Faces (redesign/lush): the large hero headline — and ONLY it — is Unique
  (`--font-hero-display`; fails legibility at label sizes, never use it for
  labels, card titles, or body). Display headings and all body/labels/card
  titles = Geist (`--font-display` / `--font-body`). Eyebrows/meta = Geist
  Mono (`--font-mono` chain).
- BELLA size tokens map 1:1 to the ramp: `tag` 13, `sm` 14, `base` 16,
  `lg` 18, `xl` 20, `2xl` 24, `3xl` 32, `4xl` 40, `5xl` 56.
- No ad-hoc `clamp()` with per-section vw factors. At most ONE fluid pair
  per step, endpoints on the ramp, defined once as a token in
  `app/globals.css`:

| Token | Pair |
| --- | --- |
| `--font-hero-unique` | `clamp(80px, 12.5vw, 184px)` (Unique hero headline only — recorded display-step exception, from `_proto/_hero.html`) |
| `--font-hero` | `clamp(40px, 5vw, 56px)` |
| `--font-section-title` | `clamp(32px, 2.5vw, 40px)` |
| `--font-subsection` | `clamp(24px, 2.2vw, 32px)` |
| `--font-card-title` | `clamp(20px, 1.4vw, 24px)` |
| `--font-body-size` | `clamp(16px, 1.1vw, 18px)` |
| `--font-small` | `14px` (meta, fixed) |

## Recorded token additions (case covers + atom hero)

From the vetted `_proto` prototypes (2026-07-15). Cover plates for the
label-style case cards; graphite doubles as the atom-hero nucleus.

| Token | Value | Text pair (contrast) |
| --- | --- | --- |
| `--color-cover-graphite` | `#221F2C` | ink `#EDE9F4` 13.5:1, kicker `#C9C2E6` 9.5:1 |
| `--color-cover-peri-hi/-lo` | `#C6BEEF` / `#B2A8E6` | ink `#231D3A` 9.2 / 7.4:1 |
| `--color-cover-sage-hi/-lo` | `#D2DCC7` / `#C1CEB1` | ink `#242C18` 10.2 / 8.8:1 |
| `--cover-min-height` | `250px` | label cover plate |
| `--panel-min-height` | `172px` | atom hero detail panel (prevents reflow on select) |
| `--nucleus-size` | `120px` | atom hero nucleus |

Selected atom node fill is `--color-semantic-accent` (periwinkle, fill
only) with ink text (7.6:1); selection is never colour-only (leading dot
plus border plus `aria-checked`).

## Recorded token additions (bubble hero + keycap logo, 2026-07-16)

From the vetted `_proto/_hero.html`. Per-case bubble gradients
(`--case-*-hi/-lo`), a deep readable accent per case (`--case-*-deep`,
AA+ on the white reveal card), the iris hub (`--hub-*`), fixed-context
reveal-card tokens (`--hero-panel-*` — the card is always light), and
the keycap logo plates (`--key-*`). Declared in `app/globals.css`.

## Buttons — the keycap Button (site-wide)

From `_proto/_hero.html` `.toggle`. One button style, two variants, both in
`app/globals.css`:

| Variant | Class | Face | Plate |
| --- | --- | --- | --- |
| Neutral | `.btn-key` | `--key-face-hi` → `--key-face-lo` | `--shadow-key-resting` (`2px 5px 0 --key-edge` + soft cast + inset top highlight) |
| Primary | `.btn-key--primary` | `--key-c` (accent default; set a case colour to re-key) | `color-mix(in srgb, var(--key-c) 64%, black)` |
| Secondary (card CTA) | `.pr` in `BubbleCluster.module.css` | iris `--color-accent-ink`, ALWAYS — never per-case (case colour stays in kicker/trace/glow) | `color-mix(in srgb, accent 60%, black)` |

- Radius `--btn-key-radius` (12px). Labels Geist Mono, `tag` size, 600,
  uppercase — NEVER Unique (locked type rule).
- Press: `translateY(3px)` onto `--shadow-key-pressed` (reduced plate).
  `aria-pressed="true"` / `aria-selected="true"` hold the pressed-in state
  (view tabs, filter chips).
- Min-height `--spacing-touch-target`; focus ring `--ring-focus-*`.

## Recorded exceptions

- `.feature-panel` (section-scale color block): `--radius-3xl`.
- Card shadow contexts: BELLA `CaseStudyCard` and `MediaCard` rest on
  `--shadow-card-default` and raise to `--shadow-card-elevated`; lab cards on
  the `.card-elevated` surface keep that tier and lift without a tier change.
- Hero portrait / About photo organic corners: 70px opposing corners (shipped
  carousel corner language; candidate token `--radius-organic` when the BELLA
  JSON is next rebuilt).
- `.cs-shell` case-study shell manages its own two-column padding (uses
  spacing tokens; documented in `app/globals.css`).
- `.kbd-logo` header lockup: Unique at 28px key caps (20px ≤640px). The
  logo is a brand mark, not running text — the only sanctioned use of
  Unique besides the hero headline.
- Hero bubble geometry (sizes 126–196px, cluster positions) is recorded
  data in `components/BubbleCluster.tsx`, from `_proto/_hero.html` — not
  ramp/spacing values.
- Proto-exact hero type (2026-07-16 correction — the proto wins over the
  ramp here, do NOT re-conform): bubble labels 19/18px + hub 22px, hub
  sub + switch meta 11px, hero kicker 13.5px, hero intro 17px, reveal-card
  kicker 12px. Scope: hero cluster + reveal card + header chrome only.
