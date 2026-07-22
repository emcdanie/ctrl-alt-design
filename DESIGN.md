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

- Card titles and subtitles (Elleta, 2026-07-21, via Cowork): BODY font,
  never Unique. Content-card titles (About "Working with me", Learning
  cards, and every other content card) render through the ONE shared
  `.heading-item` style (Geist 18px/700); Unique stays display only:
  hero, statement headlines, section display heads, keycap lockup. No
  per-card overrides.
- Card voice (Elleta, 2026-07-21, card-voice branch): **Unique never
  renders inside a Card.** CaseCard is DEMOTED to `.heading-item` (its
  private `--font-card-title` title rule deleted; the token itself now
  serves the shared `.card-statement` recipe: Geist 700 at
  `--font-card-title`, hierarchy from weight/size/colour, ONE accent
  word in the case identity colour, AA both themes). Both About
  statement sections (How I solve problems, How I collaborate) render
  through the ONE `StatementCard` on the theme-aware `thesis-band`
  surface; the Unique specimen treatment inside cards is retired
  (`.thesis-band__core/__rest` deleted). Enforced by the Unique-in-card
  check in `audit:reuse` (seeded-offender verified).
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

## Buttons — grammar v5 (2026-07-20, supersedes the neutral keycap)

Purple means clickable at every tier. One `ui/Button` component, both
variants in `app/globals.css`:

| Tier | Class | Treatment |
| --- | --- | --- |
| Primary | `.btn-key--primary` | Filled iris keycap, the ONE 3D moment per view (Elleta's task-2 pick, 20 Jul). Calm extrusion from the `--shadow-key` family: thin plate (`1px 3px 0 --key-fill-edge`), small soft cast, inset top highlight — one upper-left light source, both themes. Hover gains the travelling border light via the SHARED `.trace-host` recipe (2px ring at `--btn-key-radius`); focus-visible keeps its own ring; reduced motion renders the static accent border. |
| Secondary | `.btn-key` | FLAT: 1.5px iris outline + iris text on transparent, tinted wash on hover/active, no elevation. Colour is `--color-accent-ink` (iris light / periwinkle dark; fixed-dark chrome scopes the same token to its peri stop). Never confusable with FilterChip or Tag. |
| Tertiary | text link | Iris + underlined, the inline-link pattern. |

- The neutral keycap and `--btn-key-border` are RETIRED (v5).
- The bubble-peek CTA (`.pr`) is the view's primary while the peek is
  open (the hero demotes); it rides the same `--shadow-key` family.
- Radius `--btn-key-radius` (12px). Labels Geist caps, `tag` size, 600,
  uppercase — NEVER Unique (locked type rule).
- Primary press: `translateY(2px)` onto `--shadow-key-pressed` (reduced
  plate). Keycaps are never toggles (audit:controls).
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
- Decision why-lines (Elleta, 2026-07-20): the key-line style
  (`.cs-decision-why`, 18px/600 in the case marker colour) applies
  ONLY when the why is a single short statement of ~160 characters or
  fewer; longer whys render as regular body ink. Key-line trims are
  per-decision content edits in her words, via Cowork.
- Thesis presentation (task-6 winner, Elleta 2026-07-20): the About
  "How I solve problems" theses are SPECIMEN BANDS on the fixed-dark
  navy ground (`--thesis-band-ground/-ink`, same both themes, the
  dark-contact-chrome fixed-context pattern): Unique display scale
  through the Heading primitive, core word huge in the case identity
  colour (Drift thesis wears Drift), rest a tier down, body Geist 16px
  floor. Bands speak the Card interaction language via the SHARED
  `.trace-host` recipe. The stat-tile THESIS treatment is retired;
  `.thesis-tile` itself stays, consumed by MetricsStrip (task 8).
  Recomposed (Elleta, 2026-07-21, spec system-page-v2): ONE `.thesis-row`
  of three equal-height dark cards at >=1024px, stacked below; type steps
  one tier (core `--font-section-display`, rest `--font-subsection`) so
  three-up fits; treatment and copy unchanged. No full-width band with an
  empty right half.
  REVERSED (Elleta, 2026-07-21, later the same day): the fixed-dark
  decision is withdrawn; the thesis cards are THEME-AWARE. The
  `--thesis-band-ground/-ink` pair resolves to the card surface + ink in
  light and the navy specimen pair under `[data-theme="dark"]`; core
  words moved from the dark-calibrated `--case-*-hi` stops to
  `--case-*-text` (AA on its ground in both themes); the card gains the
  soft border. Composition, Unique specimen type, and copy unchanged.
- TODO content slots (Elleta, 2026-07-21, spec system-page-v2): a
  TODO(elleta) slot renders NOTHING publicly until her words land. The
  slot survives as a code/HTML comment so it stays findable; placeholder
  copy ("[ Your words here ]", TBD, lorem) must never reach a rendered
  surface or a published demo.
- System page map (Elleta, 2026-07-21, spec system-page-v2; Agents +
  Rules added in v3, same day): a sticky section nav (`DesignSystemNav`)
  lists Identity, Type, Colour, Spacing, Controls, Inspector, Agents,
  Rules, Gate, and the band order follows the map. Left rail at
  >=1280px, horizontal pill row below; scroll-spy sets `aria-current`.
  D1 amended: with a rail present, specimen bands paint the CONTENT
  COLUMN edge to edge, not the viewport.
- audit:axe joins the gate (Elleta, 2026-07-21, a11y pass): axe-core
  runs against every route in both themes, zero violations to pass; the
  gate is ELEVEN audits. This was the blind spot that let the
  readiness-map dark-mode contrast fail ship. Fixed in the same pass:
  dark `--case-writing-text` brightened toward the on-dark ink (AA on
  its own wash), `main-content` id restored on /about (dead skip link),
  the mobile breadcrumb nav leaves the tree at desktop (duplicate
  landmark + visual leak), sr-only h1 on the chromeless inspector.
  Axe "incomplete" nodes (text over gradients) are counted by the audit
  and verified manually; the 2026-07-21 manual pass measured the
  identity-band worst case at 5.72:1.
- Lab maturity taxonomy (Elleta, 2026-07-21, v3): every Design Lab card
  wears a StatusPill with an honest maturity value, one of Live (a
  deployed, working tool), Prototype (a clickable working demo),
  Exploration (recorded or static design exploration), Concept
  (idea-stage artifact). Assigned from what the artifact IS, never
  aspirationally; a card that cannot be honestly classified carries a
  TODO(elleta) instead of a guess. Current assignments: the three video
  cards = Exploration, the five clickable demos = Prototype.
- Cluster membership (Elleta, 2026-07-20): the hero cluster is six
  bubbles + hub, and membership is the `inCluster` flag on a case's ONE
  `WORK_ITEMS` row (absent = in; `false` = out, as on Travel Booking).
  Never a parallel data structure — the old `EXTRA_CASES` side table is
  deleted; the registry-parity audit rejects the pattern.
- Proto-exact hero type (2026-07-16 correction — the proto wins over the
  ramp here, do NOT re-conform): bubble labels 19/18px + hub 22px, hub
  sub + switch meta 11px, hero kicker 13.5px, hero intro 17px. Scope:
  hero cluster + header chrome only. AMENDED (Elleta, 2026-07-21,
  card-voice readability): the reveal/peek CARD leaves the proto-exact
  scope; its kicker joins the shared eyebrow scale, its list joins the
  card body step, its CTA the 16px floor.
- Redline spec annotations, CONTAINMENT LAW (Elleta, 2026-07-22,
  supersedes every earlier flag-placement rule including the withdrawn
  outside-the-edge allowance): no descendant of a card renders outside
  the card border box, ever. Flags are IN-FLOW rows in two fixed lanes
  inside the card (above and below the demo, inside the padding),
  always on, leader ticks spanning the lane-to-demo gap, values
  ellipsizing to the card inner width. Flags are the METADATA tier,
  RECORDED exempt from the 16px reading floor; non-interactive, never
  focusable. One card size per band grid (grid-auto-rows 1fr + the
  two-line head slot). Enforced by audit:visual: containment (every
  descendant bbox inside its card, clip-aware, 1440 AND 390, both
  themes) + uniformity (identical card dims per band grid). The ONE
  TokenAnnotation carries list, alwaysOpen (inspector), and flags
  modes.
- List markers (Elleta, 2026-07-21, card-voice): solid CSS discs,
  NEVER glyphs, rings, or icons. The ONE `.card-list-item` recipe:
  `::before` disc at `--list-marker-size` (6px, recorded token),
  `--radius-full`, `--color-accent-ink` (iris light / periwinkle
  dark), centred on the first line box, `list-style: none`. ui/Icon is
  reserved for interactive affordances (e.g. the popup CTA arrow).
- Card body (Elleta, 2026-07-21, card-voice readability): the ONE
  `.card-body` recipe: Geist at `--typography-font-size-lg` (18px, one
  ramp step above the 16px floor), line-height 1.6, measure capped at
  `--measure-card` (70ch), FULL ink on card surfaces (thesis-band ink on
  the statement ground); muted is reserved for metadata rows only. The
  statement head (`--font-card-title`, 20-24px) sits at most two ramp
  steps above it. Enforced by `audit:type` (computed sizes, both the
  16px floor and the 18px card-body step); the gate is TWELVE audits.
  Known 14px `.body-base` (misnamed, `--font-small`) remains OUTSIDE
  card surfaces only (/quick); flagged for a future pass.

## Button grammar (2026-07-17, section 7 addendum)

Labels: Geist caps + `--tracking-eyebrow` on every keycap, site-wide.
Arrows render through the Icon component, never raw glyphs in labels:
ArrowRight = internal navigation, ArrowUpRight = external/new context,
Download = download, and NO arrow on submit actions. Sizing: hug
content, min 44px target; full-width only inside forms below 768px.
Three tiers (v5, 2026-07-20): PRIMARY (single most important action of
the view, max one, gate-enforced; iris keycap, white label; the submit
in forms), SECONDARY (supporting actions; flat iris outline, iris text,
no fill), TERTIARY (low-emphasis navigation; text link, iris +
underline; caps reserved for the BACK TO WORK meta-link pattern). When
in doubt, demote. Placement:
form primary sits where the flow ends; paired actions keep primary
trailing; no destructive tier exists by design. Exactly two button
colour treatments, from tokens; disabled = opacity on the variant. The
keycap face carries the specular sheen from the one upper-left light
(`--gloss-key` family): sheen brightens on hover, shifts down on press,
never animates on its own, and stays translucent so the per-stop
contrast check judges the real fill stops.

## One contact action per case page (Pass B, 2026-07-18)

Template rule: a case page carries exactly ONE contact action, the
closing CtaBanner. The sidebar is information (meta, tags, demo links),
never the ask; it has no button. The same rule generalises: no route
duplicates its primary ask in two surfaces.

## Form submit placement (Pass B, 2026-07-18)

Single-column forms left-align the submit button with the fields (NN/g
single-column guidance, settled as the site rule); full-width below
768px. The contact form is the reference implementation. Forms validate
on blur per field, and again on submit.

## Case-specimen demo register (PR 41 amendment, Elleta 22 Jul 2026)

The `--demo-*` token set is the neutral product register for CASE SPECIMEN
STAGES ONLY (her ruling): the specimen reads as "a product", the annotation
layer (flags, leaders, highlights) stays BELLA iris in both themes. Scope is
the `.spec-stage` selector in globals.css; the tokens exist nowhere else and
must never appear in site chrome.

Palette (light / dark): surface #FFFFFF / #17181C · ink #17181C / #F2F2F4 ·
muted #5D6067 / #A6A8B0 · border #D7D8DC / #3A3C42 · primary #101114 both
themes (BLACK primary is the ruling; a border keeps it legible on the dark
surface) · primary ink #FFFFFF · selected #3D5A96 / #8FACE0 (the one
restrained blue, selected states only) · radius 8px · touch 44px.

Recorded exceptions, deliberate: the demo register uses a pure white surface
and a black primary INSIDE stages, overriding the site-wide "no pure
white/black" rule by her ruling; the before-state mess styles (Georgia,
off-palette colours) are depicted drift, never system UI.

LEAK ASSERTION (audit:visual): on every swept route, `--demo-ink` must
resolve to EMPTY on both the document root and body. A `--demo-*` token that
resolves outside a specimen stage fails the gate.

Animation law for stages: CSS transitions on tokens only, no keyframes, no
motion libraries; `prefers-reduced-motion: reduce` renders everything
immediately (leaders drawn, flags and console lines visible).

## Data display dialect + status set (PR 41 amendment 2, 22 Jul 2026)

CHIP's display grammar, generalized for case prototypes: every data point
answers "so what" in one glance (value + verdict + action). Parity states
render as bars WITH counts (n of total) and a StatusPill verdict beside them;
divergence is stated as a consequence ("three props behind the code"), never
a bare number; finding tables carry an Action column so every row ends in a
verb. The RECORDED status set is: In sync / Drift / Stale / Critical (words,
never colour-only). No dashboards for decoration; only data the story needs.

Stage geometry law: the component and its flags own a reserved stage zone;
readouts and consoles start BELOW the zone; leaders may only cross empty
ground. Asserted in audit:visual (no leader path may intersect the bounding
box of any text or table node; proven red on the pre-restory parity layout
before the fix). The `.demo-scope` class is the flat variant of the
case-specimen register scope (same leak law as `.spec-stage`).

## Section 5 addendum: annotation leaders do not cross (polish pass, 22 Jul 2026)

No annotation leader may cross another leader, and a leader enters the card
body at most once, landing on its part, never traversing. Routing law for the
case specimen: CORNER hugs the bottom-right corner with a short low path
(never up past META); META and TITLE drop straight; IDENTITY and TAG stay on
the left. Asserted in audit:visual (pairwise polyline intersection + the
enter-once rule, both themes, 1440 + 390); proven red on the pre-polish
corner routing before the fix. Shadow law recorded with it: card surfaces use
--shadow-soft; --shadow-orb is for spheres and keycaps only (asserted).
