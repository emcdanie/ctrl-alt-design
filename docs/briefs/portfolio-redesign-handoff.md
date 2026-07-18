# Portfolio session handoff — elleta.design

Living "start here" file. Repo: ctrl-alt-design, branch redesign/lush. Prompts/specs live
in this project (claude/*.md). Last updated: 17 Jul 2026, end of day (the big iteration
day).

## READ FIRST — the loop-breaker

Stale renders, not bad work, cause "terminal says fixed but I don't see it". Before
judging any change: rm -rf .next, npm run dev, hard-reload (Cmd+Shift+R), DevTools open
with Disable cache. Unchanged, still the most important habit.

## THE ONE NEXT ACTION

LIVE: main is b615ba3 (redesign/lush merged --no-ff, 18 Jul night), Vercel production
Ready at elleta.design, gate 9/9 green, full git history scrubbed (paths + terms,
word-boundary verified across all 194 commits). The next action: a fresh Claude Code
session runs docs/briefs/portfolio-pass-e-reconciliation.md (nine tasks: the seven
amendments Passes A to D missed, MetricsStrip colour, named-employers gate scoping;
two STOP points for Elleta: primary button style, thesis direction). After Pass E,
her content slots: NDA disclosure wording, accessibility evidence lines, CHIP
personal lines and Loom, logo uploads (mango plus the two orgs in the employers file, ASU and BFW re-exports).

## Where the site stands (end of 17 Jul)

Everything below landed on redesign/lush today, all gates green at each step (gate is
now 10+ audits incl. fonts, tokens, context/agent-surface check):

1. Visual-system lock: two fonts (Unique + Geist, Geist Mono retired), token sweep with
   elevation tokens + inline waivers, /skills page, POV folded into About with redirect,
   8-audit gate.
2. Heading system: ui/Heading primitive, Unique 700 on ALL display headings (decision
   REVERSED from "hero only" after seeing it live). About rebuilt. Then flat page
   headers everywhere: title-in-orb bubbles REMOVED sitewide (parked at e25eefc for a
   future expression pass); PageHeader is flat-only.
3. Affordance rule: saturated iris = interactive only; eyebrows demoted (then re-tuned,
   see 6); accent tokens renamed (--color-accent-iris / --color-accent-peri); card token
   warmed off pure white; testimonial semantics + Unique quote glyph; Tag vs FilterChip
   distinction; theme follows OS preference with stored override.
4. Type presence: section tier scaled up, quote text 18px, testimonials moved
   Contact → About; Contact tightened; CLAUDE.md made committable (banned terms moved to
   _private/, constitution now ships in the repo).
5. Combined pass: shared filter bar restored on /skills; CHIP case built and featured
   (slugs: /case-studies/chip; Writing node REMOVED from Work, cluster stays 6; CHIP
   evidence stills live at public/case/chip/, April-skin honest); System page phase 1
   (nav = Work · System · Skills · About · Contact); Work map z-order fixed (one shared
   bubble renderer); TYPE filter row; cards render only in Cards view.
6. Contact rebuild: one header, human-first left column (portrait, blurb, availability
   rows), labelled form with states. Then AI layer: llms.txt + /api/bella.json + "For
   agents" section with curl, gate check that the agent surface matches the live
   registry; find-your-fit shipped on Work (deterministic fallback until API key).
7. Eyebrow presence re-tuned (bold, identity colours allowed, iris still banned),
   Work went HYBRID: curated ranked view default (CHIP featured, then cases, then
   Explorations), explore toggle reveals Map/Table + condensed filters.

QUEUED IN TERMINAL (paste order): `portfolio-button-grammar.md` v4 (label caps, arrow
grammar → ↗ ↓, two colour treatments only, three-tier hierarchy rules, primary keycap
specular sheen, email REMOVED site-wide, form anti-spam + verified delivery), then
`portfolio-card-system-case-template.md` (Work hybrid task 0, ONE card with image+scrim,
ONE case template for all five cases with per-case gap list, component merge sweep,
/skills matrix links to cases).

## Decisions today (SUPERSEDE earlier where conflicting)

Unique on all display headings via one Heading primitive (24px floor stays). Bubbles as
page headers: gone, parked. Saturated iris means interactive, only; identity colours
carry decoration. Eyebrows: bold, identity-coloured, never iris. Buttons: two colour
treatments, three tiers, arrow grammar, caps labels, one primary per view; primary gets
specular sheen (same upper-left light as orbs). Testimonials live on About. Writing is
out of Work (returns only as real public writing). Guardian stays. Work is hybrid:
curated first, machinery behind explore. Nav has System. No email rendered anywhere,
ever (constitution rule); the form is the channel, with honeypot+rate limit and proven
delivery. Theme follows OS. CHIP featured first. Case order is curated in data, not
newest-first. BELLA identity: lush wins (April parchment/amber RETIRED); Figma +
Storybook plan and Brain/distribution plan exist as project docs, sequenced after
portfolio stabilizes. Case prose is Elleta's, never AI-written; CHIP has 4 content slots
+ Loom URL pending her voice notes + read-aloud.

## Course review (done today, separate doc)

Brad's full AI+DS course distilled into `bfw-course-process-improvements.md`: audit:
context idea (now partly live), confidence questions in clock-out (live in the skill),
docs/fixes grep in clock-in (live), inspection-kit quarterly ritual (pending), BELLA
Brain direction (doc'd). Skills project-init + session-handoff were updated today.

## OPEN — needs Elleta

- CHIP case: 4 personal lines + Loom URL + read-aloud pass (case reads complete
  without them but isn't final until her voice is in).
- ANTHROPIC_API_KEY + spend cap in Vercel to switch find-your-fit from deterministic to
  AI matching.
- Confirm the contact form test submission actually reached her.
- Logo files for About (public orgs only: BFW, Ironhack, ASU, VML, Mango-as-employer;
  NDA'd clients stay text-only).
- Better assets: Code First images from the BradFrostWeb folder (connect it); the
  Finviz AI version from Vitaly's workshop (she checks if usable).
- Then: approve the master backlog order when the full review produces it.

## Key docs in project

Review (NEXT): `portfolio-full-review-brief.md`. Today's passes: portfolio-button-
grammar.md, portfolio-card-system-case-template.md, portfolio-combined-pass.md,
portfolio-contact-rebuild.md, portfolio-system-v2-ai-layer.md, portfolio-affordance-
theme-fix.md, portfolio-type-presence-testimonials.md. Audit: portfolio-purple-buttons-
a11y-audit.md. CHIP: portfolio-case-chip-build.md (+ public/case/chip/ stills). BELLA:
bella-figma-storybook-plan.md, bella-brain-distribution-direction.md. Course: bfw-
course-process-improvements.md. Constitution: in-repo CLAUDE.md (now committable).
