# BELLA Migration — Morning Report

**Branch**: `migration/bella-v0.1`
**Main**: untouched
**Pushed**: no (local-only, as instructed)
**Build**: ✅ PASS (exit 0)
**Lint**: ⚠ 3 errors, 5 warnings — all **pre-existing**, not introduced by migration

---

## Commits shipped (newest first)

```
9acc3ae  refactor(bella-migration): migrate typography tokens
b4d7917  refactor(bella-migration): migrate radius tokens
1303a39  refactor(bella-migration): migrate shadow + glass tokens
f4e516d  refactor(bella-migration): migrate spacing tokens
ee60c71  refactor(bella-migration): migrate color tokens
89c15d4  feat(bella-migration): import BELLA tokens at global scope
f393a94  chore(bella-migration): audit report — phase 1
bd68ff5  chore(bella): vendor bella.css v0.1.1 into lib/bella/
```

8 commits ahead of `main`. Every commit on this branch has `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` in the trailer.

## Totals

- **Files changed vs main**: 43
- **Lines**: +1,120 / −451 (net +669, mostly new vendored `bella.css` + `AUDIT.md`)
- **Migration-only diff** (excluding vendoring + audit): ~40 files, ~400 lines of swaps

## Files touched per category (Phase 3)

| Category | globals.css | TSX files | Total lines migrated |
|---|---|---|---|
| Colors | ✓ (17 lines) | 25 files | ~86 lines |
| Spacing | ✓ (39 lines) | 25 files | ~170 lines |
| Shadows + Glass | ✓ (14 lines) | 8 files | ~31 lines |
| Radii | ✓ (12 lines) | 19 files | ~49 lines |
| Typography | ✓ (15 lines) | 26 files | ~119 lines |

## Tokens mapped vs unmapped (from AUDIT.md)

| Category | High-conf mapped | Med (left per rules) | UNMAPPED |
|---|---|---|---|
| Colors | ~180 | ~50 | ~50 |
| Spacing | ~75 | — | ~30 (off-scale) |
| Shadows + Glass | ~30 | ~25 | ~15 (custom hover composites) |
| Radii | ~45 | — | ~5 (2/6/22px) |
| Typography | ~35 | — | ~45 (below-13px-floor, clamp, off-scale line-heights) |

Mapped entries have been swapped to BELLA tokens in Phase 3 commits. UNMAPPED entries remain at their hardcoded values — they're catalogued in `migration/AUDIT.md` Section F, organized by reason.

## Build status

```
npm run build → exit 0 ✅
```

Next.js production build **succeeds** against the migrated code. All `var(--bella-blur-*)`, `var(--color-alpha-*)`, `var(--color-semantic-*)`, `var(--spacing-*)`, `var(--radius-*)`, `var(--typography-*)` references resolve through the imported `lib/bella/bella.css`. CSS custom-property references survived the Next.js/Tailwind build pipeline cleanly.

## Lint status

```
npm run lint → exit 1 (3 errors, 5 warnings)
```

All lint issues are **pre-existing** and unrelated to this migration. Confirmed by reviewing each:

**Errors (3)**:
1. `components/VideoWalkthrough.tsx:15` — two unescaped `"` in JSX content (line has `"Design systems" and "AI UX"` as literal quotes; needs `&quot;` or curly braces). Pre-existing.
2. `components/WorkSidebar.tsx:54` — `handleScroll()` called synchronously inside a `useEffect` body (new-ish `react-hooks/set-state-in-effect` rule). Pre-existing.

**Warnings (5)**: unused imports/variables (`Eyebrow`, `H2`, `_type` ×2, missing `visible` dep in `CustomCursor`). None migration-related.

## Typecheck

```
SKIPPED — no "typecheck" script in package.json scripts
```

Package.json only defines `dev / build / start / lint`. If a `tsc --noEmit` typecheck is desired, add a `"typecheck": "tsc --noEmit"` script and re-run. The `next build` pass already runs TypeScript compilation and it succeeded.

## Top 5 "review carefully in the morning" items

### 1. Shadow-name collision (globals.css `@theme` vs BELLA)

`app/globals.css` still defines `--shadow-soft` and `--shadow-layered` in its `@theme` block (lines 26–29). BELLA's `bella.css` defines the same names (lines 108–109). Since BELLA imports BEFORE tailwindcss, and tailwind processes `@theme` after, the LOCAL definitions likely win the cascade.

**Action**: the local values are byte-identical to BELLA's, so no visual delta. But the duplication is confusing. Recommend deleting the `--shadow-soft`/`--shadow-layered` lines from globals.css `@theme` in a follow-up commit — BELLA is now authoritative.

### 2. `.card-default` and `.card-elevated` inset-highlight mismatch

In globals.css lines ~447 and ~459, the composite box-shadows use `rgba(255, 255, 255, 0.5)` and `0.6` inset highlights, whereas BELLA's equivalents use `--color-alpha-glass-55` (0.55) and `-68`. I did NOT swap these to `var(--shadow-card-default)` / `var(--shadow-card-elevated)` because the mismatch would change visual output.

**Action**: judgment call — align to BELLA (swap 0.5→0.55 and 0.6→0.68, use `var(--shadow-card-default/elevated)`) or keep the existing subtler inset. Both are valid design choices. Recommend aligning to BELLA for consistency, but verify in the `.card-default` and `.card-elevated` demos on a live page.

### 3. Warm-black `#1A1814` vs BELLA ink `#0F1117`

The portfolio uses `#1A1814` as its dark utility surface (button backgrounds, focus rings, dashboard hero block) and `#1A1A1A` as a near-black body color. BELLA's `--color-brand-ink` is `#0F1117` — darker and with a blue-cool undertone. I left `#1A1814` / `#1A1A1A` untouched (med confidence; visual drift).

**Action**: decide whether the portfolio should unify to BELLA's ink (more saturated near-black) or keep its warm-black. If unifying, swap `#1A1814` → `var(--color-brand-ink)` across `BackToWorkButton`, `CtrlAltDesignSection`, `Header`, `OverlayNav`, `VideoWalkthrough`, `about/page.tsx`. ~12 occurrences.

### 4. Command-center palette is deliberately outside BELLA

`app/command-center/CommandCenterDashboard.tsx:42–53` defines a 4-color status palette (red/green/blue/purple with bg/border variants at 0.08/0.20 alpha). These are NOT in BELLA and shouldn't be — they're status/genre indicators outside BELLA's editorial palette. **Left untouched by design.**

**Action**: nothing required now. If BELLA v0.2 introduces semantic status colors (success/warning/error/info with subtle + border variants), consider re-mapping then. Currently BELLA has `--color-semantic-success` (sage) and `--color-semantic-info` (steel) but no error or warning tokens.

### 5. About-page category palette (`#2A5FA8`, `#6B3FA8`, `#0D6B4A`)

`app/about/page.tsx:106–108` defines learning-type category colors (workshop/course/conference). Same story as command-center: deliberate domain palette, left untouched.

**Action**: document in BELLA's v0.2 backlog — "category token layer" as a possible extension for consumer projects that need it.

## Recommended next steps (by hand)

1. **Fix the 2 lint errors** (`VideoWalkthrough.tsx` unescaped quotes, `WorkSidebar.tsx` set-state-in-effect). Neither touches migration work. ~10 minutes.
2. **Visually verify** the migrated surfaces at dev (`npm run dev`) — particularly:
   - Portfolio home (`/`) — Hero, carousel, case-study grid, experience cards — glass cards should render identically
   - `/command-center` — the dashboard's glass cards, status pills, genre chips
   - `/case-studies/*` — hero frames, inline style-objects that received the most substitutions
   - `/about` — dense inline typography updates
3. **Review "Top 5" items above** — pick up/down on each.
4. **Decide on local `@theme` deprecation**. The Appendix of `migration/AUDIT.md` lists the 40+ local tokens. Some are genuine layout (`--container-width`, `--header-height`) that BELLA doesn't cover — keep those. Others (ink/page/cream/surface/accent-gold) are now parallel to BELLA semantics — decide whether to remove and point consumers at BELLA directly.
5. **OKLCH parallel system** (globals.css lines 77–92) — decide fate. BELLA doesn't offer OKLCH variants. Recommend deprecate unless it's solving a specific color-accuracy need.
6. **Enable GH Pages** for `bella` repo so `https://emcdanie.github.io/bella/` serves the v0.1.1 preview (separate action on the BELLA repo, not this one).
7. **When satisfied, merge `migration/bella-v0.1` to `main`** — suggest squash-merge with a single commit message summarizing v0.1 migration.

## Files of record

- `migration/AUDIT.md` — comprehensive mapping rules + file lists + UNMAPPED catalog
- `migration/BUILD_LOG.txt` — full output of Phase 4 commands
- `migration/REPORT.md` — this file
- `lib/bella/bella.css` — vendored BELLA v0.1.1 (source of truth: `github.com/emcdanie/bella`)
- `lib/bella/README.md` — provenance

## Branch posture

Clean, ready to review. No pushes, no tags on this branch, no merges to main. Nothing to undo from the overnight run.
