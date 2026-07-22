# Requirements: case scroll-spine template

R1. The scroll-spine template renders Code First: canonical rail steps
    (Context, Problem, Key decisions, Challenges, Impact, Outcome & learnings),
    her narrative headline inside each section, kickers from her proto drafts,
    Context kicker TODO(elleta).
R2. ONE implementation: the template replaces the CaseShellV2/CodeFirstV2 beat
    structure; superseded scaffolding deleted; no orphaned beat/shell code
    (grepped); the supersession recorded in DESIGN.md + claude-progress.md and
    named in the PR.
R3. The spine reuses the DesignSystemNav scroll-spy (generalized via props,
    System page byte-identical in behaviour); aria-current, keyboard, hash,
    back/forward safe; dashed connector + filled active dot; iris = active
    affordance, inactive ink-muted; reduced-motion instant; <1024px collapse,
    no horizontal scroll.
R4. Spacing law: only the four rhythm aliases (beat 64 / title-to-body 32 /
    para 16 / columns 48, all --spacing-*), align-items:start; asserted: no
    --space-* and no px literals in the case shell; the floating-title bug is
    gone at every width.
R5. The PR 41 specimens (DriftBeat, LayerJourney, GateRun, SystemTree) are
    re-homed unmodified in behaviour; leaders-in-front, overlap, geometry,
    Z-pattern (via proto flip alternation) and Geist-in-cards assertions stay
    green.
R6. One recorded-session link, header meta only; the mid-column YouTube link
    is removed; identical figure frames; one deliberate pull quote; extras
    folded into their beats.
R7. Reusable: sections driven by the data schema; canonical set default;
    rename/omit via props; recipe doc at
    docs/recipes/case-study-scroll-template.md; Storybook story flagged as a
    follow-up, not scaffolded.
R8. Gate 13/13 + tsc + axe both themes + all routes 200 both themes; evidence:
    before/after shots (1440/390 × themes), scroll + keyboard webm,
    reduced-motion check, preview link. Branch feat/case-scroll-template, PR,
    NO MERGE, hers.
