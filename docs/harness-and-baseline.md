# Harness & baseline — how to change elleta.design without breaking it

Adapted from Roxanne G's harness workflow (Kiro) to a solo Next.js repo + Claude Code. The point is the
*discipline*, not the tool: rebuild from what really exists before you change it, so the agent can't veer
off and invent a fresh interpretation each time. This is the fix for "changes never go global" and
"it duplicated the code in extra divs so a global change doesn't take".

## The core rule: baseline before change
Before altering ANY existing page or component:
1. **Read the real thing.** Open the actual component/route and its data source (`lib/content.ts`,
   `lib/workLibrary.ts`, the shell). Note exactly which components and tokens it uses.
2. **Establish the baseline.** State (or reproduce) the current rendered output from those real components.
   For a visual change, screenshot the current page (light + dark, desktop + 390px) as the "before".
3. **Only then change.** Apply the smallest edit on top of the baseline. Do not regenerate the page from
   scratch. You are editing the production truth, not a new guess.
4. **Prove parity.** Diff before/after; confirm nothing else moved. Run the gate.

This mirrors Roxanne's "rebuild the page from production first, wire to real components, then add the
ticket work on top." Here, "production" = the live `redesign/lush` codebase and its real components.

## Why a single render path makes this possible
The consolidation already gives you the baseline anchor: **one render path** (all cases through
`[slug]` + `CaseStudyShell`), **one container**, **one tag/button system**. Because there's one true
implementation, "rebuild from the real thing" is unambiguous. Protect that: the moment a second copy of a
page/component exists, the baseline rule breaks. The gate's `audit:structure` is what keeps it single.

## Where a portfolio Storybook fits
Optional, but it upgrades the harness from "read the code" to "consume real components":
- Build a Storybook for the site's component library (Button/keycap, FilterChip, SegmentedControl, Tag,
  CaseStudyShell blocks, the bubble). Each component's stories become the canonical, inspectable truth.
- Then any harness/spec work *consumes* those stories instead of the agent re-deriving markup. This is
  Roxanne's "Storybook MCP as a Code-Connect substitute" move: the agent sees the real components and
  reuses them rather than guessing.
- Bonus: Storybook gives you per-component accessibility checks and a place to test states in isolation —
  useful evidence for the portfolio itself ("here's my component library, tested").
- Scope honestly: this is a real build. Do it only if you'll maintain it; a stale Storybook is worse than
  none. If you build it, add it to the workspace so the harness reads from it.

## Where the Figma CLI fits
- **Token cost:** the Figma CLI is the token-free path Syl demoed — it doesn't re-pull the whole file
  through the MCP on every call, which is what blows out context and burns tokens. Install it and use it
  in place of the Figma Desktop MCP for repeated work on one file.
- **Big-file workaround (until the CLI is in):** when the MCP returns design context, stop, copy that
  context into a text file at repo root, and tell the agent to read the text file instead of re-running
  the MCP. Prevents the context blowout.
- **Reverse build (code → Figma):** point the CLI at a Storybook page or your code and have it build the
  Figma file. Useful for generating a Figma prototype for user testing without hand-connecting frames —
  do it on a branch first. This is the "make prototypes without Maze frame-wiring" idea.
- **components-as-data (later):** Nathan Curtis's Specs plugin (formerly Eight Shapes Specs) can export a
  component's anatomy + properties as JSON — a possible alternative to pulling structure via MCP. Note it
  omits layout/spacing today.

## The loop, end to end
1. Constitution (`CLAUDE.md`) sets the rules.
2. `portfolio-spec` skill turns intent into design/requirements/tasks, you review, then it executes.
3. This harness rule forces every change to start from the real baseline, not a fresh guess.
4. The gate proves it landed globally and broke nothing.
5. Figma CLI / Storybook feed the harness real design + component truth without token waste.
