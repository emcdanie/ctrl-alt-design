# Case curation + case shell v2

Source brief: Elleta, 22 Jul 2026, via Cowork (approved; two phases, hard STOP
between them). Precondition met in-session: PR 37 merged to main on her word
(2dd4b06), PR 40 retargeted to main. Branch feat/case-curation-shell-v2 off main.
Reference: the Justine talk notes (one idea per viewport, text beside image,
interactive specimen, theming payoff, short clips only).

## Phase A: curation sweep

Three star cases stay registered: chip, brad-frost (Code First),
design-system-transformation (From Drift to Foundation). Guardian, Operational
Clarity (un-operational-dashboard), Travel Booking (filters-decision-support-system)
and the design-lab.ts orphan are ARCHIVED: full content preserved under
content/case-studies/_archive/ with a header comment (deliberately unrouted,
Elleta 22 Jul 2026), removed from index.ts and WORK_ITEMS.

Everything else derives from WORK_ITEMS and follows automatically: /work counts,
Find My Fit corpus, the matrix, related-work rows, /api/bella.json, /quick.
Untouched by order: Find My Fit, the Cards/Map/Table switcher, the Design Lab
band and its 8 pieces.

Bespoke sites that need hands:

- **Bubble cluster (home + Map view):** the seven-sphere hive geometry stays
  (GEOMETRY/CONNS are positional; removing spheres would hole the hive and
  break connector indices). The registry-driven spheres (chip, code-first,
  drift, design-lab) and the hub keep their live links. Guardian and Clarity
  become TOPIC spheres: a local TOPIC_SPHERES const (labels from the retired
  rows' type fields, "AI UX" / "Data Dashboard"; same case colour tokens),
  rendered as non-interactive identity spheres, no button, no peek, no link.
  INTERPRETATION FLAG: "any remaining spheres are identity/topic only, without
  links" is read as targeting the archived-case spheres; design-lab
  (/work#design-lab) and the hub (/about#how-i-think) point at LIVE routes and
  keep them. Her call if those should unlink too.
- **System page orbs (CASE_ORBS):** all eight identities stay (the tokens are
  real); the three archived names render as plain kicker text, link removed.
  NOTE: PR 40's DesignSystem2.tsx duplicates CASE_ORBS; if 40 merges after
  this branch, page 2 needs the same three-line unlink (flagged on both PRs).
- **About (her-edit file):** the Vitaly workshop entry's relatedWork link
  points at the archived filters case; the field is removed (entry renders
  without a link). Edit via the lift/restore procedure, her uncommitted
  learning-entries patch never staged.
- **ExperienceSection:** the Geneva contract entry's caseStudySlug/caseStudyLabel
  point at the archived clarity case; removed (entry renders linkless like
  other entries). Employment history itself is untouched.
- **Agent surfaces:** generate-agent-surfaces.mjs case list drops to the three
  stars; llms.txt regenerates; audit:agents re-verifies.
- **Gate plumbing:** archived routes leave the axe/type/controls/contrast (and
  audit-layout) route lists; audit-reuse EXEMPT gains content/case-studies/_archive/
  (archived-by-design, per the brief); audit-visual gains the DEAD-LINK sweep:
  on every gate route, every internal <a href> must resolve 200 and the three
  archived route strings must appear nowhere in rendered HTML.

STOP at preview after Phase A. Elleta checks the curated library.

## Phase B (only on her go, this session): case shell v2 on Code First

- Sticky side title dies; the case title is a normal in-flow head.
- Screen architecture: each section ONE idea at roughly one viewport, text
  BESIDE its visual (alternating), nothing competing within a screen.
- Opening screen: the broken/before state annotated with the merged flag
  recipe (TokenAnnotation, one lane, anchored leaders) so the problem is
  visible before any reading.
- One interactive specimen: the parity specimen, Figma value vs Storybook
  value read live, flags anchored to the exact part each token drives.
- Theming payoff: the same specimen flipped dark via the existing contract,
  framed "same tokens, second theme, zero redesign".
- Video only as short clips with a 3-bullet "what you'd see" beside them.
- Narrative text is real HTML at the 16px reading tier, keyword-rich; existing
  approved copy reused where it fits, new prose slots TODO(elleta); NDA-safe
  outbound links to shipped surfaces where allowed.
- chip and drift keep the old shell (rebuilt in their own passes); the old
  shell code is deleted only when the last case leaves it.
- /skills: default becomes a plain grouped list (skill, one plain-language
  line TODO(elleta), a "proven in" link to a case or lab piece); the matrix
  stays as a secondary toggle only if it costs nothing.

## Standing rules

Tokens only, one implementation, 16px reading floor, no em dashes, never stage
all of app/about/page.tsx, one session in the tree. Verify per phase:
npm run gate, tsc, all routes 200 both themes, screenshots into
_review/after/case-shell-v2/. Open PR, STOP at preview. Elleta merges.
