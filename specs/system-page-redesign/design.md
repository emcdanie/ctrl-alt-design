# design.md, system-page-redesign

**Status:** spec only, awaiting Elleta's review. Nothing built.
**Branch:** `spec/system-page-redesign`, cut from `main` at `e787503`.
**Supersedes:** the `ds-contract` beat on `spec/system-contract-visible` (`329f32a`). See §2.

---

## 1. The job, and how every decision below is judged

In about 30 seconds, prove to **both** a non-technical scanner and a senior engineer that
BELLA is a real, governed, agent-ready system Elleta engineered.

Two readers, one page, no separate tracks. The scanner needs the claim legible at a glance
without reading. The engineer needs the receipt, one level down, on demand. Every section
below is scored against that, and anything that serves neither reader is cut or demoted.

The current page fails the job in one specific way: it is an undifferentiated wall of grey
cards, so nothing leads and everything competes. The strongest proof, the governed pipeline,
sits roughly 60% down. A scanner leaves before reaching it.

## 2. Branch decision, and how we never ship both

**Recommendation: cut from `main`, re-fold the plumbing as its own commit. Do not branch from
`spec/system-contract-visible`.**

That branch carries two commits. Only one deserves to survive.

| From `329f32a` | Verdict |
| --- | --- |
| `lib/bella/tokens.ts` (extracted reader, verified byte-identical) | **Keep.** Re-fold as its own commit. The instrument needs `dtcgToken()` client-side, so this is load-bearing for the redesign, not leftovers. |
| `audit:contract` added to the `GATE` array | **Keep.** The array was missing it. Folds into the gate table. |
| The stale `300+ more` placeholder removal | **Keep**, moot once the JSON specimen is rebuilt. |
| The three `ds-contract` text columns | **Discard.** The instrument replaces them wholesale. |
| The slimmed `ds-agents` band | **Discard.** Finding 6 demotes it into the pipeline section. |

Why not branch from that work: roughly ninety percent of its visible diff is deleted again by
this redesign, so a reviewer would read a diff that adds three text columns and then removes
them. Worse, if the redesign stalls, `spec/system-contract-visible` is still mergeable and
`main` could acquire the text columns the redesign exists to replace. Cutting from `main`
makes shipping both impossible rather than merely discouraged.

**Sequencing that keeps the anti-drift rule structural, not procedural:**

1. Land `lib/bella/tokens.ts` plus the `audit:contract` gate-array entry as one small PR off
   `main`. Pure plumbing, no visual change, already verified byte-identical.
2. Cut the build branch for this redesign from that.
3. Close `spec/system-contract-visible` unmerged, with a line in `claude-progress.md` saying
   the beat was superseded by this spec and where its good parts went.

Anyone can then check the rule mechanically: `main` never contains a commit that renders both
the text columns and the instrument.

## 3. The spine, in inverted-pyramid order

Strongest proof first. One idea per viewport, explanation beside its visual.

| # | Section | id | One idea | Tier |
| --- | --- | --- | --- | --- |
| 0 | Opening | `ds-open` | What BELLA is, and its scale, in one screen | Lead |
| 1 | The governed pipeline | `ds-pipeline` | Authoring is human. Enforcement is deterministic. | **Signature** |
| 2 | The gate | `ds-gate` | Fifteen checks, live status, nothing decorative | **Signature** |
| 3 | Maturity | `ds-maturity` | Where the system honestly is, and where it is not | **Signature** |
| 4 | The specimen shelf | `ds-specimens` | The parts, inspectable | Recessive |
| 5 | Rules and status | `ds-close` | The constitution, and what is next | Quiet close |

Six sections, down from ten. The three signature sections carry the page. Everything else
recedes on purpose.

### 0. Opening (`ds-open`)

**One idea:** BELLA is a real system of this size, and this page is it inspecting itself.

Flat page opening, the Work pattern: eyebrow plus `Heading` at page tier, one sentence, then a
**stat line** reading the live numbers. No card. No specimen. The scanner gets scale in three
seconds; the engineer gets four real numbers.

Stat line, all computed at build, never typed: **469** tokens (120 primitive / 28 semantic /
321 component), **10** components under contract, **15** audits in the gate. The token figures
come from `tokenCounts()`; the component figure from `componentContract.components.length`; the
audit figure from the same source the gate table renders (§7), never a literal.

Reuses `PageHeader`, `ui/Heading`, `.layout-container`. Creates: a stat-line recipe in
`globals.css`, no component.

### 1. The governed pipeline (`ds-pipeline`)

**One idea:** authoring is human, enforcement is deterministic. Felt in five seconds.

This is the page's lead proof and the reason for the redesign. It replaces the three text
columns from `spec/system-contract-visible` entirely.

**One instrument, three linked steps, laid left to right on wide viewports and stacked below.**
Explanation sits beside each step, never under the fold of its own visual.

- **SOURCE.** A real control on a real token. The visitor nudges `--color-ink-soft` toward the
  ground, or trips a "use a raw hex instead" switch. The specimen text beside it restyles
  immediately, because the control writes the custom property on a scoped element, not a mock.
- **MANIFEST.** The DTCG entry for that token re-renders live, `$value` and `$type` changing
  as the source changes. This runs the **same `dtcgToken()` function** the endpoint uses,
  imported from `lib/bella/tokens.ts`. It is a pure function, so the page runs the real code
  path rather than an imitation of it.
- **REFUSAL.** The gate row flips to a real red failure carrying the **actually computed**
  contrast ratio, not a stored string. The WCAG maths in `scripts/contrast-check.mjs` is
  relative luminance on two resolved colours, which the browser can compute exactly. Nudge ink
  toward the ground and the ratio genuinely falls under 4.5, and the row genuinely fails.

**Why this is honest and not a simulation.** Two of the three stages execute the real logic:
`dtcgToken()` is the endpoint's own function, and the contrast ratio is the same computation
the audit performs. Nothing is a recorded string pretending to be live. This matters, because a
page whose whole argument is "the system refuses drift" cannot fake the refusal. See §10.3 for
the one place the honesty is imperfect and needs Elleta's ruling.

**Absorbs, per finding 6.** The agents narrative folds in here as one closing line naming
`/api/bella.json` and `/llms.txt` as what agents read. The `ds-agents` band is deleted. There
is one self-governance narrative on this page, not three.

Reuses `ui/Card` (the specimen only), `ui/SegmentedControl` or `ui/Select` for step
selection, `ui/StatusPill` for the pass/fail state, `.ds-swatch__case` for links,
`lib/bella/tokens.ts`. Creates: **one** component, `ContractPipeline.tsx`. Justified in §6.

### 2. The gate (`ds-gate`)

**One idea:** fifteen checks, what each refuses, and whether it is green right now.

Tabular data renders as a table. The current fourteen decorative cards become one compact
table: check name, what it refuses, status. Sortable is not needed and is not built.

**Progressive disclosure.** The row is the summary. Expanding a row reveals the detail: the
receipt of a real past slip where one exists (`audit:parity`, `audit:axe`, the CI run already
carry these slots). Reuses `ui/DisclosureCard` semantics; see §7 for the honesty mechanism
behind "live status".

The gate prose that currently wraps this section collapses to one line. The rest of what it
said is now demonstrated by section 1.

Reuses `ui/DisclosureCard`, `ui/StatusPill`, the existing `GATE` array and `GATE_RECEIPTS`.
Creates: a `.ds-gate-table` recipe, no component.

### 3. Maturity (`ds-maturity`)

**One idea:** here is where the system honestly is, including where it is weak.

Finding 7: this is the page's one strong visual. It gets enlarged, moved onto the open ground,
and labelled with an explicit "you are here" marker per axis. It stops being a card.

Its honesty is the asset. Two axes score V1 and the copy says so plainly, which is exactly what
persuades a senior reader. Nothing about that copy changes here without Elleta's word: it is
hers, verbatim from her mockup. One factual staleness inside it is flagged in §10.8.

The AI-readiness explainer currently sits beside it as a second band. It merges into this
section as the framework caption, one band, not two.

Reuses `BellaMaturityMap`, `AiReadinessExplainer`. Both are modified in place, not forked.

### 4. The specimen shelf (`ds-specimens`)

**One idea:** the parts are real and you can poke them.

Identity, Type, Colour, Spacing, Controls collapse from five full bands into one section with a
tighter internal rhythm. These are the only place cards are correct, because each card holds an
inspectable specimen rather than prose (finding 1).

The keycap `TokenInspector` stays as the shelf's one interactive centrepiece.

Reuses `TokenInspector`, `TokenAnnotation`, `SpecimenCard`, every `ui/` control primitive.
Creates: nothing.

### 5. Rules and status (`ds-close`)

**One idea:** the constitution these came from, and what is next.

Rules stay a numbered list on the ground. Status stays two lists. Quiet, unstyled, terminal.

Reuses the existing markup. Creates: nothing.

## 4. Prose leaves the cards (finding 1)

The rule, stated once and applied everywhere:

> A card holds a specimen you can inspect. Prose lives on the open warm ground.

That single rule is most of the hierarchy fix. Today prose and specimens wear the same
container, so the eye finds no edges and the page reads as one grey mass. After this change,
seeing a card means "there is a thing here to look at", which is a signal the page currently
spends and gets nothing for.

Consequence worth stating: moving prose out of cards removes it from `audit:type`'s card scope,
which weakens automated coverage of exactly the text we most care about. That is not a reason
to keep it in cards; it is a reason the gate-hardening ticket in §10.2 matters.

## 5. Card and ground separation (finding 2)

Measured today: cards `rgb(250,250,248)` on ground `rgb(245,244,239)`, about 5 of 255. That is
below the threshold where an edge reads as an edge.

**Separation comes from the card, never from the band.** `audit:visual` enforces one ground on
this page, band backgrounds equal to the page ground, no exceptions since the 23 Jul no-wash
port. So the fix works on `--color-card`, the card border token, and the card shadow, and never
tints a band. Any proposal that darkens a band to create contrast is out by construction.

Constraint on the fix: no pure white, warm neutrals only. The card surface moves within the
warm neutral range, and both themes get checked, since dark mode has the inverse problem.

## 6. Reuse before create: the one new component, justified

Every section above reuses existing code. Exactly one component is new:

**`components/ContractPipeline.tsx`.** Required because no existing component does live
token-nudging with a recomputed DTCG entry and a genuinely computed pass/fail. The nearest
neighbours were considered and rejected:

- `TokenInspector` reads computed values and annotates a static specimen. It cannot write a
  token or recompute a verdict.
- `GateRun` (Code First case) animates a scripted sequence of audit chips. It is scripted, it
  is `CaseBeat`-scoped, and its `AUDITS` array is already stale at 13 entries. Reusing it would
  import a case beat onto the System page and inherit its drift.
- `DisclosureCard` handles summary-then-detail, which is the gate table's need, not this one.

Everything else on the page is a reuse or a CSS recipe.

## 7. Making "live pass/fail" honest

The gate runs locally and in CI, not in the browser. A table that simply renders every row
green is an invented metric, which §6 of the constitution forbids.

**Proposal:** the gate writes its own result. A small reporter appends each audit's name, exit
status, and timestamp to a committed JSON artifact as part of `npm run gate`. The page reads
that artifact at build. Status is then a real receipt of a real run, with its date visible, and
it cannot claim green for a run that did not happen.

The one row that is genuinely live in the browser is the contrast row while the pipeline
instrument is being operated, because that maths runs client-side (§3.1).

**If Elleta does not want a generated artifact in the repo**, the fallback is to drop the
status column entirely and let the table be "what each check refuses", which is still a large
improvement on fourteen cards and stays honest. What the table must never do is assert green
without evidence.

## 8. Hierarchy, rhythm, and the one read-path

- **Size and weight, not colour**, carry the hierarchy. Section titles stay `ui/Heading` at
  section tier. Iris stays reserved for interactive, per §4 of the constitution.
- **Signature sections** (1, 2, 3) get generous vertical space, a wider measure, and their
  visual at full width. **Recessive sections** (4, 5) get tighter rhythm and smaller specimens.
  The contrast between the two rhythms is what creates a read-path.
- **Spacing comes from the scale.** `--space-section` between bands, no ad-hoc padding.
- **The rail** (`DesignSystemNav`) drops from ten entries to six, matching the new spine. Its
  `desc` slots stay TODO and keep rendering nothing while empty.
- **Every section is anchor-linkable** and keeps `aria-labelledby`, so the rail keeps working
  and deep links survive.

## 9. Constitution constraints, called out

- **One implementation (§0.2).** The instrument replaces the three text columns; they never
  coexist, enforced by the branch decision in §2. `ds-agents` and the AI-readiness band are
  deleted as separate bands, absorbed. Orphan grep before finishing.
- **Smallest change first (§0.1).** One new component, justified in §6. Everything else is
  reuse or a CSS recipe.
- **Baseline before change (§0.4).** Task 1 rebuilds and screenshots the current page first.
- **Tokens only (§1).** No hex, no px, no arbitrary Tailwind values, including inside the
  instrument's dynamic styling. Nudged values are written as custom properties on a scoped
  element, which is a token operation, not a literal.
- **Min 16px reading text (§1).** All reading text, including the code specimen and the table
  cells. See the conflict in §10.1.
- **No amber, warm neutrals, no pure white or black (§1).** The card-separation fix in §5 stays
  inside the warm range. The instrument's failure state uses the semantic danger token, never
  the banned warm warning hue.
- **1240 container and band grammar (§2).** Every section is
  `ds-band` > `layout-container` > `ds-section`. The instrument sits inside that, not outside it.
- **Display headings via `ui/Heading` only, two typefaces (§3).** Section titles through
  `SectionHeader`. Table headers, row labels, and every instrument label are Geist.
- **Unique never inside a Card (§3).** The specimen shelf keeps the recorded Type-band
  exception; nothing new adds Unique to a card.
- **Eyebrows never iris (§4).** Step labels in the instrument are `--color-eyebrow`.
- **Colour affordance (§4).** The only iris at body scale is genuinely interactive: the
  instrument's controls and the real links.
- **Dark mode is a contract (§4).** Every new surface, the table, and all three instrument
  states resolve through `[data-theme="dark"]`. The failure state must clear AA in both themes.
- **Control taxonomy (§5).** The instrument's controls are real primitives. See the
  one-primary conflict in §10.4.
- **No em or en dashes (§6).** Including the receipt rendering. See the conflict in §10.5.
- **"AI-enabled" only (§6).** Never "augmented", never "assisted".
- **NDA-safe, no invented metrics (§6, §7).** Every number computed live. No employer or client
  names. `audit:nda` scans `specs/`, so this file is in scope.
- **Accessibility, AAA-minded.** Covered as acceptance criteria in `requirements.md` §F:
  keyboard operation, visible focus independent of any trace, reduced motion, and a resting
  state that reads as scannable text without interaction.

## 10. Conflicts between this direction and the constitution

Surfaced, not resolved. Elleta rules on each.

**10.1 The 16px floor collides with the sanctioned metadata tier.**
Finding 3 asks for all reading text at 16px minimum, naming case labels at 13px. Probed live on
`/design-system`: the 13px case labels are `.ds-section__kicker`, 33 instances, sized by
`--typography-font-size-tag: 13px`. That token is the shared metadata tier. It also sizes
`Tag`, `StatusPill`, `FilterChip`, and every kicker on every page.

The constitution explicitly protects this tier. §9 under `audit:type`: "Metadata rows
(tags/pills/eyebrows/kickers) are a deliberate separate tier and exempt." §3 defines eyebrows as
Geist caps on `--tracking-eyebrow`.

So the finding and the constitution disagree, and it cannot be settled inside this page:
- Raise `--typography-font-size-tag` and every tag, pill, and chip sitewide changes.
- Move case labels off the kicker recipe onto a reading recipe, and the System page diverges
  from the metadata tier everywhere else.
- Keep the carve-out, and only genuine prose and the code specimen are raised, which fixes the
  code specimen at 14px but leaves the labels at 13px.

The third is the smallest change and the only one that does not alter the constitution.
This spec does **not** choose. Elleta does.

**10.2 `audit:type` does not catch what finding 3 found, and the redesign widens the hole.**
Verified by reading `scripts/audit-type.mjs`:
- The card-scope pass queries `p, li, blockquote, dd` only, so the `<code>` specimen at 14px is
  never measured. That is precisely why it passes today.
- The sitewide floor pass queries `p, li` only, and skips anything whose own text is under 40
  characters, so short labels are invisible to it.
- `META_EXEMPT` additionally exempts swatch names, values, flags, and the inspector.
- Nothing measures `span`, `td`, `th`, `code`, `pre`, `dt`, or `a`.

The redesign makes this worse in two ways before it makes it better: prose moves out of cards
(out of scope of the card pass) and a table arrives (`td`/`th` are unmeasured). **Gate-hardening
is a separate ticket and should land before or with this work, not after.** Its shape: extend
both passes to `code`, `pre`, `td`, `th`, `dt`, and `span` carrying own text, and re-examine
whether `META_EXEMPT` is still drawn in the right place. Flagged as a dependency, not folded in.

**10.3 "A real red failure" is only two-thirds real.**
`dtcgToken()` and the contrast maths genuinely execute. But `audit:contract` and `audit:tokens`
are Node scripts reading files from disk; they cannot run in a browser. So a row for those
checks flipping red would be a rehearsal, not a run. Options: restrict the instrument's refusal
to the contrast check, which is genuinely computable and genuinely visual; or show the other
rows changing to "would fail" with different wording. This spec proposes restricting it to what
actually computes, and stating in the copy that this is the same maths the audit runs. Elleta
should confirm she is happy with a narrower but wholly honest demonstration.

**10.4 The instrument needs a control, and the page already spends its one primary.**
§5 caps a view at one primary, the filled iris keycap, and `audit:controls` fails on more. The
Controls specimen band already renders a primary ("Press me"). Either the instrument's run
control is secondary (flat iris outline, no elevation), or the specimen band demotes its
primary so the instrument can hold the page's one true action. The second reads better, because
the instrument is the page's real action and the specimen is a picture of one, but it changes a
band that exists to demonstrate the taxonomy. Elleta's call.

**10.5 The real receipt format contains an em dash.**
`scripts/lib/receipt.mjs` formats every failure as
`audit:<name>: <offender> [em dash] got <actual>, expected <expected>`.
That file is in `scripts/`, which `audit:copy` does not walk, so it is legal where it lives. The
instrument renders a receipt inside `components/`, which `audit:copy` **does** walk, and §6 bans
the character outright. So the on-page receipt cannot be byte-identical to the real one. Either
the rendered receipt substitutes a comma or a period and stops being a literal quote, or
`receipt.mjs` changes its separator repo-wide, which touches every audit's output format. The
first is smaller; the second is more honest. Flagged rather than chosen.

**10.6 Removing bands removes anchors.**
`ds-identity`, `ds-type`, `ds-colour`, `ds-scales`, `ds-controls`, `ds-ai-readiness`,
`ds-agents`, `ds-rules`, `ds-status` are live anchors today. Collapsing to six sections breaks
any deep link to them, including the footer colophon path and anything Elleta has shared. Not a
constitution violation, but a real cost. Either keep the retired ids as anchor targets on their
new parent section, or accept the breakage knowingly.

**10.7 "One idea per viewport" versus the 1240 container.**
A three-step instrument laid horizontally inside 1240px gives each step roughly 380px, which is
tight for a control, a manifest entry, and a verdict. The alternatives are a vertical instrument
that costs three viewports and weakens the "one glance" claim, or stepping through the three
stages in place, which is progressive disclosure but hides two-thirds of the point behind
interaction. This spec proposes horizontal on wide, stacked below, with all three states present
as text at rest. Worth Elleta's eye at mockup stage, since it is the single riskiest layout call
in the redesign.

**10.8 Stale audit counts that this redesign puts under a spotlight.**
The gate runs 15 audits. The `GATE` array is 14 on `main` and 15 with the re-folded
`audit:contract` entry. But: the gate section prose says "Thirteen audits", the page intro says
"Thirteen audits run before anything ships", the status card says "thirteen audits and a
pre-commit hook", `GateRun.tsx` lists 13, `gate.yml`'s step name says "ten audits", and the
maturity map's Governance rationale says "a 13-audit gate that fails the build on drift".

The last one is Elleta's verbatim copy from her mockup, so it does not change without her word.
The rest are fixable, but a table with a live count sitting beside prose that says thirteen is
worse than today's inconsistency, because the redesign puts them next to each other. Either the
counts get corrected as part of this work or the prose drops the number entirely and lets the
table be the count. Recommend the latter, since a number that lives in one place cannot drift.

## 11. Out of scope

`/design-system/inspector`, the case-study beats including `GateRun`'s stale array, the voice
pass on the `TODO(elleta)` slots in `GATE_INTRO` / `GATE_CLOSER` / `GATE_RECEIPTS` / the rail
`desc` fields, and any change to the token layer itself beyond the card-surface separation in §5.
