# design.md, system-page-calm-template

**Status:** spec only, awaiting Elleta's review. Nothing built.
**Branch:** `spec/system-page-redesign` (continues from `65e5418`).
**Reference:** `_proto/the-parts-calm-template.html`. That mockup is the template.
**Supersedes:** the current specimen and case-identity treatment on `/design-system`.

---

## 1. The problem

`/design-system` is noisy, and the noise has two named causes.

**Cause one: the same diagram, roughly fifteen times.** The page repeats one figure over
and over: a token chip, a leader line, and a specimen floating at the end of the string.
It runs on the opening keycap, on all eight case orbs, on the type ramp, and on every
control. Each instance is defensible. Fifteen of them on one page is a thicket, and the
eye has nowhere to rest. The leader lines in particular are drawn geometry pretending to
be information: they connect a label to a thing that is already six inches away and
obviously the subject.

**Cause two: every section invents its own layout.** Identity is an orb grid, Type is a
ramp with a side rail, Colour is a swatch grid, Spacing is a scale list, Controls is a
mixed row. Five sections, five compositions, five sets of rules for the reader to learn.

The fix is not more polish on each. It is **one quiet template, repeated**, so the page
teaches its own grammar once and then gets out of the way. The three moments that
genuinely earn special treatment keep it, and they read as special precisely because
everything around them stopped shouting.

## 2. The template

Straight from the mockup, expressed in this repo's tokens.

### 2.1 The section shell, reused everywhere

```
ds-band > layout-container > section.ds-section
  .ds-shell__head        (max 60ch, on the open ground)
    eyebrow              "The parts"
    keyline heading      "Every control has one job."
    lede                 one line, what the section is for
  <the section's content>
```

Three parts, always in that order, always on the ground, never in a card. Every section
on the page adopts it, including the ones keeping their hero content.

### 2.2 The specimen card

```
.ds-spec-card
  .ds-spec-card__name    the component name
  .ds-spec-card__role    ONE line, what it is for, reserved height so cards align
  .ds-spec-card__stage   the REAL component, centred, on a quiet inset
  .ds-spec-card__list    the tokens, an aligned two-column spec list
    .ds-spec-row         [ swatch? + token name ]            [ value ]
```

Rules that make it calm, each doing real work:

- **The stage is an inset, not a void.** A quiet surface panel with its own radius, so
  the specimen is clearly *on* something rather than floating.
- **The tokens are a list, not chips on strings.** Name left, value right, one small
  swatch for colours. Aligned columns, so the eye reads down a rule instead of hunting.
- **The role line reserves its height** so a one-line and a two-line role still put every
  stage on the same line across a row.
- **The spec list pins to the bottom** (`margin-top: auto`), so cards of different
  content depth still align their lists. This is what makes equal-height rows read as
  deliberate rather than stretched.
- **No leader lines. No floating chips. No connector strings. Anywhere on this page.**

### 2.3 Case identity becomes a swatch grid

The hue *is* the identity. That was always the claim, and eight orbs on strings was an
elaborate way of saying it. Each case becomes one quiet cell: the case name and its
swatch. Linked where a case page exists, plain where it does not, one type treatment for
both (already fixed in `65e5418`).

The orb does not disappear from the page. It survives once, as a specimen card in The
parts, exactly as the mockup has it ("Bubble, the case orb, one light source, upper
left"). One orb demonstrating the recipe is a specimen; eight orbs demonstrating the same
recipe is wallpaper.

### 2.4 The opening keycap

Same calm treatment: the keycap on a stage, its tokens as a spec list, no dashed
selection ring, no zone buttons wired to leader lines. See §5.3 for the complication,
because this component is not only used here.

## 3. What gets deleted, and what must not be

The anti-drift rule means the old treatment cannot linger beside the new one. But the
brief's phrase "the leader-line / trace-host annotation system" bundles together things
that are not the same system, and one of them is load-bearing. Read this section before
deleting anything.

### 3.1 Delete: the leader and flag layer, on this page

| Thing | Where | Note |
| --- | --- | --- |
| `FlagLeaders` usage in `SpecimenCard` | `DesignSystemSpecimens.tsx` | the in-card leader SVG |
| `TokenAnnotation` usage in `SpecimenCard`, the Type band, the orb band | `DesignSystemSpecimens.tsx` | the flag lane |
| `.ds-leaders`, `.ds-leaders line` | `globals.css` | the leader layer |
| `.ds-flaglane`, `.ds-flag`, `.ds-flag__row`, `.ds-flag__chip`, `.ds-flag__value`, `.ds-flag__token` | `globals.css` | the chips |
| `.tok-inspector__ring`, `.tok-inspector__ringwrap`, `.tok-inspector__zones`, `.tok-inspector__zone` | `globals.css` | the dashed ring and zone buttons |
| `ANN`, `ORB_TOKENS`, `TYPE_FLAGS`, `flagsAriaHidden` | `DesignSystemSpecimens.tsx` | the data that fed them |

### 3.2 Do NOT delete: `.trace-host`

**`.trace-host` is not the annotation system.** It is the shared travelling-border-light
recipe, and the constitution names it explicitly in §5: the primary button's "hover gains
the travelling border light (the SHARED `.trace-host` recipe, never a copy)". It is
consumed by:

- `components/ui/Button.tsx` (the primary, per §5)
- `components/ui/Card.tsx` and `Card.module.css` (every card on the site)
- `app/about/page.tsx`, `components/LayerJourney.tsx`, `components/CodeFirstV2.tsx`
- **`scripts/audit-visual.mjs:120`**, which defines its entire card set as
  `.trace-host:not(.btn-key)`

Deleting it would break the primary button's specified behaviour, restyle every card on
every route, and silently empty the visual gate's card selector so containment and
uniformity would stop being checked anywhere. Flagged in §5.1 as the spec's most
important correction to the brief.

### 3.3 Do NOT delete: `FlagLeaders` the component

The leader system leaves `/design-system`, but the component stays in the tree, because
`components/CaseSpecimen.tsx` imports it and that powers the case-study beats
(`CodeFirstV2`, `LayerJourney`, `GateRun`, `SpecimenStage`). Those are the hero moments
item 4 says to keep, including the agent-or-drift diagram.

`audit:visual` also asserts heavily on case-route leaders: stage geometry, leaders
crossing only empty ground, leaders not traversing the card body. Those checks stay
meaningful only while the case leaders exist.

**So the deletion is scoped: leaders leave the System page, not the codebase.**
`TokenAnnotation`'s flag rendering, however, has no consumer left once the System page
stops using it, so that part genuinely goes. `TokenName` (the mid-token wrap fix) must be
preserved and re-homed, because the swatch grid still needs it.

### 3.4 Keep as-is: the three hero moments

Untouched by this spec, and they now sit in a quiet page rather than a busy one:

- **The pipeline instrument** (`ContractPipeline.tsx`), the lead proof.
- **The maturity map** (`BellaMaturityMap.tsx`), on the ground, the one strong chart.
- **The agent-or-drift diagram** (`AiReadinessExplainer.tsx`), the framework caption.

Each gains the §2.1 shell header. Nothing inside them changes.

## 4. Reuse before create

| Need | Reuses | New |
| --- | --- | --- |
| Band and container | `ds-band`, `layout-container`, `ds-section` | no |
| Shell heading | `ui/SectionHeader` (see §5.2) | no |
| Card surface | `ui/Card` | no |
| Token name wrapping | `TokenName`, re-homed from `TokenAnnotation` | no |
| Live token values | the existing computed-style read in `DesignSystemSpecimens` | no |
| Control specimens | the real `ui/` primitives, unchanged | no |
| Case swatches | the `--case-*` token pairs already in `CASE_ORBS` | no |

**New CSS only:** `.ds-shell__head`, `.ds-spec-card` and its parts, `.ds-spec-row`,
`.ds-identity-grid`. **New components: none.** The specimen card is a composition of
`ui/Card` plus a CSS recipe, not a new primitive.

**Retired local component:** `SpecimenCard` inside `DesignSystemSpecimens.tsx` is
replaced by the calm card. One implementation, so it goes when the new one lands.

## 5. Where the template fights an existing constraint

Surfaced, not resolved. Elleta rules on each.

**5.1 "Delete the trace-host system" would break the primary button and the visual gate.**
The single most important correction in this spec. `.trace-host` is the constitution's
own §5 recipe and is `audit:visual`'s card selector. What the page actually needs gone is
the leader and flag layer (§3.1). This spec deletes that and leaves `.trace-host`
untouched. If the intent really was to retire the travelling border light as a *visual*,
that is a separate constitution change to §5 and should not ride in on a layout ticket.

**5.2 The mockup's heading is Geist. The constitution says display headings are Unique.**
The mockup renders its section heading as a 30px Geist 640 keyline. Constitution §3:
every display heading renders through the ONE `ui/Heading` primitive, Unique 700, and
section headers are that tier. Three options:
- Shell heading stays `SectionHeader` (Unique), and the mockup's calm is achieved by the
  eyebrow plus lede rather than by the face. Site-consistent, mockup-inexact.
- Shell heading becomes Geist, which needs a recorded exception in §3 for this page.
- The shell heading is Unique at a smaller step, which is nearest to the mockup's weight
  without a new face.
This spec proposes the first and flags that it is a visible departure from the mockup.

**5.3 The keycap specimen is used on three routes, not one.**
`TokenInspector` renders on `/design-system`, on `/quick`, and on
`/design-system/inspector`, where it is embedded chromeless as case evidence. Calming it
here changes it there. Either the calm treatment is applied to the component (so all
three routes change together, one implementation), or the System page stops using
`TokenInspector` and gets a plain keycap specimen card while the other two routes keep
the interactive one, which is two implementations of the same idea and exactly what the
anti-drift rule forbids. This spec proposes changing the component once, and notes that
`/quick` and the inspector route need a visual check in the same PR.

**5.4 Removing the dashed ring leaves a dead assertion in the gate.**
`audit-visual.mjs:189-206` asserts the trace ring keeps an equal offset on all four sides
of the keycap. If `.tok-inspector__ring` goes, that check silently matches nothing and
passes forever. It must be deleted in the same commit, not left to rot. This is precisely
the failure mode the `audit-visual-hardening` spec calls out.

**5.5 The mockup's type sizes are below the floor.**
The mockup sets the card name and role at 15px and the spec rows at 13px. The role line
is a reading sentence and must be at least 16px. The spec rows are token names and values,
the same tier as `.ds-swatch__name` and `.ds-swatch__value`, which `audit:type` already
exempts as metadata. Proposal: role at `--typography-font-size-base`, spec rows on the
metadata tier and added to `META_EXEMPT` by name. Elleta should confirm the spec list is
metadata and not reading text, because it is genuinely arguable.

**5.6 Dropping seven orbs may orphan tokens.**
Case identity currently renders eight orbs, each consuming a `--case-*-hi/lo` pair plus
`--shadow-orb`. As a swatch grid the pairs are still consumed, but `--shadow-orb` and the
`.ds-orb` recipe would be down to the single Bubble specimen. That is fine and intended,
but worth a check that nothing else depended on the orb band, and `audit:reuse` should be
run early rather than at the end.

**5.7 The Type band does not fit the specimen-card mould.**
A type ramp is not a component on a stage; it is a scale. Forcing it into the card
template would be the template fighting the content. Proposal: Type keeps the shell header
and renders as a plain ramp on the ground, with its tokens in the same aligned spec-list
recipe so it still rhymes. Named here so it is a decision rather than a drift.

**5.8 "Equal-height cards" is already asserted, at zero tolerance.**
`audit:visual` fails when siblings in a tracked grid differ by a single pixel. The new
grid must be added to that tracked list, and the reserved role height plus the
`margin-top: auto` spec list are what make it true rather than merely stretched.

## 6. Out of scope

The three hero moments' internals, the case-study routes, `/design-system/inspector`'s own
composition beyond what §5.3 forces, and any change to the token layer itself.
