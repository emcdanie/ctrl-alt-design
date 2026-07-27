# design.md, audit-visual-hardening

**Status:** spec only, awaiting Elleta's review. Nothing built.
**Branch:** `spec/audit-visual-hardening`, cut from `main` at `e787503`.
**Depends on:** the redesign PR (`spec/system-page-redesign`). Its fixed page is this
audit's passing fixture, so this lands after it. It can be developed now against the
defect fixtures in §7.

---

## 1. Why

The gate has fifteen audits and they check **code**: token literals, font families, copy,
contract shape, contrast values, axe rules, computed type sizes. None of them check
**rendered layout**. So a shadow can bloom into a halo, a token card can wrap mid-token,
a column can go ragged, and a card can strand a dead region below its content, and every
one of those ships green. They have recurred for weeks because nothing can see them.

This is the `audit:type` hardening move, one level up. That hardening worked because it
turned a rule everyone agreed on into a browser-computed assertion with a named offender.
Same shape here.

## 2. Read the existing script first: three things change the plan

`scripts/audit-visual.mjs` already exists and is 549 lines. It is not a stub. It already
runs a Playwright sweep over both themes and seven widths and asserts one ground,
containment, uniformity, trace-ring concentricity, cover contrast, dead links, stage
geometry, leader crossing, and beat-template law. Reading it changes three of the five
proposed checks.

### 2.1 Check 2 already exists. Do not write it twice.

`audit-visual.mjs:62-82` already groups grid children by rounded `top` and fails when a
row's heights differ. It runs at **zero tolerance** (`new Set(heights).size > 1` on
rounded integers), scoped to `.ds-specimen-row, .ds-gate, .ds-caseband, .ds-status,
.bmm-list`. A second implementation of equal-height siblings would violate Prime
Directive 2 outright.

**So check 2 is not new work. It is a scope extension**, and the actual gap is that the
new surfaces are not in that selector list. See §4.2.

Related staleness to fix while there: the redesign turns `.ds-gate` from a card grid into
a table, so that selector goes dead in the list above. A selector that matches nothing
fails silently forever, which is the worst failure mode an audit has.

### 2.2 Check 1 as briefed would fail on almost every card.

The brief says "each specimen has at most one box-shadow". That cannot be the assertion,
because **the shadow tokens are themselves multi-layer**:

```
--shadow-soft:          3 layers
--shadow-layered:       4 layers (one inset)
--shadow-card-default:  3 layers (one inset)
--shadow-key-resting:   3 layers
```

Counting layers would red every card on the site on day one. The overglow defect was never
"more than one layer": it was a **bespoke stack that matched no token**. The DESIGN button
carried `2px 5px 0 <edge>, 6px 9px 14px <32% bloom>, inset 0 1px 0 rgba(...)`, hand-written
in `globals.css`, resembling a token without being one.

**The correct assertion is token equality**, and it is both stricter and safer:

> A specimen's computed `box-shadow` must be string-equal to the computed value of one of
> the registered `--shadow-*` tokens, or `none`.

That catches every bespoke stack including the bloom, cannot false-positive on legitimate
multi-layer tokens, and needs no blur-radius heuristic. See §4.1.

There is already a **static** shadow law at `audit-visual.mjs:525-542` (no `--shadow-orb`
on a card/flag/panel selector). The new check is its computed counterpart, not a
replacement, and the two should sit next to each other.

### 2.3 Check 5 is only half-assertable today.

`components/TokenAnnotation.tsx` draws leaders two ways:

- **Anchored mode** (line 210): `<path data-for="<flag token>">` plus landing circles,
  against `[data-part]` targets. Endpoint-on-target **is** assertable.
- **Fallback mode** (line 253): a bare `<line>` with **no target attribute at all**.
  Nothing in the DOM says what it points at, so the assertion cannot be written.

Note the existing case-page geometry checks only ever query `.ds-leaders path`, so the
System page's `<line>` leaders are unchecked today and would stay unchecked. Making check 5
whole needs a one-line markup change (`data-for` on the fallback line) shipped **before**
the assertion. That is a dependency, not a detail. See §4.5.

## 3. Harness: extend, do not add a runner

One Playwright pattern already exists and every browser audit uses it: `chromium.launch()`,
a themed context via `addInitScript` setting `localStorage.theme`, `waitUntil: "networkidle"`,
a scroll sweep to force lazy content, and `receipt()` for every failure. That pattern is not
re-invented here.

**Where the checks live is a real decision, and the brief points two ways.**

The brief says "do not build a second runner" and also says the gate becomes **16 audits**
with an entry in the GATE array and `gate.yml`. Those cannot both be literally true: the
checks either extend `audit:visual` (gate stays 15, no new entry) or become their own audit
(gate goes to 16, new entry, second chromium launch).

**Recommendation: a new audit, `audit:render`, sharing a extracted harness module.**

- Extract the launch/theme/scroll boilerplate into `scripts/lib/browser.mjs` and have
  `audit-visual.mjs`, `audit-axe.mjs`, `audit-type.mjs` and the new `audit-render.mjs` all
  import it. That is the "no second runner" requirement honoured properly: one harness,
  four callers, less duplication than today rather than more.
- A separate audit keeps the failure vocabulary clean. `audit:visual` means "the layout
  laws"; `audit:render` means "the paint defects". A receipt that says which one failed is
  worth more than one giant audit.
- Cost, stated plainly: one more `chromium.launch()`, roughly 10 to 20 seconds of gate wall
  clock. If Elleta would rather not pay that, folding into `audit:visual` is a one-line
  change to this plan and the gate stays at 15.

**The 16 is the point.** `lib/bella/gate.ts` derives the count from the gate script, so
sixteen appears on the System page, in the maturity rationale and in the status card the
moment the script changes, with nothing typed. This spec is the first real test of that
derivation. If any surface still says fifteen after this lands, the derivation is broken and
that is a bug in the redesign, not here.

## 4. The five checks

Every failure uses the existing receipt format, `receipt(audit, offender, got, expected)`,
and every offender is a **selector plus a text fragment**, never "a card".

### 4.1 SINGLE ELEVATION SHADOW. Confidence: HIGH.

**Assertion.** For every element in scope, computed `box-shadow` is either `none` or
string-equal to the computed resolution of a registered shadow token.

**How the token set is built.** At page load, enumerate every `--shadow-*` custom property
declared on `:root` and on `[data-theme="dark"]`, then resolve each by setting
`box-shadow: var(--shadow-x)` on a detached probe element and reading `getComputedStyle`
back. Comparison is then computed-string against computed-string, in the same document, in
the same theme. No parsing, no colour maths, no tolerance.

**Tolerance.** None. Exact string equality. This is why confidence is high: there is no
threshold to tune and no sub-pixel noise.

**Scope (v1).** `/design-system` only: `.tok-inspector__key`, `.tok-inspector`, every
`.trace-host:not(.btn-key)`, `.ds-pipeline__step`, and `[class*="Card"]` inside
`.ds-page`. Both themes, 1440 only (shadows do not change with width).

**Offender message.**
```
audit:render: .tok-inspector__key (light) "DESIGN" [got] a bespoke 3-layer shadow
  matching no token: 2px 5px 0 ..., 6px 9px 14px ..., inset ...
  [expected] one registered --shadow-* token, or none
```

**Why it cannot come back.** The overglow was hand-written CSS. Any hand-written stack fails
this by construction, whatever its blur radius.

### 4.2 EQUAL-HEIGHT SIBLINGS. Confidence: HIGH. Existing check, extended.

**Assertion.** Unchanged from `audit-visual.mjs:62-82`: children of a tracked grid that
share a row must share a computed height.

**Tolerance.** The existing check rounds to integers and demands exact equality. Keep that.
Grid `stretch` produces genuinely identical heights, so a 1px allowance would only hide
real breakage. **Stated explicitly so it is a decision, not an accident: tolerance 0px on
`Math.round`ed heights.**

Row grouping keeps its current rule, `Math.round(top)` equality, which is safe because
stretched grid items share an exact top.

**Scope change, which is the actual work.** Add `.ds-pipeline` and `.ds-swatches` to the
tracked list; remove `.ds-gate` once the redesign turns it into a table, and add a guard
that fails loudly when a tracked selector matches nothing anywhere in the sweep, so a dead
selector can never rot silently again.

**Offender message.**
```
audit:render: .ds-swatches row@412 (dark) [got] heights 148,148,171
  [expected] equal heights per row (grid stretch), tolerance 0px
```

### 4.3 GRID ALIGNMENT to the 4px step. Confidence: MEDIUM.

**Assertion.** For elements in a narrow opt-in list, the box edges land on the BELLA 4px
base step.

**Tolerance and why.** `+/- 0.5px` against `Math.round(v * 2) / 2`, evaluated at device
pixel ratio 1. Half a pixel because layout produces genuine sub-pixel values from
`1fr` division and fractional gaps, and rounding to whole pixels would fail honest layouts.
The 4px base comes from `--spacing-1: 4px` in `bella.css`, read at runtime rather than
typed.

**Scope, deliberately narrow.** Only **container** edges, and only ones the design actually
controls: `.ds-band > .layout-container`, `.ds-pipeline__step`, `.ds-swatch`, `.ds-card__inner`.
**Explicitly not text nodes, not inline elements, not anything whose height comes from a
line box**, because font metrics do not land on 4px and never will.

**Why medium, not high.** The rule is real but the scope boundary is a judgement call. The
risk is not false failures inside the listed scope; it is that the list is too small to catch
the next ragged column. Expect to grow it, one selector at a time, each with a reason.

**Offender message.**
```
audit:render: .ds-swatch (light 1024) [got] left edge at 237.5px, off the 4px step
  [expected] a multiple of 4px within 0.5px
```

### 4.4 NO STRANDED DEAD-SPACE. Confidence: LOW. Stage it last.

**Assertion, and the honest problem with it.** The naive version, "the gap between the last
child's bottom and the card's content-box bottom exceeds a threshold", **fires on every
correctly stretched card in a grid row**. A short card sitting beside a tall sibling is
supposed to have trailing space. That is equal-height working, not a defect.

So the assertion has to isolate self-inflicted dead space:

> Flag a card only when the trailing gap exceeds the threshold **and** the card is the
> tallest in its row, meaning no sibling is forcing its height, so the space came from its
> own `min-height` or its own reserved slots.

**Threshold.** Trailing gap `> 48px`, one `--spacing-12`, read from the token at runtime.
Chosen because the largest legitimate internal gap in the specimen shelf is
`--spacing-8` (32px), so 48px is one clear step beyond anything intentional.

**Scope.** `/design-system` cards only, 1440 and 900.

**Why low confidence, said plainly.** The tallest-in-row qualifier is a heuristic standing in
for intent, and intent is not in the DOM. A single card outside any grid has no row to
compare against and must be skipped entirely, which means the dead-space code card from this
session **is only caught if it sits in a grid**. If the prototype in task 5 cannot catch the
captured fixture without also flagging something legitimate, **drop this check**. A flaky
audit is worse than no audit: it trains people to rerun the gate until it passes, which
poisons the other fifteen.

### 4.5 LEADER-LINE LANDING. Confidence: MEDIUM, and blocked on markup.

**Assertion.** For each leader with a known target, the drawn endpoint lies within the
target's border box, expanded by tolerance.

**Tolerance.** `2px`. The leader is drawn to touch the target's edge, and stroke width is
1.5px, so half the stroke plus rounding is the honest allowance.

**Scope (v1).** Anchored leaders only: `.ds-leaders path[data-for]` against
`[data-part]` targets, on `/design-system`, both themes, 1440. The endpoint comes from
`getPointAtLength(getTotalLength())`, the same technique the existing crossing check
already uses, so no new geometry machinery.

**Blocked on.** Fallback-mode leaders draw a bare `<line>` with no target attribute
(`TokenAnnotation.tsx:253`). Until that line carries `data-for`, those leaders are
unassertable. **Task 6 ships the attribute first; the assertion follows in task 7.** If
Elleta would rather not touch that component, v1 covers anchored leaders only and the
fallback stays uncovered, which should then be said out loud in the audit's header comment
rather than left as a silent gap.

**Offender message.**
```
audit:render: leader data-for="--key-fill-hi" (light) [got] endpoint 7px clear of
  [data-part="face"] [expected] the endpoint on its target's box, within 2px
```

## 5. Fixtures: how "it catches the defect" is proved

An audit that has never been seen red is a guess. Each check ships with a **captured
fixture**: a minimal HTML file under `scripts/fixtures/render/` reproducing the defect with
the real tokens, plus a test that runs the check against it and asserts it fails.

| Fixture | Reproduces | Proves check |
| --- | --- | --- |
| `overglow-key.html` | the DESIGN button's bespoke 3-layer bloom | 4.1 |
| `ragged-swatches.html` | the mid-token-wrapping colour cards with mismatched row heights | 4.2 |
| `dead-space-card.html` | the manifest card with a large empty region below its content | 4.4 |

The fixtures are captured from **this session's pre-fix code**, not hand-written to be
catchable. Where a fixture cannot be produced faithfully, that is evidence the check is not
ready.

## 6. Constitution constraints

- **One implementation (§0.2).** Check 2 is an extension of the existing assertion, never a
  copy. The harness is extracted and shared, not duplicated. No second runner.
- **The receipt (§9).** Every failure prints through `scripts/lib/receipt.mjs` and names the
  offending selector plus a text fragment.
- **Smallest change first (§0.1).** Five checks land in five separate commits, ordered by
  confidence, each independently revertible.
- **No invented metrics (§6).** Every threshold is read from a token at runtime
  (`--spacing-1` for the 4px step, `--spacing-12` for the dead-space bound), never typed as
  a magic number.
- **NDA-safe (§7).** Fixtures contain tokens and layout only, no content. `audit:nda` scans
  `scripts/`, and will scan the fixtures too.
- **Derived counts.** Adding the audit moves the gate to sixteen with nothing typed. That is
  the test of `lib/bella/gate.ts`.
- **Both themes.** Every check runs light and dark, matching every other browser audit.

## 7. Conflicts and risks, surfaced not resolved

**7.1 "No second runner" versus "16 audits".** They point opposite ways. §3 recommends a new
audit plus an extracted shared harness, and states the wall-clock cost. Elleta rules.

**7.2 Check 2 is not new.** Writing it as specified would be a second implementation of a
check that already runs. This spec converts it to a scope extension. Worth confirming that
matches intent.

**7.3 Check 1 as briefed would red the whole site.** "At most one box-shadow" versus
multi-layer tokens. §2.2 substitutes token-equality. This is a change to the brief, made
deliberately and flagged.

**7.4 Check 5 needs a component change first.** A `data-for` on the fallback leader. Small,
but it is a source edit inside `TokenAnnotation.tsx`, not audit-only work.

**7.5 Check 4 may not survive its own prototype.** Stated in §4.4. The instruction to drop
rather than ship flaky is taken literally, and task 5 has an explicit kill decision.

**7.6 Scope is `/design-system` only in v1.** Deliberate, per the brief, to avoid flake. The
cost is that the same defect class on `/work` or a case page ships unchecked until v2. Worth
knowing that this narrows the promise.

**7.7 These checks are 1440-centric.** Except check 4, they run at one width. The existing
`audit:visual` sweeps seven widths for containment, which is where width-dependent breakage
lives. If Elleta wants width sweeps here too, the gate gets slower in proportion; not
proposed for v1.

## 8. Out of scope

Visual regression by screenshot diffing (a different tool and a different maintenance
burden), hover and focus states, animation timing, and any route other than
`/design-system`.
