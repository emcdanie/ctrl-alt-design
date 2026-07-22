# Tasks: case-scroll-template

- [x] T0 Spec (this folder). STOPPED for Elleta: confirm the section mapping,
      the rail labels, the kicker drafts, and the BASE BRANCH decision
      (stacked on PR 41 vs merge-41-then-main). Nothing below runs before
      her go.

## Executed on her go (mapping approved, Context kicker "The setup",
## rail labels as drafted, stacked on PR 41)

- [x] T1 Rhythm tokens + beat module CSS (proto case-template): the four
      aliases, align-items:start, figure frame, keyline, outcomes tick card,
      case header with meta row; legacy centered-grid/space-* rules out.
- [x] T2 Generalize DesignSystemNav (sections/label props, default
      unchanged); case spine skin (dashed connector, filled dot, iris
      active); reduced-motion + <1024px collapse.
- [x] T3 components/CaseScrollTemplate.tsx (schema-driven sections);
      Code First data mapping per the confirmed table; specimens re-homed;
      session link to header meta only; supersessions recorded in DESIGN.md.
- [x] T4 Delete superseded beat scaffolding (CaseShellV2 head, Beat wrapper,
      dead cs2 CSS); orphan grep.
- [x] T5 docs/recipes/case-study-scroll-template.md; Storybook follow-up
      flagged.
- [x] T6 Assertions: --spacing-only sweep of the case shell; float-gone check;
      existing overlap/geometry/Z-pattern/leader laws re-verified.
- [x] T7 Verify: gate 13/13, tsc, axe, routes 200 both themes; before/after
      shots, scroll + keyboard webm, reduced-motion check. PR with preview.
      NO MERGE.
