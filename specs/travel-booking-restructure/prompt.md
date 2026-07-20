# Terminal prompt: Travel Booking restructure + approved headlines + site metadata

Paste everything below this line into terminal Claude Code in the repo root.

---

Execute the following approved content changes. All decisions are already made (Elleta, 18 Jul headlines; 20 Jul mapping and metadata, via Cowork). Do not re-open them, do not invent copy, do not ask checkpoints. Surface a conflict only if something below contradicts CLAUDE.md.

Read first: `CLAUDE.md`, `claude-progress.md`, `docs/briefs/portfolio-pass-e-reconciliation.md` (task 11 carries the template mechanics these changes rely on).

Standing rules for everything below: prose moves VERBATIM, never paraphrased. No em or en dashes anywhere. NDA abstraction stays (industry, not client). Disclosure lines stay on the two NDA cases. One implementation: edit live components/content, delete what they replace, grep for orphans.

## Task 1. Site metadata (approved 20 Jul)

- Metadata title: `Elleta McDaniel, AI-Enabled Design Systems Designer`
- Metadata description: `AI-enabled design systems and complex platforms. Token-first foundations, agent-ready governance, and systems that ship.`
- Apply to the Next.js metadata export AND OpenGraph/Twitter fields so link previews match. The phrase "AI-enabled" must reference the existing positioning constant (CLAUDE.md §6), not a new string literal. If any page-level metadata overrides the root title template, keep those page titles consistent with the new suffix.

## Task 2. Statement headlines, all five cases (approved 18 Jul, verbatim)

Template rule: the case display headline is the case THESIS, set in Unique at hero scale through the Heading primitive, in the case identity colour. The case NAME moves to sidebar and breadcrumb only. A pull quote promoted to the headline must NOT also remain as a pull quote or duplicate title on the same page; keep the headline, delete the duplicate.

Verify each slug-to-case mapping from the file's title field before editing. Expected mapping:

| Case | File | Approved headline |
|---|---|---|
| Code First | `content/case-studies/brad-frost.ts` | WORKING CODE-FIRST CHANGES WHAT YOU PAY ATTENTION TO. |
| Guardian | `content/case-studies/guardian.ts` | GOVERNANCE WAS ARRIVING TOO LATE, AT THE HIGHEST POSSIBLE COST. |
| Travel Booking | `content/case-studies/filters-decision-support-system.ts` | CAPABILITY WITHOUT CLARITY IS JUST A DIFFERENT KIND OF FRICTION. |
| From Drift to Foundation | `content/case-studies/design-system-transformation.ts` | THE SYSTEM IS THE SET OF AGREEMENTS, NOT THE COMPONENT LIBRARY. |
| Operational Clarity | `content/case-studies/un-operational-dashboard.ts` | SIX OPERATIONAL DOMAINS. ONE INTERFACE. EIGHT WEEKS. |

CHIP keeps its existing headline. `design-lab.ts` untouched.

For Travel Booking this means the `problem.title` string and the pull quote in the "Capability Without Clarity" section both currently carry the headline phrase; after promotion, delete the pull quote block and make sure the phrase renders exactly once as the display headline (check every render path for the remaining `problem.title` usage).

## Task 3. Travel Booking full restructure (mapping approved 20 Jul)

File: `content/case-studies/filters-decision-support-system.ts`. Convert from essay to decision-led using CHIP (`chip.ts`) as the structural reference. Every paragraph moves verbatim; sections whose paragraphs move are deleted (no empty shells, no duplicates). Remove the `TODO(elleta): decision blocks` comment once done.

New block order:

1. `summary` block: unchanged.
2. Intro section (INTRODUCTION / "The Problem Wasn't the Boxes" heading stays as authored: "The Problem Wasn't the Controls"): its two existing paragraphs, plus the single paragraph from CONTEXT / "A Platform That Outgrew Its Patterns" appended verbatim as a third paragraph. Delete the CONTEXT section shell.
3. THE DECISION PROBLEM section: keeps its two paragraphs; the pull quote is deleted per Task 2.
4. Existing embed `filters-before.html` stays immediately after (problem visual inside the first two scrolls).
5. Decision 01, index "01", title: `Search and filtering as one flow`. Why: `The user stays in one mental model throughout: expressing intent, seeing interpretation, refining constraints, evaluating options.` (her sentence, verbatim from the case). Children: both paragraphs from SEARCH AS THE ENTRY POINT, then both paragraphs from PROGRESSIVE REFINEMENT, all verbatim. Evidence: the search prototype demoStep (`/demos/travel-search.html`).
6. Decision 02, index "02", title: `Policy as a visible dimension`. Why: `Treating policy not as a blocker that appears at checkout but as a visible dimension of every result.` (her fragment, verbatim). Children: both paragraphs from FACETED FILTERING, then the bolded "Policy as a visible dimension" paragraph from WHAT THE PROTOTYPE DEMONSTRATES, verbatim. Evidence: the existing `filters-after.html` embed moves here.
7. Decision 03, index "03", title: `Making it safe to experiment`. Why: `The cost of reversing any decision is visibly low.` (her fragment, verbatim). Children: both paragraphs from VISIBLE FILTER STATE, then both paragraphs from REVERSIBLE EXPLORATION, verbatim. Evidence: the filter demoStep (`/demos/travel-filter-demo.html`).
8. PROTOTYPE JOURNEY section: kept intact (intro paragraph, three demoSteps, the `ctrl-travel-v2` prototype embed), with the "Progressive booking" paragraph from WHAT THE PROTOTYPE DEMONSTRATES appended verbatim. Delete the WHAT THE PROTOTYPE DEMONSTRATES shell once both its paragraphs are rehomed. If a demoStep now duplicates evidence placed in a decision block, the decision placement wins; drop the duplicate demoStep, never render the same demo twice.
9. `lessons` block: unchanged.
10. REFLECTION section ("What I Would Do Next"): unchanged, stays last.

If the decision block type's shape (fields, evidence kinds) differs from what CHIP uses, follow the actual type in `lib/content` and the Pass E task 11 mechanics; do not invent new block kinds.

Eyebrow rule while restructuring: no section eyebrow may repeat a summary label or its own heading.

## Verification (all required before done)

1. `npm run gate` green (all 9 audits), tsc clean.
2. All routes 200, light and dark.
3. NDA content grep across the whole tree.
4. Grep for orphans: no old section shells, no duplicated paragraphs, the headline phrase appears exactly once on the Travel Booking page.
5. Before/after screenshots of `/case-studies/filters-decision-support-system` (top of page and full scroll), light and dark, plus one screenshot of the home page metadata check (view-source title/description or the OG tags).
6. Update `claude-progress.md`: what changed, how verified, next best action (next sitting: Code First restructure, Cowork mapping first).
7. Commit with a descriptive message. Do not commit `components/VinylPlayer.tsx` (known pre-commit false positive).
8. Report a diff summary.
