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

## Phase B (FINAL brief, 22 Jul, supersedes the stop-and-wait version): case
## shell v2 on Code First, per the Carmen ADOPT list + Justine scan rules

Reference committed: docs/briefs/carmen-structure-audit.md (from _review/).

- In-flow head (sticky side title dead): outcome-framed title (the existing
  thesis), one-sentence problem subhead (the existing summary sentence),
  mechanical reading time, existing Tag row, link out to the public recorded
  session (the NDA-safe shipped surface).
- Numbered spine 01 Foundation / 02 The design work / 03 Current chapter;
  every screen ONE idea at roughly one viewport, text BESIDE its visual,
  alternating; thin token-coloured reading-progress bar on case pages only.
- 01 Foundation: the drift pair visible before reading (the observed
  "Primary, Large" vs "variant: action, size: lg" annotated with the flag
  recipe + leaders); the token layer as live swatch artifacts; the PARITY
  specimen (declared source value vs live rendered value per theme-stable
  token, In sync / Drift stated in words); the Readable-by-AI block (real
  llms.txt / bella.json / gate story); the honest Before tokens / On system
  pair.
- Differentiator band, hers and real: BELLA tokens, the 13-audit gate, the
  CLAUDE.md constitution, agent surfaces; band title TODO(elleta).
- 02 The design work: token-alignment screen (decision 01 copy + the
  command-center visual), the MCP screen (decision 02 copy + the short clip
  with its 3-bullet "what you would see" and the 39:36 link), the pull
  quote, and the three-column feature row (the three work areas).
- 03 Current chapter: the live inspector inline ("the same discipline, on
  this site", existing Evidence copy); the theming payoff via the REAL
  contract (nested fixed-theme panels are outside the recorded theming
  contract, so the payoff is the live lane + the site's own theme toggle,
  "flip the theme and watch the values follow"); her closing reflection.
- OUTCOMES band: three qualitative cards from the approved outcome copy,
  "No invented numbers." line, TODO(elleta) elaboration slot.
- THE JOURNEY: numbered phases, one line each, the rules-as-law recipe; the
  in-progress phase is the discipline running this site.
- Personality-break card (TODO(elleta) voice) with the ONE contact keycap;
  NEXT CASE card chaining chip -> code-first -> drift -> chip; small thanks
  line.
- Iris emphasis register (.cs2-em, iris + 700) defined for her scanning-word
  pass; applied nowhere until she marks words.
- chip and drift keep the old shell; old shell code is deleted only when the
  last case leaves it.
- /skills: DEFAULT is the plain grouped list (grouping taxonomy: Systems /
  AI and code / Craft, my mechanical pick); per skill a TODO(elleta)
  one-liner slot and a "proven in" link to the best-ranked live piece; a
  skill with no live proof renders honestly linkless (UX Research, flagged);
  the matrix stays as the secondary SegmentedControl toggle.

## Standing rules

Tokens only, one implementation, 16px reading floor, no em dashes, never stage
all of app/about/page.tsx, one session in the tree. Verify per phase:
npm run gate, tsc, all routes 200 both themes, screenshots into
_review/after/case-shell-v2/. Open PR, STOP at preview. Elleta merges.
