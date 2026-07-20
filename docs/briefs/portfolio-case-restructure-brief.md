# Case study restructure: approved headlines and live review findings

18 Jul 2026. For the next working session (Cowork editorial, then terminal applies).
Source of authority: Elleta approved the headline list in the 17-18 Jul Cowork session.
Pairs with docs/briefs/portfolio-pass-e-reconciliation.md (task 11 carries the
mechanical template fixes; this doc carries the approved content decisions and the
editorial plan). Constitution applies. Her words stay verbatim. No em or en dashes.

## Approved statement headlines (Elleta, 18 Jul)

Template rule: the case display headline is the case THESIS, set in Unique at hero
scale in the case identity colour. CHIP is the reference. The case NAME moves to the
sidebar and breadcrumb only.

1. Code First: WORKING CODE-FIRST CHANGES WHAT YOU PAY ATTENTION TO.
   (her pull quote, verbatim, trimmed at the first sentence)
2. Guardian: GOVERNANCE WAS ARRIVING TOO LATE, AT THE HIGHEST POSSIBLE COST.
   (her pull quote, verbatim)
3. Travel Booking (filters): CAPABILITY WITHOUT CLARITY IS JUST A DIFFERENT KIND
   OF FRICTION. (her pull quote, verbatim)
4. From Drift to Foundation: THE SYSTEM IS THE SET OF AGREEMENTS, NOT THE
   COMPONENT LIBRARY. (composed from her About thesis; approved 18 Jul)
5. Operational Clarity: SIX OPERATIONAL DOMAINS. ONE INTERFACE. EIGHT WEEKS.
   (composed from case facts; approved 18 Jul)

CHIP keeps its existing headline. A pull quote promoted to the headline should not
also remain as a pull quote in the same page; keep whichever placement serves the
page and delete the duplicate.

## Live review findings (verified on production, 18 Jul)

Mechanical, already specced as Pass E task 11 e to h:
- More-work-like-this: 3 cards in a 2-col grid orphans the third; render one
  3-col row at desktop.
- Eyebrow collisions: CONTEXT twice on brad-frost; REFLECTION over Reflection.
  Rule: a section eyebrow repeats neither a summary label nor its own heading.
- Sidebar meta: one canonical ordered field set for every case; omit empty rows.
- Statement headlines per the approved list above; never invent wording.

Editorial (this doc's plan, needs Elleta per case):
- Code First runs three long prose sections before its first visual; CHIP shows
  evidence within two scrolls. Pacing comes from the restructure, not CSS.

## Census (why the pages feel different)

- CHIP: tight decision-led. 3 decisions, readiness map, 3 figures. Reference.
- From Drift to Foundation: tight decision-led. 3 decisions. Close to reference.
- Code First: essay with decisions appended. 6 sections, 21 paragraphs, 2 decisions.
- Guardian: essay with decisions appended. 9 sections, 24 paragraphs, 3 decisions.
- Travel Booking: pure essay. 11 sections, 20 paragraphs, ZERO decisions.
- Operational Clarity: essay. 7 sections, 17 paragraphs, 2 decisions, two summary
  blocks (the duplicate merges verbatim in Pass E).

## Restructure plan (one case per sitting, Cowork first, terminal applies)

Order: Travel Booking, Code First, Guardian, Operational Clarity. Drift and CHIP
need no restructure.

Per case, in a Cowork session with Elleta:
1. Read the case file's sections and paragraphs.
2. Propose which existing paragraphs become which decision blocks (titles from her
   section headings or her call). Prose moves VERBATIM; empty why slots get
   TODO(elleta) markers she fills in the session, in her words.
3. Propose evidence placement so a visual lands within the first two scrolls.
4. She approves the mapping; the terminal session applies it as content edits and
   runs the gate.

Standing rules: nothing invented, NDA abstraction stays (industry not client),
disclosure lines stay on the two NDA cases, no em or en dashes, her voice only.

## Where things stand otherwise

- Live: main at b615ba3 plus the About truth fix (9a29243). Gate 9 audits green.
- Queued: Pass E (docs/briefs/portfolio-pass-e-reconciliation.md, 11 tasks, two
  STOP points: primary button style, About thesis direction).
- Elleta's open items: NDA disclosure wording read, accessibility evidence lines,
  CHIP personal lines and Loom URL, logo uploads, backup mirror deletion,
  ANTHROPIC_API_KEY plus spend cap in Vercel.
