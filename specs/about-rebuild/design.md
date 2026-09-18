# About: design

## CONCEPT LOCK, 18 Sep 2026, LOCKED (Elleta, in session)

Minimal About. Start small; add pieces back later, one at a time, each its own
decision. Supersedes every earlier About spec (the July build and the 18 Sep eight-beat
lock in PR #92, which was stopped before merge). `requirements.md` and `tasks.md` in this
folder describe the July build and are stale.

### Spine
1. **Hi.** The `elleta-bella-walk` illustration + two short lines in her voice. No
   eyebrow label, no tagline, no highlighted keyword.
2. **Worked with.** One row of real logos: Brad Frost Web, the 2024-25 employer, VML,
   UN Geneva. Monochrome, equal height. Mango as plain text until Elleta confirms her
   approval covers the logo. Logos are official files only (press/brand page or
   Wikimedia Commons, SVG preferred) in `public/logos/`, source URL per file listed in
   the PR. Never drawn or recreated. No official file, or use restricted: the name as
   text. Names and file paths live in `components/ExperienceSection.tsx` (NDA-exempt).
3. **Experience.** Five or six plain text lines, company · role · years, then
   "Full CV →" opening `ResumeModal`. No cards, no accordions.
4. **Say hi.** Copy email + LinkedIn.

### Cut
Everything else on About: principles, credentials, education, testimonials, "Where I am
now", stats, collaborate cards, learning, vinyl and podcasts, the closing banner.
Credentials and education live in the CV only.

### Nav
Contact leaves the nav. A Southleft-style "Get in touch" button on the right opens the
same two actions (Copy email + LinkedIn). The /contact route itself stays until its own
PR retires it.

### Email rule (constitution §6, amended by this lock)
The address is never in the HTML or the source as one string. It is assembled on click
and copied to the clipboard.

### Style rule going forward (constitution §3/§4, amended by this lock)
No eyebrow label above every heading. No one-purple-word headlines. No card grids unless
the content really is a set of cards. Applies to new and rebuilt surfaces; existing pages
migrate when they are next touched.

### Out of scope
Adding back any cut piece (each returns as its own decision). Retiring /contact.
