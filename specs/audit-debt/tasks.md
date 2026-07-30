# tasks.md, audit-debt

Ordered by confidence, highest first, each independently revertible. The low-confidence
checks land last so they can be dropped without unpicking anything above them.

Nothing is built. Do not start until the six decisions in `requirements.md` §J are answered.

---

## 0. Decisions

- [ ] Get Elleta's ruling on all six items in `requirements.md` §J.
- [ ] Fold the answers into `design.md` before writing code.

## 1. Capture the fixtures first

A check written before its fixture gets written to pass, not to catch.

- [ ] Record the broken reference: `specs/bubble-recipe/design.md` to
      `_proto/bella-bubble-lab.html` (on `chore/clock-out-27jul`).
- [ ] Record the orphaned CSS left by deleting `DesignSystemSpecimens.tsx`
      (on `spec/system-page-redesign`): list the selectors, by name, before writing a
      detector.
- [ ] Record the gate-list divergence fixture by hand-editing a copy of `BellaSpine.tsx`
      to drop one audit row, so check 2 below has something to fail on.
- [ ] Measure and record the **gate wall clock before any change**. There is no "after"
      without a "before".

## 2. Broken internal references (HIGH, cheapest, ships first)

- [ ] `scripts/audit-debt.mjs`, first check: scan `docs/**.md`, `specs/**.md`, `CLAUDE.md`
      for repo-relative paths and assert each exists.
- [ ] Ignore URLs, globs and `<placeholder>` syntax.
- [ ] Prove RED against the bubble-lab reference. Paste the receipt.
- [ ] Prove GREEN on `main`.
- [ ] Commit alone. This check alone is worth shipping even if everything below is dropped.

## 3. Derived-list assertion (HIGH, catches a real fixture)

Not a generic duplication check. One specific assertion for one specific piece of debt.

- [ ] Assert the gate table's audit array agrees with `auditNames()` from
      `lib/bella/gate.ts`, in both directions.
- [ ] Failure names the audits missing from each side.
- [ ] Prove RED against the hand-edited fixture from task 1, GREEN on the real file.

## 4. Orphaned design tokens (MEDIUM-HIGH)

- [ ] Resolve alias chains transitively, including `color-mix()`.
- [ ] State the "consumed" definition in the script header: a `var()` reference in `app/` or
      `components/`; serialisation into `/api/bella.json` does not count.
- [ ] Report the token total as a derived number (467 today, 21 shadow tokens).
- [ ] Run against `main`. **Expect findings.** Triage each one: genuinely dead, or
      deliberately published for downstream consumers. The second category is the first real
      test of the allowlist.

## 5. The allowlist (must land before any check that needs it)

- [ ] `scripts/lib/debt-allowlist.json`. One entry per exception, each with a written reason
      and a date. Entries missing either fail the audit.
- [ ] The count prints on every run, pass or fail.
- [ ] **The cap: fail above 15 entries, and fail on any entry older than 180 days.**
- [ ] Add the CLAUDE.md §9 sentence distinguishing this from the banned per-element
      exemptions.

## 6. Dead selectors in the audit scripts (HIGH, but touches working code)

- [ ] Refactor `audit-visual.mjs`, `audit-type.mjs` and `contrast-check.mjs` to **export**
      their tracked selector lists instead of hard-coding them inline.
- [ ] Verify each audit produces **identical output** before and after the refactor. This
      task changes no assertion, only where the selectors live.
- [ ] Then assert: a tracked selector matching nothing anywhere in the sweep fails.
- [ ] Prove RED by temporarily tracking a selector that does not exist.

## 7. knip: unused files, exports and dependencies (HIGH for files and deps)

- [ ] Add `knip` as a devDependency.
- [ ] Write the config: declare `app/**/{page,layout,route}.tsx` as entry points; exclude
      `_proto/`, `_archive/`, `prototypes/`, `public/`.
- [ ] **Budget a full day for config.** Out of the box it will be loud, and it must not join
      the gate until it is quiet on `main`.
- [ ] Unused files and unused dependencies fail. Unused **exports** warn only, until proven
      quiet.

## 8. Orphaned CSS (MEDIUM, the flakiest, killable)

- [ ] Implement all three false-positive layers: stem matching, template-literal harvest,
      allowlist.
- [ ] Run against `main` and count false positives.
- [ ] **Decision point, binding.** Zero false positives with ten or fewer allowlist entries:
      ship it. Anything else: **drop the check**, record the reason in `design.md` §3.2, move
      on. Do not tune it into passing.

## 9. jscpd: duplicated blocks (LOW-MEDIUM, last, killable)

- [ ] Add `jscpd`. TS and TSX only, CSS excluded.
- [ ] `--min-lines 10 --min-tokens 70 --threshold 0`.
- [ ] Run against `main`, triage every hit.
- [ ] **State in the PR that it does not catch the `GATE_RECEIPTS` fixture**, and why
      (design.md §3.4). If it finds nothing else of value either, drop it rather than carry
      a dependency for a check that has never caught anything.

## 10. Unit tests

- [ ] Add `vitest`. No config beyond what the four functions need.
- [ ] `lib/bella/dtcg.test.ts` covering `relativeLuminance`, `contrastRatio`, `toHex`,
      `parseRgb` only.
- [ ] **Write the `color(srgb ...)` test FIRST and paste the RED run**, before touching
      `parseRgb`.
- [ ] Fix `parseRgb` to return `null` for colour spaces it cannot interpret.
- [ ] Update `ContractPipeline` to refuse rather than display a ratio when `parseRgb`
      returns `null`. A wrong number on that page is worse than no number.
- [ ] Add WCAG reference cases, ratio symmetry, and `toHex` padding and rounding.
- [ ] Wire `npm test` as the **first** step of the gate script.

## 11. Join the gate

- [ ] `package.json` gate script, `CLAUDE.md` §9, the System page `GATE` array, `gate.yml`.
- [ ] Confirm the gate reports **16**, derived, with no typed number anywhere.
- [ ] Remove the stale count from `gate.yml`'s step name.
- [ ] **Measure the wall clock after.** If audit:debt added more than 20 seconds, split per
      `requirements.md` §G and record which way it went.

## 12. Verify

- [ ] Full gate, all 16 green, `audit:nda` included.
- [ ] tsc, build, lint, 13 routes 200 both themes.
- [ ] Red-then-green evidence pasted for every shipped check.
- [ ] The kill decisions for checks 8 and 9 recorded either way.
- [ ] Allowlist count and contents reviewed, under the cap.

## 13. Ship

- [ ] PR with the template: what changed, local gate output, the wall-clock before and
      after, the red-then-green evidence, and the dropped-check decisions.
- [ ] Merge only on green. No direct push to main.
- [ ] Update `claude-progress.md`: what shipped, what was dropped and why, and what the next
      debt class worth catching would be.
