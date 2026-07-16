# Fix: "changes never go global"

## Symptom
You edit a case-study page (or a card, or the nav) and the change doesn't show up site-wide. You fix the
same thing repeatedly and it keeps coming back. A "global" change quietly only hits one place.

## Root cause
More than one implementation was rendering. The live home still rendered the OLD architecture while new
work went into parallel components; there was a duplicate `app/case-study/*` (singular) route tree beside
`app/case-studies/*`; and some pages were hand-built alongside the data-driven ones. Editing one copy left
the other untouched.

## The fix
**One render path.** All cases render through `app/case-studies/[slug]` + `CaseStudyShell` + the block
schema in `lib/content.ts`. Home renders the live dashboard, not the old section stack. Every duplicate
route/component is deleted, not left dormant.

## Guard
- `audit:structure` fails on per-case route dirs (forces the single `[slug]` path).
- Before finishing any change: grep for orphaned old copies and delete them.
- Rule: edit the LIVE file; never leave old + new both rendering.
