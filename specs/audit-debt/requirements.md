# requirements.md, audit-debt

Acceptance criteria. Each line is testable. Nothing is built yet.

---

## A. The two rules that govern everything else

- [ ] **Zero false positives on `main`.** With the tree otherwise untouched, `audit:debt`
      exits 0. Proven by running it, and the run is pasted in the PR. Not reasoned about.
- [ ] **Every shipped check has been seen red** against a captured fixture, and both the red
      and the green output are pasted in the PR.
- [ ] A check that cannot satisfy both is **dropped, not softened**. A check tuned until it
      stops complaining teaches people to rerun the gate, which poisons the other fifteen.
- [ ] Any dropped check is recorded in `design.md` with the reason, so it is not
      re-proposed blind.

## B. Fixtures it must catch

Fixtures live on `spec/system-page-redesign` and `chore/clock-out-27jul`, not on `main`.

- [ ] **Broken reference:** `specs/bubble-recipe/design.md` cites
      `_proto/bella-bubble-lab.html`, which does not exist. Check 3.6 must fail on it.
- [ ] **Orphaned CSS:** selectors in `globals.css` left behind by the deletion of
      `DesignSystemSpecimens.tsx`. Check 3.2 must name at least one real one.
- [ ] **Hand-maintained list:** the gate table's audit array in `BellaSpine.tsx` while
      `auditNames()` derives the truth from `package.json`. **This needs its own assertion**
      (the two lists must agree), not a generic duplication check.
- [ ] **`GATE_RECEIPTS` / `RECEIPT_LABELS` re-declared:** **explicitly NOT claimed.**
      design.md §3.4 shows no copy-paste detector can catch it, because after the deleting
      commit only one copy exists. Do not write a check that pretends to.

## C. No magic numbers

- [ ] Every threshold is documented with its reason at the point of use:
      jscpd `--min-lines 10`, `--min-tokens 70`, `--threshold 0`; the allowlist cap;
      the exemption staleness window.
- [ ] Counts the audit reports (tokens, selectors, components) are **derived at runtime**,
      never typed. Today's real values are 467 tokens, 21 of them shadow tokens, 408 class
      selectors, 60 component files. If any of those appear as literals, that is a bug.

## D. Per check

- [ ] **3.1 knip:** config committed; `app/**/{page,layout,route}.tsx` declared as entry
      points; `_proto/`, `_archive/`, `prototypes/`, `public/` excluded. Unused *exports*
      start as warnings and only fail once proven quiet on `main`.
- [ ] **3.2 orphaned CSS:** all three false-positive layers implemented (stem matching,
      template-literal harvest, allowlist). **Kill criterion: if reaching zero false
      positives on `main` needs more than ten allowlist entries, the check does not ship.**
- [ ] **3.3 orphaned tokens:** alias chains resolved transitively, including `color-mix()`.
      "Consumed" is defined as referenced by a `var()` in `app/` or `components/`;
      serialisation into `/api/bella.json` does **not** count, and that definition is stated
      in the script header.
- [ ] **3.4 jscpd:** TS and TSX only, CSS excluded, thresholds as above. The PR states
      plainly that it does not catch the fixture that prompted it.
- [ ] **3.5 orphaned components:** **no second implementation.** The check stays in
      `audit:reuse`. audit:debt may harden it in place (dynamic imports, re-exports) but a
      reviewer must be able to point at one place where the rule lives.
- [ ] **3.6 broken references:** URLs, globs and `<placeholder>` syntax are ignored. Zero
      broken repo-relative paths across `docs/**.md`, `specs/**.md`, `CLAUDE.md`.
- [ ] **3.7 dead selectors:** each browser audit exports its tracked selector list; a
      selector matching nothing anywhere in the sweep **fails**. Includes the refactor of
      `audit-visual.mjs`, `audit-type.mjs` and `contrast-check.mjs`, each verified green
      before and after with identical output.

## E. The allowlist

- [ ] Exactly one file: `scripts/lib/debt-allowlist.json`. No inline comments, no source
      attributes, no per-element hooks. Nothing scattered.
- [ ] Every entry carries a **written reason** and a **date**. An entry missing either fails
      the audit.
- [ ] The audit prints the allowlist count on **every** run, pass or fail:
      `debt gate: PASS (0 findings, N allowlisted)`.
- [ ] **The audit fails when the allowlist exceeds 15 entries**, or when any entry is older
      than 180 days without being re-dated. Without this cap the mechanism is the hole that
      CLAUDE.md §9 bans, only tidier, and design.md §4 says so.
- [ ] CLAUDE.md §9 gains a sentence distinguishing this from the banned per-element
      exemptions: §9 governs rendered output, the allowlist governs code inventory, where
      intent is not derivable by tooling.

## F. Unit tests

- [ ] Runner is **vitest**, with the reasoning recorded: `node:test` cannot run `.ts` on
      Node v20.20.1 without a loader dependency, so its zero-dependency advantage does not
      exist here.
- [ ] Scope is **only** the four pure functions in `lib/bella/dtcg.ts`:
      `relativeLuminance`, `contrastRatio`, `toHex`, `parseRgb`. No component tests, no DOM,
      no snapshots.
- [ ] **A test asserts `parseRgb` returns `null` for `color(srgb 0.29 0.34 0.47)`** and it
      is **RED on today's implementation**. The red run is pasted in the PR before the fix.
- [ ] The `parseRgb` fix lands with the test: unparseable colour spaces return `null`, and
      `ContractPipeline` refuses to display a ratio rather than computing a wrong one.
- [ ] `relativeLuminance` checked against WCAG reference values for black, white and mid
      grey; `contrastRatio` checked for symmetry and the known 21:1; `toHex` checked for
      channel padding and fractional rounding.
- [ ] `npm test` runs **first** in the gate script, so a broken pure function fails in about
      a second rather than after four minutes of browser work.
- [ ] Tests are not an audit and **do not change the derived count**.

## G. Wall clock

- [ ] Gate wall-clock **measured before and after**, both recorded in the PR. Estimates are
      not acceptable.
- [ ] **If audit:debt adds more than 20 seconds**, split it: the cheap deterministic checks
      (3.3, 3.6, 3.7) run on every gate; knip and jscpd move to a CI-only job alongside
      `npm audit` and gitleaks. Record which way it went and why.

## H. Joining the gate

- [ ] Added to `package.json`'s `gate` script, `CLAUDE.md` §9, the `GATE` array on the
      System page, and `.github/workflows/gate.yml`.
- [ ] The gate reports **16** audits, derived. **No surface types the number.** If any still
      reads fifteen after this lands, the derivation is broken and it blocks the PR.
- [ ] `gate.yml`'s step name stops carrying a count (it currently says "ten audits", already
      wrong by five).

## I. The standing gate

- [ ] All 16 audits green, `audit:nda` included (local run is the NDA authority).
- [ ] `npx tsc --noEmit` clean, `npm run build` clean.
- [ ] `npm run lint` introduces no new errors beyond the pre-existing React Compiler ones.
- [ ] All 13 routes 200 in light and dark.
- [ ] New devDependencies (`knip`, `jscpd`, `vitest`) do not introduce a high or critical
      advisory. If they do, that is a blocker, not an allowlist entry.

## J. Decisions needed before build

- [ ] **§3.1** Approve adding `knip` as a devDependency, and accept the configuration day
      before it can be trusted.
- [ ] **§3.4** Approve `jscpd`, knowing it does not catch the fixture that prompted it.
      It is worth having for future copy-paste, or it is not worth the dependency.
- [ ] **§3.5** Confirm orphaned-component detection stays in `audit:reuse`.
- [ ] **§4** Approve the allowlist **with the 15-entry cap and the 180-day staleness rule**.
      Without both, design.md §4 says it recreates the hole §9 bans.
- [ ] **§5.1** Approve `vitest`, or defer tests until a Node 22 upgrade makes `node:test`
      viable for TypeScript.
- [ ] **§7** Every-build or CI-only, decided once the wall clock is measured.
