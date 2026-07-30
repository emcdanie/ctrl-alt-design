# requirements.md, system-page-calm-template

Acceptance criteria. Each line is testable. Nothing is built yet.

---

## A. Zero leader lines, and nothing left behind

- [ ] **`/design-system` renders zero leader lines.** `document.querySelectorAll(".ds-leaders")`
      returns empty on that route, both themes, after a full scroll sweep.
- [ ] Zero floating token chips: `.ds-flag`, `.ds-flaglane` match nothing on the route.
- [ ] No connector string, tick, or pointer of any kind is drawn between a label and a
      specimen anywhere on the page.
- [ ] The retired CSS is **deleted, not orphaned**: `.ds-leaders`, `.ds-leaders line`,
      `.ds-flaglane`, `.ds-flag`, `.ds-flag__row`, `.ds-flag__chip`, `.ds-flag__value`,
      `.ds-flag__token`, `.tok-inspector__ring`, `.tok-inspector__ringwrap`,
      `.tok-inspector__zones`, `.tok-inspector__zone` all return no grep hits in
      `app/globals.css`.
- [ ] The retired data is deleted: `ANN`, `ORB_TOKENS`, `TYPE_FLAGS`, `flagsAriaHidden`,
      and the local `SpecimenCard`.
- [ ] `TokenAnnotation`'s flag rendering is deleted once nothing consumes it.
- [ ] `TokenName` survives and has exactly one home; the swatch grid still imports it.
- [ ] `audit:reuse` passes: no component is left with zero imports.
- [ ] `grep -rn "SpecimenCard"` returns nothing outside its own deletion.

## B. What must NOT be deleted

- [ ] `.trace-host` still exists and is still consumed by `ui/Button.tsx` and
      `ui/Card.tsx`. The primary button's travelling border light still works on hover.
- [ ] `scripts/audit-visual.mjs` card set (`.trace-host:not(.btn-key)`) still matches a
      non-empty set on every swept route. **A card selector that matches nothing fails
      the PR**, because containment and uniformity would silently stop being checked.
- [ ] `FlagLeaders` still exists and `components/CaseSpecimen.tsx` still imports it.
- [ ] The case-study routes still render their leaders, and `audit:visual`'s stage
      geometry, leader-crossing and card-traverse assertions still run against real
      geometry on all three case routes.
- [ ] The three hero moments render unchanged in substance: the pipeline instrument still
      computes a real ratio and a real DTCG entry, the maturity map still shows its axes
      and you-are-here markers, the agent-or-drift diagram still animates in.

## C. The shell

- [ ] Every section on `/design-system` uses the same shell: eyebrow, one keyline
      heading, one lede, in that order, on the band ground, never inside a card.
- [ ] The shell head is constrained to a readable measure (about 60ch).
- [ ] Every section keeps `aria-labelledby` and its anchor id; the nine retired anchor
      aliases still resolve (they were verified in `3d98e01` and must stay verified).
- [ ] The rail still lists exactly the six spine sections and scroll-spy still works.
- [ ] The heading tier follows the §5.2 ruling, applied consistently to every section.

## D. The specimen card

- [ ] Anatomy in order: name, role, stage, spec list.
- [ ] The role line reserves a fixed height so every stage in a row starts on the same
      line, verified by measuring stage tops across each row.
- [ ] The spec list pins to the bottom of the card (`margin-top: auto`).
- [ ] The stage is a visible quiet inset with its own radius, distinguishable from both
      the card surface and the page ground. Measured, both themes.
- [ ] The specimen on the stage is the **real** component imported from `ui/`, never a
      picture or a copy of one.
- [ ] Spec rows are two aligned columns: name left, value right, optional swatch before
      the name. Every row in a card shares one left edge and one right edge.
- [ ] Token names never break mid-token, in any card, at any swept width.
- [ ] Values are read live from computed styles, never typed.

## E. Case identity

- [ ] Renders as a quiet swatch grid: case name plus its swatch. No orbs on strings, no
      per-case token diagrams, no leader lines.
- [ ] Case names use one type treatment; only colour and underline distinguish a real
      link from an unrouted case.
- [ ] Exactly one orb survives on the page, as the Bubble specimen card in The parts.
- [ ] The `--case-*` token pairs are still consumed, so no token is orphaned.

## F. Equal height and alignment

- [ ] Every card row on the page has identical card heights. `audit:visual` asserts this
      at **zero tolerance**, and the new grid is added to its tracked selector list.
- [ ] Uniform padding across every specimen card.
- [ ] Uniform stage dimensions across every specimen card in a row.
- [ ] No horizontal overflow at 390px, 768px, 1024px, 1440px.
- [ ] Radii come from tokens, never literals.

## G. Type floor

- [ ] Every reading element on `/design-system` computes at 16px or above, including the
      card role line and every lede.
- [ ] The spec-list name and value rows follow the §5.5 ruling: either 16px, or added to
      `META_EXEMPT` by name as the metadata tier. Whichever is chosen is applied to
      **both** the name and the value, never split.
- [ ] `audit:type` passes with no new exemptions beyond the one §5.5 decision.

## H. Constitution

- [ ] Tokens only. No hex, no px, no arbitrary Tailwind values in any new CSS or markup.
- [ ] No amber. Warm neutrals. No pure white and no pure black as a surface or text.
- [ ] 1240 `layout-container` on every section, `ds-band` grammar throughout.
- [ ] Display headings through `ui/Heading` or `ui/SectionHeader` only, per §5.2.
- [ ] Exactly two typefaces. Unique never renders inside a Card.
- [ ] No em or en dashes anywhere.
- [ ] "AI-enabled" is the only positioning term.
- [ ] One primary action on the view; the pipeline instrument keeps it.
- [ ] NDA-safe. No invented metrics; token, component and audit counts stay derived.
- [ ] Dark mode is a first-class contract on every new surface, including the stage.

## I. The gate

- [ ] All 15 audits green.
- [ ] `npx tsc --noEmit` clean, `npm run build` clean.
- [ ] `npm run lint` introduces no new errors beyond the 7 pre-existing ones.
- [ ] All 13 routes 200 in light and dark.
- [ ] `audit:nda` clean across the whole tree (the local run is the NDA authority).
- [ ] **`audit:visual`'s trace-ring assertion is deleted in the same commit that removes
      the ring**, so no check is left matching nothing.
- [ ] `/quick` and `/design-system/inspector` are visually checked in the same PR,
      because §5.3 means they change too.

## J. Evidence required in the PR

- [ ] Before and after screenshots of every section, desktop and 390px, light and dark.
- [ ] A measurement showing zero `.ds-leaders` on the route.
- [ ] Row-height and stage-top measurements proving alignment.
- [ ] Stage versus card versus ground separation measured in both themes.
- [ ] `/quick` and `/design-system/inspector` after shots.

## K. Decisions needed before build

- [ ] **§5.1** Confirm `.trace-host` stays. The brief said delete it; this spec says the
      leader layer goes and the trace recipe stays.
- [ ] **§5.2** Shell heading: Unique via `SectionHeader`, Geist with a recorded §3
      exception, or Unique at a smaller step.
- [ ] **§5.3** `TokenInspector`: change the component once so all three routes calm
      together, or split it and accept two implementations.
- [ ] **§5.5** Is the spec list metadata (exempt) or reading text (16px)?
- [ ] **§5.7** Does the Type ramp keep its own shape with the shared shell, or get forced
      into the card mould?
- [ ] Confirm the orb survives exactly once, as the Bubble specimen.
