# Case study layout constitution (Code First + all cases)

Locked rules for the case-study layout. **Every case-study build prompt MUST reference and honor
this file.** A build that violates any rule below is a regression, not a new idea. Logged 22 Jul
2026 because these kept recurring.

## Structure
- **Scene skeleton per beat:** eyebrow (NN + kicker) → display headline → keyline → body. This is
  ONE narrative unit (the text column). The visual is the OTHER column. Side by side, ALTERNATING
  sides down the page (Z-pattern).
- **The headline sits directly ABOVE its body text, ALWAYS.** eyebrow + headline + keyline + body
  move together. On flipped beats the headline moves to the SAME side as its body — never left
  above the visual while the body is on the right. (Recurring miss. Do not repeat.)
- **align-items: START.** Headline and visual both top-aligned. No floating titles, no dropped
  visuals, no dead half-columns.

## Visuals
- **All visuals sit FLAT on the page ground. NO card / frame / border / shadow container around a
  visual** — not the specimens, not the journey. The demo card (e.g. Operational Clarity) is the
  ONLY card, because it IS the subject being shown. (Recurring miss: the journey was wrongly put in
  a card. Do not repeat.)
- Cards use `--shadow-soft`. NEVER `--shadow-orb` (sphere/keycap only).
- Annotated specimens: flags anchored to the exact part; leaders land on the part with a dot;
  leaders render in front; NO leader crosses another leader or the card twice.

## Spacing (one scale)
- `--spacing-*` only (no legacy `--space-*`, no raw px). Rhythm: beat padding 64, headline→body 32,
  paragraph 16, columns 48.

## Controls & extras
- **ONE control slot:** any demo control (before/on-system toggle, Run) sits in the same place,
  directly above its visual. No floating controls.
- **ONE footnote slot:** captions, chips, machine-surface links sit in a consistent quiet row
  beneath the visual.

## Copy (Vitaly limits)
- Max ~50 words/paragraph, ~20 words/sentence. Inverted pyramid (key point first). One keyline per
  beat (bold ink, NOT iris). Remove fluff.
- **NO invented numbers.** Honest outcome language only.
- The machine never writes Elleta's voice: new sentences are `TODO(elleta)`.

## Type & brand
- Geist inside cards; the Unique display face only on the page ground, never in a card. Body min
  16px. Warm neutrals, no pure white/black. 1240px container.

## Beat 02 journey (specifics)
- Rail reads in journey order (foundation/Figma at top → Production shipped at bottom). Single-line
  rail labels (no two-line wrap). Rail + detail sit FLAT (no outer card), equal-height, adjacent so
  the active step is beside the detail it drives.
