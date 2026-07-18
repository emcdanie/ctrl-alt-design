# Two-speed flow + polish — design

## Why
Two visitor speeds, one site: explorers wander the constellation and deep cases;
reviewers have four minutes. No linear "next" path; two clearly marked doors instead.

## 1. The doors (home hero)
- Door one (exists): "Browse the library →" keycap → /work.
- Door two (new): quiet secondary link "Short on time? The quick version →" in the
  slot the dead "Current focus ↓" anchor occupied, styled with the existing quietLink
  treatment.
- Destination decision: /work already IS the table, so pointing the fast door at it
  would duplicate door one. The brief's composed overview is the honest fast lane, so
  door two goes to a new /quick ROUTE (routes are allowed; it is composed ONLY from
  existing components):
  - flat PageHeader (the bubble device stays on identity pages; /quick is
    utilitarian like /work),
  - the one-line positioning (lib/copy POSITIONING),
  - top 3 cases as existing CaseCards (rank, then featured, then year, the library's
    own default order),
  - the skills x projects matrix (MatrixView exported from WorkLibrary; header
    toggles route to /work with the same URL params),
  - the "I read code" proof: the existing TokenInspector, live, linking /design-system,
  - contact CTA (the page's ONE primary keycap) plus a quiet "prefer to explore"
    link back to the library. No forced path in either direction.
- New components: none. New route: /quick (allowed per brief).

## 2. Work views
Timeline view deleted (weak): TimelineView + its tl*/cardInner styles go; one Cards
view (visual browse) replaces it, a responsive grid of the existing CaseCard over the
same filtered list. Views: Table · Map · Cards · Skills (four, the ceiling). Sort
Select shows on map/cards (no column headers there).

## 3. Home current-focus card
The stranded beige "Current focus / Design Lab" section below the hero is deleted
along with the "Current focus ↓" anchor and Hero's onEnterDashboard plumbing. The
constellation already tags current focus.

## 4. Colophon bug + copy gate
ContactSection renders a literal ’ in JSX text (JSX does not process JS escapes;
the same sequence inside a quoted JS string is fine, which is why testimonials render
correctly). Fix the character, and extend audit:copy to fail \uXXXX sequences in JSX
text (implementation: strip quoted string spans from each line, then flag remaining
escapes). Also normalises a — em-dash escape hiding inside a testimonial string,
and the dash check now catches —/– escapes too.

## 5. audit:reuse (new, the brief lists it in the gate)
Fails any components/**/*.tsx never imported anywhere (one implementation, no
orphans). Exemptions: VinylPlayer (frozen, recorded), components/motion/* (barrel
library, re-exported via motion/index.ts). First catch: ui/SurfaceCard, orphaned
since an old refactor, deleted in this change.
