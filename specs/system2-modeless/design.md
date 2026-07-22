# System page take 2: the modeless grammar on BELLA

Source brief: Elleta, 22 Jul 2026, via Cowork (approved; execution authorised in the
brief itself). Reference: docs/briefs/modeless-system-page-audit.md (Cowork, 21 Jul).

A SECOND System page at /design-system2 so Elleta can compare two compositions and
pick one. /design-system, the site nav, and PR 37's branch are untouched; the page is
reachable by URL only. The losing page is deleted in a follow-up, never left rendering.

## The grammar (from the brief, in force here)

1. ONE ground, zero band tints, no identity wash. The whole page renders on the page
   ground (warm light / navy dark).
2. The Card is the ONLY structural device: specimens, swatches, rules, status rows,
   gate entries, and the inspector all render through ui/Card. Rhythm from grid and
   whitespace, never surface changes.
   RECORDED DEVIATION: the Type ramp stays on the ground. "Unique never renders
   inside a Card" (constitution section 3, enforced at runtime by audit:type) beats
   grammar item 2; splitting the ramp between carded Geist rows and grounded Unique
   rows would break the ramp. Flagged in the PR for her ruling.
3. Tight opening: head (mono kicker, Unique title, one positioning sentence) stacks
   directly into the intro; the inspector card sits beside the intro at equal column
   width, columns top-aligned so the text column never stretches.
4. Map rail: the existing DesignSystemNav, UNMODIFIED (its per-section description
   slots are already TODO(elleta) and render nothing until her words land).
5. One metadata register: .ds-section__kicker (the existing mono eyebrow tier) for
   every kicker and label, including the rail labels via a .ds2 scope override. Full
   sentences stay on the 16px .ds-section__note tier. Asserted in audit:visual.
6. Case identity inside cards (orbs, swatch chips); no section backgrounds. Iris
   stays interactive-only.
7. Rules as numbered law through cards. BELLA's published constitution has EIGHT
   rules, so the numbering runs 01-08 (the brief's 01-07 matches Modeless's count,
   not ours; flagged in the PR).
8. Gate merged with the misses ledger as "How things slip": per-audit cards, receipt
   slots (TODO(elleta), the one verbatim Resend line kept), the honest not-covered
   line, and the framing line "Green only means something next to the reds it
   survived" (her decision language from the audit doc).
9. Current status: two equal columns, every row its own card, coming list from the
   real plan docs (unchanged from page 1).
10. Inspector, fixed recipe: one lane; ring gap a uniform 2px VISUAL gap measured
    around the visible key INCLUDING the 2px/5px 3D plate (so the in-flow ringwrap
    padding is asymmetric: 4px top/left, 6px right, 9px bottom = gap + 2px ring
    border + plate overhang); leaders anchored per referent: fill-hi upper face,
    fill-lo lower face, label tokens on the text, radius tokens on a corner arc,
    edge tokens below the key, hit area on the key outline. Asserted in audit:visual.

## Implementation shape

- app/design-system2/page.tsx: route (noindex; the comparison page must not compete
  with /design-system in search).
- components/DesignSystem2.tsx: the ONE new composition component (sanctioned by the
  brief: "no new parallel components except the page composition itself"). It reuses
  ui/Card, Button, SegmentedControl, FilterChip, Tag, StatusPill, Select, Heading,
  SectionHeader, TokenAnnotation + FlagLeaders, DesignSystemNav, and the existing
  ds-* CSS recipes. Content data (orbs, tokens, gate lines, receipts) is duplicated
  from DesignSystemSpecimens.tsx BY DESIGN: the brief forbids touching page 1, and
  exactly one of the two files survives the follow-up.
- app/globals.css: additive .ds2 scope block only (opening alignment, rail label
  register, rules/status card layouts, inspector chrome strip + ring geometry).
- scripts: /design-system2 joins the axe, type, controls, and contrast sweeps;
  audit:visual gains a ds2 block (one ground, one metadata register, 2px visual ring
  gap, equal card rows).

## Copy

No new voice. Head sentence = the route metadata description; intro paragraphs,
section notes, gate lines, status lists verbatim from page 1. New mechanical strings
only: the opening text link label ("Rules of the system", anchor to the rules
section), the numbered rule indices, and the section title "How things slip"
(brief's words). TODO(elleta) slots keep rendering nothing.
