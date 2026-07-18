# About rebuild — design

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
