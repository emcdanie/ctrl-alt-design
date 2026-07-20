# System v2 + theses recomposition + case fixes — design

Approved: Elleta, 21 Jul 2026, via Cowork (decisions verbatim from the brief;
implementation choices recorded here). Tokens only; gate green per task.

## 1. About theses: one row of dark cards

Keep the task-6 winner treatment (fixed-dark navy ground, Unique display
through the Heading primitive, core word in the case identity colour, shared
trace on hover, focus-within ring, reduced-motion static). Composition
changes: the three `.thesis-band` articles move into a `.thesis-row` grid,
three equal columns at >=1024px, one column below. Cards are equal height
(grid stretch + flex column; body keeps `flex: 1`).

Type steps down one tier so three-up fits without clipping: core word
`--font-hero` -> `--font-section-display`, rest `--font-section-display` ->
`--font-subsection` (min 24px, gate-safe; both still Unique through Heading).
No copy changes. No empty right half: the card is the band now.

## 2. System page map (Modeless-style)

New `components/DesignSystemNav.tsx` (client). Section list, Elleta's order:
Identity, Type, Colour, Spacing, Controls, Inspector, Gate. The page bands
REORDER to match this list (currently Colour precedes Identity, Controls
precedes Spacing) so the map order IS the scroll order. Unlisted bands (For
agents, Rules, Status) sit between Inspector and Gate and simply do not
highlight; the map lists the system's core sections.

- Desktop >=1280px: `.ds-layout` grid `[220px rail | 1fr]`; the rail is
  `position: sticky` below the header. Bands paint the CONTENT column edge
  to edge (D1 amended for the nav era: full-width means full content-column
  width once a rail exists; recorded in DESIGN.md).
- <1280px: the rail collapses to a sticky horizontal pill row under the
  header, `overflow-x: auto`, same links.
- Scroll-spy: IntersectionObserver on the seven section ids; the current
  link carries `aria-current="true"` + the highlight style. Links are real
  anchors (keyboard operable natively); sections get `scroll-margin-top`.
- `<nav aria-label="System sections">`.

## 3. Specimen consistency

a. **Spheres.** `CASE_ORBS` gains Travel Booking (`--case-filters-hi/-lo`),
   making eight items: six cases + Design Lab + hub. The `small` modifier is
   deleted: ONE orb size (112px), one grid
   (`repeat(4, 1fr)` desktop / `repeat(2, 1fr)` at <768px), and fixed row
   structure per item (orb / name / token / value) with a min-height on the
   name row so readouts share baselines across all eight.

b. **Real components.** The FilterChip, Tag, and StatusPill specimens are
   redrawn copies (raw `button.filter-chip`, `span.tag`, `span.status-pill`);
   they become imports of `ui/FilterChip`, `ui/Tag`, `ui/StatusPill`. Every
   specimen body centres its content (`justify-content: center`) inside the
   SAME `.ds-specimen__body` recipe; nothing overflows (Select constrained to
   the card). The orb specimen stays the recorded `.ds-orb` recipe: there is
   no ui/Bubble component, the recipe IS the implementation.

c. **Annotation.** New `components/TokenAnnotation.tsx`, the ONE annotation
   implementation: a `dl` of attached tokens (name + resolved value read live
   from computed styles, colour chip when the value is a colour; re-reads on
   theme flip). Two modes, one component: default = disclosure (a "Tokens"
   trigger button, `aria-expanded`/`aria-controls`; click or focus+enter
   reveals the panel, button semantics give keyboard for free);
   `alwaysOpen` = the readout alone (no trigger), which is how the keycap
   TokenInspector consumes it (its zone buttons keep selecting WHICH tokens
   show; its bespoke readout markup is deleted).
   Annotated specimens: the opening keycap pair, all six control specimens,
   the type display + three type rows, and each case-identity sphere.
   Recorded exception: colour swatches and the spacing/radius scales ARE
   inline token readouts already (name + live value visible at rest);
   wrapping a readout in a reveal-a-readout adds nothing, so they stay as
   they are.

d. **Gate grid.** `.ds-gate` becomes a scannable card grid
   (`repeat(auto-fill, minmax(280px, 1fr))`): each card = audit name (mono),
   PASS chip, one-line description. The snapshot line stays visible and gets
   honest: "ten audits" (the page still said nine in two places; the GATE
   array has ten) and the snapshot date updates to the gate run verified in
   this session (21 Jul 2026).

## 4. Related cards

`relatedWorkItems` returns TWO (was three); `.cs-shell__related-grid` becomes
`repeat(2, 1fr)` at desktop, one column mobile — two cards at a wider width.
Covers: one fixed aspect on the cover box with `object-fit: cover` on the
image (no stretched/skewed art at the new width); cases without an honest
cover render THE existing placeholder recipe (`coverPlaceholder` on the warm
gradient), no new recipe.

## 5. TODO slots never render publicly

Rule (recorded in DESIGN.md): a TODO(elleta) content slot renders NOTHING
until her words land; the slot survives as a code/HTML comment so it stays
findable. Known leak fixed: the Code First token-parity demo's
"[ Your words here: ... ]" note. Then a live sweep: crawl every route and
every published demo, search visible text for placeholder markers (TODO,
"[ Your", "words here", TBD, lorem, placeholder); fix anything found the
same way and list it in the progress log.

## 6. Finviz canvas card retired

The "Finviz AI, Solution Canvas" STRATEGY card leaves `CtrlAltDesignSection`;
`public/demos/finviz-kpi-tree.html` and its orphaned thumbnail
(`public/images/thumbnails/finviz-kpi-tree.png`) are deleted. The
`prototypes/` source stays local (gitignored). The Finviz 3.0 screener card
stays exactly as is.

## 7. Verification

Gate 10/10 + tsc per task commit; final: all routes 200 both themes,
screenshots 1440/390 both themes to `_review/after/system-v2/`
(About theses + System page), placeholder sweep output, progress log, push.
