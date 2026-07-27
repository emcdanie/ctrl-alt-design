# requirements.md, audit-visual-hardening

Acceptance criteria. Each line is testable. Nothing is built yet.

---

## A. The two rules that govern everything else

- [ ] **Zero false positives on green main.** With the redesign merged and the tree
      otherwise untouched, the new audit exits 0. Proven by running it, not by reasoning
      about it, and the run is pasted in the PR.
- [ ] **Every shipped check has been seen red.** No check merges without a captured fixture
      that it fails on, and the red output is pasted in the PR beside the green one.
- [ ] Any check that cannot satisfy both is **dropped, not softened**. A check tuned until it
      stops complaining is worse than no check: it teaches the team to rerun the gate.
- [ ] Dropping a check is recorded in `design.md` with the reason, so the next person does
      not re-propose it blind.

## B. Harness and structure

- [ ] No second browser runner exists. The launch, theme, scroll and receipt boilerplate
      lives in one shared module (`scripts/lib/browser.mjs` per design.md §3).
- [ ] `audit-visual.mjs`, `audit-axe.mjs`, `audit-type.mjs` and the new audit all import that
      shared module. Net duplication goes **down**, not up.
- [ ] Every failure prints through `scripts/lib/receipt.mjs`. No bespoke error format.
- [ ] Every failure names a **selector plus a text fragment**. A receipt that says "a card"
      fails review.
- [ ] Both themes are swept for every check.
- [ ] The audit exits non-zero on any failure and prints a one-line summary on success,
      matching the other fourteen.

## C. Check 1, single elevation shadow

- [ ] The allowed set is built by **resolving `--shadow-*` tokens at runtime** in the page
      being audited, never by a hardcoded list of shadow strings.
- [ ] Comparison is exact computed-string equality. No tolerance, no parsing, no blur
      heuristic.
- [ ] `none` passes.
- [ ] A legitimate multi-layer token (`--shadow-soft`, `--shadow-layered`,
      `--shadow-card-default`, `--shadow-key-resting`) passes. Verified explicitly, because
      the briefed "at most one shadow" wording would have failed all four.
- [ ] Fails on `scripts/fixtures/render/overglow-key.html`.
- [ ] Passes on the fixed DESIGN button after the redesign.

## D. Check 2, equal-height siblings

- [ ] **No second implementation.** The existing assertion in `audit-visual.mjs` is extended,
      not copied. A reviewer can point at one place where row equality is decided.
- [ ] Tolerance is documented as **0px on rounded heights**, and that zero is written down as
      a decision rather than left implicit.
- [ ] `.ds-pipeline` and `.ds-swatches` are tracked.
- [ ] `.ds-gate` is removed from the tracked list once the redesign makes it a table.
- [ ] **A tracked selector that matches nothing anywhere in the sweep fails the audit.** A
      dead selector must never rot silently.
- [ ] Fails on `scripts/fixtures/render/ragged-swatches.html`.

## E. Check 3, grid alignment

- [ ] The 4px step is read from `--spacing-1` at runtime, never typed.
- [ ] Tolerance is `+/- 0.5px`, documented with its reason (sub-pixel `1fr` division).
- [ ] Scope is an explicit opt-in selector list of **container** edges only.
- [ ] Text nodes, inline elements, and anything sized by a line box are excluded, with the
      reason in a comment.
- [ ] Zero false positives across both themes on the fixed page.
- [ ] Every later addition to the scope list carries a one-line reason beside it.

## F. Check 4, stranded dead-space

- [ ] The threshold is read from `--spacing-12` at runtime, never typed.
- [ ] A card is only flagged when it is the **tallest in its row**, so equal-height stretch
      is never mistaken for a defect.
- [ ] A card with no grid row to compare against is skipped, and the audit says so in its
      header comment rather than pretending coverage.
- [ ] Fails on `scripts/fixtures/render/dead-space-card.html`.
- [ ] **Kill criterion, binding:** if the prototype cannot fail the fixture without also
      flagging a legitimate card on the fixed page, this check does not ship. Record the
      outcome either way.

## G. Check 5, leader-line landing

- [ ] Tolerance is `2px`, documented against the 1.5px stroke width.
- [ ] The endpoint is taken from `getPointAtLength(getTotalLength())`, reusing the existing
      technique rather than adding geometry machinery.
- [ ] Anchored leaders (`path[data-for]` to `[data-part]`) are asserted.
- [ ] Fallback-mode `<line>` leaders either carry `data-for` and are asserted, or are
      **named as uncovered in the audit's header comment**. Silence is not acceptable.
- [ ] If `TokenAnnotation.tsx` is changed to add the attribute, the change is behaviour-free
      and the full gate stays green.

## H. Joining the gate

- [ ] The audit is added to `scripts/`, to the `gate` script in `package.json`, to the
      Constitution audit list in `CLAUDE.md` §9, to the `GATE` array rendered by the System
      page, and to `.github/workflows/gate.yml`.
- [ ] The gate now runs **16** audits.
- [ ] **No surface anywhere states the number 16 as a literal.** Every count comes from
      `lib/bella/gate.ts`. If any surface still reads fifteen after this lands, that is a bug
      in the derivation and it blocks this PR.
- [ ] The `gate.yml` step name does not carry a typed count either (it currently says "ten
      audits", which is already wrong by five).
- [ ] Gate wall-clock cost is measured before and after and recorded in the PR, so the price
      of the extra browser launch is a known number rather than a surprise.

## I. The standing gate

- [ ] All 16 audits green.
- [ ] `npx tsc --noEmit` clean.
- [ ] `npm run build` clean.
- [ ] `npm run lint` introduces no new errors beyond the 7 pre-existing React Compiler ones.
- [ ] All 13 routes 200 in light and dark.
- [ ] `audit:nda` clean across the whole tree, fixtures included.
- [ ] Branch flow honoured: PR with local gate output, merge only on green, no direct push
      to main.

## J. Evidence required in the PR

- [ ] Green run of the new audit on the fixed page, both themes.
- [ ] Red run of each check against its fixture, output pasted.
- [ ] The kill decision for check 4, whichever way it went.
- [ ] Gate wall-clock before and after.
- [ ] Confirmation that the System page, the maturity rationale and the status card all read
      sixteen without any typed number.

## K. Decisions needed before build

- [ ] **§3** New `audit:render` with a shared harness (gate goes to 16, costs one more
      browser launch), or fold into `audit:visual` (gate stays 15, no new entry). The brief
      implies the first; the second is cheaper.
- [ ] **§2.1** Confirm check 2 is a scope extension, not a new check.
- [ ] **§2.2** Confirm token-equality replaces "at most one box-shadow".
- [ ] **§4.5** Approve the one-line `data-for` addition to `TokenAnnotation.tsx`, or accept
      that fallback leaders stay uncovered in v1.
- [ ] **§4.3** Approve the initial opt-in selector list for grid alignment.
- [ ] **§7.6** Confirm `/design-system`-only scope for v1, accepting that the same defect
      class ships unchecked elsewhere.
