# CODE-AUDIT — redesign/lush (2026-07-16)

Why design changes weren't sticking: **the home page still renders the entire
pre-redesign architecture** (11-section stack + WorkSidebar) alongside the new
system, three case-data sources coexist, and a 1754-line globals.css carries
rules for components that no longer exist — so "fixes" land in one copy of a
job while visitors see the other.

Measured against `docs/portfolio-conformance-spec.md` (§0 no-duplicates,
§1 spacing) and `docs/portfolio-ia-spec.md` — both now in the repo.

## Reconciliation (post Steps 0–3, 2026-07-16)

| Spec | Status |
| --- | --- |
| §0 one home / one nav / one card / one case tree / no dead routes | DONE — commits `2fd7e80`…`4cb403d`; orphan grep clean |
| §1 container 1240 centred | DONE — `--container-width: 1240px`, `.page-container` + hero on the token |
| §1 section rhythm `--space-section` 96 | DONE — `.layout-section` on the token |
| §1 body ≥16 / no arbitrary px | DONE (earlier type pass); recorded proto exceptions stand |
| §2 image-led card, no colour blocks/dots | DONE — `CaseCard` + warm cover tokens |
| IA: routes, 4-item nav, aria-current, logo-home, featured CHIP | DONE |
| Cascade trap | FIXED via the unlayered APP TOKEN AUTHORITY block in `globals.css` (layering bella instead would let preflight strip its borders — documented in the block comment) |
| Style sprawl | globals.css 1754 → ~1524 lines; 30 dead blocks removed (snap-shell/view-*/dashboard-*/sidebar-*/carousel/bento/stat-moment/old headings); dup selectors resolved |

Below is the original audit as found, kept for the record.

## (a) Route → render map (BEFORE)

| Route | Renders | Verdict |
| --- | --- | --- |
| `/` (app/page.tsx) | OverlayNav, **Hero**, **CaseStudyGrid**, ProcessSection, VideoWalkthrough, CtrlAltDesignSection, AboutSection, ExperienceSection, LearningSection, TestimonialSection, ContactSection, ResumeModal, **WorkSidebar** — inside `.snap-shell` view-landing/view-dashboard | **PRIME SUSPECT.** Old architecture fully alive: second nav (sidebar), second card system (grid), 11 stacked sections. Every redesign change competes with this stack. |
| `/work` | OverlayNav, WorkLibrary (→ BubbleCluster) | New IA ✓ |
| `/point-of-view` | OverlayNav (stub content) | New IA ✓ |
| `/about` | OverlayNav, BackToWorkButton, VinylPlayer, MetricsStrip | Keep; absorbs Process/Experience/Learning per IA |
| `/case-studies/[slug]` | CaseStudyLayout, CaseStudyShell, CaseStudyTypography (data: `lib/content.ts`) | Canonical case tree ✓ |
| `/case-studies/{brad-frost, guardian, filters-decision-support-system}` | static pages on the same Shell | Keep |
| `/case-study/{brad-frost, guardian}` | `redirect()` → plural tree | **Duplicate tree** — inbound links: **zero** (grep clean). Safe delete. |
| `/command-center`, `/command-center/map` | own dashboard/nav/map stack | **Legacy route.** Only inbound link: CtrlAltDesignSection (home). Delete route + link. |

## (b) Duplicate / dead / orphan files

Import counts = files importing it (grep, app+components+lib).

| File | Imports | Call | Why |
| --- | --- | --- | --- |
| `app/case-study/*` (2 pages) | n/a | **delete** | Redirect stubs to the plural tree; nothing links to them |
| `app/command-center/*` (2 pages + 3 components) | 1 link | **delete** | Legacy app; unreachable from the new IA |
| `components/Header.tsx` | 0 | **delete** | Competing nav #3 (vs OverlayNav) — orphan |
| `components/Carousel.tsx` | 0 | **delete** | Retired from hero (noted in page.tsx comment) |
| `components/MediaCard.tsx` | 0 | **delete** | Card system #3 — orphan |
| `components/VideoSection.tsx` | 0 | **delete** | Superseded by VideoWalkthrough |
| `components/PersonalSection.tsx` | 0 | **delete** | Orphan section |
| `components/CaseStudyHero.tsx` | 0 | **delete** | Orphan (also holds the last arbitrary `text-[Npx]`) |
| `components/CaseStudySideCard.tsx` | 0 | **delete** | Orphan |
| `components/SectionWrapper.tsx` | 0 | **delete** | Orphan |
| `components/ArtifactGallery.tsx`, `ArtifactPlaceholder.tsx` | 0 | **delete** | Orphans |
| `components/CaseStudyGrid.tsx` + `bella/CaseStudyCard(.module.css)` + `bella/CaseStudyCardGrid(.module.css)` | 1 (home) | **delete after home→dashboard** | Card system #2; superseded by the one image-led CaseCard (IA Step 2) |
| `components/WorkSidebar.tsx` | 1 (home) | **delete after home→dashboard** | Nav #2; IA says no sidebar anywhere |
| `data/caseStudies.ts` (~700 lines) | **0** | **delete** | Dead third case-study source; `lib/content.ts` (per-case files) is canonical for prose, `lib/workLibrary.ts` for library metadata |
| ProcessSection / ExperienceSection / LearningSection (+ExperienceCard, ResumeModal, LogoContainer) | 1 (home) | **merge → /about** | Content keeps living, route changes |
| AboutSection, TestimonialSection, VideoWalkthrough (+VideoCard/VideoModal), CtrlAltDesignSection | 1 (home) | **merge/decide** | AboutSection folds into /about; Testimonial+Video+CtrlAlt need a home in the IA or deletion — flagged for review |
| ContactSection | 1 (home) | **move → /contact route** | Also stays as site footer? IA says own route |

## (c) Style conflicts (file:line)

1. **Cascade-layer fight (systemic):** Tailwind `@theme` emits tokens inside
   `@layer theme`; `lib/bella/bella.css` `:root` is **unlayered and wins**.
   Proven live: `--header-height` 70px (@theme, `app/globals.css:66`) silently
   lost to BELLA's 64px (`lib/bella/bella.css:289`) until an unlayered override
   was added (`app/globals.css:97-107`). Any token declared in BOTH places has
   this trap. Fix pattern: app-level overrides go in the unlayered `:root`
   block, never only `@theme`.
2. **Container width, three values:** `--container-width: 1200px`
   (`globals.css:59`) vs `.page-container { max-width: 1200px }` hardcoded
   (`globals.css:1160`) vs hero `max-width: 1240px`
   (`Hero.module.css:5`) vs spec **1240px**. Same page, two grids.
3. **Duplicate selectors:** `html` ×2 (`globals.css:223? / :360-area`), `body`
   ×2, `.case-study-content` ×2 (`globals.css:879` scroll-padding + `:883`
   padding-top) — second declarations extend the first invisibly.
4. **Old-architecture CSS still shipped:** `.snap-shell`, `.view-landing`,
   `.view-dashboard` (`globals.css:1219-1300`), `.cs-shell` two-column +
   media-query blocks, carousel keyframes (`:180-200`), and every
   `.surface-*`/`.bento-*`/`.demo-link` rule serving home-stack sections —
   ~40% of the file services components slated for deletion.
5. **Hardcoded values that dodge tokens:** `.surface-dark` `#1A1814`
   (recorded fixed-context, ok) but also `.page-container` px (above),
   `.cs-shell__left/right` previously `88px` (fixed 2026-07-16),
   WorkSidebar terminal-widget px/hex (recorded exception),
   `command-center/*` (exempt → delete instead).
6. **Where a fix would silently not show:** any change to home sections via
   tokens can be overridden by the later section-specific rules in
   `globals.css:900-1700` (e.g. `.bento-card`, `.cs-shell__*`,
   `.view-landing` padding) — late unlayered rules beat module CSS of the
   same specificity by source order.

## (d) Consolidation plan (priority order)

1. **ONE dashboard home** — `app/page.tsx` = OverlayNav + Hero (bubble board)
   + featured CHIP + "Browse the library →". Remove WorkSidebar,
   CaseStudyGrid, stacked sections. Move Process/Experience/Learning (+
   About/Testimonial content) into `/about`; ContactSection becomes
   `/contact`. Delete `.snap-shell`/`.view-*` CSS with it.
2. **ONE case-study tree** — delete `app/case-study/*`; plural tree only.
3. **ONE nav** — OverlayNav everywhere (visible desktop links, hamburger
   mobile, aria-current); delete Header.tsx, WorkSidebar, command-center nav.
4. **ONE card** — new image-led CaseCard (cover-art slot, muted warm
   placeholder, no colour-block bg, no swatch dots) consumed by dashboard +
   library; delete CaseStudyGrid + bella card pair.
5. **ONE content source** — `lib/workLibrary.ts` (library/hero metadata) +
   `lib/content.ts` (case prose). Delete `data/caseStudies.ts`.
6. **ONE style source** — collapse globals.css: drop rules for deleted
   components, dedupe selectors, unify container to 1240 token, keep the
   unlayered-token override pattern documented (see DESIGN.md Engineering
   conventions).

Guardrail (now in DESIGN.md): migrate the live route/component and delete the
old copy in the same commit; grep for orphans before finishing.
