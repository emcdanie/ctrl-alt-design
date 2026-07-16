# Two-speed flow + polish — requirements

- [ ] Home hero shows both doors: the library keycap and the quiet "Short on time?
      The quick version →" link; no "Current focus ↓" anchor; no current-focus
      section below the hero.
- [ ] /quick renders: positioning line, top 3 CaseCards (library default order),
      skills matrix (headers route to /work with the same params), live
      TokenInspector with a /design-system link, ONE primary contact keycap, and a
      quiet explore link. Existing components only.
- [ ] Work view switcher reads Table · Map · Cards · Skills; Timeline is gone
      (code and CSS); Cards is a CaseCard grid over the filtered items; sort Select
      appears on map/cards only.
- [ ] Footer colophon renders a real apostrophe; audit:copy fails \uXXXX escapes in
      JSX text and dash escapes in strings; the testimonial em-dash escape is gone.
- [ ] audit:reuse in the gate: no orphaned components (VinylPlayer + motion/*
      exempt); SurfaceCard deleted.
- [ ] Standing gates: tokens only; container + scale; Unique display only; control
      taxonomy (max one visible primary per view, incl. /quick); dark mode
      everywhere; "AI-enabled" only; no dashes; NDA-safe; no orphans.
- [ ] npm run gate green (incl. new reuse audit); tsc; all routes 200 light + dark;
      screenshots: home with both doors, /quick, work switcher, desktop + 390.
