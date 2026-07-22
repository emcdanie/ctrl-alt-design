# Case study scroll-spine template (Code First first consumer)

Decision record: Elleta, 2026-07-22, via Cowork. Spec per §8; STOPPED after this
spec for her review of the mapping and rail labels. Nothing is built yet.

## Supersession, named (constitution §0)

This template SUPERSEDES the "Code First = five beats" beats-law (PR 41
amendments 2-3) for this case, deliberately and Elleta-approved. The five
narrative sentences survive as the section headlines; the flat beat sequence
becomes the scroll-spine (sticky rail + canonical steps). To be recorded in
DESIGN.md and claude-progress.md at build time and named in the PR.

## OPEN DECISION for Elleta (base branch)

The brief says branch off updated main, but every specimen this template
re-homes (DriftBeat, LayerJourney, GateRun, SystemTree, CaseSpecimen) exists
only on feat/case-curation-shell-v2 (PR 41, unmerged). This branch therefore
stacks on PR 41's head, PR to target PR 41's branch (the system2 precedent),
retarget to main when 41 merges. Alternative: merge PR 41 first, rebase this
onto main. Say which.

## Binding contracts

- _review/protos/case-template.html: the SPACING LAW. One --spacing-* rhythm:
  --rhythm-beat 64 (spacing-16), --rhythm-headtobody 32 (spacing-8),
  --rhythm-para 16 (spacing-4), --rhythm-col 48 (spacing-12); the beat body
  grid is align-items:start (the fix for the live floating-title bug in
  .cs2-screen__grid { align-items:center }). Beat module: 96px display number
  column + kicker + display h2; identical figure frames with bordered
  captions; the keyline recipe; the outcomes tick card; the next-case card;
  the case header with sub + meta row (read time · tags · ONE session link).
- _review/protos/case-layout.html: the FULL-PAGE structure. Five beats,
  alternating flip (Z-pattern holds), one deliberate pull quote, extras
  folded into their beat, the recorded-session link in the HEADER only (the
  mid-column YouTube link leaves beat 03; the poster may stay as a plain
  figure, no link).
- The scroll-spine reference (Justine): sticky vertical rail, dashed
  connector, the current step's dot fills on scroll; canonical steps
  Context · Problem · Key decisions · Challenges · Impact · Outcome & learnings.

## Proposed mapping (CONFIRM, not assumed)

| Rail step | Kicker (her proto drafts) | Headline (hers) | Content + specimen |
|---|---|---|---|
| Context | Setup /* TODO(elleta): kicker */ | (none; the header holds the thesis) | summary.approach + BACKGROUND ¶1 (both approved, currently unrendered); text-only section |
| Problem | The mismatch | "The button didn't match the code." | summary.context + keyline ("A year of quiet drift…" from her proto, verbatim fragment) + DriftBeat |
| Key decisions | The proof | "So I made the tokens testify." | decision-01 ¶1 + LayerJourney |
| Challenges | The rebuild | "Then I rebuilt what the system wanted." | decision-01 ¶2 + decision-02 ¶1 + SystemTree; the MCP poster as a captioned figure (link removed per the one-session-link law) |
| Impact | The gate | "Now the system checks itself." | Evidence ¶ + GateRun + the two agent-surface lines + the caption row |
| Outcome & learnings | The takeaway | "What the work walked away with." | reflection ¶s + the outcomes TICK CARD (proto recipe; rows from the approved outcome sentences) + "No invented numbers." + journey lines + personality keycap + next-case card + thanks |

Gaps marked TODO(elleta): the Context kicker; anything else her review adds.
Existing TODO slots carry over unchanged (BEAT_LINKS become between-section
links, NO_NUMBERS_DETAIL, PERSONALITY_LINE, JOURNEY_FAILURE_LINE).

## The build plan (on her go; Step 2 of the brief)

1. ONE implementation: components/CaseScrollTemplate.tsx driven by a schema
   `sections: {step, id, kicker, heading, flip?, content}[]`; canonical step
   set is the default, cases may rename/omit via props, the rail stays
   consistent. CaseShellV2's head is replaced by the proto case header;
   CodeFirstV2 becomes the Code First section data + composition; superseded
   beat scaffolding (Beat/cs2-beat CSS era) deleted; orphan grep before
   finishing.
2. The spine: GENERALIZE DesignSystemNav (optional sections/label props,
   default = the System page set, page 1 unaffected) — its sticky rail +
   IntersectionObserver scroll-spy + aria-current is the ONE spy
   implementation. Add the case skin: dashed connector, filled active dot,
   iris active affordance (rail IS navigation, §4-compliant), inactive
   --color-ink-muted; hash updates, back/forward safe, keyboard operable;
   reduced motion = instant jumps, no spine draw. <1024px: the existing
   collapse pattern (sticky pill row), no horizontal scroll.
3. Spacing: the four rhythm aliases in globals, used identically in every
   beat; align-items:start; legacy --space-*/centered-grid rules leave the
   case shell.
4. Recipe doc: docs/recipes/case-study-scroll-template.md (schema, rhythm
   tokens, rail behaviour, do/don't, dark-mode + a11y), the portfolio's
   recipe home. FLAG: a real Storybook story needs Storybook stood up here or
   the pattern ported to the bella Storybook; proposed as a follow-up, not
   scaffolded.
5. Gate: 13/13 + tsc + axe both themes + routes 200; assertions kept
   (Z-pattern via the flip alternation, leaders-in-front, Geist-in-cards,
   overlap + geometry laws, --spacing-only sweep of the case shell).

## Verify (from the brief)

Float gone (headline top-aligned beside its visual at every width); rail
advances on scroll and keyboard, hash + back/forward safe; one rhythm
(no --space-*, no px literals in the case shell); Z-pattern, leaders-in-front
and Geist-in-cards intact. Evidence: before/after shots both themes both
widths, a scroll + keyboard webm, a reduced-motion check, preview link.
