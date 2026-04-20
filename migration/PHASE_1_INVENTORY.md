# BELLA Migration — Phase 1 Inventory

**Branch:** `migration/bella-v0.1`
**Date:** 2026-04-20
**Reference component:** `components/bella/CaseStudyCard.tsx` + `CaseStudyCardGrid.tsx` (token-only, CSS module, semantic HTML, AAA contrast, `prefers-reduced-motion` honored)

This report is read-only — no source files were modified. Pruning is *proposed*, not executed.

---

## 1. Route map

| Route | File | Renders | Reachable from | Live on elleta.design |
|---|---|---|---|---|
| `/` | `app/page.tsx` | Hero + Carousel + WorkSidebar + 10 sections (CaseStudyGrid, MetricsStrip, ProcessSection, TestimonialSection, VideoWalkthrough, CtrlAltDesignSection, AboutSection, ExperienceSection, LearningSection, ContactSection) + ResumeModal | Direct / root | **assumed yes — verify** |
| `/about` | `app/about/page.tsx` | OverlayNav + Hero copy + collaboration cards + LearningCard list + Timeline + VinylPlayer + dark CTA | `<AboutSection>` "Read full bio →" link only. **Not in OverlayNav.** | **assumed yes — verify** |
| `/case-studies/[slug]` | `app/case-studies/[slug]/page.tsx` | Generic case study via `CaseStudyShell` + `CaseStudyTypography`. `generateStaticParams` pulls slugs from `lib/content`. | `CaseStudyGrid` cards | yes (covers any slug not overridden below) |
| `/case-studies/brad-frost` | `app/case-studies/brad-frost/page.tsx` | Hand-written Brad Frost narrative (overrides `[slug]`) | `CaseStudyGrid` | yes |
| `/case-studies/guardian` | `app/case-studies/guardian/page.tsx` | Hand-written Guardian narrative (overrides `[slug]`) | `OverlayNav` (item 02), `VideoWalkthrough`, grid | yes |
| `/case-studies/filters-decision-support-system` | `app/case-studies/filters-decision-support-system/page.tsx` | Hand-written narrative + 3 demo embeds (overrides `[slug]`) | `CaseStudyGrid`, `LearningCard.relatedWork` | yes |
| `/case-study/brad-frost` | `app/case-study/brad-frost/page.tsx` | `redirect("/case-studies/brad-frost")` | external/legacy URLs only — **no internal link** | likely (legacy) |
| `/case-study/guardian` | `app/case-study/guardian/page.tsx` | `redirect("/case-studies/guardian")` | external/legacy URLs only — **no internal link** | likely (legacy) |
| `/command-center` | `app/command-center/page.tsx` → `CommandCenterDashboard.tsx` | Internal Brad Frost dashboard (status / quests / metrics / alerts / speaking / genres) | `CommandCenterNav` only — **not linked from portfolio** | unknown — likely deployed but unlisted |
| `/command-center/map` | `app/command-center/map/page.tsx` → `SystemMap.tsx` | Pan/zoom Atomic Design system map | `CommandCenterNav` only | unknown — likely deployed but unlisted |
| `/api/contact` | `app/api/contact/route.ts` | `POST` handler — Resend → `elletamc@gmail.com` | `ContactSection` `fetch("/api/contact")` | yes (required by form) |

Layouts: `app/layout.tsx` (root, fonts + DevTools), `app/command-center/layout.tsx` (CommandCenterNav + CSS).

**Reachability flags for Elleta:**
- `/about` is only reachable from one bottom-of-the-fold link in `AboutSection` — **not in OverlayNav**. Is that intentional?
- `/case-study/*` redirects are dead from the inside; only useful if external traffic still lands there. Worth checking analytics before pruning.
- Command Center routes are never linked from the portfolio. Is that intentional (private dashboard) or a missing nav link?

---

## 2. Component inventory

`components/` totals 39 top-level `.tsx` files + `bella/` (2 components, 2 modules) + `motion/` (8 files) + `ui/` (3 files) + `FadeIn.tsx`/`SectionWrapper.tsx` legacy shims.

### Top-level components

| File | LOC | Purpose | Used by | Verdict |
|---|---|---|---|---|
| `AboutSection.tsx` | 189 | Home about-section card | `app/page.tsx` | **refactor** — large inline styles, hardcoded `#1A1814`, `rounded-[…]` arbitrary values |
| `ArtifactGallery.tsx` | 91 | Generic gallery for case study artifacts | — none — | **delete** (orphan) |
| `ArtifactPlaceholder.tsx` | 92 | Placeholder image block | — none — | **delete** (orphan) |
| `BackToWorkButton.tsx` | 19 | Back link on case study + about pages | `CaseStudyLayout`, `app/about/page.tsx` | **promote** — small, single-purpose, clean candidate for `bella/Button` ghost variant |
| `Carousel.tsx` | 77 | Auto-advancing image carousel on landing | `app/page.tsx` | **refactor** — hardcoded image paths in component, not data |
| `CaseStudyGrid.tsx` | 98 | Wraps BELLA grid with FadeIn + local `SectionHeader` | `app/page.tsx` | **refactor** — local `SectionHeader` duplicates `ui/SectionHeader`; merge after extracting BELLA SectionHeader |
| `CaseStudyHero.tsx` | 133 | Old case study hero with sticky meta | — none — (replaced by `CaseStudyShell`) | **delete** (orphan) |
| `CaseStudyLayout.tsx` | 23 | Wraps a case study with `CustomCursor`+`OverlayNav`+`BackToWorkButton` | the 3 hand-written case study pages + `[slug]` | **canonical** (small shell) |
| `CaseStudyShell.tsx` | 353 | Two-column sticky case study container | the 4 case study pages | **refactor** — biggest single component; relies on legacy CSS classes (`.cs-shell__*`) and `tagColor` |
| `CaseStudySideCard.tsx` | 146 | Sticky meta sidebar (older variant) | — none — | **delete** (orphan, superseded by `CaseStudyShell`'s left column) |
| `CaseStudyTypography.tsx` | 84 | `Eyebrow`/`H2`/`Body`/`PullQuote`/`Section` primitives | the 4 case study pages | **refactor** → **promote to `bella/`** — token drift inside (`#8A8A8A`, `#1A1A1A`, `#2C2C2C`, `#2C2A28`, `#3A3430`, `#F5F2EE`) |
| `ContactSection.tsx` | 234 | Contact form + footer nav + form errors | `app/page.tsx` | **refactor** — large inline styles + hardcoded form colors |
| `CtrlAltDesignSection.tsx` | 249 | "Design Lab" section: prototype cards + video modal | `app/page.tsx` | **refactor** — uses `ui/SectionShell`+`ui/SectionHeader` already; tag chips inline |
| `CustomCursor.tsx` | 188 | Custom hover cursor | `app/page.tsx`, `app/about/page.tsx`, `CaseStudyLayout` | **canonical** — purely behavioural |
| `DevTools.tsx` | 23 | Dev-only Web Vitals + a11y init | `app/layout.tsx` | **canonical** — dev-only |
| `ExperienceCard.tsx` | 124 | Single role card | `ExperienceSection` | **refactor** — token drift |
| `ExperienceSection.tsx` | 222 | Roles + education + local `SectionHeader` | `app/page.tsx` | **refactor** — has its own `SectionHeader` duplicating `ui/SectionHeader` |
| `FadeIn.tsx` | 5 | Re-export shim for `motion/FadeIn` | `LearningSection`, `CaseStudyGrid`, `TestimonialSection` | **canonical** (shim — keeps existing call sites stable) |
| `Header.tsx` | 88 | Sticky scroll-aware header | — none — (replaced by `OverlayNav`) | **delete** (orphan) |
| `Hero.tsx` | 265 | Landing hero + share panel | `app/page.tsx` | **refactor** — share panel is its own unit; lots of inline `rgba(26,24,20,*)` |
| `LearningSection.tsx` | 129 | Podcasts + learning blurb | `app/page.tsx` | **refactor** |
| `LogoContainer.tsx` | 59 | Square brand logo tile | `ExperienceCard`, `ExperienceSection` | **promote** — small, token-clean candidate |
| `MediaCard.tsx` | 174 | Generic project/video card variant | — none — (JSDoc shows usage but no callers) | **delete** (orphan) |
| `MetricsStrip.tsx` | 159 | Highlights strip on home | `app/page.tsx` | **refactor** |
| `OverlayNav.tsx` | 189 | Full-screen overlay menu + sticky bar | `app/page.tsx`, `app/about/page.tsx`, `CaseStudyLayout` | **refactor** → **promote to `bella/Nav`** — high reuse, tokenize cleanly |
| `PersonalSection.tsx` | 91 | Personal-bio section variant | — none — | **delete** (orphan) |
| `ProcessSection.tsx` | 168 | Process steps + linked case studies | `app/page.tsx` | **refactor** |
| `PrototypeEmbed.tsx` | 212 | Iframe wrapper for case study prototypes | `app/case-studies/filters-decision-support-system/page.tsx` | **refactor** |
| `ResumeModal.tsx` | 224 | Resume modal triggered from home | `app/page.tsx` | **refactor** — hardcoded `#1A1814`, multiple inline styles |
| `SectionWrapper.tsx` | 16 | Re-export shim for `ui/SectionShell` | — none — | **delete** (orphan shim — no consumers) |
| `TestimonialSection.tsx` | 371 | Testimonial carousel + LinkedIn links | `app/page.tsx` | **refactor** — largest after `CaseStudyShell` |
| `VideoCard.tsx` | 93 | Video thumbnail card | `CtrlAltDesignSection` | **refactor** |
| `VideoModal.tsx` | 108 | Video player modal | `CtrlAltDesignSection` | **refactor** |
| `VideoSection.tsx` | 75 | Standalone video section | — none — | **delete** (orphan) |
| `VideoWalkthrough.tsx` | 81 | Hackathon showreel block | `app/page.tsx` | **refactor** — has lint error (unescaped quotes) per `migration/REPORT.md` |
| `VinylPlayer.tsx` | 132 | Audio "vinyl" widget | `LearningSection`, `app/about/page.tsx` | **refactor** |
| `WorkSidebar.tsx` | 185 | In-dashboard scroll sidebar | `app/page.tsx` | **refactor** — has `react-hooks/set-state-in-effect` lint error |

### `components/bella/`

| File | Verdict |
|---|---|
| `CaseStudyCard.tsx` + `.module.css` | **canonical** — reference shape |
| `CaseStudyCardGrid.tsx` + `.module.css` | **canonical** |

### `components/ui/`

| File | LOC | Used by | Verdict |
|---|---|---|---|
| `SectionHeader.tsx` | 35 | `CtrlAltDesignSection` | **promote** → `bella/SectionHeader` (one consumer + 2 local duplicates in `CaseStudyGrid`/`ExperienceSection` waiting to merge) |
| `SectionShell.tsx` | 19 | `CtrlAltDesignSection`, re-exported by dead `SectionWrapper.tsx` | **promote** → `bella/Container` |
| `SurfaceCard.tsx` | 28 | — none — | **delete** (orphan) |

### `components/motion/`

| File | Used by | Verdict |
|---|---|---|
| `FadeIn.tsx` | `components/FadeIn.tsx` shim → 3 sites | **canonical** |
| `useReducedMotion.ts` | `motion/FadeIn` (+ all dead siblings) | **canonical** (still used by `FadeIn`) |
| `useInView.ts` | `motion/FadeIn` (+ all dead siblings) | **canonical** |
| `index.ts` (barrel) | — none — | **delete** (no `@/components/motion` consumers anywhere) |
| `HoverLift.tsx` | — none — | **delete** (orphan) |
| `ScaleIn.tsx` | — none — | **delete** (orphan) |
| `SlideUp.tsx` | — none — | **delete** (orphan) |
| `StaggerContainer.tsx` | — none — | **delete** (orphan) |
| `StaggerItem.tsx` | — none — | **delete** (orphan) |
| `PageTransition.tsx` | — none — | **delete** (orphan) |
| `LoadingBubbles.tsx` | — none — | **delete** (orphan) |

---

## 3. Dead code

### Unimported components (no `import` references anywhere)

- `components/ArtifactGallery.tsx`
- `components/ArtifactPlaceholder.tsx`
- `components/CaseStudyHero.tsx`
- `components/CaseStudySideCard.tsx`
- `components/Header.tsx`
- `components/MediaCard.tsx`
- `components/PersonalSection.tsx`
- `components/SectionWrapper.tsx` (re-export shim with no consumers)
- `components/VideoSection.tsx`
- `components/ui/SurfaceCard.tsx`
- `components/motion/HoverLift.tsx`
- `components/motion/LoadingBubbles.tsx`
- `components/motion/PageTransition.tsx`
- `components/motion/ScaleIn.tsx`
- `components/motion/SlideUp.tsx`
- `components/motion/StaggerContainer.tsx`
- `components/motion/StaggerItem.tsx`
- `components/motion/index.ts` (barrel re-exports the 7 dead files above; no consumer imports `@/components/motion`)

### Dead data layer

- `data/caseStudies.ts` (699 lines) — superseded by `content/case-studies/`. **No file imports from `@/data/`**. Confirmed by grep: only consumer references are inside `data/` itself.
- `data/navigation.ts` — exports `navigationItems`. The only navigation array in active code is hard-coded inside `Header.tsx` (which is itself dead) and `OverlayNav.tsx` (which uses a different set of items).

### Unused routes (flag — do not delete without Elleta)

- `app/case-study/brad-frost/page.tsx` and `app/case-study/guardian/page.tsx` are `redirect()` shims with no internal callers. They exist for inbound links from older URLs. **Check analytics / search-console traffic before removing.**

### Orphan public assets

- `public/videos/***REMOVED***.mov` — `***REMOVED***.mp4` is the referenced version; `.mov` and the case-mismatched name are unreferenced.
- `public/videos/eddie.mov` — `eddie.mp4` is the referenced version.
- `public/videos/design-system.mp4` — no references in code or content.
- `public/audio/` — directory exists but is empty (only contains a single subdirectory with no files surfaced by `ls`). Verify.
- `public/images/thumbnails/` — these 8 files are unreferenced (the carousel renders the `carosel/` originals; thumbnail copies are duplicates):
  - `imGE3.png`, `IMG_3144.jpeg`, `IMG_3153.jpeg`, `IMG_3170.jpeg`, `IMG_3182.jpeg`, `imag1.png`, `image2.png`, `CTRL_ATL_TRAVEL.jpeg`
- `public/demos/guardian-evolution.html` — only referenced by dead `data/caseStudies.ts`.
- `.DS_Store` files: `app/.DS_Store`, `public/.DS_Store`, `public/images/.DS_Store`, `public/images/carosel/.DS_Store`, `public/images/thumbnails/.DS_Store`. Should also be added to `.gitignore` if not already.

### Orphan CSS / commented-out blocks

- `app/globals.css` lines 26–29 redefine `--shadow-soft` + `--shadow-layered` already provided (byte-identical) by BELLA. Flagged in `migration/REPORT.md` Top-5 #1; safe to delete.
- `app/globals.css` lines 76–92: parallel OKLCH color system feature-flagged via `@supports`. No consumers reference the OKLCH tokens — flagged in `AUDIT.md`. Candidate for removal.
- No large multi-line `/* removed */` / `// commented-out` blocks were found across `components/**/*.tsx`.

---

## 4. Token drift (outside `lib/bella/`)

Aggregate counts (file with N occurrences):

- **Hardcoded hex** (`#xxxxxx`) — 432 occurrences across 40 files
- **Raw `rgba(…)`** — 194 occurrences across 35 files
- **Tailwind arbitrary values** (`rounded-[…]`, `shadow-[…]`, `text-[…]`, `bg-[…]`, `p[xy]?-[…]`) — 104 occurrences across 17 files
- **Inline `px` literals in TS/TSX** — 336 occurrences across 38 files

These are catalogued exhaustively as mapping rules in `migration/AUDIT.md`. The deltas Phase 1 surfaces over what `AUDIT.md` already lists are below.

### Key offenders (file:line — pattern → BELLA equivalent)

**`app/about/page.tsx`** — heavy inline `style={{}}` with category palette + warm-black drift:
- L106–108 — workshop/course/conference colors `#2A5FA8` / `#6B3FA8` / `#0D6B4A` (UNMAPPED — see AUDIT.md F)
- L222, 232 — `#8A8A8A`, `0.1em`, `font-size: 11px` (below BELLA 13px floor)
- L250, 423, 445, 481, 494, 500 — repeated `#1A1814` (warm-black) → candidate for `--color-brand-ink` swap
- L315 — `#D8D4CC` avatar bg (UNMAPPED)
- L324 — `#C8C4CC` error avatar bg (UNMAPPED)
- L418 — `left: "-var(--spacing-6)"` — **broken token interpolation** (literal string instead of `calc()`); will not render. Bug.

**`components/CaseStudyTypography.tsx`** — primitives mix tokens with hex:
- L11 — Eyebrow color `#8A8A8A`
- L25 — H2 color `#1A1A1A`
- L41 — Body color `#2C2C2C`
- L56 — PullQuote color `#2C2A28`
- L57 — PullQuote border `#3A3430`
- L62 — PullQuote bg `#F5F2EE`
- L11 — letter-spacing `0.14em` (UNMAPPED)

**`components/Header.tsx`** *(dead — would resolve via deletion)* — 5 hex / 4 arbitrary classes.

**`components/Hero.tsx`** — 28 px literals, 8 hex, 11 rgba, 8 arbitrary classes. Largest single TSX surface for inline drift.

**`app/case-studies/brad-frost/page.tsx`** — Live Demo block (L92–112): `font-size: 11px`, `#8A8A8A`, `#1A1A1A`, `#2C2C2C`, `#0A0A0A`, `rgba(0,0,0,0.12)` (cool-black shadow).

**`app/case-studies/filters-decision-support-system/page.tsx`** — Step header inline styles repeat `#1A1A1A`, `var(--color-muted)` mixed with raw `font-size: 12px/15px`.

**`app/case-studies/guardian/page.tsx`** — L98 / L116 wrappers: `#0F1117` (matches `--color-brand-ink`), `rgba(255,255,255,0.06)`, `rgba(0,0,0,0.06)`.

**`app/command-center/CommandCenterNav.tsx`** — fully inline: 5 hex (`#1a1a1a`, `#7a7a7a`, `#6f6a63`), 3 rgba, raw `52`, `13`, `17` numeric font-sizes/heights.

**`app/command-center/CommandCenterDashboard.tsx`** — 21 hex + 20 rgba; status palette is deliberately outside BELLA per `migration/REPORT.md` Top-5 #4.

**`components/ResumeModal.tsx`** — 21 hex, 18 arbitrary classes — very dense; should be one of the first refactors after extraction primitives land.

### Files with zero token drift (candidates for "already clean")

- `components/bella/CaseStudyCard.tsx` + `.module.css` (canonical)
- `components/bella/CaseStudyCardGrid.tsx` + `.module.css`
- `components/CaseStudyLayout.tsx`
- `components/DevTools.tsx`
- `components/SectionWrapper.tsx` (dead shim)
- `components/ui/SectionShell.tsx`
- `components/ui/SectionHeader.tsx`
- `components/FadeIn.tsx` (shim)

---

## 5. Next BELLA components to extract

Ranked by leverage (sites cleaned per extraction × token-drift pressure × proximity to existing primitives).

| Rank | Component | Current ad-hoc location(s) | Sites / usage count | Complexity | Notes |
|---|---|---|---|---|---|
| 1 | **`bella/Tag`** | `.tag` className → `VideoWalkthrough.tsx:53`, `app/about/page.tsx:227`, `VideoCard.tsx:86`, `CtrlAltDesignSection.tsx:171`, `CaseStudySideCard.tsx:105`, `CommandCenterDashboard.tsx:669`. Plus 3 inline tag variants in `bella/CaseStudyCard.module.css`, `LearningCard` (about page L168), `CaseStudyShell.tsx` via `tagColor`. | 9+ rendering sites | **S** | The CaseStudyCard already has 3 tag variants + states baked in — extract that exact CSS module shape with a `variant` prop. Unblocks `CaseStudyShell` migration. |
| 2 | **`bella/SectionHeader`** | `components/ui/SectionHeader.tsx` (canonical-ish, 1 consumer), local `SectionHeader` in `CaseStudyGrid.tsx:34`, local `SectionHeader` in `ExperienceSection.tsx:112` | 3 implementations, 5+ render sites | **S** | Pure consolidation — `ui/SectionHeader.tsx` is already token-clean; promote, then delete the two local copies. |
| 3 | **`bella/Button`** | `BackToWorkButton.tsx` (whole file), `Hero.tsx` L117 (primary dark CTA), `Hero.tsx` L142 (secondary glass), `Header.tsx` L80 (resume — dead but pattern recurs), `OverlayNav.tsx` L77 (icon button), `ContactSection.tsx`, `ResumeModal.tsx`, `app/about/page.tsx` L498 (Get-in-touch), `app/case-studies/[slug]/page.tsx` L309 (completion tag). Plus 15 files using `rounded-full` for pill buttons. | 12+ visual variants across ~20 sites | **M** | Three needed variants observed: `primary-dark` (ink bg + cream text), `glass` (white-alpha + ink text), `ghost` (transparent + ink text). All use `--radius-full`, `--spacing-touch-target`. Hover/focus states already established in `BackToWorkButton`. |
| 4 | **`bella/Container`** | `components/ui/SectionShell.tsx` (canonical-ish, 1 consumer + dead `SectionWrapper` shim), `.layout-container` CSS class in `globals.css`, `.page-container` CSS class | 1 component consumer + many CSS class consumers | **S** | Promote `ui/SectionShell.tsx` as `bella/Container` (or `bella/Section`). Already token-clean. |
| 5 | **`bella/Footer`** | `ContactSection.tsx` L18–28 — `footerNav` object + render block | 1 site (and there is no standalone Footer component today) | **S** | Will be a *new* component, not a refactor. Worth the cost only after Tag/Button exist so it can compose them. |
| 6 | **`bella/Nav`** | `OverlayNav.tsx` (189 LOC — full-screen overlay + sticky bar) | 1 site, used on 3 routes (`/`, `/about`, case studies via `CaseStudyLayout`) | **L** | Heavy: state, animation, focus trap, body-scroll lock, share-panel-style hamburger. Worth extracting because it appears on every route, but defer until Tag + Button are in place. |
| 7 | **`bella/Hero`** | `Hero.tsx` (homepage, 265 LOC). Different from `CaseStudyShell`'s left column. | 1 site | **L** | Bespoke: share panel, animated mount, large clamp typography. Low extraction value (only one site) — better treated as a **refactor in place** to use BELLA tokens than promoted to a reusable primitive. |
| 8 | **`bella/Link`** | All `next/link` usage is direct; no abstraction. | n/a | **S** | **Skip** — not needed yet. Only extract once a hover/focus pattern emerges that we want to enforce. |

**Recommended order:** 1 (Tag) → 2 (SectionHeader) → 3 (Button) → 4 (Container). That set unblocks `CaseStudyShell`, `CaseStudyTypography`, `ExperienceSection`, `CtrlAltDesignSection`, `CaseStudyGrid`, and the case-study pages. Defer Nav/Hero/Footer/Link to v0.2.

---

## 6. Prune proposal

**Single list — safe-to-delete.** Read-only review pass: nothing has been deleted. Items flagged with **⚠** need Elleta's call.

### Definitely safe (no inbound references; no external traffic concern)

| Path | Reason |
|---|---|
| `components/ArtifactGallery.tsx` | Unimported; superseded by `CaseStudyShell` content children |
| `components/ArtifactPlaceholder.tsx` | Unimported |
| `components/CaseStudyHero.tsx` | Unimported; superseded by `CaseStudyShell` |
| `components/CaseStudySideCard.tsx` | Unimported; superseded by `CaseStudyShell` left column |
| `components/Header.tsx` | Unimported; superseded by `OverlayNav` |
| `components/MediaCard.tsx` | Unimported; never wired into any page |
| `components/PersonalSection.tsx` | Unimported |
| `components/SectionWrapper.tsx` | Re-export shim with zero consumers |
| `components/VideoSection.tsx` | Unimported |
| `components/ui/SurfaceCard.tsx` | Unimported |
| `components/motion/HoverLift.tsx` | Unimported |
| `components/motion/LoadingBubbles.tsx` | Unimported |
| `components/motion/PageTransition.tsx` | Unimported |
| `components/motion/ScaleIn.tsx` | Unimported |
| `components/motion/SlideUp.tsx` | Unimported |
| `components/motion/StaggerContainer.tsx` | Unimported |
| `components/motion/StaggerItem.tsx` | Unimported |
| `components/motion/index.ts` | Barrel for the 7 unused motion files; no `@/components/motion` consumer exists |
| `data/caseStudies.ts` (699 lines) | Zero `@/data/` consumers; replaced by `content/case-studies/` |
| `data/navigation.ts` | Zero consumers; nav arrays are inlined where used |
| `public/videos/***REMOVED***.mov` | Unreferenced (case-mismatch + `.mov` while `.mp4` is canonical) |
| `public/videos/eddie.mov` | Unreferenced (`.mp4` is canonical) |
| `public/videos/design-system.mp4` | Unreferenced |
| `public/demos/guardian-evolution.html` | Only referenced by dead `data/caseStudies.ts` |
| `public/images/thumbnails/imGE3.png` | Duplicate of `carosel/imGE3.png`; unreferenced |
| `public/images/thumbnails/IMG_3144.jpeg` | Duplicate; unreferenced |
| `public/images/thumbnails/IMG_3153.jpeg` | Duplicate; unreferenced |
| `public/images/thumbnails/IMG_3170.jpeg` | Duplicate; unreferenced |
| `public/images/thumbnails/IMG_3182.jpeg` | Duplicate; unreferenced |
| `public/images/thumbnails/imag1.png` | Duplicate; unreferenced |
| `public/images/thumbnails/image2.png` | Duplicate; unreferenced |
| `public/images/thumbnails/CTRL_ATL_TRAVEL.jpeg` | Duplicate of `carosel/`; unreferenced |
| `app/.DS_Store`, `public/.DS_Store`, `public/images/.DS_Store`, `public/images/carosel/.DS_Store`, `public/images/thumbnails/.DS_Store` | macOS metadata; never source-of-truth |
| `app/globals.css` lines 26–29 (the local `--shadow-soft` + `--shadow-layered` overrides) | Byte-identical to BELLA; per `REPORT.md` Top-5 #1 |
| `app/globals.css` lines 76–92 (OKLCH `@supports` block) | No consumers reference the `--oklch-*` tokens |

### ⚠ Flag for Elleta (ambiguous)

| Path | Question for Elleta |
|---|---|
| `app/case-study/brad-frost/page.tsx` (redirect) | Any inbound traffic still hitting `/case-study/*`? If not, drop both redirects. |
| `app/case-study/guardian/page.tsx` (redirect) | Same as above. |
| `app/command-center/**` (whole sub-tree) | Is this a deliberately unlinked private dashboard? Should it stay shipped? Should we add it to the nav? Or move it out of `app/`? |
| `public/audio/` (appears empty) | Confirm — if truly empty, drop the directory. |
| `lib/tagColor.ts` | Used by `CaseStudyHero` (dead) and `CaseStudyShell` (alive). After extracting `bella/Tag`, decide whether the 6 pastel colors stay (per `AUDIT.md` UNMAPPED) or migrate to BELLA category tokens in v0.2. |
| Local `@theme` tokens in `app/globals.css` (`--color-cream`, `--color-page`, `--color-card`, `--color-ink`, `--color-ink-soft`, `--color-ink-muted`, `--color-surface`, `--color-white-pure`, `--color-accent-espresso`, `--color-accent-gold`, `--color-border-soft`, `--color-border-medium`, `--color-glass*`, `--color-tag-*`, `--color-muted`, `--font-*` clamps, `--space-1..8`) | Many still consumed by tokenized components (e.g. `var(--color-ink)` appears in `Hero`, `Carousel`, etc.). Per `AUDIT.md` Appendix, deprecate only after Phase 3 confirms no consumer reads each one. Don't bulk-delete in this pass. |
| `data/` directory (after `caseStudies.ts` + `navigation.ts` go) | Empty parent dir — drop or keep for future? |

---

## Top 3 findings

1. **`data/caseStudies.ts` (699 lines) is fully dead** — completely superseded by `content/case-studies/`, no `@/data/` consumer exists anywhere in the repo. Largest single deletion candidate.
2. **The entire `components/motion/` library, except `FadeIn` + its two hooks, is orphaned** — 7 component files plus the barrel `index.ts` have no consumer. The single survivor (`FadeIn`) is reached via the `components/FadeIn.tsx` legacy shim, not via the barrel.
3. **9 top-level components and 1 `ui/` component (~1,300 LOC) are unimported** — `ArtifactGallery`, `ArtifactPlaceholder`, `CaseStudyHero`, `CaseStudySideCard`, `Header`, `MediaCard`, `PersonalSection`, `SectionWrapper`, `VideoSection`, `ui/SurfaceCard`. They represent older patterns superseded by `CaseStudyShell` + `OverlayNav` + `ui/SectionShell`.

Bonus finding worth flagging: `app/about/page.tsx:418` contains `left: "-var(--spacing-6)"` — a literal string with `-` prepended to `var(…)`. CSS will not parse that. It's a latent bug from the spacing migration, not Phase 1 scope, but worth noting.

## Top 3 delete candidates

1. `data/caseStudies.ts` — 699 lines, zero consumers.
2. `components/motion/` (delete all except `FadeIn.tsx`, `useReducedMotion.ts`, `useInView.ts`) — 7 component files + `index.ts`.
3. `components/Header.tsx` + `components/SectionWrapper.tsx` + the 8 other unimported top-level components listed above — single coordinated cleanup commit.
