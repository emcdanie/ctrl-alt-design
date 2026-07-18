# Passes A to D: approved backlog execution

For a fresh Claude Code session at the repo root (ctrl-alt-design, branch redesign/lush).
This file is the whole instruction: the four passes approved from the 17 Jul full-site
review, with the three docs/briefs findings folded in and the deltas already resolved.
Constitution (CLAUDE.md) applies: smallest change, one implementation, tokens only.
Commit per pass, gate green between passes (npm run gate), push at the end. No new scope.

Loop-breaker before judging any change live: kill the dev server, rm -rf .next,
npm run dev, hard reload, DevTools cache off.

## Deltas (resolved against the three briefs, 18 Jul)

1. Quote cards: re-checked against portfolio-affordance-theme-fix.md task 3.
   TestimonialSection.tsx now conforms (Unique glyph via --font-hero-display at
   --font-subsection, --color-accent-peri at 0.35 opacity, aria-hidden, user-select
   none, figure/blockquote/figcaption, fonts allowlist entry). Dropped as a work item;
   the figcaption's muted-at-tag-size pair rides the Pass B contrast sweep.
2. Backlog item 10 (find-your-fit placement, form-button rule) is superseded and
   expanded by the Work toolbar direction in portfolio-full-review-brief.md: search
   LEFT, view switcher RIGHT, no hidden explore state. This replaces two smaller Pass B
   items (explore-chrome consolidation, invitation-line merge) with the toolbar rebuild
   (Pass B task 1). The form-button placement rule is settled in Pass B task 6.
3. New items folded from the brief: duplicate GET IN TOUCH on case pages (Pass B),
   the "More work like this" end-of-case row (Pass C), NDA disclosure lines for the two
   NDA cases (Pass C), the logo needs list (Pass C, blocked on her files).
4. Constitution impact: the toolbar rebuild contradicts CLAUDE.md section 1b ("the
   Cards view tab is gone", machinery behind ?explore). Her 17 Jul note supersedes it;
   amend 1b deliberately in the same commit, not silently.

## Pass A: compliance and truth

1. Reflow (WCAG 1.4.10): /skills, /design-system, and /quick overflow horizontally at
   390. Wide matrices, tables, and specimens scroll inside their own overflow-x auto
   container; the page body never scrolls horizontally. Verify every route at 390 after.
2. Code First case: replace the dead black autoplaying video frame with a poster image
   plus a text link to the video.
3. System page truth: the type specimen says "Geist 700, section titles" but the
   section tier is Unique 700; correct the specimen copy. The SegmentedControl specimen
   lists a dead TIMELINE view; show only real views. The System page never lies about
   the system.
4. One-implementation sweeps: cs-shell__tag renders through the Tag primitive;
   CaseStudyTypography.Eyebrow renders through the shared eyebrow treatment. Delete the
   orphaned copies, grep for leftovers.
5. Heading levels: fix the h2 to h4 jumps the review flagged. Sequential levels, one h1
   per page.

Commit. Gate green.

## Pass B: system polish

1. Work toolbar rebuild (supersedes the ?explore hybrid; amend CLAUDE.md 1b in this
   commit):
   - ONE toolbar row above the library. Find-your-fit search on the LEFT, always
     visible, placeholder like "search a skill, or tell me what you are hiring for",
     quick-pick skill chips beneath so the box is never empty (existing FilterChip
     taxonomy). The click-text-to-open trigger dies.
   - View switcher on the RIGHT: the existing SegmentedControl with Cards / Map /
     Table, Cards default, always visible. The ?explore state is retired; the view
     lives in the URL (view param, back/forward safe, defaults keep clean URLs).
   - Cards view is the existing curated composition (featured CHIP, ranked grid,
     Explorations). Filter rows render in Map and Table views only, dense variant;
     sort stays with the filters.
   - Secondary tabs for the curated sections: rejected. The toolbar already carries
     the view axis; a second tab row rebuilds the double chrome the review flagged.
     Curated sections keep plain section headers.
   - Find-your-fit backend unchanged (deterministic matcher, dormant AI leg); the
     AI-enabled label stays honest.
   - Button grammar v5 (Elleta, 17 Jul evening, supersedes the neutral secondary):
     purple means clickable at every tier. PRIMARY = filled iris keycap, the one 3D
     moment per view (FIND MY FIT is /work's primary; the mobile tray's Apply lives
     inside the open tray, a modal context, fine). SECONDARY = iris outline, iris
     text, NO fill, flat (no keycap elevation); periwinkle variant on dark and on
     fixed-dark chrome, AA both themes. TERTIARY = text link, iris and underlined
     per the affordance rule. The neutral keycap is RETIRED from the button
     taxonomy (grep for leftovers); a secondary can never be confused with a
     FilterChip or Tag again. Shadow calm-down on the primary keycap, token-level
     in the shadow/gloss key family: thinner extrusion plate, smaller softer drop
     shadow, one upper-left light source, both themes. This changes the ONE
     ui/Button component only; amend CLAUDE.md section 5 and DESIGN.md section 7
     deliberately in the same commit (three-tier wording), then sweep every route:
     no button may blend into its ground, no second 3D button per view at rest.
   - Primary style decision, from evidence (Elleta, 17 Jul late evening): build BOTH
     primary treatments and STOP for her pick before the final button commit:
     (a) the v5 keycap with the calm shadow, hover gains the travelling border
     light (the Card conic trace language, one implementation shared, not copied);
     (b) flat filled iris primary, no elevation, same travelling border light on
     hover. Both: focus-visible keeps a proper ring independent of the trace;
     reduced-motion renders a static accent border; both themes. Screenshot the
     pair side by side (rest, hover, focus) into _review/after/primary-style/ and
     wait for her choice. The chosen treatment updates CLAUDE.md section 5 and
     DESIGN.md section 7 in the same commit; the losing one leaves no trace in
     the tree.
   - SegmentedControl pixel pass (Elleta, 17 Jul evening): the selected segment's
     corner radius is not concentric with the container (inner radius = outer
     radius minus inset; with the current hairline inset the selected fill follows
     the container curve). Kill the seam where the selected edge meets the divider;
     selected fill sits flush, no vertical offset. Add a leading Iconoir icon per
     segment through the existing Icon wrapper (cards / map / table), aria-hidden,
     text labels stay, target size holds. Radius fix lands in the ONE
     SegmentedControl component and is verified everywhere it renders.
   - Filter coherence + contextual fit message (Elleta, 17 Jul evening, from the
     Table-view screenshot: a selected Design Tokens chip sat above a table showing
     6 of 6 pieces):
     a. ONE stable page order in every view: toolbar, then the one chip row, then
        contextual message, then count, then content. Nothing jumps position when
        the view changes.
     b. ONE chip row, one job (Elleta, 17 Jul late evening, supersedes separate
        filter rows): the quick-pick chips under the search ARE the skill filter,
        in every view. The SKILL row is deleted as a duplicate. The CASE row is
        deleted as redundant machinery (a six-item library does not need a filter
        that lists the items). TYPE (case study / prototype) folds into the end of
        the same row (visually separated) or the sort area; sort stays. Selecting
        any chip filters the content below in every view and the count reports it
        honestly (n of 6, matching X). FilterChip presence rides the button-grammar
        sweep: chips must clear their ground, selected state unmistakable at a
        glance, aria-pressed intact.
     c. The fit explanation becomes ONE contextual message block above the results
        (role-status wording, aria-live polite): summary sentence plus expandable
        why-rows in that block. The per-card footnote pattern (Matches on... / Why
        this match under each card) is deleted. Verifiability rules hold: scannable
        in under 10s, explicit AI-enabled label when the AI leg produced the match.
2. One contact action per case page: the case sidebar loses its button (sidebar is
   information, the closing banner is the ask). Record it as a template rule. Sweep
   every other route for the same duplicated-action pattern.
3. Target sizes: interactive targets meet the 44px house rule (footer links, meta
   links, applied-filter chips, the 17 to 23px offenders from the review).
4. Contrast: bump the recurring muted-ink pairs that sit AA-only toward AAA where the
   token change is global (ink-soft and muted on ground and card); fix the footer
   colophon 3.31 pair. Re-run audit:contrast; report AA and AAA per pair honestly.
5. Overlay menu: keep the inert guard, add the visibility belt-and-braces so
   closed-menu content can never paint or catch focus.
6. Contact form: validate on blur, not only on submit. Submit button left-aligned with
   the fields (NN/g single-column guidance, settled as the site rule); keep full-width
   on mobile. Record the placement rule in DESIGN.md.
7. FadeIn tuning: no section invisible in first paint; reduced-motion renders static.

Commit. Gate green.

## Pass C: content and assets

HARD STOP RULE: structure and wiring only. Leave clearly marked content slots
(TODO(elleta)). Never write case prose in her voice.

1. Case end sequence, all five cases, template-level: replace the text-only prev/next
   with a "More work like this" row of 2 or 3 case cards computed by skill overlap
   with the current case (the matrix data), excluding the current case, deterministic
   order, rendered with the ONE Card component. Then the single closing CTA banner.
2. NDA disclosure: add the upfront disclosure block to From Drift to Foundation and
   Operational Clarity using the pattern from her brief ("under strict NDA; specifics
   withheld; role, process, and decisions follow"). Mark TODO(elleta) to confirm
   wording. Both cases keep industry-not-client, recreated artifacts, illustrative
   data, no metrics.
3. Decision-led restructure of Code First and Guardian: reshape both into the
   template's decision blocks with clearly marked empty slots. Move existing verbatim
   paragraphs intact into the right blocks. Write nothing new.
4. Code First imagery: pull better assets from the local Brad Frost Web project
   folder (Elleta connects or points the session at it). Shareable and public
   material only; anything ambiguous gets listed for her, not used.
5. Finviz exploration: if the newer finviz-kpi-tree prototype is usable, swap the Lab
   card asset and link; otherwise list what is missing.
6. Logos: wire the logo slot for public orgs only (Brad Frost Web, Ironhack, ASU, VML,
   Mango as employer). Abstracted clients stay text-only forever. Output the exact
   file list she needs to upload; render text-only until the files exist.
7. Operational Clarity cover and CHIP pending slots stay marked, not filled.
8. Skills matrix truth + evidence layer (Elleta, 17 Jul evening):
   a. lib/workLibrary.ts: Accessibility joins the skills arrays of drift, chip,
      guardian, and code-first (clarity already carries it). Order encodes weight:
      drift lists it mid-array (the a11y work was structural there); the other three
      append it as secondary.
   b. Dead dots become doors: every matrix cell with a dot links to its case study,
      keyboard operable, descriptive accessible name (case plus skill). Same in the
      Table view if it renders the same mapping.
   c. Evidence layer, structure only: an optional per case-and-skill evidence map in
      the data (one line each, TODO(elleta) placeholders). Where a line exists the
      cell exposes it on demand (existing disclosure pattern, keyboard operable,
      aria-expanded) with the case link; where empty the cell just links. NO AI
      labelling here: this layer is deterministic data. The AI entry point stays
      find-your-fit, whose why-rows this matrix verifies (her AI-positive rules:
      the matrix IS the verification).
   d. Where a case gains a skill its prose cannot back yet, add a TODO(elleta)
      content slot in that case file so the dot is backed, not decorative.

Commit. Gate green.

## Pass D: expression and wow

1. System page composition: kill the left-hugging spec-sheet layout. Full-width
   specimen bands, an oversized type specimen (Unique at display scale with the
   accent-word treatment), a case-colour band naming the five identities, one
   signature 3D moment from the keycap-and-orb world. It should feel like an
   AI-enabled design system built it: alive, precise, a bit show-off.
2. About visual thesis (amended by Elleta, 17 Jul evening: specimen-energy reference
   supersedes the stat-tile direction; decide from evidence). Build BOTH directions as
   quick implementations, then STOP for her pick before committing either:
   a. Full specimen treatment: thesis bands on a fixed-dark navy ground (the existing
      dark-ground token, same fixed-context pattern as the dark contact chrome).
      Headlines in Unique display scale through the Heading primitive, all-caps,
      accent words in colour mapped to case identities (the Drift thesis wears the
      Drift case colour; no amber ever, the reference yellow maps to peri or a case
      hue). Long lines use scale contrast: the core word huge, the rest a tier down.
   b. Unique headlines with coloured accent words on the current warm ground, no
      bands. Lighter touch, same headline system.
   Both: her thesis copy verbatim, body Geist 16px minimum, tokens only, Unique 24px
   floor via the primitive, AA both themes. Screenshot both at 1440 and 390, light
   and dark, into _review/after/pass-d-theses/, present the pair, and WAIT for her
   choice before committing. More colour through the mid-page follows the chosen
   direction. No new copy.
3. Timid spots: About mid-page and /quick each get one deliberate Unique-energy moment
   (scale, colour blocking) without breaking the calm-card rule.
4. Work page: verify the Pass B toolbar resolved the hectic reading; tune spacing and
   rhythm only.
5. Music returns (Elleta, 17 Jul evening): restore the About "Outside the work"
   Learning and Inspiration moment, vinyl player plus the Podcasts card, rebuilt on
   the current system, not pasted from history:
   a. Recover VinylPlayer from commit 518e3db (git show 518e3db:components/VinylPlayer.tsx)
      and fold in her stashed edits (stash@{0}: the gold center becomes periwinkle;
      apply the change, do NOT pop the stash, it also carries unrelated SystemMap edits).
   b. Conform both cards: ui/Card surfaces, tokens only, no amber or gold anywhere
      (vinyl center and label use peri or case hues), eyebrow per the current rule,
      copy swept for em dashes, min 16px body, both themes AA.
   c. The Apple Music album id false-positives the pre-commit phone scan: add the id
      to ALLOWED_PHONE_DIGITS in .git/hooks/pre-commit before committing. If the hook
      cannot be modified from the session, stop and hand Elleta the exact one-line
      edit rather than using no-verify.
   d. Keyboard and reduced-motion: play control reachable and labelled; any spin
      animation honours prefers-reduced-motion.

Commit. Gate green. Push.

## Needs Elleta (carry forward, do not block)

- CHIP: 4 personal lines, Loom URL, read-aloud pass.
- Logo files (exact list produced by Pass C task 6).
- NDA wording check on both agreements (time limits); sweep of publicly released
  client materials that could unlock legitimate imagery.
- ANTHROPIC_API_KEY plus spend cap in Vercel for find-your-fit.
- Tag-family colour taxonomy approval; SKILL_TRIGGERS sanity read; Operational
  Clarity cover art; summary-bucket choices on the two migrated cases.

## Close-out

Update claude-progress.md (local only, never committed). Report per pass: diff summary,
gate output, any new files with a one-line why, honest severities on anything left.
