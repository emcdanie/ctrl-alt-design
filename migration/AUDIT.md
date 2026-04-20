# BELLA Migration Audit — Phase 1

Branch: `migration/bella-v0.1`
BELLA vendored at: `lib/bella/bella.css`

## How to read this file

The portfolio has an extensive local design vocabulary (`@theme` block in `app/globals.css`) plus hundreds of ad-hoc hardcoded values across 48 components, 5 case-study pages, and the command-center app. Enumerating every `file:line` would run to thousands of entries and obscure the pattern.

This audit is organised as **mapping rules first**, then **scoped file lists**, then **specific UNMAPPED entries** that need manual judgment in Phase 3.

BELLA's actual CSS custom-property names (not all are `--bella-*` prefixed — only blur is): see `lib/bella/bella.css` lines 6–272.

---

## Scope

Scanned:
- `app/` — 1157-line `globals.css`, 5 case-study pages, command-center dashboard, about/page, layout, root page
- `components/` — 48 `.tsx` files (35 contain inline `style={{ }}` props with hardcoded values)
- `lib/` (excluding `lib/bella/`) — `tagColor.ts`, `a11y-dev.ts`, `web-vitals.ts`, `motion.ts` (hex values only in devtools console strings)

Skipped:
- `lib/bella/` (BELLA source of truth — do not touch)
- `node_modules/`, `.next/`
- `prototypes/`, `content/` (not production code paths)

---

## A. COLORS

### Mapping rules

Local token → BELLA semantic token (preferred):

| Local value | BELLA token | Confidence | Notes |
|---|---|---|---|
| `#f7f3ec` / `--color-cream` | `--color-semantic-background` (`#F7F4EF`) | high | Functionally identical warm parchment |
| `#f6f1e8` / `--color-page` | `--color-semantic-background` | high | Same role as cream above |
| `#f0ebe3` / `--color-surface` | `--color-semantic-surface` (`#F0EDE8`) | high | Near-exact hex match |
| `#ffffff` / `--color-card` | *(see glass family)* | low → UNMAPPED | BELLA avoids pure white; solid white surface has no direct semantic |
| `#fafaf8` / `--color-white-pure` | `--color-neutral-50` (`#FBFAF7`) | high | Near-exact match |
| `#1a1a1a` / `--color-ink` | `--color-semantic-text-primary` (`#111111`) | med | Both near-black, BELLA slightly deeper |
| `#1A1A1A` (uppercase variant) | `--color-semantic-text-primary` | med | Same as above |
| `#2c2c2c` / `--color-ink-soft` | `--color-semantic-text-secondary` (`#525252`) | low | Visibly different; see UNMAPPED |
| `#3d3832` / `--color-ink-muted` / `--color-muted` | `--color-neutral-600` (`#525252`) | low | Warm brown-grey vs BELLA cool grey |
| `#1A1814` (dark utility surface) | `--color-brand-ink` (`#0F1117`) | med | Both warm near-black; BELLA has blue-cool undertone |
| `#b8956a` / `--color-accent-gold` | `--color-semantic-accent` (`#C4956A`) | med | Gold vs amber; BELLA's is slightly warmer/brighter |
| `#2c1810` / `--color-accent-espresso` | `--color-alpha-shadow-warm-*` base | high | Exact hex match — BELLA uses `#2C1810` at 3/4/5/6/8% for cognac shadows |
| `#110f12` (hero frame bg) | `--color-brand-ink` | med | Near-black warm, same role |
| `#F6F1E8` / `#EDE8DF` (dark-mode text-on-ink) | `--color-semantic-text-inverse` (`#F7F4EF`) | high | Warm parchment on ink |
| `#F8F5F0` / `#f9f8f5` | `--color-semantic-background` | high | All warm-cream page backgrounds |
| `#F3EEE7` (contact form field border) | `--color-semantic-border` / `--color-neutral-100` | med | Warm light; visually similar |
| `#F5F0E8` (case-study embed bg) | `--color-semantic-surface` | high | Same role |
| `#D8D4CC` (about avatar bg) | `--color-neutral-200` or `--color-neutral-100` | low → UNMAPPED | Warm grey, off-scale from BELLA neutrals |
| `#C8C4CC` (error avatar bg) | UNMAPPED | — | Not a BELLA color |
| `#E8E3DA` (carousel background) | `--color-supporting-linen` (`#E8E4DC`) | high | Near-exact warm light grey |
| `#8A8A8A` (case-study meta text) | `--color-semantic-text-muted` (`#999999`) | med | Secondary-grey role |
| `#6f6a63` (prototype embed muted) | `--color-semantic-text-secondary` | low | Warm-grey vs cool-grey |
| `#7a7a7a` (inkMuted fallback) | `--color-semantic-text-muted` | med | Close |

### rgba mappings (exact or near-exact)

| Local rgba | BELLA token | Confidence |
|---|---|---|
| `rgba(44, 24, 16, 0.03)` | `--color-alpha-shadow-warm-03` | high ✓ exact |
| `rgba(44, 24, 16, 0.04)` | `--color-alpha-shadow-warm-04` | high ✓ exact |
| `rgba(44, 24, 16, 0.05)` | `--color-alpha-shadow-warm-05` | high ✓ exact |
| `rgba(44, 24, 16, 0.06)` | `--color-alpha-shadow-warm-06` | high ✓ exact |
| `rgba(44, 24, 16, 0.08)` | `--color-alpha-shadow-warm-08` | high ✓ exact |
| `rgba(44, 24, 16, 0.1)` / `0.10` | `--color-semantic-border-subtle` or `--color-alpha-shadow-warm-08` | med | Two near-matches |
| `rgba(44, 24, 16, 0.12)` / `0.14` | UNMAPPED | — | No exact BELLA match |
| `rgba(255, 255, 255, 0.28)` | `--color-alpha-glass-28` | high ✓ exact |
| `rgba(255, 255, 255, 0.48)` | `--color-alpha-glass-48` | high ✓ exact |
| `rgba(255, 255, 255, 0.55)` | `--color-alpha-glass-55` | high ✓ exact |
| `rgba(255, 255, 255, 0.68)` | `--color-alpha-glass-68` | high ✓ exact |
| `rgba(255, 255, 255, 0.72)` | `--color-alpha-glass-72` | high ✓ exact |
| `rgba(255, 255, 255, 0.82)` | `--color-alpha-glass-82` | high ✓ exact |
| `rgba(255, 255, 255, 0.9)` / `0.90` | `--color-alpha-glass-90` | high ✓ exact |
| `rgba(255, 255, 255, 0.35/0.42/0.45/0.5/0.6/0.62/0.7/0.75/0.8/0.85/0.92)` | closest `glass-*` | med | Off-scale but close; use nearest BELLA step |
| `rgba(184, 149, 106, *)` | `--color-alpha-amber-*` base | med | Uses `#B8956A`, BELLA uses `#C4956A` — close but not exact |
| `rgba(26, 24, 20, *)` | `--color-alpha-shadow-warm-*` approx | low | Different hex base (26,24,20 vs 44,24,16) |
| `rgba(0, 0, 0, *)` (pure black shadows) | UNMAPPED → prefer warm shadow | — | See C. SHADOWS; cognac is the system warmth |

### Files touched (colors)

- `app/globals.css` — ~60 rgba + ~25 hex outside `@theme`
- `app/about/page.tsx` — ~20 hex (including three non-BELLA category colors: `#2A5FA8`, `#6B3FA8`, `#0D6B4A`)
- `app/case-studies/*/page.tsx` — ~15 hex (warm backgrounds, near-black hero frames)
- `app/command-center/CommandCenterDashboard.tsx` — ~35 hex + rgba (incl. non-BELLA UI palette: red/green/purple/blue reds); see UNMAPPED
- `app/command-center/CommandCenterNav.tsx` — ~8 rgba
- `app/command-center/map/SystemMap.tsx` — ~5 hex (warm palette clones)
- `components/*.tsx` — 35 files with inline `style={{ }}` containing hex/rgba
- `lib/tagColor.ts` — 6 pastel tag colors (UNMAPPED — not in BELLA)
- `lib/a11y-dev.ts` + `lib/web-vitals.ts` — console-string-only hex (devtools output, not rendered CSS; **skip entirely**)

### Colors count

~280+ colored-value occurrences across ~42 files, of which ~180 have **high-confidence** mappings, ~50 **medium**, ~50+ are **UNMAPPED** (category colors in command-center + about/ page + custom rgba alphas).

---

## B. SPACING

### Mapping rules

| Local px | BELLA token | Confidence |
|---|---|---|
| `4px` | `--spacing-1` | high |
| `8px` | `--spacing-2` | high |
| `12px` | `--spacing-3` | high |
| `16px` | `--spacing-4` | high |
| `20px` | `--spacing-5` | high |
| `24px` | `--spacing-6` | high |
| `32px` | `--spacing-8` | high |
| `40px` | `--spacing-10` | high |
| `48px` | `--spacing-12` | high |
| `64px` | `--spacing-16` | high |
| `80px` | `--spacing-20` | high |
| `44px` | `--spacing-touch-target` | high (for interactive-element min-height) |
| `96px` / `120px` / `56px` / `72px` / `88px` / `28px` / `36px` | UNMAPPED | — Off-scale |

Existing `var(--space-{1..8,xs,sm,md,lg,xl,2xl,section})` references in `globals.css` — already tokenized via the `@theme` block. These will **continue to resolve** after BELLA import because BELLA's `--spacing-*` does NOT shadow them (different names). **Leave untouched** in Phase 3. If Elleta wants to unify long-term, that's a separate pass.

### Spacing count

- `globals.css` — ~45 px values outside @theme, ~40 high-confidence mappable
- Components — ~60 `padding`/`margin`/`gap`/`rounded-[Npx]` values; many 16/20/24/32 (high) and some 14/18/22/28 (UNMAPPED)
- Tailwind utility classes (`p-4`, `gap-6`) are NOT in scope — already scale-aware

---

## C. SHADOWS + GLASS

### Mapping rules

| Local value | BELLA token | Confidence |
|---|---|---|
| `0 1px 2px rgba(44,24,16,0.04), 0 10px 30px rgba(44,24,16,0.06), 0 24px 60px rgba(44,24,16,0.04)` | `--shadow-soft` | high ✓ exact (BELLA built from this) |
| `0 1px 2px rgba(44,24,16,0.05), 0 12px 40px rgba(44,24,16,0.08), 0 28px 80px rgba(44,24,16,0.06), inset 0 1px 0 rgba(255,255,255,0.9)` | `--shadow-layered` | high ✓ exact |
| `0 1px 4px rgba(44,24,16,0.03), 0 4px 16px rgba(44,24,16,0.04), inset 0 1px 0 rgba(255,255,255,0.5)` | `--shadow-card-default` (inset differs slightly — 0.5 local vs 0.55 BELLA) | high |
| `0 1px 2px rgba(44,24,16,0.04), 0 8px 24px rgba(44,24,16,0.06), inset 0 1px 0 rgba(255,255,255,0.6)` | `--shadow-card-elevated` (inset 0.6 vs 0.68) | high |
| `0 8px 24px rgba(44,24,16,0.05), 0 2px 6px rgba(44,24,16,0.04), inset 0 1px 0 rgba(255,255,255,0.9)` (MediaCard / ExperienceCard) | `--shadow-layered` | med (layers close, slightly different spread) |
| `0 8px 32px rgba(0,0,0,0.12)` | `--shadow-lg` | med (cool black vs warm cognac — visual match, semantic drift) |
| `backdrop-filter: blur(14px)` | `--bella-blur-sm` | high ✓ exact |
| `backdrop-filter: blur(16px)` | `--bella-blur-md` | high ✓ exact |
| `backdrop-filter: blur(18px)` | `--bella-blur-lg` | high ✓ exact |
| `backdrop-filter: blur(20px)` | `--bella-blur-xl` | high ✓ exact |
| `backdrop-filter: blur(8px)` | `--bella-blur-xs` | high ✓ exact |

### Glass gradient rules

Local `linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.68) 100%)` → `--color-semantic-surface-glass` — high
`(0.68 → 0.48)` → `--color-semantic-surface-glass-elevated` — high
`(0.48 → 0.28)` → `--color-semantic-surface-glass-light` — high

### Files touched (shadows + glass)

- `globals.css` — ~12 `box-shadow` declarations, 6 `backdrop-filter` calls, 4 glass gradients
- Components with shadow/glass (arbitrary tailwind `shadow-[...]` escapes): `MediaCard`, `ExperienceCard`, `Hero`, `OverlayNav`, `Header`, `VideoCard`, `CtrlAltDesignSection`, `ExperienceSection`, `ContactSection`, `BackToWorkButton`, `AboutSection`, `PersonalSection`, `PrototypeEmbed`, `CaseStudyHero`, `CaseStudyShell`, `VinylPlayer`, `LogoContainer`, `VideoSection`, `VideoWalkthrough`, `ProcessSection`, `motion/HoverLift.tsx`
- `app/command-center/CommandCenterDashboard.tsx` — ~12 composite shadows, some matching BELLA exactly, some with custom spread

### Shadow count

~70 box-shadow declarations total. ~30 high-confidence matches, ~25 med (close but off by one layer or pct), ~15 UNMAPPED (hover states with custom multi-layer composites).

---

## D. RADII

### Mapping rules

| Local value | BELLA token | Confidence |
|---|---|---|
| `4px` | `--radius-sm` | high |
| `8px` | `--radius-md` | high |
| `12px` | `--radius-lg` | high |
| `16px` | `--radius-xl` | high |
| `20px` | `--radius-2xl` | high |
| `24px` | `--radius-3xl` | high |
| `999px` / `9999px` | `--radius-full` | high |
| `2px` / `6px` / `22px` | UNMAPPED | — Off-scale |

### Files touched (radii)

- `globals.css` — ~15 border-radius values; most 12/16/20/24 (high)
- Components — ~30 `rounded-[Npx]` Tailwind class strings + inline `borderRadius` values
  - Tailwind `rounded-[20px]` appears in many cards (high → `rounded-[var(--radius-2xl)]`)
  - `rounded-[24px]` in bento-card, glass-card, case-study hero on desktop (high → `--radius-3xl`)

### Radii count

~50 border-radius values. ~45 high-confidence, ~5 UNMAPPED (2px, 22px, custom).

---

## E. TYPOGRAPHY

### Mapping rules

| Local value | BELLA token | Confidence |
|---|---|---|
| `font-size: 13px` | `--typography-font-size-tag` | high |
| `font-size: 14px` | `--typography-font-size-sm` | high |
| `font-size: 16px` | `--typography-font-size-base` | high |
| `font-size: 18px` | `--typography-font-size-lg` | high |
| `font-size: 20px` | `--typography-font-size-xl` | high |
| `font-size: 24px` | `--typography-font-size-2xl` | high |
| `font-size: 32px` | `--typography-font-size-3xl` | high |
| `font-size: 40px` | `--typography-font-size-4xl` | high |
| `font-size: 56px` | `--typography-font-size-5xl` | high |
| `font-size: 11px` / `10px` / `12px` | UNMAPPED → **below BELLA's 13px floor**; flag for rethink |
| `font-size: 15px` / `17px` / `22px` / `28px` / `34px` | UNMAPPED (off-scale) |
| `font-size: clamp(…)` | UNMAPPED (fluid; BELLA scale is discrete) |
| `font-weight: 400` | `--typography-font-weight-regular` | high |
| `font-weight: 500` | `--typography-font-weight-medium` | high |
| `font-weight: 600` | UNMAPPED → BELLA uses 500 or 700, not 600 |
| `font-weight: 700` | `--typography-font-weight-bold` | high |
| `font-weight: 800` | `--typography-font-weight-black` | high |
| `line-height: 1.1` | `--typography-line-height-tight` | high |
| `line-height: 1.3` | `--typography-line-height-snug` | high |
| `line-height: 1.6` | `--typography-line-height-normal` | high |
| `line-height: 1.8` | `--typography-line-height-relaxed` | high |
| `line-height: 1.02/1.08/1.15/1.18/1.35/1.5/1.65/1.85` | UNMAPPED (off-scale) |
| `letter-spacing: -0.02em` | `--typography-letter-spacing-tight` | high |
| `letter-spacing: 0` | `--typography-letter-spacing-normal` | high |
| `letter-spacing: 0.08em` | `--typography-letter-spacing-wide` | high |
| `letter-spacing: 0.15em` | `--typography-letter-spacing-wider` | high |
| `letter-spacing: 0.01em/0.02em/0.04em/0.05em/0.12em/0.14em/-0.025em/-0.015em/-0.005em/-0.01em/-0.03em` | UNMAPPED |

### Files touched (typography)

- `globals.css` — ~40 font-size/weight/line-height declarations; about 1/3 match BELLA scale
- `app/about/page.tsx` — extensive inline typography in style={{}} (11px, 13px, 16px, clamp); mix of mappable and off-scale
- `app/case-studies/brad-frost/page.tsx` — 11px, 13px, 16px, clamp
- Components — most use `var(--font-body)` / `var(--font-display)` + clamp (preserve)

### Typography count

~80 typography declarations. ~35 high-confidence (font-size 13/14/16/18/20/24/32, font-weight 400/500/700, line-height 1.1/1.3/1.6/1.8, letter-spacing 0.08em/0.15em). ~45 UNMAPPED (off-scale values, font-weight 600, custom line-heights).

---

## F. UNMAPPED

Specific entries that do **not** have a clean BELLA mapping. These stay untouched in Phase 3 with a `/* TODO(bella-migration): ... */` comment where practical.

### Non-BELLA palette colors (category indicators)

These serve semantic roles BELLA doesn't have tokens for — category/learning-type colors, command-center status:
- `app/about/page.tsx:106-108` — workshop `#2A5FA8` / course `#6B3FA8` / conference `#0D6B4A` and their 0.1 alpha backgrounds. **Keep**; add TODO noting "category palette outside BELLA scope — propose BELLA category tokens in v0.2."
- `app/command-center/CommandCenterDashboard.tsx:42-53` — status colors `#2d7a50` / `#a63030` / `#6b4ea0` / `#3066a0` + 0.08/0.20 alpha variants
- `app/command-center/CommandCenterDashboard.tsx:138, 252-255, 767` — genre/show accent colors (`#7f1d1d`, `#d06060`, `#a78bfa`, `#c9a87e`) — gradient endpoints, leave
- `lib/tagColor.ts:2-7` — 6 pastel tag background/foreground pairs. **Keep entirely** — this is a distinct category palette. Tag **structure** (min-height 44, radius full) will migrate; the **colors** stay.

### Off-scale dimensions

- `globals.css:322` — `.pull-quote` padding `20px 24px`, border-radius `4px` (partially mappable — radius and padding-y are, padding-x isn't clean — use spacing-6)
- `globals.css:527` — `.demo-link` padding `10px 20px`, border-radius `999px` (padding-y 10px UNMAPPED, -x/radius mappable)
- `globals.css:591` — `.page-container` max-width `1200px`, padding `32px` (max-width is layout, not a token; padding-x maps to spacing-8)
- `globals.css:716, 826, 971` — sidebar width `220px`, back-btn padding, cs-shell padding — **all off-scale or context-specific**
- `globals.css:738, 751` — sidebar paddings `28px 20px 20px`, `16px 14px 22px` — first arg 28/22 off-scale
- `globals.css:857` — `font-size: 10px` (below 13px floor), letter-spacing `0.14em` — **leave, flag for rethink**
- `globals.css:943` — tag font-size `10px`, letter-spacing `0.04em` — **below BELLA 13px floor**; TODO
- `globals.css:868` — clamp font-size `24px → 34px` — fluid, UNMAPPED
- `globals.css:603` — `.card-interactive:hover` transform `translateY(-3px)` — BELLA hover lift is `-2px`; different feel. TODO.

### Custom rgba with no BELLA equivalent

- `rgba(44, 24, 16, 0.12)` / `0.14` / `0.18` — shadow alphas at unusual strength; closest BELLA is `shadow-warm-08` (0.08). Add TODO.
- `rgba(26, 24, 20, *)` — different warm-black base than BELLA cognac. Several occurrences in Hero/Header/OverlayNav. TODO: flag for palette unification.
- `rgba(255, 253, 247, 0.35)` (command-center todo done state) — UNMAPPED
- `rgba(215, 197, 166, 0.22)` (nav radial gradient) — golden tint, UNMAPPED
- `rgba(243, 238, 231, *)` (contact field outline/placeholder) — warm off-white at alpha, no match

### Shadow variants

- Custom bento-card hover shadow (`0 8px 24px ..., 0 24px 56px ..., inset 0 1px 0 ...`) — **close to shadow-layered** but different layer 2 spread. Med confidence, TODO.
- Multi-layer card hover composites (`VideoCard`, `MediaCard`, `ExperienceCard`) — close to `shadow-layered` + hover state; TODO: consider migrating to `transform: var(--motion-transform-hover-lift)` + `box-shadow: var(--shadow-layered)` pattern.
- `shadow-[0_4px_16px_rgba(0,0,0,0.18)]` / `shadow-[0_18px_48px_rgba(0,0,0,0.12)]` — pure-black shadows in `BackToWorkButton`, `VideoSection`. BELLA uses warm cognac. **Swap to `--shadow-lg` or `--shadow-hover`** for warmth unification — but this is a visual judgment. Med confidence, leave TODO.

### OKLCH color system

- `globals.css:76-92` — an entire parallel OKLCH color system feature-flagged via `@supports`. **Leave untouched** in Phase 3. BELLA doesn't have OKLCH equivalents. Consider deprecating post-migration.

### Fluid typography (clamp)

- `--font-hero`, `--font-section-title`, `--font-card-title`, `--font-body-size`, `--font-small` — all `clamp(…)` expressions. BELLA's type scale is discrete; no direct mapping. **Leave untouched**. A fluid-to-step translation is a v0.2 decision.

---

## Summary

- **Colors**: ~280 entries. ~180 high-confidence, ~50 med, ~50 UNMAPPED.
- **Spacing**: ~105 entries. ~75 high-confidence, ~30 UNMAPPED (off-scale or layout-specific).
- **Shadows + Glass**: ~70 entries. ~30 high, ~25 med, ~15 UNMAPPED (custom hovers).
- **Radii**: ~50 entries. ~45 high, ~5 UNMAPPED.
- **Typography**: ~80 entries. ~35 high, ~45 UNMAPPED (below-13px-floor, off-scale, fluid clamp).
- **Unmapped total**: ~140 entries across categories.
- **Files needing edits in Phase 3** (unique): ~45 files.

### Phase 3 priority order (most leverage first)

1. **`app/globals.css`** — biggest single surface; 100+ replacements. One commit per category there alone would be productive.
2. **`app/command-center/CommandCenterDashboard.tsx`** — dense glass + shadow + custom palette. High mapping yield on the glass/shadow side; palette colors stay.
3. **Shared card components** — `MediaCard`, `ExperienceCard`, `VideoCard`, `CtrlAltDesignSection` — all share the "warm glass card" pattern. Unify to BELLA `--color-semantic-surface-glass-*` + `--shadow-layered`.
4. **Header / OverlayNav / BackToWorkButton** — branded UI chrome. Maps cleanly.
5. **Case-study pages** — inline style={{}} refactor; mostly hex + spacing.
6. **About page** — inline typography; leave category palette UNMAPPED.

---

## Appendix: existing `@theme` / `:root` local tokens

These are **definitions** in `app/globals.css` (lines 4-84). Phase 2 adds `@import '../lib/bella/bella.css';` at the **top** of globals.css. BELLA's tokens do NOT shadow these (different names — `--color-cream` vs `--color-semantic-background`; `--space-2` vs `--spacing-2`). Phase 3 edits use BELLA tokens **outside** the `@theme` / `:root` blocks. The local tokens stay as-is and can be deprecated in a future pass once every consumer is migrated.

Existing local namespaces (summary):
- `--color-cream / page / card / ink / ink-soft / ink-muted / surface / white-pure / accent-espresso / accent-gold / border-soft / border-medium / glass / glass-strong / tag-bg / tag-border / muted` (17 tokens)
- `--shadow-soft / layered` (2 — **collide by name with BELLA but have identical values**; BELLA's are authoritative after import)
- `--font-display / body / hero / section-title / card-title / body-size / small` (7 fluid clamp tokens)
- `--space-1..8`, `--space-xs..2xl`, `--space-section / section-lg` (17 tokens — different scale from BELLA `--spacing-*`)
- `--container-width / padding`, `--grid-gap`, `--card-padding / radius`, `--header-height` (6 layout tokens)
- `--oklch-*` (6 parallel OKLCH tokens, feature-flagged)

### Collision note — shadow names

Both files define `--shadow-soft` and `--shadow-layered`. When BELLA is imported FIRST (top of globals.css), the `@theme` redefinitions AFTER it in the same cascade will win, unless `@theme` is evaluated as definitions-only by Tailwind. This needs a build-check in Phase 4 — log any visual regression.

If BELLA's shadows lose, Phase 3 swaps to `--shadow-*` in components will still reference the LOCAL values (which are byte-identical anyway). If there's a visual delta, it's a value-alignment issue, not a breakage.
