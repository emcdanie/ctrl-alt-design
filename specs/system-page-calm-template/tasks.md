# tasks.md, system-page-calm-template

Smallest first, and **"The parts" is built first as the proof**. If the template does not
convince there, nothing else should adopt it. Nothing is built. Do not start until the six
decisions in `requirements.md` §K are answered.

---

## 0. Decisions

- [ ] Get Elleta's ruling on all six items in `requirements.md` §K.
- [ ] Fold the answers into `design.md` before writing code.

## 1. Baseline

- [ ] Confirm the page renders as it does today, both themes, desktop and 390px.
      Screenshot every section as the before.
- [ ] Capture `/quick` and `/design-system/inspector` too, since §5.3 means they move.
- [ ] Run `npm run gate` once, green, so any later red is provably this work.

## 2. The shell recipe (no visible change yet)

- [ ] Add `.ds-shell__head` to `globals.css`: eyebrow, heading, lede, constrained measure.
- [ ] Apply it to ONE section that already has all three parts, to prove the recipe.
- [ ] Gate green. Commit alone.

## 3. THE PROOF: rebuild "The parts" to the mockup

Everything after this depends on this looking right.

- [ ] Add `.ds-spec-card`, `.ds-spec-card__name/__role/__stage/__list`, `.ds-spec-row`.
- [ ] Build the six control cards from the mockup, each holding the **real** `ui/`
      primitive on its stage.
- [ ] Spec lists read live values; token names use `TokenName`.
- [ ] Reserved role height and `margin-top: auto` on the list.
- [ ] Delete the local `SpecimenCard` and the leader/flag usage in this section only.
- [ ] Screenshot both themes and **stop for Elleta's eye before continuing.** If the
      template is wrong, it is wrong once, not five times.

## 4. Case identity as a swatch grid

- [ ] Replace the orb band with the quiet swatch grid: name plus swatch.
- [ ] Keep exactly one orb, as the Bubble specimen card in The parts.
- [ ] Confirm no `--case-*` token is orphaned. Run `audit:reuse` early.

## 5. The opening keycap

- [ ] Apply the calm treatment per the §5.3 ruling.
- [ ] Remove the dashed ring and the zone buttons from the System page.
- [ ] **In the same commit**, delete `audit:visual`'s trace-ring assertion, so no check is
      left matching nothing.
- [ ] Check `/quick` and `/design-system/inspector` in the same pass.

## 6. The remaining sections adopt the shell

- [ ] Colour, Spacing and radius, Type: shell header on each.
- [ ] Type keeps its ramp shape per the §5.7 ruling, with its tokens in the shared
      spec-list recipe so it rhymes with the cards.
- [ ] The three hero sections gain the shell header and nothing else changes inside them.

## 7. Delete the leader layer for real

- [ ] Remove every retired selector listed in `requirements.md` §A from `globals.css`.
- [ ] Remove the retired data (`ANN`, `ORB_TOKENS`, `TYPE_FLAGS`, `flagsAriaHidden`).
- [ ] Strip `TokenAnnotation`'s flag rendering now nothing consumes it; re-home
      `TokenName`.
- [ ] **Verify `FlagLeaders` and `CaseSpecimen` still work on all three case routes.**
- [ ] Verify `.trace-host` still exists and `audit:visual`'s card set is still non-empty.
- [ ] `grep` sweep for every retired name. Zero hits.

## 8. Wire the new grid into the gate

- [ ] Add the specimen-card grid to `audit:visual`'s tracked equal-height selectors.
- [ ] Confirm it actually matches elements, so the check is live rather than decorative.

## 9. Verify

- [ ] Wipe `.next`, prod build, serve, confirm the server's working directory.
- [ ] Full gate, all 15 green, `audit:nda` included.
- [ ] tsc, build, lint, 13 routes 200 both themes.
- [ ] Zero `.ds-leaders` on `/design-system`.
- [ ] Row heights and stage tops measured equal.
- [ ] Capture every artifact in `requirements.md` §J.

## 10. The calm test

The check the gate cannot run, and the reason for the whole ticket.

- [ ] Scroll the page top to bottom at speed. Count the moments that demand attention.
      There should be three: the pipeline, the maturity map, the agent-or-drift diagram.
      If a specimen card competes with them, the template is still too loud.
- [ ] Record the answer in the PR.

## 11. Ship

- [ ] PR with the template: what changed, local gate output, every §J artifact, the
      Vercel preview link, and the Elleta-approval line.
- [ ] Merge only on green. No direct push to main.
- [ ] Update `claude-progress.md`: what shipped, what was deleted, known risks.
