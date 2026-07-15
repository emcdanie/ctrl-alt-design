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
