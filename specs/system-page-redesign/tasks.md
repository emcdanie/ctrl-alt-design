# tasks.md, system-page-redesign

Ordered, smallest change first. Nothing is checked, nothing is built. Do not start until the
ten decisions in `requirements.md` §N are answered.

Each phase leaves the page shippable. If the work stops after any phase, `/design-system` is
still green and still coherent.

---

## 0. Decisions and mockup

- [ ] Get Elleta's ruling on all ten items in `requirements.md` §N.
- [ ] Fold her answers into `design.md` before writing code.
- [ ] Mock the three-step instrument at 1240px and at 390px and get her eye on it before
      building (design.md §10.7, the riskiest layout call in the redesign).

## 1. Baseline

- [ ] `git checkout main && git pull`. Confirm `/design-system` renders as it does today, both
      themes, desktop and 390px. Screenshot everything as the before.
- [ ] Save the current `/api/bella.json` response as the byte-identity reference.
- [ ] Run the type-floor probe and the card-versus-ground separation probe on the current page.
      Record both. These are the numbers the redesign is measured against.
- [ ] Run `npm run gate` once, green, so any later red is provably this work.

## 2. Land the plumbing (own PR, off main)

- [ ] Re-fold `lib/bella/tokens.ts` from `329f32a`: `readTokens`, `dtcgToken`, `tokenCounts`,
      the DTCG types.
- [ ] Import it in `app/api/bella.json/route.ts`, delete the local copies.
- [ ] `cmp` the rebuilt `/api/bella.json` against the reference. Must be identical.
- [ ] Add the missing `audit:contract` entry to the `GATE` array.
- [ ] Gate, tsc, PR, merge on green.
- [ ] Close `spec/system-contract-visible` unmerged. Record in `claude-progress.md` that it was
      superseded by this spec and where its parts went.

## 3. Gate-hardening (separate ticket, order per §10.2 ruling)

- [ ] Extend `audit:type`'s card pass beyond `p, li, blockquote, dd` to include `code`, `pre`,
      `td`, `th`, `dt`, and `span` carrying own text.
- [ ] Extend the sitewide floor pass to the same tags, and re-examine the 40-character
      threshold that currently hides short labels.
- [ ] Re-examine where `META_EXEMPT` is drawn, in light of the §10.1 ruling.
- [ ] Expect the tree to go red. Fix what it legitimately catches. This is the point.

## 4. Card and ground separation

- [ ] Move `--color-card` and the card border and shadow tokens so the card reads as a distinct
      surface, both themes. Warm neutrals, no pure white.
- [ ] Re-probe the separation. Record before and after numbers.
- [ ] `audit:visual`, `audit:contrast`, `audit:axe` green. This touches every card sitewide, so
      check `/work`, `/about`, and a case study, not just this page.

## 5. Prose leaves the cards

- [ ] Move every prose-only card on `/design-system` onto the band ground.
- [ ] Reserve `<Card>` for inspectable specimens.
- [ ] Fix the code specimen's 14px reading text to the floor.
- [ ] Gate green. Screenshot: this alone should visibly restore hierarchy.

## 6. The gate table

- [ ] Replace the fourteen gate cards with a real `<table>`, `th` scope attributes, one row per
      audit, count derived from the audit list rather than typed.
- [ ] Row detail on demand via `ui/DisclosureCard` semantics, keyboard operable.
- [ ] Wire status per the §7 ruling: the gate-written artifact with its run date, or no status
      column at all.
- [ ] Collapse the surrounding gate prose to one line.
- [ ] Horizontal scroll inside the table container at 390px; page body never scrolls sideways.
- [ ] `audit:type` on `td`/`th`, `audit:axe` on table semantics, both themes.

## 7. Maturity

- [ ] Move `BellaMaturityMap` onto the band ground, out of its card.
- [ ] Enlarge it past every specimen card on the page.
- [ ] Add the explicit current-position marker per axis, labelled in text, not position alone.
- [ ] Merge `AiReadinessExplainer` into this section as the framework caption. Delete its
      standalone band.
- [ ] Leave Elleta's verbatim rationale copy alone unless she ruled otherwise under §10.8.

## 8. The pipeline instrument

- [ ] Build `components/ContractPipeline.tsx`. One component, three stages.
- [ ] SOURCE: a real control writing a scoped CSS custom property. No inline hex, no inline px.
- [ ] MANIFEST: render the DTCG entry using `dtcgToken()` imported from `lib/bella/tokens.ts`.
- [ ] REFUSAL: compute the contrast ratio in the browser with the same relative-luminance maths
      as `scripts/contrast-check.mjs`. Real number, real verdict.
- [ ] Render the receipt using the separator decided under §10.5.
- [ ] Resting state: all three stages present as real text, no interaction required, no
      JavaScript required. Verify with JS disabled and with find-in-page.
- [ ] Keyboard: full operation, visible focus independent of any trace, correct ARIA state.
- [ ] Live region announces the verdict flip. Verdict never conveyed by colour alone.
- [ ] `prefers-reduced-motion: reduce` renders end states with no transition.
- [ ] Fold the agents narrative in as one closing line naming `/api/bella.json` and `/llms.txt`.
- [ ] Delete the standalone `ds-agents` band.
- [ ] Verify the failed state clears AA in both themes and passes `audit:axe`.

## 9. Reorder the spine and retire the old bands

- [ ] Reorder to `ds-open`, `ds-pipeline`, `ds-gate`, `ds-maturity`, `ds-specimens`, `ds-close`.
- [ ] Collapse Identity, Type, Colour, Spacing, Controls into the single `ds-specimens` section
      with the tighter recessive rhythm.
- [ ] Build the opening stat line from computed counts.
- [ ] Apply the signature-versus-recessive spacing so one read-path is visible.
- [ ] Cut `DesignSystemNav` `SECTIONS` to the six.
- [ ] Handle the nine retired anchors per the §10.6 ruling.
- [ ] Resolve the audit-count prose per the §10.8 ruling.

## 10. Orphan sweep

- [ ] `grep -rn "What agents read"` returns nothing.
- [ ] No retired band markup survives anywhere.
- [ ] `npm run audit:reuse` green.
- [ ] Exactly one new component file exists.

## 11. Verify

- [ ] `npm run build` and `npx tsc --noEmit` clean.
- [ ] `npm run lint` introduces no new errors.
- [ ] Wipe `.next`, start the prod server, confirm its working directory, run `npm run gate`.
      All 15 green, `audit:nda` included.
- [ ] All 13 routes 200, light and dark.
- [ ] NDA content-grep clean.
- [ ] Type-floor probe and separation probe re-run. Record the after numbers.
- [ ] `cmp` proves `/api/bella.json` unchanged.
- [ ] Capture every artifact in `requirements.md` §M.

## 12. The 30-second test

The one check that is not automatable, and the reason for the whole redesign.

- [ ] Show the page cold to someone non-technical for 30 seconds. Ask what BELLA is and whether
      it is real. If the answer is vague, the hierarchy failed and the spine needs another pass.
- [ ] Show it cold to an engineer for 30 seconds. Ask what governs it. If they cannot name the
      gate or the pipeline, the lead proof is not leading.
- [ ] Record both answers in the PR. This is the acceptance criterion the gate cannot check.

## 13. Ship

- [ ] PR with the template: what changed, local gate output, every §M artifact, the Vercel
      preview link, and the Elleta-approval line for the content changes.
- [ ] Merge only on green. No direct push to main.
- [ ] Update `claude-progress.md`: what shipped, how verified, known risks, next action.
