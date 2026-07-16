# Find your fit — design

## What and why
A recruiter pastes a role or job description; the site surfaces the 2 or 3 cases that
match and shows why. This is the site's one AI touchpoint, built to the house rules:
verifiable, honestly labelled, calibrated. The match is a suggestion, never a gate.

## How matching works (honest, local, no black box)
Pure client-side keyword matching over her own structured data. No model call, no
network, no recruiter data leaves the page.

- `lib/fit.ts` (new lib module, pure logic): a `SKILL_TRIGGERS` map from each entry in
  `SKILLS` (lib/workLibrary.ts) to a small set of trigger phrases (the skill name plus
  close synonyms, e.g. Design Tokens: "tokens", "token architecture", "theming").
- The JD text is scanned for trigger phrases; matched skills map to cases through the
  same `WORK_ITEMS[].skills` arrays that drive the library and the matrix.
- Case score = count of distinct matched skills; top 2 or 3 with score > 0 win.
- The mapping (JD phrase, then skill, then case) is kept and shown, so the result is
  verifiable in under ten seconds. No generated prose anywhere.

FLAG: the brief's summary line example says "agent-ready systems"; no current skill or
trigger produces that phrase. The summary is template-composed from matched skill names
only, so wording follows the data.

## Placement (decision for review)
Default proposed: a compact section at the top of /work, above the library controls.
Collapsed to one line ("Hiring? Paste the role, I'll point you at the closest work.")
with the textarea revealed on expand, so the library stays the page's subject.
Alternative: a small /fit route linked from Contact. Trade-off: /work placement meets
recruiters where they already are but adds a block above the library; /fit keeps /work
untouched but few will find it. No top-nav item either way.

## Reuse (checked first, per the reuse-first rule)
- Input: plain `<textarea>` styled with the existing form field styles from
  ContactSection. Not a component.
- Results: the EXISTING reveal card (the BubbleCluster peek: pin card, colour-trace
  border in light, case-colour edge halo in dark). The pin card markup currently lives
  inline in BubbleCluster; it is extracted to `components/ui/RevealCard.tsx` and
  BubbleCluster consumes it unchanged. That is a refactor of an existing component to
  one implementation, not a new primitive: after it, exactly one pin-card
  implementation exists.
- Labels: existing eyebrow style for the "AI MATCH" text label (never a sparkle);
  existing Tag for matched-skill chips.
- Button: existing keycap Button, secondary variant ("Find my fit"). /work keeps its
  primary budget untouched (the mobile tray apply button is the view's primary when
  open).
- Colour: existing case identity tokens only (hi/lo/deep/text per case).
- Mapping detail: native `<details>` under each result ("Why this match"), one row per
  JD phrase, then skill, then case.
- New components: RevealCard (extraction, justified above). New lib module: fit.ts
  (pure matcher, one file one job). Nothing else.

## Behaviour
1. Paste text, press Find my fit (Enter submits; Shift+Enter newlines).
2. Above the results: an explicitly labelled block. Eyebrow-style label reading
   "AI MATCH", then ONE template line: "Your role emphasises {skill}, {skill}, and
   {skill}. Closest fit: {case} and {case}." No model narration.
3. Results: 2 or 3 RevealCards in the matched cases' identity colours, each with
   kicker, title, matched-skill Tags, "Why this match" details, and Read case link.
4. Zero matches: honest empty state ("No strong match in the library for that text."),
   plus the Show everything link. Never a fake match.
5. Human override: "Show everything" link under the results scrolls to the full
   library; all cases stay browsable at all times; filters untouched.

## A11y and conformance
- Textarea has a visible label; results region `aria-live="polite"`; after a match,
  focus moves to the AI MATCH summary heading.
- Keyboard order: textarea, button, summary, cards, Show everything.
- Reduced motion: the reveal card's existing static-trace fallback applies.
- AA both themes (the reveal card is a fixed-context light card by design; its ink
  tokens already pass).
- Dark mode on every surface via tokens; no new colours.

## Gate note
The brief names `audit:reuse`; no such audit exists in the gate today
(structure, copy, nda, controls, contrast). Options: (a) treat the reuse checklist as
review-enforced here, or (b) add a small `audit:reuse` that fails on new files under
components/ not referenced by more than zero routes, or on a second pin-card
implementation. Decide at review; (a) assumed for this spec.
