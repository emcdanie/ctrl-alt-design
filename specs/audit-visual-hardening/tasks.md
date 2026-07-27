# tasks.md, audit-visual-hardening

Ordered smallest first and by confidence: shadow and equal-height lead, dead-space last so
it can be dropped without unpicking anything. Nothing is built. Do not start until the six
decisions in `requirements.md` §K are answered.

**Blocked on:** the redesign PR. Its fixed page is the passing fixture. Tasks 1 and 2 can
run now; task 3 onward needs the redesign merged.

---

## 0. Decisions

- [ ] Get Elleta's ruling on all six items in `requirements.md` §K.
- [ ] Fold the answers into `design.md` before writing code.

## 1. Capture the fixtures, before writing any check

Do this first. A check written before its fixture gets written to pass, not to catch.

- [ ] `git worktree` or a scratch checkout of the pre-fix commit from this session.
- [ ] Capture `scripts/fixtures/render/overglow-key.html`: the DESIGN button with its bespoke
      3-layer bloom, the real token stylesheet linked, nothing else.
- [ ] Capture `ragged-swatches.html`: the colour cards mid-token wrapping, with the row
      height mismatch that produced.
- [ ] Capture `dead-space-card.html`: the manifest card with the empty region below its
      content.
- [ ] Each fixture opens standalone in a browser and visibly shows the defect. If it does
      not, it is not a fixture, it is a guess.
- [ ] `audit:nda` over the fixtures.

## 2. Extract the shared harness (no behaviour change)

- [ ] Create `scripts/lib/browser.mjs`: launch, themed context, `networkidle` goto, the
      scroll sweep, viewport helper.
- [ ] Port `audit-visual.mjs`, `audit-axe.mjs`, `audit-type.mjs` onto it.
- [ ] Run the full gate. All fifteen must be **identically** green: this task changes no
      assertion, only where the boilerplate lives.
- [ ] Commit alone, so a regression here is bisectable away from any new check.

## 3. Check 1, single elevation shadow (HIGH confidence, ship first)

- [ ] Build the allowed set by resolving `--shadow-*` at runtime on a detached probe.
- [ ] Assert exact computed-string equality, or `none`, over the §4.1 scope, both themes.
- [ ] Prove RED against `overglow-key.html`. Paste the receipt.
- [ ] Prove GREEN on the fixed page.
- [ ] Explicitly verify the four multi-layer tokens pass, so the briefed layer-count reading
      is disproved in evidence rather than in argument.

## 4. Check 2, equal-height siblings (HIGH confidence, extension not addition)

- [ ] Extend the **existing** assertion in `audit-visual.mjs`. Do not write a new one.
- [ ] Add `.ds-pipeline` and `.ds-swatches`; remove `.ds-gate` now it is a table.
- [ ] Add the dead-selector guard: a tracked selector matching nothing anywhere fails.
- [ ] Document the 0px tolerance in the comment as a decision.
- [ ] Prove RED against `ragged-swatches.html`, GREEN on the fixed page.

## 5. Check 3, grid alignment (MEDIUM confidence)

- [ ] Read the step from `--spacing-1` at runtime.
- [ ] Implement `+/- 0.5px` against the half-pixel rounding, DPR 1.
- [ ] Apply to the opt-in container list only, with the text-node exclusion commented.
- [ ] Sweep both themes on the fixed page and confirm zero false positives.
- [ ] If it reds on honest layout, **narrow the scope list rather than widening the
      tolerance.** Widening tolerance is how a check becomes decorative.

## 6. Check 5 part one, the markup dependency

- [ ] Add `data-for` to the fallback `<line>` in `TokenAnnotation.tsx:253`, matching the
      anchored path's attribute.
- [ ] Behaviour-free change: full gate stays green, nothing renders differently.
- [ ] If Elleta declined this in §K, skip to task 7 and cover anchored leaders only.

## 7. Check 5 part two, leader landing (MEDIUM confidence)

- [ ] Endpoint from `getPointAtLength(getTotalLength())`, target from `data-for` to
      `[data-part]`.
- [ ] Assert the endpoint sits within the target's border box, 2px tolerance.
- [ ] Both themes, 1440, `/design-system`.
- [ ] Name any uncovered leader mode in the audit's header comment.

## 8. Check 4, stranded dead-space (LOW confidence, last, killable)

- [ ] Prototype the tallest-in-row qualifier against `dead-space-card.html`.
- [ ] Read the 48px bound from `--spacing-12`.
- [ ] Run against the fixed page and count false positives.
- [ ] **Decision point, binding.** Catches the fixture with zero false positives: ship it.
      Anything else: **drop it**, record the reason in `design.md` §4.4, and move on. Do not
      tune it into passing.

## 9. Join the gate

- [ ] Add to `package.json` `gate`, `CLAUDE.md` §9, the `GATE` array, `gate.yml`.
- [ ] Confirm the gate now reports **16**, derived, with no typed number anywhere.
- [ ] Fix `gate.yml`'s step name, which still says "ten audits".
- [ ] Measure gate wall-clock before and after; record both.

## 10. Verify

- [ ] Wipe `.next`, prod build, serve, confirm the server's working directory.
- [ ] Full gate, all 16 green, `audit:nda` included.
- [ ] tsc, build, lint, 13 routes 200 both themes.
- [ ] Capture every artifact in `requirements.md` §J.

## 11. Ship

- [ ] PR with the template: what changed, local gate output, the red-then-green evidence per
      check, the check 4 decision, and the wall-clock numbers.
- [ ] Merge only on green. No direct push to main.
- [ ] Update `claude-progress.md`: what shipped, which checks were dropped and why, what the
      next defect class to harden would be.
