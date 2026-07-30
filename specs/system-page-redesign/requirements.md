# requirements.md, system-page-redesign

Acceptance criteria. Each line is testable. Nothing is built yet.

---

## A. The spine

- [ ] `/design-system` renders exactly six sections in this order: `ds-open`, `ds-pipeline`,
      `ds-gate`, `ds-maturity`, `ds-specimens`, `ds-close`.
- [ ] The governed pipeline is the first content section after the opening. No section about
      tokens, type, colour, spacing, or controls appears above it.
- [ ] Every section is `ds-band` > `layout-container` > `ds-section`, carries `aria-labelledby`,
      and is anchor-linkable.
- [ ] `DesignSystemNav` `SECTIONS` lists exactly those six ids, in page order.
- [ ] Scroll-spy sets `aria-current` on the correct rail entry for all six.
- [ ] Signature sections (pipeline, gate, maturity) are visibly distinct in vertical rhythm from
      the recessive ones (specimens, close). Verifiable by measuring section padding against the
      spacing scale, not by opinion.

## B. One implementation, no orphans

- [ ] The three `ds-contract` text columns from `spec/system-contract-visible` do not exist
      anywhere in the tree.
- [ ] `git log main..HEAD` contains no commit that renders both the text columns and the
      instrument.
- [ ] `lib/bella/tokens.ts` exists and is imported by `app/api/bella.json/route.ts`, the page,
      and `ContractPipeline.tsx`. One reader, three consumers.
- [ ] `/api/bella.json` is byte-identical to a response captured from `main` before the work.
      Verified with `cmp`, not by eye.
- [ ] The standalone `ds-agents` band is deleted. `grep -rn "What agents read"` returns nothing.
- [ ] The standalone AI-readiness band is deleted as a band; `AiReadinessExplainer` is consumed
      inside `ds-maturity`.
- [ ] `grep -rn "ds-identity\|ds-type\|ds-colour\|ds-scales\|ds-controls\|ds-ai-readiness\|ds-agents\|ds-rules\|ds-status"`
      returns only the deliberate anchor-preservation aliases decided under design.md §10.6, if any.
- [ ] `audit:reuse` passes. No component is left with zero imports.
- [ ] Exactly one new component file exists: `components/ContractPipeline.tsx`.

## C. Prose, cards, and separation

- [ ] No `<Card>` on `/design-system` contains only prose. Every card holds an inspectable
      specimen.
- [ ] Section intros, rules, and explanatory copy render on the band ground, not in cards.
- [ ] Card surface and page ground differ by a measurable margin in both themes. Target: the
      card surface is distinguishable from the ground at a glance without a border doing all the
      work. Measured with a computed-style probe, recorded in the PR, both themes.
- [ ] The separation comes from `--color-card`, the card border token, and the card shadow.
      No band background is tinted.
- [ ] `audit:visual` passes, including its one-ground assertion for this page.
- [ ] No pure white and no pure black as a surface or text colour, either theme.
- [ ] No amber anywhere.

## D. Reading floor

- [ ] Every element carrying its own reading text on `/design-system` computes at 16px or above,
      in both themes, for the categories Elleta rules in scope under design.md §10.1.
- [ ] The code specimen computes at 16px or above. It is currently 14px via
      `--typography-font-size-sm` and is unambiguously reading text.
- [ ] Every `td` and `th` in the gate table computes at 16px or above.
- [ ] `.card-body` computes at 18px or above wherever used.
- [ ] A probe covering `p, li, span, dd, dt, td, th, code, pre, a, blockquote` is run against
      `/design-system` and its output is recorded in the PR, so the number is evidence rather
      than a claim.
- [ ] The gate-hardening ticket (design.md §10.2) is filed, and its landing order relative to
      this work is decided, before this work merges.

## E. The pipeline instrument

- [ ] It renders three labelled stages: SOURCE, MANIFEST, REFUSAL.
- [ ] The MANIFEST stage calls `dtcgToken()` imported from `lib/bella/tokens.ts`. Not a copy,
      not a reimplementation.
- [ ] The REFUSAL stage's contrast ratio is computed in the browser from the two resolved
      colours, using the same relative-luminance maths as `scripts/contrast-check.mjs`. No
      stored or hardcoded ratio.
- [ ] Nudging the token far enough genuinely drops the computed ratio below 4.5 and genuinely
      flips the row to failed. Verified by operating it, not by reading the code.
- [ ] Restoring the token returns the row to passing.
- [ ] No fabricated failure text. Any check that cannot actually run in a browser is not shown
      as having run (design.md §10.3).
- [ ] Token nudging writes a CSS custom property on a scoped element. No inline hex, no inline
      px, anywhere in the component.
- [ ] The instrument's failure state uses the semantic danger token and clears AA in both themes.
- [ ] `audit:tokens` passes over `components/ContractPipeline.tsx` with no waiver, or with an
      inline `token-waiver:` comment carrying a written reason.

## F. Interaction: keyboard, motion, focus, and degradation

- [ ] Every instrument control is reachable and operable by keyboard alone. Tab order follows
      visual order.
- [ ] Every control has a visible focus indicator that does not depend on any travelling-trace
      effect, and that clears AAA-minded contrast against its own background in both themes.
- [ ] Controls are real primitives with correct semantics and ARIA state: `aria-pressed` for
      toggles, `aria-current` for single-select views, a real `label` for any slider or select.
- [ ] Live regions: when the verdict flips, the change is announced. The verdict is not
      conveyed by colour alone; a text label states pass or fail.
- [ ] `prefers-reduced-motion: reduce` renders the instrument's end states with no animated
      transition, and nothing is lost by that.
- [ ] **The point survives with zero interaction.** At rest, all three stages render real,
      selectable, find-in-page-able text stating what each stage does and its current value. A
      30-second scanner who never clicks still gets the argument.
- [ ] The instrument degrades without JavaScript to that same resting text. It never renders an
      empty shell.
- [ ] `audit:axe` passes with zero violations across both themes, including with the instrument
      in its failed state.

## G. The gate table

- [ ] The gate renders as a real `<table>` with `th` scope attributes, not a card grid.
- [ ] It lists every audit `npm run gate` actually runs. The row count equals the audit count,
      verified against `package.json`, not typed.
- [ ] Row detail uses progressive disclosure: summary visible, detail on demand, keyboard
      operable.
- [ ] Status is evidence-backed per design.md §7: either read from a gate-written artifact with
      its run date visible, or the status column does not exist. The table never asserts green
      without a receipt.
- [ ] The table scrolls horizontally inside its own container at 390px. The page body never
      scrolls horizontally.
- [ ] No audit count is typed as a literal anywhere on the page.

## H. Maturity

- [ ] The maturity map renders on the band ground, not inside a card.
- [ ] It is visibly larger than any specimen card on the page.
- [ ] Each axis carries an explicit current-position marker, labelled in text as well as
      position.
- [ ] Elleta's verbatim rationale copy is unchanged, except where she has explicitly approved a
      change under design.md §10.8.
- [ ] `AiReadinessExplainer` renders inside this section as the framework caption, and does not
      also render as its own band.

## I. Copy and content

- [ ] No em dash and no en dash anywhere in `app/**` or `components/**`, including the rendered
      receipt (design.md §10.5) and any dynamically built string.
- [ ] No dash characters smuggled in as unicode escapes in JSX text.
- [ ] "AI-enabled" is the only positioning term.
- [ ] No invented metric. Token counts, component counts, and audit counts are computed, never
      typed.
- [ ] No employer, client, or internal tool name. `audit:nda` passes across the whole tree,
      including `specs/`.
- [ ] No email address rendered.
- [ ] Audit counts stated in prose are either correct or absent (design.md §10.8).

## J. Type and controls taxonomy

- [ ] Unique renders nowhere inside a Card, except the existing recorded Type-band exception.
- [ ] Every display heading renders through `ui/Heading` or `ui/SectionHeader`.
- [ ] Exactly two typefaces. `audit:fonts` passes; no mono family reference is introduced.
- [ ] Exactly one primary action on the view, per the ruling in design.md §10.4.
      `audit:controls` passes.
- [ ] No keycap is used as a filter, toggle, or sort.
- [ ] Eyebrows and kickers are never iris. The only iris at body scale is genuinely interactive.

## K. Layout

- [ ] 1240 `layout-container` on every section. No full-bleed text.
- [ ] Vertical rhythm from the scale. No inline ad-hoc padding.
- [ ] Sibling specimen cards render equal heights in both themes.
- [ ] No horizontal overflow on the page body at 390px, 768px, 1024px, or 1440px.
- [ ] The instrument is usable at 390px in its stacked form.

## L. The gate list this must pass

All 15 audits green, plus tsc, build, routes, and the NDA grep.

- [ ] `audit:structure`
- [ ] `audit:fonts`
- [ ] `audit:tokens`
- [ ] `audit:copy`
- [ ] `audit:reuse`
- [ ] `audit:nda` (local only, CI cannot run it; the local run is the authority)
- [ ] `audit:controls`
- [ ] `audit:parity`
- [ ] `audit:agents`
- [ ] `audit:contract`
- [ ] `audit:contrast`
- [ ] `audit:axe` (13 routes, both themes, zero violations)
- [ ] `audit:type`
- [ ] `audit:visual`
- [ ] `audit:dark`
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` clean
- [ ] `npm run lint` introduces no new errors beyond the 7 pre-existing React Compiler ones
- [ ] All 13 routes 200 in light and dark
- [ ] NDA content-grep clean across the whole tree
- [ ] Branch flow honored: PR with local gate output and screenshots, merge only on green, no
      direct push to main

## M. Evidence required in the PR

- [ ] Before and after screenshots, desktop and 390px, light and dark.
- [ ] A screen recording or frame sequence of the instrument going from pass to failed and back.
- [ ] The keyboard-only walkthrough result for the instrument.
- [ ] The reduced-motion rendering.
- [ ] The type-floor probe output (§D).
- [ ] The card-versus-ground separation measurement, both themes (§C).
- [ ] `cmp` output proving `/api/bella.json` is byte-identical (§B).

## N. Decisions needed before build

Not code criteria. Blocking.

- [ ] **§10.1** The 16px floor versus the metadata tier. Which of the three options.
- [ ] **§10.2** Whether gate-hardening lands before, with, or after this work.
- [ ] **§10.3** Confirm a narrower but wholly honest refusal demo is acceptable.
- [ ] **§10.4** Which control holds the page's one primary.
- [ ] **§10.5** Rendered receipt: substitute the separator, or change `receipt.mjs` repo-wide.
- [ ] **§10.6** Preserve the nine retired anchors, or accept the breakage.
- [ ] **§10.7** Approve the horizontal three-step layout at mockup stage before it is built.
- [ ] **§10.8** Correct the stale audit counts, or drop the number from prose entirely.
- [ ] **§7** Gate-status artifact, or no status column.
- [ ] **§2** Confirm the branch plan: land the plumbing off `main`, close
      `spec/system-contract-visible` unmerged.
