# design.md, audit-debt

**Status:** spec only, awaiting Elleta's review. Nothing built.
**Branch:** `spec/audit-debt`, cut from `main` at `e787503`.
**Pairs with:** `specs/audit-visual-hardening/` (same audit shape, same discipline).
**Note on fixtures:** the debt this must catch lives on `spec/system-page-redesign`
(PR #77) and `chore/clock-out-27jul`, not on `main`. Develop against those branches.

---

## 1. Why

The gate proves the code obeys the system's rules. **Nothing proves the codebase is not
accumulating dead weight.** Today alone: a 678-line component deleted, roughly a thousand
lines of CSS added, a primitive deleted, and four separate pieces of known debt shipped
green. Every audit passed at every step.

That is not a failure of the audits. They were never asked the question. `audit:reuse` asks
"is this component imported" and nothing else asks "is this code still earning its place".

## 2. Reuse the established shape

Everything here follows the pattern already in `scripts/`: a plain `.mjs` script, failures
printed through `scripts/lib/receipt.mjs` so every offender is named, non-zero exit on
failure, and one summary line on success. **audit:debt is static analysis only, no browser**,
which is the main reason it will be fast where the browser audits are not.

Two checks below overlap code that already exists. Neither may be reimplemented:

- **Check 5 (orphaned components) already exists** in `scripts/audit-reuse.mjs:26-44`. It
  walks `components/**.tsx` and regex-matches import statements. audit:debt must **not**
  write a second one. Either it stays where it is, or it moves wholesale and
  `audit:reuse` loses it. See §5.
- **Check 7 (dead selectors)** is the failure mode `audit-visual-hardening` §5.4 predicted
  and that actually bit us on 27 Jul: the trace-ring assertion silently matched nothing when
  the inspector left `/design-system`. It failed loudly only because that particular check
  returns an explicit error when its elements are missing. Most do not.

## 3. The checks

Every failure message uses the receipt format and names a file plus a symbol, never "some
CSS".

### 3.1 Unused exports, files and dependencies. Confidence: HIGH (files, deps) / MEDIUM (exports)

**Recommendation: use `knip`. Do not write our own, and do not use `ts-prune`.**

- **Writing our own** means implementing a TypeScript module graph: barrel re-exports,
  dynamic `import()`, JSX usage, type-only imports, Next's implicit entry points. That is
  weeks of work to arrive at a worse version of a solved problem.
- **`ts-prune` is the wrong shape.** It finds unused *exports* only, not unused files or
  unused dependencies, and it is effectively superseded by knip.
- **`knip`** does all three in one pass and ships Next.js awareness.

**The honest risk:** knip out of the box will be loud on this repo. Next's app router makes
`app/**/page.tsx`, `layout.tsx` and `route.ts` implicit entry points, and `_proto/`,
`_archive/`, `prototypes/` and `scripts/` all need declaring. **Expect a day of config
before it is quiet.** Until it is quiet it must not join the gate, because an audit that
cries wolf is worse than no audit.

**Scope:** `app/`, `components/`, `lib/`, `scripts/`. Excluded: `_proto/`, `_archive/`,
`prototypes/`, `public/`.
**Tolerance:** zero unused files, zero unused dependencies. Unused *exports* start as a
warning, and only become a failure once the config is proven quiet on `main`.

### 3.2 Orphaned CSS. Confidence: MEDIUM. This is the flakiest check here.

**Assertion:** every class selector defined in `app/globals.css` is referenced somewhere in
`app/` or `components/`.

**Scale:** 408 distinct class selectors in a 5,721-line file.

**The false-positive problem, stated plainly.** This codebase builds class names
dynamically all over the place:

```
`ds-flow__verdict ds-flow__verdict--${state}`
`bmm-badge bmm-badge--${a.stage}`
`agentdemo__verdict--${failing === 0 ? "pass" : "fail"}`
```

A naive `grep` for `.ds-flow__verdict--pass` finds nothing and reports a live class as dead.
Delete it on that evidence and you break the page.

**How the check avoids it, three layers:**

1. **Stem matching.** A selector `.a__b--c` counts as referenced if the literal string
   `a__b--` appears anywhere, because that is the prefix a template literal produces.
2. **Template-literal harvest.** Pre-scan every `.tsx` for backtick strings containing
   `-${`, extract the static prefix, and treat every selector sharing that prefix as
   consumed.
3. **Allowlist** for the residue, per §4.

**Tolerance:** zero orphans after those three layers. **Gate criterion: if it cannot reach
zero false positives on `main` without an allowlist longer than ten entries, drop the check.**
An orphaned-CSS check that needs a large allowlist has not found dead code, it has found a
detector that does not work.

### 3.3 Orphaned design tokens. Confidence: MEDIUM-HIGH

**Assertion:** every custom property defined in `lib/bella/bella.css` or `app/globals.css`
is consumed by a `var()` reference, directly or through an alias chain.

**Scale, measured today:** **467 unique tokens**, of which **21 are shadow tokens**. (The
brief said 469; the reader counts 467 on `main` after this week's edits. The number is
derived, never typed, which is the point.)

**Alias chains must be followed.** `--a: var(--b)` consumes `--b`. So does
`color-mix(in srgb, var(--x) 26%, var(--y))`. A single-pass grep would report every
foundation token as orphaned because only its alias is referenced in components. The check
resolves transitively: start from every `var()` in `app/` and `components/`, then walk the
definitions' own `var()` references until the set stops growing.

**The question that decides whether this check is worth anything:** `/api/bella.json`
serialises **every** token. If "appears in the manifest" counts as consumption, nothing is
ever orphaned. **Definition: consumed means referenced by a `var()` in `app/` or
`components/`. Being serialised into the manifest does not count.**

**The legitimate exception this creates.** BELLA is meant to be distributable. A token can
be deliberately published for downstream consumers and unused here. That is a real category
and it is exactly what §4's allowlist is for, with the reason written down.

### 3.4 Duplicated blocks. Confidence: LOW-MEDIUM, and it does NOT catch its fixture

**Recommendation: `jscpd`, TypeScript and TSX only, CSS excluded initially.**

**Thresholds, chosen not guessed:**
- `--min-lines 10`. Below that, matches are import blocks and prop destructuring.
- `--min-tokens 70`. jscpd's default of 50 flags JSX boilerplate constantly.
- `--threshold 0`. Any duplicate above the floor fails; there is no acceptable percentage.
- **CSS excluded.** Design-system CSS legitimately repeats shape. Including it would bury
  the real signal.

**Honest finding, and it changes the brief.** The known-debt fixture "`GATE_RECEIPTS` and
`RECEIPT_LABELS` re-declared in `BellaSpine.tsx`" **will not be caught by jscpd, and no
copy-paste detector can catch it.** The constants were re-declared as `DesignSystemSpecimens.tsx`
was deleted in the same commit. After that commit there is exactly **one** copy in the tree.
The duplication was **temporal, not spatial**: it exists in the diff, not in the codebase.

What would catch it is a different and more opinionated rule: *a data constant over N lines
declared inside a component file should live in `lib/`*. That is a lint rule about
architecture, not a duplication check, and it would need its own justification. **Do not
claim check 4 catches fixture 1.** It catches future copy-paste, which is worth having, but
it is not the answer to the thing that prompted it.

### 3.5 Orphaned components. Confidence: HIGH. Already exists.

`audit:reuse` already does this. The decision is only where it lives.

**Recommendation: leave it in `audit:reuse`.** It is a *reuse* rule ("one implementation, no
dead copy"), it already has its exemption list with reasons, and moving it would churn a
working check for tidiness. audit:debt should **improve** it rather than move it: the current
implementation regex-matches `from "...Name"`, which misses dynamic imports and
re-exports. Harden it in place.

### 3.6 Broken internal references. Confidence: HIGH. Cheapest check here.

**Assertion:** every repo-relative path mentioned in a `.md` file under `docs/` or `specs/`
resolves to a file that exists.

**Fixture it catches:** `specs/bubble-recipe/design.md` cites
`_proto/bella-bubble-lab.html`, which **does not exist** (verified: absent from the tree and
from every branch). The spec I wrote flags this in prose, but nothing enforces it, so the
next spec to cite a ghost file will ship the same way.

**Scope:** `docs/**.md`, `specs/**.md`, `CLAUDE.md`.
**Pattern:** backtick-quoted strings and markdown links that look like paths, meaning they
contain a `/` and a known extension, or start with a known top-level directory.
**Tolerance:** zero broken references.
**False-positive control:** only check strings that look like real repo paths. Ignore URLs,
ignore globs, ignore anything with `<placeholder>` syntax.

### 3.7 Dead selectors in the audit scripts. Confidence: HIGH, but needs a refactor first

**Assertion:** every CSS selector an audit tracks must match at least one element somewhere
in its sweep. A tracked selector matching nothing fails loudly.

**Why this matters more than it sounds.** On 27 Jul, `audit:visual`'s equal-height check
tracked `.ds-gate`, which stopped existing when the gate became a table. It kept "passing".
The trace-ring check only failed loudly because it happens to return an explicit error
string when its elements are missing. That was luck, not design.

**The cost:** the audits currently hard-code selectors inline. To assert on them, each must
**declare** its tracked selectors as an exported constant. That is a mechanical refactor of
`audit-visual.mjs`, `audit-type.mjs` and `contrast-check.mjs`, and it is the one part of this
spec that touches working code.

**Tolerance:** zero selectors matching nothing across the full sweep.

## 4. The exemption question

CLAUDE.md §9 now says: *the gate has no per-element exemptions. An audit you can opt out of
is not an audit.* That rule exists because of the `data-example` incident, where I made
three audits look away from live DOM.

**These are reconcilable, and the distinction is real, not a lawyer's dodge.**

The §9 rule governs **rendered output**: if a page element cannot pass, it does not get to be
live DOM. audit:debt does not judge rendered output. It judges **code inventory**, where
"this token is deliberately published for downstream consumers" is a true fact about intent
that no static analysis can derive. There is no equivalent of "render it as a picture
instead" for a published-but-unused token.

**The proposal, and I think it holds:**

- **One central file**, `scripts/lib/debt-allowlist.json`. Nothing inline, no comments in
  source, no attributes in markup.
- **Every entry requires a written reason.** An entry without one fails the audit.
- **Every entry requires a date.**
- **The audit prints the allowlist count on every run**, pass or fail, so it can never be
  silent: `debt gate: PASS (0 findings, 7 allowlisted)`.

**Where I think it still recreates the hole, said plainly:** an allowlist with forty entries
is the hole, reopened, just tidier. A central file is only better than scattered comments if
someone looks at it. So the proposal needs one more thing to be honest:

- **The audit FAILS when the allowlist exceeds a stated cap** (proposed: 15 entries), or
  when any entry's date is older than 180 days without being re-dated. Growth becomes
  self-limiting and stale exemptions surface themselves.

Without that cap, I would not claim this is meaningfully different from what §9 bans.

## 5. Unit tests

### 5.1 Runner: vitest, not node:test

The instinct is `node:test` for zero dependencies. **On this repo that advantage does not
exist.** The functions under test are in `lib/bella/dtcg.ts`, TypeScript, and this is
**Node v20.20.1**. `--experimental-strip-types` landed in Node 22.6, so `node --test` cannot
run a `.ts` file here without adding a loader dependency anyway.

So the real comparison is "one dependency (a loader) plus config" against "one dependency
(vitest) and no config". **Recommendation: vitest.** It handles TS natively, needs no
config for this scope, and the repo already carries a Vite-adjacent toolchain through
Tailwind and Next.

If Elleta would rather not add a dependency at all, the alternative is to wait for a Node 22
upgrade and use `node:test` then. That is a legitimate choice; it just means no tests until
then.

### 5.2 Scope: the four pure functions only

`lib/bella/dtcg.ts`: `relativeLuminance`, `contrastRatio`, `toHex`, `parseRgb`. Nothing
else. No component tests, no DOM, no snapshots. These four are the most testable code in the
repo and the only place a unit test earns its keep today.

### 5.3 The test that must fail on today's implementation

The code review found this and it is the reason to write tests at all:

```ts
// FAILS on today's implementation, deliberately
parseRgb("color(srgb 0.291137 0.342118 0.47898)")
// today returns [0.291137, 0.342118, 0.47898]
// which downstream is read as 0-255, i.e. near-black
```

`parseRgb` regex-scrapes the first three numbers with no regard for colour space. Today both
tokens the pipeline instrument reads resolve to `rgb()`, so it is latent. The moment either
becomes a `color-mix()` (as `--color-semantic-accent-subtle` already is), the instrument
computes and displays a **confidently wrong contrast ratio** on a page whose entire argument
is that the number is real.

**The test asserts the correct behaviour: `parseRgb` returns `null` for a colour space it
cannot interpret, and callers refuse rather than compute.** It will be red until the fix
lands, which is the point.

Other cases worth covering, all cheap and deterministic: `relativeLuminance` against the
WCAG reference values for black, white and mid grey; `contrastRatio` symmetry
(`ratio(a,b) === ratio(b,a)`) and the known 21:1 black-on-white; `toHex` padding for
single-digit channels and rounding of fractional inputs.

### 5.4 Where tests run

**Recommendation: `npm test` runs first inside the gate script.**

It takes about a second and it is pure logic. Running it before four minutes of browser work
means a broken pure function fails in one second rather than four minutes. Tests are not an
audit, so they do not appear as `audit:*` and **do not change the derived count**, which is
a small proof that deriving the count was the right call.

## 6. The gate count

Adding audit:debt makes the gate **16 audits**. If the token check were split out it would be
17. Either way **nothing types the number**: `lib/bella/gate.ts` derives it from the gate
script, and the System page, the maturity rationale and the status card all read from that.
This spec is the second real test of that derivation.

## 7. Wall clock

**Must be measured, not estimated, before this joins the gate.** The requirement is in
`requirements.md`. What can be said now: audit:debt is static analysis with no browser, so it
should be seconds against the browser audits' minutes. The exception is knip, which builds a
full TypeScript program and may take 10 to 30 seconds on this repo.

**If the total exceeds 20 seconds, the proposal is to split:** the cheap deterministic checks
(3.3, 3.6, 3.7) run on every gate; knip and jscpd (3.1, 3.4) run in CI only, as their own
job alongside `npm audit` and gitleaks. Slow checks that people skip locally are worse than
slow checks that only CI runs.

## 8. Confidence summary

| # | Check | Confidence | Catches its fixture? |
| --- | --- | --- | --- |
| 3.6 | Broken internal references | **HIGH** | **Yes**, the missing bubble-lab proto |
| 3.7 | Dead selectors in audits | **HIGH** | Yes, needs a refactor first |
| 3.1 | Unused files and deps (knip) | **HIGH** | Yes, orphaned CSS aside |
| 3.3 | Orphaned tokens | MEDIUM-HIGH | Partly, see the manifest question |
| 3.1 | Unused exports (knip) | MEDIUM | Only once configured quiet |
| 3.5 | Orphaned components | HIGH, exists | Already caught `ui/Select` |
| 3.2 | Orphaned CSS | **MEDIUM** | Should catch the DesignSystemSpecimens residue |
| 3.4 | Duplicated blocks | **LOW-MEDIUM** | **No.** See §3.4 |

## 9. Out of scope

Complexity metrics, bundle-size budgets, dependency licence auditing, and any check on the
`_proto/`, `_archive/` or `prototypes/` trees, which exist to hold things that are not wired
in.
