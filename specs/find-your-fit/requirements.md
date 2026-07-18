# Find your fit — requirements

## Feature
- [ ] Pasting a JD that mentions tokens and governance surfaces From Drift to
      Foundation and Code First (verifiable against SKILL_TRIGGERS).
- [ ] Matching is fully client-side and deterministic: same input, same output; no
      network request fires on submit.
- [ ] Match data derives ONLY from lib/workLibrary.ts (skills arrays) via lib/fit.ts;
      no hand-maintained case list in the component.
- [ ] Output is capped at 3 cases; ties broken by case rank; zero matches shows the
      honest empty state, never a fabricated match.
- [ ] Every AI output block carries the visible text label "AI MATCH" (no sparkle, no
      icon-only signifier).
- [ ] The one-line summary is template-composed from matched skill and case names; no
      free prose, no reasoning narration.
- [ ] Each result exposes the mapping (JD phrase, skill, case) one layer down via
      details; a reviewer can verify a match in under ten seconds.
- [ ] "Show everything" is one click away from any state and the full library remains
      browsable underneath; the match never filters the library.

## Reuse
- [ ] Results render through the SAME RevealCard used by the BubbleCluster peek; after
      the change exactly one pin-card implementation exists (grep proves no duplicate).
- [ ] Input is a plain textarea using existing field styles; button is the existing
      keycap (secondary); labels use existing eyebrow/Tag primitives.
- [ ] No new colour values; case identity comes from existing case tokens.

## A11y
- [ ] Textarea has a visible label and is reachable by keyboard; Enter submits.
- [ ] Results region is aria-live polite; focus lands on the AI MATCH summary after a
      match; tab order is textarea, button, summary, cards, Show everything.
- [ ] Reduced motion: no trace animation, static ring (existing fallback).
- [ ] AA contrast both themes on every text node the feature renders.

## Standing gates
- [ ] Tokens only, no hardcoded hex or px in components.
- [ ] 1240 container and spacing scale; Unique 700 display only; Geist body.
- [ ] Control taxonomy respected; max one visible primary per view on /work in every
      state (tray open included).
- [ ] Dark mode on every surface.
- [ ] "AI-enabled" is the only positioning term; no em or en dashes anywhere.
- [ ] NDA-safe (runs over public case data only; nothing recruiter-entered is stored
      or sent).
- [ ] One implementation, no orphans; npm run gate green; tsc clean; all routes 200
      light and dark.
