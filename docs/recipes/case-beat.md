# Recipe: CaseBeat, THE case-study beat template

The one reusable beat structure for Code First and every future case study
(airtight spec, 2026-07-22). The law it implements is
`docs/briefs/case-layout-constitution.md`; a build that violates it is a
regression, not a new idea. Future case studies compose beats from
`components/CaseBeat.tsx`, never bespoke.

## Shape

```tsx
<CaseBeat
  index="01" kicker="The mismatch"
  headline="The button didn't match the code."   // display face, INSIDE the text column
  keyline="Same component. Different names…"      // bold ink, never iris
  id="case-b1" flip={false}
  body={<Scannable … />}
  visual={<DriftBeat />}                          // FLAT: no card wrapper
/>
```

Rendered DOM (never deviate): `section.beat[.beat--flip] > .beat-grid >
(.beat-text > .beat-eyebrow + h2.beat-headline + .beat-keyline + .beat-body)
+ .beat-visual`.

## The hard rules (all asserted in audit:visual)

1. The headline is a CHILD of the text column. No full-width headline row:
   on a flipped beat, eyebrow + headline + keyline + body move together to
   the same side. (Asserted: headline left edge equals body left edge, every
   beat, both themes, 1440 + 390.)
2. Alternation is `.beat--flip` swapping grid column order only; the text
   column's internal order never changes. Consecutive beats alternate
   (asserted).
3. `.beat-visual` is FLAT: no background, border, shadow, or padding frame
   (asserted), and no ui/Card may wrap a visual (asserted via the Card
   module class); the demo specimen inside is the only card, because it IS
   the subject.
4. `align-items: start` on the grid; no floating titles or dropped visuals.
5. `--spacing-*` only; columns gap `--spacing-12`; headline-to-body on the
   locked steps.

## Slots inside a visual

Controls ride `.scene-control` directly above the demo; captions, chips and
machine links ride `.scene-foot` beneath it. Specimens stay flat with their
flags and leaders (leaders land on the part, render in front, never cross).
The journey renders flat with its rail in JOURNEY ORDER, Figma at the top,
Production at the bottom, single-line labels, equal-height beside its detail.
