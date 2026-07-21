# System page v3 — one ground, cards carry the page, the gate tells the slip story

Approved: Elleta, 21 Jul 2026, via Cowork (base brief + T5/T6 amendment).
SOURCE CAVEAT, recorded: the brief cites `claude/modeless-system-page-audit.md`
sections 4-5 as the source doc; that file does not exist in the repo at
execution time (searched whole tree). This spec is sourced from the brief's
own text verbatim; reconcile against the doc when it lands.

Constitution applies throughout: tokens only, one implementation, 16px
reading floor, no em dashes, TODO(elleta) slots never render publicly.

## T1 — one ground

/design-system renders on the page ground only, both themes. `ds-band--card`
and every per-band background retire. RECORDED EXCEPTION (Elleta's call):
the Case identity band keeps its low-tint five-hue wash as the page's single
background moment. Enforcement: `audit:visual` (new, see T5) asserts every
`.ds-band` computed background equals the page ground except the identity
band. No band may gain a surface again.

## T2 — cards carry the structure

Every content unit renders through ui/Card on that ground: colour swatch
groups, identity sphere entries, control demos, spacing/radius scales, the
inspector, the agents sample, status rows, gate entries. The numbered Rules
list stays a numbered list (system law, not cards). Identity hues live
inside cards and orbs, never as section surfaces. Unique section heads stay
on the shared SectionHeader; map rail + scroll-spy keep working.

RECORDED EXCEPTION (constitution beats composition): the TYPE band's
display-face specimens (Unique samples through the Heading primitive)
render on the ground, NOT in cards — "Unique never renders inside a Card"
is a hard rule and the specimens ARE Unique. Enforcement moves from the
file-level static check to a runtime assertion in audit:type (no element
inside a card scope may compute the Unique family); DesignSystemSpecimens
joins the static check's reasoned exemption list.

## T3 — the map describes

Each DesignSystemNav rail item gains a one-line purpose description under
its label, rendered only when filled; ALL are TODO(elleta) slots for her
voice. Rail layout holds with and without descriptions; the pill row
(small screens) stays label-only. COUNT NOTE for Elleta: the brief says
"all ten"; the map has NINE links (Identity, Type, Colour, Spacing,
Controls, Inspector, Agents, Rules, Gate). Nine slots created; name the
tenth if one is missing.

## T4 — "How the gate works"

One merged section replaces the PASS-chip grid and ABSORBS the PR 30
receipts structure (moved, not duplicated; the standalone dark section is
deleted). Per audit, one card: name, one line on what it catches, and,
where real, the receipt of a slip it caught or missed — receipts are
TODO(elleta) slots with factual scaffolding kept beside them:
- audit:parity — the parity miss (Travel Booking's missing library row).
- audit:axe — the ink-soft dark blind spot (8 reported nodes verified
  clean, the real miss was 3 readiness-map cells; axe became the tripwire).
- the CI harness card (tsc + build + the audits on every PR) — CI run #1
  catching the module-scope Resend client; the red run is history, told
  honestly.
Honest "not covered yet" line: hover states are not pixel-snapshotted and
CI skips pixel comparison (the local gate enforces those). Status stays two
columns, Available now vs Coming next, as card rows; the coming list from
the real plan docs: Storybook full component set, the Figma leg, BELLA
Brain MCP, npx bella init, BFW inspection baseline pending. Twelve green
chips alone must never appear anywhere.

## T5 — specimen alignment (amendment)

Structural, not nudged: ONE specimen grid recipe with equal-height cards
(grid stretch); specimen name + when-to-use line in a fixed-height head
slot so every demo area starts on the same line; demo content centred in
the shared body recipe; the annotation control pinned to the card bottom.
`audit:visual` asserts sibling specimen cards in a row render equal
heights.

## T6 — redline spec annotations (amendment)

TokenAnnotation redesigned (one implementation; live computed-style reads
and the theme re-read stay): redline-style measurement flags with leader
lines, the annotation grammar of a design spec — radius flags at the
corner, size flags on the edge, colour flags by the fill, resolved value on
the flag with the token name. An annotate toggle PER BAND (relocated
trigger, iris interactive, aria-pressed, keyboard reachable, default OFF)
turns the overlay on/off; reduced motion safe; flags never trap focus
(aria-hidden, pointer-events none). Flags style themselves from BELLA
tokens (accent ink on ground, mono values); flags are METADATA tier,
RECORDED as exempt from the 16px reading floor. Both themes AA. Flags must
not overlap specimen content at 1440 or 390; tight space puts the flag
outside the card edge like a real redline.
MODE NOTE (one implementation, two consumers): the keycap TokenInspector
keeps consuming the component's readout-list mode (its zone buttons are its
annotation grammar); the flags mode is the specimen-facing presentation.

## audit:visual (new, thirteenth audit)

Her briefs have named audit:visual three times; it now exists:
scripts/audit-visual.mjs — (1) band grounds equal the page ground except
identity (T1), (2) sibling specimen cards equal heights (T5), (3) the
cover-placeholder 3:1 check MOVES here from contrast-check (one home for
visual assertions). Gate becomes THIRTEEN audits; CLAUDE.md §9, System
gate data, and DESIGN.md updated.

## Verification

Full gate green including audit:visual, tsc clean, all routes 200 both
themes, screenshots 1440/390 light+dark plus BEFORE/AFTER of the Identity,
Controls, and Gate bands and the annotated state both themes, all in
_review/after/system-v3/. STOP at preview with the PR link and the list of
TODO(elleta) slots awaiting her words.
