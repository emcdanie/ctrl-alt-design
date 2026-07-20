# Pass E: reconciliation, the seven missed amendments

For a fresh Claude Code session at the repo root (ctrl-alt-design). Start from main
at b615ba3 (the scrubbed, merged history; work on redesign/lush fast-forwarded to it
or a fresh branch, merge back when green). NOTE: the full-history scrub rewrote every
pre-merge hash; any old commit id in chat logs is dead. Context: Passes A to D
executed the kickoff copy of portfolio-passes-a-d.md.
Seven amendments Elleta approved during that run (the 17:10 revision of that file) were
not in the kickoff copy. This brief is exactly those seven, nothing else. Constitution
applies: smallest change, one implementation, tokens only. Commit per task, gate green
between commits (npm run gate), push at the end. No new scope.

Loop-breaker: rm -rf .next, npm run dev, hard reload, DevTools cache off.

## 1. Button grammar v5 (supersedes the shipped --btn-key-border secondary)

Purple means clickable at every tier. PRIMARY = filled iris keycap, the one 3D moment
per view. SECONDARY = iris outline, iris text, NO fill, flat, no keycap elevation;
periwinkle variant on dark and fixed-dark chrome, AA both themes. TERTIARY = text
link, iris and underlined. The neutral keycap and --btn-key-border are RETIRED (grep
for leftovers); a secondary can never be confused with a FilterChip or Tag. Shadow
calm-down on the primary keycap, token-level in the shadow/gloss key family: thinner
extrusion plate, smaller softer drop shadow, one upper-left light source, both themes.
ONE ui/Button component changes; amend CLAUDE.md section 5 and DESIGN.md section 7 in
the same commit; sweep every route: no button blends into its ground, no second 3D
button per view at rest.

## 2. Primary style, decided from evidence. STOP POINT

Build BOTH primary treatments: (a) the v5 calm keycap, hover gains a travelling border
light (share the Card conic trace implementation, do not copy it); (b) flat filled
iris primary, no elevation, same travelling light on hover. Both: focus-visible keeps
a real ring independent of the trace; reduced-motion renders a static accent border;
both themes. Screenshot the pair (rest, hover, focus) into
_review/after/primary-style/ and STOP for Elleta's pick before committing either. The
winner updates CLAUDE.md section 5 and DESIGN.md section 7 in the same commit; the
loser leaves no trace in the tree.

## 3. Work filters: one chip row, one job

The quick-pick chips under the search ARE the skill filter, in every view. The SKILL
row is deleted as a duplicate. The CASE row is deleted as redundant machinery (a
six-item library does not need a filter listing the items). TYPE (case study /
prototype) folds into the end of the same row, visually separated, or the sort area;
sort renders only where order means something (not in Map). ONE stable order in every
view: toolbar, chip row, contextual message, count, content; nothing jumps when the
view changes. Selecting any chip filters the content below in every view and the
count reports it honestly (n of 6, matching X). FilterChip presence rides the v5
sweep: chips clear their ground, selected state unmistakable, aria-pressed intact.

## 4. Fit explanation as ONE contextual message

The per-card footnotes (Matches on... / Why this match under each card in
FindYourFit) are deleted. ONE contextual block above the results (role-status
wording, aria-live polite): the summary sentence plus expandable why-rows. Verifiable
in under 10 seconds; explicit AI-enabled label when the AI leg produced the match.

## 5. Skills matrix truth + evidence layer (approved as Pass C task 8)

a. lib/workLibrary.ts: Accessibility joins drift, chip, guardian, code-first
   (clarity already has it). Drift lists it mid-array (structural claim); the other
   three append it as secondary.
b. Dead dots become doors: every matrix cell with a dot links to its case study,
   keyboard operable, descriptive accessible name (case plus skill). Same in Table
   view if it renders the same mapping.
c. Evidence layer, structure only: optional per case-and-skill evidence map in the
   data (one line each, TODO(elleta) placeholders). Where a line exists the cell
   exposes it on demand (existing disclosure pattern, keyboard, aria-expanded) with
   the case link; where empty the cell just links. NO AI labelling: deterministic
   data; the AI entry point stays find-your-fit, whose why-rows this matrix verifies.
d. Where a case gains a skill its prose cannot back, add a TODO(elleta) content slot
   in that case file.

## 6. About thesis blocks, the comparison she chose. STOP POINT

The stat-tile direction is live on main. Build the alternative she asked to see:
full specimen treatment, thesis bands on a fixed-dark navy ground (the dark-ground
token, same fixed-context pattern as the dark contact chrome), headlines in Unique
display scale through the Heading primitive, all-caps, accent words in case identity
colours (Drift thesis wears the Drift colour; no amber ever, reference yellow maps to
peri or a case hue), long lines via scale contrast (core word huge, rest a tier
down). Her copy verbatim, body Geist 16px minimum, tokens only, Unique 24px floor,
AA both themes. Screenshot live tiles AND the specimen version at 1440 and 390, both
themes, into _review/after/pass-d-theses/, and STOP for her pick. Loser leaves no
trace; winner recorded. EITHER winner speaks the Card interaction language: hover
gains the travelling border light (shared implementation), focus-visible ring,
reduced-motion static. Flat-and-dead tiles are not an option (Elleta, 18 Jul).

## 7. Music returns (approved as Pass D task 5)

Restore the About Outside-the-work moment, vinyl player plus Podcasts card, rebuilt
on the current system, not pasted from history:
a. Recover VinylPlayer from the rewritten history: 4859a8a is the last commit
   carrying it (re-derive if needed: git log --all -- components/VinylPlayer.tsx);
   git show 4859a8a:components/VinylPlayer.tsx. Fold in her periwinkle-center
   edit from _private/pre-lush-stash.patch (the exported stash; apply only the
   VinylPlayer hunks, the patch also carries unrelated SystemMap edits).
b. Conform both cards: ui/Card surfaces, tokens only, no amber or gold (vinyl center
   and label use peri or case hues), current eyebrow rule, copy swept for em dashes,
   16px minimum, both themes AA.
c. The Apple Music album id false-positives the pre-commit phone scan: add the id to
   ALLOWED_PHONE_DIGITS in .git/hooks/pre-commit before committing. If the hook
   cannot be modified from the session, STOP and hand Elleta the exact one-line edit;
   never use no-verify.
d. Keyboard and reduced-motion: play control reachable and labelled; spin honours
   prefers-reduced-motion.

## 8. MetricsStrip colour (decided by Elleta, 17 Jul night)

Extend the stat-tile colour direction to MetricsStrip: metrics gain case or accent
tints consistent with the thesis tiles (tokens only, AA both themes, no amber). The
old "About is not a case" note is amended deliberately in the same commit: the new
rule is that About elements may wear identity colour per the stat-tile direction.

## 9. Named employers in Experience (Elleta, 17 Jul night; case studies unchanged)

Employment history is public; case content stays abstracted. Encode the split:
a. Term scoping: split the banned list into _private/nda-terms.txt (internal
   terms, banned EVERYWHERE, unchanged) and _private/nda-employers.txt (employer
   and engagement org names; the file is seeded, gitignored, Elleta approved its
   two entries plus Mango on 17 Jul). The hook and audit:nda ban employer names
   everywhere EXCEPT components/ExperienceSection.tsx and
   components/ResumeModal.tsx. No other file is exempt, ever. Both lists stay
   gitignored; the scripts keep zero hardcoded terms; this brief names no names.
b. Restore real names in Experience and Resume entries per the employers file:
   the employer, the contract engagement, and Mango (already allowed).
   TODO(elleta) on exact entry wording; do not write her lines.
c. Logos in Experience only, per the existing public-org rule, now including the
   two orgs from the employers file. Update the upload list (mango.png still
   missing; the two org marks re-enter as fresh assets she provides; ASU and BFW
   re-exports stand).
   Case studies keep industry-not-client naming, recreated artifacts, disclosure
   lines. The library data, tags, and matrix stay name-free.
d. Amend CLAUDE.md section 7 deliberately with the scoped rule in the same commit.
e. This composes with the history scrub: old history is clean; the names re-enter
   only in new commits, only in the two allowed surfaces.

## 10. Card micro-heading presence (Elleta, 18 Jul)

The bold sub-heads inside collab/experience/disclosure cards (I push back
respectfully, etc.) sit too close to body text. Give card micro-headings one
deliberate tier in the shared card heading style: a size step or eyebrow-weight
treatment from the ramp, ONE change in the shared style, no per-card overrides.
Both themes, hierarchy verified against the page-tier heads above them.

## 11. Case template conformance, mechanical layer only (Elleta, 18 Jul)

The census: only chip and design-system-transformation live the decision-led
shape; brad-frost and guardian are essays with decisions appended; filters has
ZERO decision blocks; un-operational carries TWO summary blocks. Mechanical fixes
only in this pass: exactly one summary block per case (merge un-operational's
second into the first, verbatim); every case renders the same section order
(disclosure where present, summary, body, lessons, more-work row, CTA). Do NOT
restructure prose into decisions in this pass: the editorial reshaping of the four
essay cases happens with Elleta in Cowork (Travel Booking first, as the pattern),
then lands as content edits. Add a conformance note per case file stating its
current shape honestly.
Plus the live-review findings (Elleta + Cowork, 18 Jul, verified on production):
e. More-work-like-this renders 3 cards in a 2-col grid, orphaning the third
   (Guardian sits alone on brad-frost). Related cards render as one 3-col row
   at desktop, stacked on mobile.
f. Eyebrow vocabulary rule: a section eyebrow must not repeat a summary label
   (CONTEXT appears twice on brad-frost) and must not equal its own heading
   word (REFLECTION over Reflection). Change or drop the collider; record the
   rule in the template.
g. Canonical sidebar meta: one ordered field set for every case (ROLE, YEAR,
   TYPE or SCOPE, ORGANISATION, TOOLS where applicable); same labels, same
   order; omit empty rows rather than invent content.
h. Statement headlines: the case display headline is the case THESIS in its
   identity colour (CHIP is the reference); the case NAME stays in the sidebar
   and breadcrumb. Wording per case is Elleta-approved only (list lives in
   claude-progress.md when she signs it off); never invent statements.

## Close-out

Update claude-progress.md. Report per task: diff summary, gate output, honest
severities. Both STOP points wait for her; everything else runs without checkpoints.
