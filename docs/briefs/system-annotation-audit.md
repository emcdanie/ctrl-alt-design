# System annotation layer, read-only audit

Phase 1 of the annotation rebuild (approved: Elleta, 22 Jul 2026, via Cowork). Audited at
`system-page-v3` HEAD `94861c8`. Contract: `_proto/bella-system-reference.html`. No code
was changed for this audit.

**Premise correction:** the brief says PR 33 is merged. It is not: GitHub reports PR 33
OPEN, `mergedAt` null, and `origin/main` HEAD is `325b45e` (PR 30). This audit and the
Phase 2 branch therefore sit on top of `system-page-v3`, and the draft PR targets that
branch; retarget to main once 33 actually merges.

Evidence method: static read of the tree plus a live probe against the running dev build
(Playwright, light theme, 13 viewport widths). Probe numbers quoted below are from that
run.

---

## 1. Absolute/fixed positioning, transforms, negative margins in the /design-system tree

The tree: `app/design-system/page.tsx` > `DesignSystemNav` + `DesignSystemSpecimens`
(> `TokenInspector`, `TokenAnnotation`, ui controls on `ui/Card`).

Card content:

| Element | Evidence | What it does | Card |
| --- | --- | --- | --- |
| `.ds-flags` | `app/globals.css:2700` | `position: absolute; inset: 0`. The deleted measured-overlay container. **Zero JSX consumers.** | none (ghost) |
| `.ds-flag` | `app/globals.css:2707` and `:2724` | Declares `position: absolute`, then `position: relative` later in the same rule block. The absolute (plus `z-index: 2` at `:2720`) is overlay residue; effective value is relative. | every flag, every card |
| Leader ticks `.ds-flaglane--top .ds-flag::after` / `--bottom ::before` | `app/globals.css:2765` | Absolute, anchored to the flag, spanning the `--spacing-2` lane margin. Contained. | every laned card |
| `.tok-inspector__ring` | `app/globals.css:2920` | Absolute with **negative inset** `calc(-1 * var(--spacing-2))`; renders outside its parent keycap's box. The proto instead reserves the space in flow (`.ringwrap` padding, proto line 54). | opening inspector |
| `.tok-inspector__key` | `app/globals.css:2913` | `position: relative`, ring anchor. | opening inspector |
| `.select-control__chevron` | `app/globals.css:1024` | Absolute + `translateY(-50%)` inside the field. Contained. | Select (Controls band) |
| `.ds-type__leader` | `app/globals.css:2512` | `transform: translateY(calc(-1 * var(--spacing-1)))` for baseline alignment. | none (Type band rows sit on the ground) |
| `.btn-key--primary:hover/:active` | `app/globals.css:1173`, `:1179` | `translateY(-1px)` / `translateY(2px)` interaction states. | opening keycaps |
| `.trace-host::before` | `app/globals.css:1068` | Absolute hover trace ring, the shared recipe. | every Card, primary Button |
| `ui/Card` internals | `components/ui/Card.module.css:16,49,92,108,122` | `.card` and `.inner` relative; `.interactive` hover `translateY(-2px)`; `.media`/`.scrim` absolute. No interactive or media Cards render on this page, so only the two relatives are live here. | every card |
| Mobile ghost block | `app/globals.css:2785` | `.ds-flagwrap--on`, static `.ds-flags`, `.ds-flag { position: static; transform: none }`. **Zero JSX consumers.** | none (ghost) |

Page chrome, not card content: `.skip-link` absolute/fixed (`:615`, `:620`), the sr-only
recipe with `margin: -1px` (`:1726`), `.ds-nav` sticky at both breakpoints (`:2317`,
`:2344`).

Notable absence: nothing live in the tree positions flags absolutely anymore. The
containment failures do not come from positioning; they come from flex min-content
overflow (section 3).

## 2. Annotation/flag implementations after v3

There should be one. There are four, in three compositions of the "one":

**A. `TokenAnnotation variant="flags"`** (`components/TokenAnnotation.tsx:70-90`,
rendering `.ds-flaglane` + `.ds-flag`). The intended ONE. Compositions:

- A1. `SpecimenCard`: **two lanes per card**, top and bottom, split by the `at` prefix
  (`components/DesignSystemSpecimens.tsx:223` and `:225`). The proto's law is one lane
  per card (proto lines 44-48, 98, 114).
- A2. `TokenInspector`: **two lanes** inside the inspector, above and below the keycap
  (`components/TokenInspector.tsx:78` and `:87`). Proto inspector: one lane, top.
- A3. **The opening's outer lane** (`components/DesignSystemSpecimens.tsx:284`, specs at
  `:138-147`): a third static lane rendered in the opening column OUTSIDE the
  `.tok-inspector` box. Probe: entirely outside the inspector at all 13 widths, and it
  wraps to two rows (31px to 71px tall) as the column narrows. Combined with A2 the
  keycap gets two stacked flag lanes above it, and the outer one annotates the same
  keycap it does not contain.

**B. Hand-rolled ramp flags** in the Type band
(`components/DesignSystemSpecimens.tsx:345-348` and `:373-376`): `.ds-flag
.ds-flag--ramp` spans with `.ds-flag__value`/`.ds-flag__token` children built inline,
plus their own leader element `.ds-type__leader`. This duplicates the flag markup outside
TokenAnnotation; second implementation.

**C. `TokenAnnotation` list/disclosure mode** (`components/TokenAnnotation.tsx:92-130`,
the `alwaysOpen` prop, trigger + panel). **Zero consumers** since the inspector
refinement; every live call site passes `variant="flags"`. Dead mode inside the "ONE"
component. Caveat: `app/about/page.tsx:142,150` reuses the `.tok-annotation__trigger` /
`__panel` CSS classes directly for the receipts disclosure, so those CSS rules are live
sitewide even though this component mode is dead.

**D. Ghost CSS of the deleted measured overlay**: `.ds-flagwrap` (`app/globals.css:2689`),
`.ds-flags` (`:2700`), the absolute half of `.ds-flag` (`:2707`), the mobile stacked-row
block (`:2785-2803`). CSS only, nothing renders it.

## 3. Why containment passes while SORT SPECIMEN escapes

What the assertion measures (`scripts/audit-visual.mjs:79-108`):

- Card set = parents of elements carrying `.ds-card__inner` (`:84`), i.e. only ui/Card
  instances given that innerClassName.
- For every DOM descendant, `getBoundingClientRect` compared to the card's **outer**
  border-box rect, tolerance 1px (`:105`), after intersecting with any
  overflow-clipping ancestors (`:93-103`).
- At exactly **two viewport widths, 1440 and 390** (`:79`), height 900, both themes.

The escape mechanism: `.select-control` is a no-wrap inline-flex row
(`app/globals.css:990-999`) sitting as a flex item in `.ds-card__demo--center`
(`:2679`). Flex min-width defaults to auto, so it cannot shrink below the min-content
width of "SORT SPECIMEN" + the select field, roughly 270-293px depending on width. The
demo centres it, so the overflow spills symmetrically across the card's 24px padding
toward both frame edges. Neither `ui/Card` layer clips (`Card.module.css`: no overflow on
`.card` or `.inner`; the proto's `.card` has `overflow: hidden`, proto line 35).

Probe, light theme, the Select card:

| Viewport | Card width | Control width | Escape per side | Audit logic run at this width |
| --- | --- | --- | --- | --- |
| 1440 | 271px | 270px | 0px, label flush on the frame | green |
| 1200 | 266px | 270px | **2px outside** | **4 fails** |
| 900 | 263px | 270px | **4px outside** | **4 fails** |
| 390 | 326px | 270px | 28px inside | green |

So the assertion is not wrong at the widths it samples; it never samples a failing
width. `.ds-specimen-row` is `auto-fit minmax(260px, 1fr)` (`app/globals.css:2641`), so
card width is non-monotonic in viewport width: every time the column count steps down,
cards jump wider, then compress again. The failure band recurs around each column-count
boundary (card width 260-270px); 1440 and 390 both happen to land in safe zones. Green is
a sampling artifact.

What it misses, in order of weight:

1. **Width coverage.** Two point samples over a layout whose failure is periodic in
   container width.
2. **The boundary is the outer edge.** Containment is judged against the card's outer
   rect (which includes the 3px trace padding), +1px. Content overlapping the 24px
   padding and sitting ON the border passes; that is exactly the 1440 render Elleta sees
   (label flush against the frame). The proto's law is content inside the content box.
3. **The card set excludes the inspector.** `.tok-inspector` is not a ui/Card, so the
   opening card, its ring, its lanes, and the outer lane (A3) are never checked at all.
4. **Pseudo-elements are invisible to it.** The leader ticks are `::before`/`::after`;
   `querySelectorAll` cannot return them, so leader geometry is asserted nowhere.

## 4. Duplicated recipes and dead code on the page

- `app/globals.css:2689-2704` `.ds-flagwrap`, `.ds-flagwrap > .ds-card__demo`,
  `.ds-flags`: dead (overlay era).
- `app/globals.css:2707,2719-2720` the absolute + `box-shadow` + `z-index` overlay half
  of `.ds-flag`, overridden at `:2724`: dead declarations inside a live rule.
- `app/globals.css:2785-2803` the mobile `.ds-flagwrap--on` / static `.ds-flags` block:
  dead (the 390 layout is now lanes wrapping).
- `app/globals.css:2805-2808` `.ds-card__foot`: zero consumers.
- `app/globals.css:2819-2826` `.ds-card__readout`: zero consumers.
- `app/globals.css:3007-3012` `.tok-inspector__readout` override: zero consumers (the
  readout column was retired in the inspector refinement).
- `app/globals.css:3058-3063` `@media (max-width: 720px) .tok-inspector {
  grid-template-columns: 1fr }`: inert, the inspector is a flex column now (`:2874`).
- `components/TokenAnnotation.tsx:92-130` list mode, `alwaysOpen`, `open` state, trigger,
  panel: zero consumers (About consumes the CSS classes, not this component).
- `components/TokenAnnotation.tsx:81` emits `ds-flag--k-<kind>` classes; no CSS defines
  them anywhere. `FlagSpec.kind` ("styles the leader grammar", `:24`) drives nothing.
- `app/globals.css:3023-3056` `.tok-inspector__tokens`/`__row`/`__chip`: reachable only
  through the dead list mode.
- Duplicated recipe: the Type band's hand-rolled flags (section 2B) re-implement
  `.ds-flag` markup outside TokenAnnotation.

## 5. Verdict

**Delete:**

- The ghost overlay CSS wholesale: `.ds-flagwrap` block, `.ds-flags`, the mobile block,
  and the absolute/z-index/shadow residue inside `.ds-flag`.
- `.ds-card__foot`, `.ds-card__readout`, `.tok-inspector__readout`, the 720px grid query.
- TokenAnnotation's list mode and `alwaysOpen` (component becomes flags-only; the
  `.tok-annotation__trigger`/`__panel` CSS stays for About's receipts disclosure).
- The opening outer lane (`DesignSystemSpecimens.tsx:284` + `OPENING_FLAGS`); the
  inspector's own zone lane is the annotation, inside the card.
- `FlagSpec.kind` and the `ds-flag--k-*` emission, unless Phase 2 styles them.

**Keep:**

- TokenAnnotation's flag renderer as the one implementation, trimmed to lane rendering.
- The TokenInspector zone model (click/hover/keyboard selection, live reads, theme
  re-read) and the measurable ring.
- `SpecimenCard` as the one card wrapper, `ui/Card` underneath, the fixed head slot
  (`.ds-card__head` min-height, `app/globals.css:2668`), `grid-auto-rows: 1fr`.

**Smallest rebuild to match the proto's model** (structure, not pixels):

1. `SpecimenCard` gets the proto's fixed slot order, head / lane / demo (/ caption), with
   **one lane per card** (`FlagSpec.at` collapses away; a flat token list per card).
   Inspector: one lane at top, then stage, zones, caption, all inside the card
   (proto lines 97-105); the outer lane is gone.
2. Ring space reserved in flow: a `ringwrap` element with `--spacing-2` padding and the
   ring at `inset: 0`, concentric radius kept (proto line 54-55). No negative insets left
   in the tree.
3. Containment by construction: `overflow: hidden` on the card inner per the proto's
   `.card` (proto line 35), and the real Select fix, let the demo's flex children shrink
   (`min-width: 0` / wrap) so nothing relies on the clip.
4. Leaders inside the card, drawn to touch the specimen (the proto's in-card SVG,
   lines 51-52, 143-145), replacing the fixed-height tick pseudo-elements.
5. Type band: ramp flags become TokenAnnotation flags (kills implementation B) or the
   band's rows become SpecimenCards; either way one flag implementation remains.
6. `audit:visual` containment rewritten to: card set = every `.trace-host` card AND
   `.tok-inspector` on the page; boundary = the inner content box, not the outer edge;
   width sweep across the failing band (at minimum every column-count boundary of
   `auto-fit minmax(260px, 1fr)` between 390 and 1440), both themes. Must demonstrably
   fail on pre-fix code (the 1200px probe above is the seed case) and pass after.

Not in scope for the rebuild: the swatch/scale inline readouts (Colour and
Spacing bands); they are specimens, not annotations, and predate the flag layer.
