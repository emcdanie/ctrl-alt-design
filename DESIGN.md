# DESIGN.md — Layout & frame contract for elleta.design

Source of truth for every frame on the site. Conform every section to this;
never invent inline values. If a needed value does not exist here, add it as a
named token in this file (and the token source) first, then use the token.

> Status: codified 2026-07-15 from Elleta's layout-contract brief on
> `redesign/standout`. If the canonical `portfolio-layout-system.md` differs,
> paste it over this file — the audit tooling and skill point here.

Token sources: `lib/bella/bella.css` (BELLA primitives/semantic/component) and
`app/globals.css` `@theme` (app-level aliases). Both load on every page.

Recorded 2026-07-17: `--color-card` light is `#FAFAF8` (aligned with
`--surface-paper`; pure `#ffffff` retired). Accent tokens renamed to what
they are: `--color-accent-iris` (was espresso) and `--color-accent-peri`
(was gold). Eyebrow colour is decided by ONE token, `--color-eyebrow`
(muted ink; declared on body, it chains to a theme-flipping token).

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
| Container | max width + side padding | `--container-width` (1240px, spec §1) + `--container-padding` (32px) via `.layout-container` / `.page-container` |
| Section vertical padding | desktop | `--space-section` (96px, spec §1) via `.layout-section` |
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

## Engineering conventions (anti-drift guardrails)

1. **One implementation per job.** When redesigning, migrate the LIVE
   route/component and DELETE the old copy in the same commit — never
   leave old + new both rendering. Before finishing any structural
   change, grep for duplicate/orphan components and routes
   (zero-import components, parallel route trees).
2. **One of each:** one dashboard home, one top nav (no sidebars), one
   card component, one case-study route tree (`app/case-studies/*`),
   one style source per concern. Content sources: `lib/workLibrary.ts`
   (hero/library metadata) + `lib/content.ts` (case prose) — nothing else.
   **One case-study render path:** every case renders through
   `app/case-studies/[slug]` + CaseStudyShell from its
   `content/case-studies/*.ts` data (ordered `blocks`). NEVER add a
   per-case route file — extend the block schema instead.
3. **Layout:** centered 1240px container, token spacing (`--space-*` /
   `--spacing-*`), body ≥16px, NO arbitrary `text-[Npx]`, NO hardcoded
   hex in components (fixed-context surfaces use their recorded tokens).
4. **Gates (un-regressable):** `npm run gate` = `audit:structure`
   (no per-case route dirs, zero amber, every page on the container/
   section system, no arbitrary px type) + `audit:contrast` (forced-dark
   AA on every route incl. worst gradient stop, display font never below
   24px outside the keycap logo). Run before every commit.
5. **Token cascade trap:** Tailwind `@theme` emits inside `@layer theme`;
   BELLA's `:root` is unlayered and WINS. App-level token overrides must
   be declared in the unlayered `:root` block in `globals.css`, never
   only in `@theme` (see `--header-height` incident, 2026-07-16).

## Global theming contract (site-wide, NOT hero-scoped)

Mirrors `portfolio-conformance-spec.md` (Design Projects). Enforced
2026-07-16 on `redesign/lush`; the forced-dark contrast gate is the
acceptance test.

1. **Every surface derives from tokens.** Background, text, and border
   come from the semantic theme tokens that resolve via
   `[data-theme="dark"]` on `<html>` — the app aliases
   (`--color-page/-card/-surface/-ink*/-border*/-glass*`) all flip in
   ONE place (`app/globals.css` dark body block) plus BELLA's
   `[data-theme="dark"]`. No hardcoded grounds/inks in components, ever.
2. **Fixed-context surfaces are the only exception**, and each must use
   a recorded non-flipping token: reveal card + resume modal paper
   (`--surface-paper` / `--ink-on-paper-*` / `--hero-panel-*`), charcoal
   footer/chips (`.surface-dark` + `--ink-on-dark-*`), keycap faces
   (`--key-*`), bubble plates (`--case-*-hi/lo`), terminal-widget dots,
   vinyl artwork.
3. **Case accents as TEXT flip**: use `--case-*-text` (deep on light,
   bright on navy). `--case-*-deep` is only for the always-light card.
4. **Acceptance**: force `data-theme="dark"` → every text node ≥ AA on
   its own surface, across home (all sections incl. contact/footer),
   /work (all three views), every case-study page, /about,
   /point-of-view. `npm run audit:contrast` automates the sweep.

## §5. Type ramp (canonical)

Sizes: **13 / 14 / 16 / 18 / 20 / 24 / 32 / 40 / 56** px, plus the hero
display step (see `--font-hero-unique`). Body text never below 16px. No
other sizes.

- Faces (revised 2026-07-17, supersedes the hero-only lock): exactly TWO
  typefaces. Unique 700 = ALL display headings (home hero headline, page
  titles, section headers, case display headlines, keycap lockup),
  all-caps, rendered through the ONE `ui/Heading` primitive
  (`.display-heading` tiers hero / page / section / case, accent span in
  iris). Unique never below 24px (keycap lockup excepted) and never in
  body, UI, card titles, eyebrows, meta, nav, buttons, or chips. Geist =
  everything else; eyebrows are Geist caps + `--tracking-eyebrow`. Geist
  Mono is retired; `--font-mono` is a legacy alias resolving to Geist.
  Enforced by `audit:fonts` + the 24px floor in `audit:contrast`.
- Unique floor: 24px. Any Unique below 24px fails the gate
  (`audit:contrast`, `display-font-below-24`); the keycap logo lockup is
  the recorded exception. Titles below the floor (card/item titles) stay
  Geist semibold (`.heading-item`).
- Section intros: ONE pattern, the shared `ui/SectionHeader` (Geist caps
  iris eyebrow + the `ui/Heading` section tier, Unique 700 uppercase at
  `--font-section-title`). No ad-hoc section titles.
- BELLA size tokens map 1:1 to the ramp: `tag` 13, `sm` 14, `base` 16,
  `lg` 18, `xl` 20, `2xl` 24, `3xl` 32, `4xl` 40, `5xl` 56.
- No arbitrary `text-[Npx]` / inline px font sizes in components — ramp
  tokens only (`--typography-font-size-*` / the fluid pairs below).
  Body copy (multi-sentence paragraphs) never below `base` 16.
- No ad-hoc `clamp()` with per-section vw factors. At most ONE fluid pair
  per step, endpoints on the ramp, defined once as a token in
  `app/globals.css`:

| Token | Pair |
| --- | --- |
| `--font-hero-unique` | `clamp(80px, 12.5vw, 184px)` (Unique hero headline only — recorded display-step exception, from `_proto/_hero.html`) |
| `--font-case-title` | `clamp(40px, 4vw, 64px)` (case-study page titles — outranks section headings) |
| `--font-case-display` | `clamp(40px, 5vw, 96px)` (Unique display case headline — visual-language move #1) |
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

GlassBanner surface (recorded surface, 2026-07-17): ONE end-of-page CTA
treatment, `ui/GlassBanner`, replacing every dark background-inverse
slab (About CTA, case-study bottom CTA, the contact form panel). A
frosted gradient over a light glass base: brand hues only (iris and
periwinkle `--hub-*`, mint `--case-clarity-*`, gold periwinkle
`--color-accent-peri`) at low opacity. Dark keeps the same tints over a
translucent navy ground; it never reverts to a flat dark block. Driven
by the `--banner-*` tokens in `globals.css` (radius 30px, `--banner-blur`,
`--banner-border`, `--banner-shadow`, `--banner-ground`,
`--banner-gradient`, light + `[data-theme="dark"]` sets). Content uses
the normal semantic inks, so text flips with the theme (AA both). The
CTA inside a banner is ALWAYS the keycap `Button`, never a custom pill.
Static surface, no motion.

Card ground rule (dark-mode fix 2026-07-17): the default `ui/Card` panel
is THEME-AWARE, it backgrounds off `--color-card` and uses the normal
semantic inks, so cards flip to navy with light text in dark. The fixed
always-light `--hero-panel-*` treatment is the `variant="peek"` opt-in,
reserved for elements that float light on navy: the bubble-cluster open
peek (which consumes the same tokens directly).

Card motion rule (motion audit 2026-07-17): the shared `ui/Card` is CALM
AT REST. Resting state = static 1px accent-tinted border (accent at ~22%
mix), soft shadow, glass inner. The conic colour trace (light) and
identity halo (dark) run ONLY on hover / focus-within. The bubble-cluster
open peek is the single element allowed to animate at rest. Reduced
motion never traces; hover shows a static solid accent ring. Goal: at
most one animated element on screen at a time.

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

## Icons — the Iconoir layer (site-wide)

Iconoir (MIT, `iconoir-react`) is BELLA's icon set. `components/ui/Icon.tsx`
is the ONLY way to render one:

- Size from `--icon-sm/md/lg` (16/20/24), stroke from `--icon-stroke` (1.5)
  — BELLA tokens in `bella.css`. Size/stroke ride on `style` (SVG
  presentation attributes don't resolve `var()`).
- ALWAYS `currentColor` — icons inherit their text's themed colour, so
  dark mode recolours them for free. No hardcoded icon fills, ever.
- Decorative by default (`aria-hidden`); pass `label` for meaningful
  icons (`role="img"` + `aria-label`). `focusable="false"`.
- `IconoirProvider` (app layout) carries the same defaults as a backstop.
- Not icons, not converted: BubbleCluster's connector SVG (diagram),
  VinylPlayer artwork (fixed-context illustration).

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
