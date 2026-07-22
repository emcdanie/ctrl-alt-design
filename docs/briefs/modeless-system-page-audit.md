# Modeless /design-system audit, take 2 (persisted this time)

> Repo copy committed from the Cowork project doc claude/modeless-system-page-audit.md
> (the source the v3 spec cites; it lives in the claude.ai project, which terminal
> sessions cannot read — hence this copy). Decisions resolved 21 Jul 2026: one ground
> yes; identity wash is the single accent moment; gate + ledger merged.

Redone 21 Jul 2026 (late evening) by Cowork from the full-page capture of
https://modeless.io/design-system/ after the first audit was lost with a frozen chat.
Purpose: name the layout grammar that makes the page feel consistent, diagnose why
Elleta's /design-system does not, and set the translation rules for BELLA. This is the
reference doc for the System page recomposition sitting.

## 1. What Modeless actually does (observed)

Section order on Overview: page head (kicker "06 / Design infrastructure", title, one
positioning sentence) → tab row (Overview, Get Started, Distribution, Foundations,
Components, Patterns, Specimens) → left map rail where every item carries a one-line
description, not just a label → intro statement with two buttons + one text link →
System at a glance (four layer cards: Foundations, Components, Patterns, Specimens) →
Live primitives (eight real components in cards: buttons, chip, search, data card,
alert, table row, panel) → Product principles (five cards) → Every surface has three
exposures (human-facing, agent-facing, private) → Rules of the system (numbered 01-07,
one line each) → Current status (Available now vs Coming next, two columns of rows).

## 2. The layout grammar (why it feels like one page)

- ONE ground. Near-black everywhere. Zero band tints. No section announces itself with
  a background change; the page is a single surface from top to bottom.
- The card is the only structural device. Every unit of content (primitive, principle,
  status row, map item) sits in the same thin-bordered card frame on that one ground.
  Rhythm and grouping come from the grid and whitespace, not from surface changes.
- One signal colour with one job. Lime marks signal, action, and active state only
  (their rule 02). Everything else is bone on black. The accent never decorates.
- Kickers are one mono voice. Small caps mono labels above everything (SYSTEM LAYER,
  PRINCIPLE, 01 / EXPOSURE). One metadata register for the entire page.
- The map rail describes, not just labels. Each item has a purpose line under it. The
  rail is content, which is why it earns its width.
- Numbered rules read as system law. 01-07, one line each, no elaboration.
- Live primitives are real. Working controls in cards, same claim Elleta's page makes.
- Honest maturity: Available now vs Coming next as equal columns; the coming list is
  specific (full component documentation, usage examples, accessibility notes, Figma/
  package distribution, agent-facing schema examples). Nothing pretends to be done.
- Everything is quiet except content scale. Titles are big; surfaces never compete.

## 3. Why Elleta's page felt inconsistent against this (pre-v3)

- Four different backgrounds on one page: the identity band's five-hue gradient wash,
  card-tint bands (ds-band--card), plain-ground bands, and the dark receipts band.
  Each band change reads as a template change.
- Structure by band, not by card. Content sat directly on band surfaces; the one-card
  system existed but was not the page's structural device.
- The gate section was a trophy shelf: twelve green PASS chips. Elleta's explicit
  intent: show how things slip and how the gate catches them. Green only means
  something next to the reds it survived. (Adam Fard decision, 21 Jul.)
- The map rail was labels only; Modeless's rail carries a purpose line per section.

## 4. Translation rules for BELLA (NOT a reskin; identity stays hers)

- One ground per theme: warm ground light / navy dark. Retire ds-band--card and every
  per-band surface change. Band tints gone.
- EXCEPTION (Elleta, 21 Jul): the Case identity band keeps its low-tint five-hue wash
  as the page's single background moment.
- The one-card system becomes the page's only structural device: specimens, swatch
  groups, rules, status rows, gate entries all render through Card on the one ground.
  This also makes the page the best possible demo of the extracted bella Card.
- Iris keeps its one job (interactive only). Identity hues live INSIDE cards (orbs,
  swatch chips), never as section washes.
- One metadata register: the existing mono eyebrow/kicker tier everywhere; full
  sentences stay on the 16px+ reading tier (conformance-sweep, #31).
- Map rail gains a one-line description per section, Elleta's words, TODO(elleta)
  slots until written.
- Keep Unique section heads (conformance-sweep decision stands). Modeless's quietness
  comes from surfaces, not from timid headings.
- Do not copy: the black hacker palette, lime, grid texture, sharp corners. BELLA is
  warm, editorial, keycap depth, 24px radius. The grammar transfers; the look does not.

## 5. The gate section, redesigned as "how things slip"

Merge the gate display and the misses ledger (PR 30 receipts) into ONE section:
- Each audit renders as a card: name, one line on what it catches, and where real,
  the receipt of a time it caught something or was blind: parity miss, ink-soft dark
  gate blind spot, CI run #1 catching the Resend bug (red run is HISTORY, told
  honestly). TODO(elleta) slots for her voice.
- An honest coverage line: what the gate does not check yet (hover pixel states,
  CI-side pixel comparison) so green has meaning.
- Status stays two honest columns (available now vs coming next), Modeless-style rows
  through Card; coming list from the real plan docs (Storybook full set, Figma leg,
  Brain MCP, npx bella init) plus the BFW inspection baseline (bella PR #6, 67/100).
