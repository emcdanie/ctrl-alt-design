---
name: portfolio-spec
description: >
  Spec-driven workflow for any change to the elleta.design (ctrl-alt-design) repo. Use for every
  non-trivial portfolio task — a new case-study page, a component, a layout or copy change, a refactor.
  Generates design.md, requirements.md, and a checkoffable tasks.md, STOPS for Elleta's review, then
  executes the checked tasks and verifies against the gate. Do NOT vibe-code portfolio changes; write a
  spec first. Triggers: "new case study", "add/change a component", "spec this", "let's write a spec",
  "update the <page>", or any multi-step portfolio edit.
---

# portfolio-spec

Turn intent into three reviewable markdown files, get a green light, then execute. This is how work stays
on-rails and global. Obey `CLAUDE.md` (the constitution) throughout.

## When to use
Any portfolio task beyond a one-line fix. If it touches a page, a component, tokens, copy, or routing,
it gets a spec.

## Workflow (do not skip steps)

### 1. Gather intent
Read the request and any attached screenshot / Figma link / description. Read `CLAUDE.md`,
`docs/portfolio-conformance-spec.md`, `docs/portfolio-ia-spec.md`, and the relevant existing files.
If changing an existing page, follow the **baseline-before-change** rule in `docs/harness-and-baseline.md`
first: confirm the current implementation from the real components before proposing changes.

### 2. Generate the three specs into `specs/<slug>/`
Write all three, then **STOP and ask Elleta to review.** Do not execute yet.

`design.md`
- What we're building and why (the decision, the constraint, the intended outcome).
- Which existing components/routes/tokens it uses. Named. No new primitives unless justified here.
- Visual/interaction notes tied to the conformance spec (layout, type, controls, dark mode, lighting).
- This file is shareable — write it so someone else understands the intent.

`requirements.md`
- Concrete acceptance criteria as a checklist, each testable.
- Must include the standing gates: tokens-only (no hardcoded hex/px), 1240 container + spacing scale,
  Unique 700 display / Geist body, control taxonomy respected, one primary per view, dark mode on every
  surface, "AI-enabled" only, no em/en dashes, no amber, NDA-safe, one implementation (no orphans).

`tasks.md`
- A checkoffable, ordered task list `- [ ]` that implements the requirements.
- Last tasks are always: run `npm run gate`, tsc, all routes 200 (light+dark), NDA content-grep,
  grep for orphaned old copies, capture before/after screenshots (desktop + 390px) where visual.

### 3. Review gate
Present the three files. Wait for Elleta's explicit go. Incorporate edits into the specs before running.

### 4. Execute
Work the tasks top to bottom, checking each off as it lands. Edit the LIVE file; delete the old one.
Never leave old + new both rendering. If reality diverges from the spec, stop and update the spec, don't
improvise around it.

### 5. Verify and report
Run the full gate. Report: what changed (diff summary), gate results, before/after screenshots, and any
orphan you deleted. Not done until green.

## Rules of engagement
- Do not vibe-code. If asked to "just build it", still write the spec first, fast, and confirm.
- Do not invent components, colors, or copy. If the task seems to need one, justify it in `design.md`
  and flag it in the review, don't silently add it.
- One spec per unit of work. A new case study is one spec; a component is one spec.
- Keep finished specs in `specs/<slug>/` as the running record of why a thing was built.
