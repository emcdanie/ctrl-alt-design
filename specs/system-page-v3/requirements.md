# System page v3 — requirements (testable)

1. Every `.ds-band` computed background equals the page ground in both
   themes EXCEPT `.ds-band--identity` (the recorded wash). `ds-band--card`
   no longer exists in CSS or markup. audit:visual asserts it.
2. Colour groups, identity entries, control demos, scales, inspector,
   agents sample, status rows, and gate entries each render inside ui/Card.
   The Rules list is a numbered list, not cards. Zero Unique computes
   inside any card scope at runtime (audit:type assertion); the TYPE
   display specimens render on the ground (recorded exception).
3. Map rail: nine description slots exist, all TODO(elleta), rendering
   nothing while empty; rail alignment identical with 0 or 9 filled;
   pill row unchanged. Scroll-spy + anchors still work.
4. Gate section: one "How the gate works" band; one card per audit with
   name + what-it-catches; receipt TODO slots wired on audit:parity,
   audit:axe, and the CI harness card with factual scaffolding comments;
   the standalone receipts section is GONE (moved); the "not covered yet"
   line renders; status = two columns of card rows with the real coming
   list; no bare grid of green PASS chips anywhere.
5. Specimen grids: sibling cards in a row compute equal heights
   (audit:visual); head slots fixed-height so demo areas start level;
   annotation toggles pinned at card bottoms.
6. Annotations: per-band toggle (aria-pressed, keyboard, iris) reveals
   redline flags with leader lines; values live-read and re-read on theme
   flip; flags aria-hidden, no focus trap, no overlap with specimen
   content at 1440/390; both themes AA for flag text on its own ground;
   default state is off. TokenInspector still renders its readout list
   through the same component.
7. Gate 13/13 (audit:visual joined; cover check moved out of
   contrast-check), tsc clean, routes 200 both themes.
8. Evidence in _review/after/system-v3/: full-page 1440/390 both themes,
   band BEFORE/AFTER (identity, controls, gate), annotated state both
   themes. PR STOPPED at preview with the TODO(elleta) slot list.
