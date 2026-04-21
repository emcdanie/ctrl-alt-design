# Session Handoff — `migration/bella-v0.1`

Context for picking this work up in a fresh terminal session (Warp or otherwise). Everything below assumes you're on `migration/bella-v0.1` in `~/DEV/ctrl-alt-design` with `~/DEV/bella` as a sibling repo.

---

## What this branch is

The portfolio at `elleta.design` (repo: `ctrl-alt-design`) is being migrated to BELLA — a standalone design system vendored from `~/DEV/bella`. The BELLA tokens live at `lib/bella/bella.css` in this repo and are imported at the top of `app/globals.css`.

`migration/bella-v0.1` is the working branch. `main` is untouched. **Nothing has been pushed; nothing has been merged.**

---

## Branch state

**31 commits ahead of `main`.** Working tree clean.

### Newest-first (this session and prior)

```
3b202c6  refactor(process): convert 5-column cards to single-column accordion
f47abfa  fix(structure): move stat strip from landing to About; unify detail lines
5840f7e  fix(structure): Design Lab grid — fixed 2-col, equal heights, no orphan
d122e80  fix(react): gate render-time Date/locale calls behind useEffect
21967e7  feat(cursor): remove CustomCursor entirely; restore native cursor
f30f768  fix(mobile): carousel no longer crowds hero on landing view
3f0f8b3  fix(scroll): drop scroll-snap-type from snap-shell
42566b0  fix(react): resolve CustomCursor hydration mismatch       ← superseded by 21967e7
37844e2  fix(mobile): command-center main grid collapses below 410px
a97c8b4  fix(mobile): about timeline dot positioning (latent CSS bug)
4715913  fix(mobile): contain landing carousel + relax snap shell at <=768px
7dd8066  fix(mobile): allow Hero name to wrap below ~600px viewport
77b08e1  fix(react): defer WorkSidebar initial scroll sync to next frame
196d1b3  fix(content): drop duplicate tagline from VideoWalkthrough (kept in Hero)
a2c0b08  fix(structure): contain floating process quote
17d775b  fix(structure): responsive grid orphans
a0eb60a  fix(a11y): header overlap + scroll padding
5523bf9  fix(structure): card grid uniformity
98336e0  fix(a11y): contact form contrast
9f008cc  docs(migration): phase 1 inventory + prune proposal
1c5ecc5  feat(bella-components): CaseStudyCard + CaseStudyCardGrid
77fd4d5  chore(bella-migration): phase 4-5 build log + final report
9acc3ae  refactor(bella-migration): migrate typography tokens
b4d7917  refactor(bella-migration): migrate radius tokens
1303a39  refactor(bella-migration): migrate shadow + glass tokens
f4e516d  refactor(bella-migration): migrate spacing tokens
ee60c71  refactor(bella-migration): migrate color tokens
89c15d4  feat(bella-migration): import BELLA tokens at global scope
f393a94  chore(bella-migration): audit report — phase 1
bd68ff5  chore(bella): vendor bella.css v0.1.1 into lib/bella/
```

### BELLA repo (`~/DEV/bella`, branch `main`)

```
9281c94  docs(rules): v0.1 governance rules for consumers     ← not pushed
7373e05  feat(bella): v0.1.1 — dark-mode AAA closure + GH Pages docs/
1fd67aa  feat(bella): AAA gap closure + glass/shadow tokens from elleta.design
```

The `9281c94` commit added:
- `docs/RULES.md` — 8 numbered governance rules (**read this before making consumer-facing changes**)
- Tokens appended to `tokens/bella.css` and `docs/bella.css`: `--ink-on-dark-{strong,build,muted}`, `--ring-focus-{color,width,offset}`, `--card-min`, `--header-height`. Marked with TODO to sync into the JSON sources on next `tokens/build.py` run.

---

## What's in flight / blocked

### 1. UN ***REMOVED*** case-study image is wrong — **blocked on asset from Elleta**

`content/case-studies/un-operational-dashboard.ts:11` has `heroImage: "/images/thumbnails/FormularOne.png"` — that's the F1 Singapore Grand Prix dashboard, not the UN ***REMOVED*** platform. The wrong image shows on the Case Studies grid card.

- `heroVideo: "/videos/***REMOVED***.mp4"` is correct — the detail page at `/case-studies/un-operational-dashboard` renders the video as hero media, so the page is fine, only the grid card is wrong.
- No dedicated ***REMOVED*** still image exists anywhere under `public/`. Full sweep done; only `***REMOVED***.mp4` / `***REMOVED***.mov` (video) and the ***REMOVED*** logo exist.
- Adjacent wrong pointer: `demoLinks` at L66–68 points to `grandprix-dashboard.html` (F1), not a ***REMOVED*** demo.

**Resolution paths:**
- Preferred: Elleta exports a static ***REMOVED*** dashboard frame (Figma → PNG/JPG, 16:10) → `public/images/thumbnails/***REMOVED***.png` → update `heroImage`.
- Workaround available on ask: extract a poster frame from `***REMOVED***.mp4` and check it in as `***REMOVED***.png`. Explicit ask required — wasn't done unilaterally because the task spec said "STOP and report — don't guess a replacement."

### 2. Known pre-existing lint warnings (non-blocking)

Build + lint status: `npm run build` passes. `npm run lint` → 0 errors, 5 warnings, all pre-existing:
- `app/case-studies/[slug]/page.tsx:6` — `Eyebrow`/`H2` imported but unused
- `components/CustomCursor.tsx` — **gone now**; any warning referencing it is stale cache, re-run lint
- `components/MediaCard.tsx:160,168` — `_type` unused (component itself is dead per Phase 1 inventory)
- `components/CustomCursor.tsx:111` — as above, now deleted

The lone lint **error** (`WorkSidebar.tsx:54 react-hooks/set-state-in-effect`) was fixed in `77b08e1`. The overlay's "1 Issue" badge it surfaced was confused with a separate hydration mismatch in `CustomCursor`, which was fixed in `42566b0`, then made moot by `21967e7` (component deleted).

### 3. Things flagged in `migration/PHASE_1_INVENTORY.md`, not yet acted on

The inventory from `9f008cc` still has pending items worth looking at before the next big refactor:
- `data/caseStudies.ts` (699 LOC) is fully dead — no consumers. Slated for deletion.
- 7 motion components under `components/motion/` are orphaned (only `FadeIn` + its two hooks are reached).
- 9 top-level components are unimported (`ArtifactGallery`, `ArtifactPlaceholder`, `CaseStudyHero`, `CaseStudySideCard`, `Header`, `MediaCard`, `PersonalSection`, `SectionWrapper`, `VideoSection`) plus `ui/SurfaceCard`.
- Orphan public assets: `***REMOVED***.mov`, `eddie.mov`, `design-system.mp4`, `guardian-evolution.html`, 8 duplicated thumbnails, several `.DS_Store`.
- The `app/case-study/{brad-frost,guardian}/page.tsx` redirect routes — ambiguous; user needs to decide if legacy URL traffic still matters.

See `migration/PHASE_1_INVENTORY.md` for the full list with reasons.

---

## Standing rules and conventions (things I did NOT reinvent per turn)

1. **RULES.md is the source of truth.** `~/DEV/bella/docs/RULES.md` — 8 numbered rules. Re-read at the start of any consumer-facing change. Most-relevant for day-to-day work:
   - Rule 1 — text on dark surfaces uses `--ink-on-dark-*` (fixed context, does NOT flip with `data-theme`).
   - Rule 2 — sibling cards share heights via `items-stretch` + `h-full` + `flex-col` + body `flex-1`. **No `min-height: NNNpx`** on variable-content cards.
   - Rule 4 — sticky-header pages define `--header-height`, use `scroll-padding-top: calc(var(--header-height) + var(--spacing-4))` on `html`, and `scroll-margin-top` with the same expression on anchor targets.
   - Rule 5 — grids use `repeat(auto-fill, minmax(var(--card-min), 1fr))`; fixed `repeat(N, 1fr)` **only when exactly N items**.
   - Rule 6 — focus rings use `--ring-focus-{color,width,offset}`; `outline: none` forbidden without a visible replacement.
   - Rule 7 — body text ≥ 16px, line-height ≥ 1.5 body / ≥ 1.2 display.
   - Rule 8 — no pure `#FFFFFF` / `#000000`.
2. **BELLA tokens only.** No hardcoded hex/rgb/px in new code. When a token doesn't exist, add it to BELLA (not inline).
3. **Never push.** Every turn has been local-only. Elleta reviews in Cowork before pushing.
4. **Never skip hooks.** No `--no-verify` flags on commits.
5. **One commit per logical change.** Conventional commits. Commit messages have a body that explains the *why*, not just the what.
6. **Co-author trailer on every commit:**
   ```
   Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
   ```
7. **Defer, don't decide.** For irreversible or high-blast-radius choices (delete vs keep, push vs not, merge strategy), flag and ask.
8. **Tasks the user typically phrases as "3 changes, one commit each"** — plan the commits upfront before editing so each diff is coherent. Grep first, edit second, commit third.

---

## Runtime

- Dev server was running in background (`b9s36rlsy`) at `http://localhost:3000`. **It dies when you close this terminal.** Restart with `cd ~/DEV/ctrl-alt-design && npm run dev`.
- Next.js 16 / Turbopack. `npm run build` passes (verified after every recent commit).
- 15 routes generated, 7 live:
  `/`, `/about`, `/case-studies/[slug]` (brad-frost / guardian / filters-decision-support-system / design-system-transformation / un-operational-dashboard), `/command-center`, `/command-center/map`, `/api/contact` (dynamic).

---

## Quick reference — files that get touched a lot

| Area | File |
|---|---|
| BELLA tokens (vendored) | `lib/bella/bella.css` |
| BELLA source + rules | `~/DEV/bella/tokens/bella.css`, `~/DEV/bella/docs/RULES.md` |
| Global styles | `app/globals.css` (~1300 lines; section-rules block starts around L608) |
| Home render | `app/page.tsx` |
| About render | `app/about/page.tsx` |
| Case study content | `content/case-studies/*.ts` + `lib/content.ts` |
| Canonical BELLA component | `components/bella/CaseStudyCard.tsx` + `.module.css` |
| Nav | `components/OverlayNav.tsx` |
| Inventory from Phase 1 | `migration/PHASE_1_INVENTORY.md` |
| Prior migration audit + report | `migration/AUDIT.md`, `migration/REPORT.md` |

---

## If you're starting a new session in Warp

1. `cd ~/DEV/ctrl-alt-design && git status` — confirm you're on `migration/bella-v0.1` with a clean tree.
2. `npm run dev` — restart the dev server; verify home loads at `localhost:3000`.
3. Read `~/DEV/bella/docs/RULES.md` (quick, ~90 lines).
4. Skim `migration/PHASE_1_INVENTORY.md` if you don't have the mental model for what's dead/canonical in this repo yet.
5. Ask Elleta what's next. Most likely next asks:
   - The UN ***REMOVED*** image (needs her asset).
   - Acting on the PHASE_1_INVENTORY prune proposal (delete dead code in one coordinated commit).
   - Further BELLA component extractions (inventory ranked Button/Tag/SectionHeader/Container as next).
   - Pushing to remote + opening PR when she's done reviewing in Cowork.

That's it.
