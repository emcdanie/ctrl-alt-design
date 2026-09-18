# About rebuild — design

## CONCEPT LOCK, 18 Sep 2026, LOCKED (Elleta's go, 18 Sep, in session)

AUTHORITATIVE. Supersedes everything below this section, which records the 16-18 Jul
build (bio page, galleries rehomed) and is kept as history. Source: spine item 4 of
`specs/site-cleanup-2026-09/design.md`. `requirements.md` and `tasks.md` in this folder
describe the July build and are flagged for archival.

### One thesis
In one scroll, a hiring manager learns who Elleta is, who has trusted her with their
system, what she will not compromise on, and how to reach her, and every claim on the
way is backed by something they can check.

### Format
Flat page opening on the existing shell: `PageHeader` pattern (eyebrow + `Heading` tier
page), `SectionHeader` for every section head (tier section, one size, gate-enforced),
`Card` / `.card-statement` for principles, `Tag` for credential meta, Button grammar v5
(ONE primary per view). Reused as they are: `ExperienceSection`, `ResumeModal`,
`TestimonialSection`, the About `photo-bubble`. One net-new component: `ClientsBar`,
already named in the parent lock. Layout and rhythm are Southleft-style: statement
first, proof strip directly under it, then long-form.

### Spine (order is part of the lock; each beat is one idea + one proof)
1. **Statement hero.** One sentence of positioning in the page tier with the iris accent
   word, the portrait, one line of supporting copy. Proof: the sentence itself names the
   work (AI-enabled design systems), not an adjective.
2. **Clients bar: "Where I've worked".** One row of four text wordmarks directly under
   the hero, no logos: **Brad Frost · Mango · VML · the 2024-25 employer** (that last
   name is on the private employer list, so this file never spells it out; it renders
   from the same private-list-exempt source as Experience). Employers and clients only,
   never an employer's customers. Proof: four organisations a hiring manager can check
   against the timeline in beat 6.
3. **Where I am now.** Barcelona; current focus (BELLA + CHIP, built in public); what I am
   open to. Proof: links to the two live things.
4. **What I won't compromise on.** Three principles as statement cards, each with the
   one decision it cost or earned. Replaces "How I collaborate" and "How I solve
   problems." Proof: a real decision per card, NDA-safe.
5. **Credentials.** Moved up. Certificates (Brad Frost's courses), conferences (Into
   Design Systems, SmashingConf, TJ's Smashing workshop), hackathons, education folded
   in. Proof: named issuers and dates, linked where public.
6. **Experience timeline** (the Carmen `/experience` grammar, see
   `docs/briefs/carmen-structure-audit.md`) with **"View CV"** opening `ResumeModal`.
   Restructured (Elleta, 18 Sep):
   - **Brad Frost Web stays its own entry at the TOP** (contract, current, the headline
     client; Elleta, 18 Sep).
   - **elleta.design · Design Systems Consultant**, Oct 2025 to present, ONE entry
     holding the other contracts as sub-lines, each with its own role and dates: the
     Geneva UN contract (Oct to Dec 2025) and Mango (Apr to Jul 2026). Starts Oct 2025,
     the earliest of its contracts.
   - **Full-time roles stay separate:** the 2024-25 employer (Jul 2024 to Feb 2026) and
     VML (Feb 2023 to Feb 2024), then the pre-design roles and "Earlier career" as they are.
   - Education moves out of Experience into beat 5 (Credentials).
   - The same grouping applies in `ResumeModal`, so the page and the CV never disagree.
   Proof: dates, roles, the CV one click away.
7. **Testimonials.** Always visible, no FadeIn. Proof: named people, real words.
8. **Contact** at `/about#contact`: LinkedIn + the existing message form until parent
   spine item 2 lands; Copy email (assembled on click) ships with that PR, which also
   deletes /contact and redirects it here.

### Cut
MetricsStrip stats row. "How I collaborate" cards and "How I solve problems" cards
(absorbed into beat 4). Learning accordion (absorbed into beat 5). VinylPlayer and the
podcast list (personality belongs in beat 3's copy, not widgets). The closing
CtaBanner (beat 8 replaces it; audit P1 #15 named it the page's quietest ask).

### Out of scope
Logo artwork for the Clients bar (wordmarks as text first). The nav indicator, /writing,
the loader (parent spine 3, 6, 7). Removing /contact itself (parent spine 2, its own PR).
New testimonial copy.

### Decisions (resolved 18 Sep, Elleta, in session)
- **Clients bar:** employers as text, four names, read from the Experience data
  (`ExperienceSection.tsx`, already NDA-exempt), so no §7 change.
- **Brad Frost Web:** contract, but its own top entry (see beat 6).
- **elleta.design:** starts Oct 2025.
- **Mango:** kept in the Clients bar and Experience; Elleta holds written approval
  (NDA clauses CUARTA and SEPTIMA require it).
- **The 2024-25 employer's customers are never named.** Her confidentiality agreement
  (5 Jul 2024, part B §1 and §3) covers client information learned in the job and
  survives termination.
- **New copy is flagged, never invented.** The hero statement and "Where I am now" are
  assembled from her existing lines and facts in the repo, marked for review. Principle
  receipts, SmashingConf and TJ's Smashing workshop have no source in the repo; they are
  `TODO(elleta)` slots that render nothing until she writes them.

## Why
About was a bio plus two galleries in flat beige: long, under-coloured, and off-system.
It becomes a short scannable bio page in the site accent (iris/periwinkle), with the
galleries rehomed. Source brief: the About rebuild prompt (2026-07-16).
FLAG: the brief cites portfolio-content-audit §2; that document is not in the repo, so
the structure is taken from the brief's own §2 list.

## Cuts (About is a bio, not a gallery)
- CtrlAltDesignSection (CTRL_ALT_DESIGN video cards + Interactive product experiments)
  moves to /work as a Lab section below the library (`/work#design-lab`).
  Decision: the brief offers "Work / the Design Lab case"; the design-lab case study is
  deliberately unregistered until Elleta authors its decision blocks (recorded in
  content/case-studies/design-lab.ts), so the /work section is the placement that ships
  today without a stub case page. The workLibrary design-lab item repoints from
  /about#design-lab to /work#design-lab.
- Guardian's experiment card stays: the Guardian case is live and registered, so no
  evidence it is retired. Drop it later if she confirms.
- Testimonials are already on /contact (moved in the earlier About content pass);
  nothing to do.
- Dead `timelineEvents` array in about/page.tsx (defined, never rendered): deleted.

## Structure (top to bottom)
1. Hero: periwinkle BubbleHeading (existing PageHeader variant="bubble") + photo +
   the bio spine paragraph. ONE accent highlight: "AI-enabled design systems" in
   accent-ink inside the first line.
2. The problem space: the second bio paragraph under an iris eyebrow, trimmed of the
   closing line (which moves to the close).
3. Stats: MetricsStrip restyled quiet-but-alive: accent-subtle tinted cards, stat in
   accent-ink, existing card anatomy. No case colours.
4. How I collaborate: content unchanged; keeps its iris section-label.
5. Experience: ExperienceSection unchanged structurally (already one clean list,
   NDA-safe labels); hardcoded #4A4640 replaced with the ink token.
6. Learning (ONE section): the existing five entries (Brad Frost Maker, Gordeshko,
   Vitaly x2, IDS 2025+2026). LearningCard goes on-system: accent bar, icon plate, and
   type chip use accent tokens; hardcoded #6B665D replaced with ink-muted.
7. Close: one human line in her own words (the "hard problems with people who care"
   sentence relocated from the bio) + the existing "open to roles" CTA block.

## Colour rules
About is NOT a case: iris/periwinkle only, never case colours. Eyebrows already render
accent-ink via .section-label. AA both themes on every change (gate verifies).

## Type
Unique 700 = the bubble heading only (PageHeader). Everything else Geist / Geist Mono
from tokens. No hardcoded px or hex in anything this rebuild touches.

## New gate check (audit:structure)
- Fails any literal font-family value in app/ or components/ that does not resolve
  through var(--font-*) (layout.tsx font loader and globals.css token definitions
  exempt; VinylPlayer frozen-file exemption respected).
- Fails var(--font-hero-display) / var(--font-unique) usage outside the sanctioned
  files: app/globals.css, app/layout.tsx, components/Hero.module.css,
  components/PageHeader.tsx, components/CaseCard.module.css,
  components/DesignSystemSpecimens.tsx. About cannot drift off-system again.
  (Below-24px Unique at runtime is already covered by audit:contrast.)

## Reuse
No new components. Touched: about/page.tsx, MetricsStrip, ExperienceSection (one hex),
CtrlAltDesignSection (unchanged, re-mounted on /work), lib/workLibrary.ts (href),
scripts/audit-structure.mjs.
