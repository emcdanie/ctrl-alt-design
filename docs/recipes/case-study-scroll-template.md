# Recipe: the case-study scroll-spine template

The portfolio's recipe home for the case layout (Elleta's decision record,
2026-07-22; contracts `_proto/case-template.html` + `_proto/case-layout.html` +
the scroll-spine reference). Code First is the first consumer; chip and drift
migrate in their own passes.

## What it is

One repeating beat module on one spacing rhythm, walked by a sticky spine
rail. Each beat: a display number, a mono kicker, HER narrative headline, and
a body where text sits BESIDE its visual, top-aligned. The rail carries the
canonical step set; the current step's dot fills as you scroll.

## The section schema

```tsx
import CaseScrollTemplate, { BeatBody, CANONICAL_STEPS, type CaseSection }
  from "@/components/CaseScrollTemplate";
import { FigureFrame, OutcomesCard } from "@/components/CaseTemplateBlocks";

const sections: CaseSection[] = [
  { step: "Problem",           // rail label; canonical set is the default vocabulary
    id: "case-problem",        // anchor id, hash-linkable
    kicker: "The mismatch",    // mono kicker, her voice
    heading: "The button didn't match the code.",  // her sentence; omit on setup sections
    body: <BeatBody txt={...} fig={<FigureFrame>...</FigureFrame>} /> },
];
<CaseScrollTemplate slug=".." eyebrow=".." title={thesis} sub={...}
  readingMinutes={n} tags={[...]} sessionLink={{label, href}} sections={sections}>
  {/* end sequence: next case, thanks */}
</CaseScrollTemplate>
```

A case may rename or omit steps via the `step` field, but the rail stays
consistent with what renders; `CANONICAL_STEPS` is the default vocabulary:
Context, Problem, Key decisions, Challenges, Impact, Outcome and learnings.

## The rhythm tokens (the ONLY vertical gaps)

- `--rhythm-beat` = `--spacing-16` (64): beat padding, all beats equal.
- `--rhythm-headtobody` = `--spacing-8` (32): title block to body.
- `--rhythm-para` = `--spacing-4` (16): paragraph to paragraph, kicker to title.
- `--rhythm-col` = `--spacing-12` (48): text column to visual column.

The beat body grid is `align-items: start`. Never center: a centered grid
floats the headline away from its body beside a tall figure (the bug this
template fixed). No `--space-*`, no px literals in the template.

## The rail

`DesignSystemNav` with `variant="case"` is the ONE scroll-spy (the System page
rail generalized): sticky at >=1024px, aria-current on the active step,
dashed connector, filled active dot, iris as the active affordance (the rail
IS navigation, so iris is correct per the colour rule; inactive labels are
ink-muted). Anchors are real links (keyboard for free); the hash follows the
active step via replaceState, so steps are linkable and back/forward safe.
Below 1024px the rail collapses to the sticky pill row; sections read top to
bottom; no horizontal scroll.

## Do / don't

- DO put every visual in the ONE `FigureFrame` (ui/Card + bordered caption).
- DO alternate `flip` on consecutive sided beats (the Z-pattern assertion
  checks it); full-width devices (`data-zbreak`) reset the run.
- DO keep the recorded-session link in the header meta, once; never a
  mid-column video embed.
- DO use one deliberate pull quote at most, folded into its beat.
- DON'T render Unique inside any card or panel (Geist in cards; Unique via
  ui/Heading on the ground: the h1 and the section headlines).
- DON'T hand-roll a second IntersectionObserver; the rail is the spy.
- DON'T invent copy: headlines and kickers are hers; gaps are TODO(elleta)
  slots that render nothing.

## Dark mode + accessibility

Every colour resolves from semantic tokens; both themes are first-class and
axe-swept in the gate. The rail is a nav landmark with aria-current;
reduced motion renders instantly (no smooth-scroll, no spine draw, specimen
end-states shown); reading text 16px minimum; metadata rows are the recorded
mono tier.

## Storybook

FLAG (follow-up, not scaffolded here): this repo has no Storybook. A real
story means standing Storybook up in this repo or porting the pattern into
the emcdanie/bella Storybook. Until then this recipe doc is the reference.
