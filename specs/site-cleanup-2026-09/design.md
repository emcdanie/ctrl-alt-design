# design.md, site cleanup + restructure (Sep 2026)

## CONCEPT LOCK, 18 Sep 2026, LOCKED (Elleta's go, 18 Sep, in session)

### One thesis
A hiring manager can see who Elleta is, what she has shipped, and how to reach her in under a minute, and nothing on the way contradicts itself.

### Format
Existing shell and primitives only (Heading, Card, Button grammar v5, Tag, CaseShellV2). New: a nav selection indicator, a first-visit loader, a Writing route, a Clients bar. Evidence: `audit.md` in this folder.

### Spine, in build order (each ships as its own PR)
1. **P1 audit fixes** (duplicate buttons, repeated card, 17 vs 13 checks, Design Lab placeholder, Mango logo).
2. **Contact becomes two actions.** Delete /contact, the form, `/api/contact`, and the `resend` dependency. Redirect /contact to /about#contact. Nav ends in one primary "Get in touch" that opens: Copy email (address assembled on click, never in the HTML) + LinkedIn.
3. **Nav: Work · System · Writing · About + Get in touch.** Southleft-style corner-bracket indicator that glides to the hovered/focused item and rests on the current page, iris on BELLA tokens. Reduced motion: no glide, brackets just appear.
4. **About, rebuilt Southleft-style.** Statement hero, Clients bar, where I am now, what I won't compromise on, Credentials (moved up: certificates from Brad's courses, conferences incl. Into Design Systems + SmashingConf + TJ's Smashing workshop, hackathons), Experience timeline (Carmen /experience pattern) with "View CV" opening the ResumeModal, Testimonials (always visible, no fade-in), Contact.
5. **System page gets "BELLA in my own words"** from the 17 Sep Southleft artifact: how it works (4 steps), the 20-second repo tour, the 10 inspection stations, likely questions.
6. **Writing.** /writing index + post pages, posts as typed content files, each with "Originally on LinkedIn" link and RSS. First post: Smashing learnings.
7. **Loader.** First visit per session only, under 2 s, Bella in a bubble with bubbles rising, circle wipe into the page. Skipped for reduced motion and for bots.

### Cut
The contact form. /skills as a nav item (the matrix stays on /quick). "Try demo" styled as a tag.

### Out of scope
CMS (Notion) for posts; case-study hi-fi visuals (the 31 Jul plan, still next after this).

### Constitution changes this needs (Elleta to approve)
- 1b nav: Work · System · Skills · About · Contact becomes Work · System · Writing · About + Get in touch.
- 6 copy: "No email rendered anywhere" becomes "no email in the HTML; assembled on click to copy".
- 7 NDA: a Clients bar puts org names outside the two exempt files. Needs the exemption widened to the Clients component, and a decision on framing (see chat).
