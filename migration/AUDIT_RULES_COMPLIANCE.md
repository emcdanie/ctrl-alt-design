# AUDIT — BELLA RULES.md compliance (v0.1)

One-shot audit against `~/DEV/bella/docs/RULES.md` (v0.1, 8 rules). **Findings only — no fixes applied.**

- Audited at commit: `5b4a61b` on `migration/bella-v0.1`
- BELLA tokens vendored at: `lib/bella/bella.css`
- Date: 2026-04-21

## Scope

**In scope** — the Next.js consumer app:
- `app/**` (routes, globals.css, case studies, about, command-center)
- `components/**` (React components, CSS modules)
- `lib/**`, `content/**` (where relevant)

**Out of scope** — deliberately excluded from violation counts:
- `prototypes/**` — standalone HTML design explorations, frozen snapshots, not BELLA consumers
- `public/demos/**` — built demo HTML served via iframe embeds, not BELLA consumers
- `*.md` (planning docs, migration audits) — documentation artifacts
- `lib/bella/bella.css` — the vendored BELLA source itself (its internal use of `#FFFFFF…` alpha hex *defines* the tokens; it's not a consumer)

Rule 1 footer/Contact violations are mentioned but the ContactSection footer is already correctly using `--ink-on-dark-*`; it is the other dark-surface usages across the app that are the issue.

---

## Summary table

| Rule | Topic | Violations | Worst offender |
|---:|---|---:|---|
| 1 | Dark-surface text tokens | 8 | `components/VideoModal.tsx` (5 occurrences) |
| 2 | Equal-height sibling cards | 2 | `components/PersonalSection.tsx` |
| 3 | Ellipsis/line-clamp | 0 | — |
| 4 | Sticky-header scroll offset | 1 (gap) | `app/globals.css` (wrapper scroll-padding) |
| 5 | Grid auto-fill minmax | 2 | `app/globals.css` (`.layout-grid` uses `auto-fit`, dead) |
| 6 | Focus-ring tokens | 4 | `app/globals.css` (global `:focus-visible` hardcoded) |
| 7 | Body text ≥16px / line-height ≥1.5 | 17 | `components/ResumeModal.tsx` (9 sub-16px body uses) |
| 8 | No pure `#fff` / `#000` | 13 | `app/globals.css:9` (`--color-card: #ffffff`) |

**Total flagged: 47 findings** across `app/**` and `components/**`.

Severity key: **critical** = user-visible accessibility or theming regression; **moderate** = token drift, brittle under theme swaps; **cosmetic** = convention breach, no functional impact.

---

## Rule 1 — Dark-surface text uses `--ink-on-dark-*` tokens

**Rule:** Text on dark surfaces must use the fixed-context tokens (`--ink-on-dark-{strong,body,muted}`), not `--color-semantic-text-*` (which flips with `data-theme`) and not hardcoded white.

**Correctly compliant:**
- `components/ContactSection.tsx` — entire footer migrated ✓
- `app/globals.css:496, 506, 512` — `.contact-field`, placeholders, footer-nav-link ✓

**Violations:**

| File:line | Current code (excerpt) | Severity |
|---|---|---:|
| `components/VideoModal.tsx:53` | `className="... text-white/50 hover:text-white ..."` on `bg-black` modal | critical |
| `components/VideoModal.tsx:88` | `<h3 className="... text-white text-[1.2rem] ...">` | critical |
| `components/VideoModal.tsx:91` | `<p className="text-white/55 text-[14px] ...">` | critical |
| `components/VideoModal.tsx:98` | `className="text-[13px] text-white/50 border border-white/15 ..."` | critical |
| `components/ExperienceCard.tsx:71` | `<span className="... bg-[#1A1814] ... text-white">` current-role pill | moderate |
| `components/OverlayNav.tsx:61` | `<div className="... bg-[#1A1814] text-white ...">` menu trigger | moderate |
| `components/BackToWorkButton.tsx:9` | `bg-[#1A1814]` with `text-[var(--color-semantic-text-inverse)]` — **token flips with theme** | critical |
| `components/Header.tsx:81` | `bg-[#1A1814]` with `text-[var(--color-semantic-background)]` — **token flips with theme** (in dark mode `--color-semantic-background` = `#0F1117`, dark-on-dark) | critical |
| `components/ResumeModal.tsx:108` | `bg-[#1A1814]/40` with `text-[var(--color-semantic-text-inverse)]/50` — **token flips with theme** | moderate |
| `app/about/page.tsx:511` | Dark CTA panel `background: "#1A1814"` with `color: "#FFFFFF"` on `<h2>` and `color: "rgba(255,255,255,0.4)"` on eyebrow (L508) | critical |
| `components/CaseStudyShell.tsx:322` | Same dark CTA pattern, same two violations (eyebrow `rgba(255,255,255,0.4)` L313 + heading `#FFFFFF`) | critical |

**Count: 11 occurrences across 8 files.** The three `text-[var(--color-semantic-text-inverse)]` usages are the silent killers — they look token-correct but break in dark mode because these tokens flip.

---

## Rule 2 — Sibling cards in a grid share equal heights

**Rule:** Grid + `align-items: stretch` + card `height: 100%` + `display: flex; flex-direction: column` + body `flex: 1`. No `min-height: NNNpx` on variable-content cards.

**Correctly compliant:**
- `components/bella/CaseStudyCard.module.css` + `CaseStudyCardGrid.module.css` — canonical pattern ✓
- `components/MetricsStrip.tsx` — comment explicitly references Rule 2 ✓
- `components/LearningSection.tsx` — comment explicitly references Rule 2 ✓
- `components/CtrlAltDesignSection.tsx:189, 225` — 2×2 fixed grids with `items-stretch` ✓

**Violations:**

| File:line | Current code | Which rule broken | Severity |
|---|---|---|---:|
| `components/PersonalSection.tsx:31` | `<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">` — cards inside have no `height: 100%`, no `flex-direction: column`, no `flex: 1` body. No `items-stretch` on the grid. | Rule 2 | moderate |
| `components/ArtifactGallery.tsx:59` | `<div className={`grid gap-5 ${gridClass}`}>` — figures; not "cards with body copy", but when `columns=3` and dataset isn't a multiple of 3, siblings have no equal-height pattern. Also Phase 1 inventory flags ArtifactGallery as unimported. | Rule 2 + Rule 5 | cosmetic |

`app/globals.css:968` (`min-height: 400px` on `.prototype-iframe`) is a fixed-minimum on an **iframe embed**, not a card with variable body content — Rule 2 does not apply.

---

## Rule 3 — No ellipsis/line-clamp on card bodies

**Rule:** `text-overflow: ellipsis`, `-webkit-line-clamp`, and Tailwind `truncate` are forbidden on card copy unless the card opts in via `Card--truncate`.

**Grep results:**
- `prototypes/` and `public/demos/` — matches present but **out of scope**
- `app/**`, `components/**`, `lib/**` — **zero matches** ✓

**Count: 0 violations in scope.** This rule is fully clean.

---

## Rule 4 — Sticky-header pages set `--header-height` and use `scroll-padding-top`

**Rule:** Define `--header-height` at `:root`, apply `scroll-padding-top: calc(var(--header-height) + var(--spacing-4))` to `html` **and the page content wrapper**, and `scroll-margin-top` with the same expression to anchor targets.

**Correctly compliant:**
- `app/globals.css:62` — `--header-height: 70px` defined in `@theme` ✓
- `app/globals.css:449-451` — `html { scroll-padding-top: calc(var(--header-height) + var(--spacing-4)); }` ✓
- `app/globals.css:453-457` — `section[id], [id] > h1, [id] > h2 { scroll-margin-top: calc(...); }` ✓
- `app/globals.css:464-467` — `.cs-shell, .case-study-content { scroll-padding-top: ... }` ✓

**Violations:**

| File:line | Issue | Severity |
|---|---|---:|
| `app/globals.css` (no match) | Rule 4 step 2 requires `scroll-padding-top` on the **page content wrapper** in addition to `html`. The home/about pages use `.layout-container` (app/globals.css:95–103) as their wrapper but it has no `scroll-padding-top` set. In practice the `html` rule covers the scroll container, so the missing wrapper rule is a conformance gap, not a broken anchor. | cosmetic |

**Count: 1 finding** (gap, not a broken user-facing behavior).

---

## Rule 5 — Grids use `auto-fill, minmax(var(--card-min), 1fr)` — not `repeat(N, 1fr)`

**Rule:** Responsive card grids use `auto-fill` + `minmax(var(--card-min), 1fr)`. Fixed `repeat(N, 1fr)` is allowed **only** when data is exactly N items and N never grows. Trailing rows must fill left-aligned.

**Correctly compliant:**
- `app/globals.css:127` (`.layout-grid-3`) — `auto-fill + minmax(var(--card-min, 280px), 1fr)` ✓
- `components/bella/CaseStudyCardGrid.module.css:7` — same ✓
- `components/CtrlAltDesignSection.tsx:189, 225` — fixed 2-col, data is exactly 4 items (2×2). Comment at L187 explicitly justifies the exception ✓
- `components/MetricsStrip.tsx:80` — fixed 4-col, data is exactly 4 items ✓
- `components/PersonalSection.tsx:31` — fixed 3-col, data is exactly 3 items ✓ (Rule 5 OK; still fails Rule 2, see above)
- `components/LearningSection.tsx:36` — fixed 2-col, exactly 2 items ✓

**Violations:**

| File:line | Current code | Issue | Severity |
|---|---|---|---:|
| `app/globals.css:117` | `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));` on `.layout-grid` | Uses `auto-fit` instead of `auto-fill` (Rule 5 specifies `auto-fill`; `auto-fit` collapses empty tracks, which can stretch the last card to full width instead of left-aligning). Dead code — no consumer found. | cosmetic |
| `components/ArtifactGallery.tsx:35-38` | `2: "grid-cols-1 sm:grid-cols-2"`, `3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"` | Fixed column counts with variable-length `items` array; will orphan when `items.length % columns !== 0`. Also unimported per Phase 1 inventory. | cosmetic |

**Count: 2 findings**, both dead-code adjacent.

---

## Rule 6 — Focus states use `--ring-focus-*` tokens

**Rule:** `:focus-visible` rules use `--ring-focus-{width,color,offset}`. `outline: none` forbidden without a replacement `box-shadow` ring / `border` swap.

**Correctly compliant:**
- `lib/bella/bella.css:280-282` — tokens defined ✓
- `app/globals.css:627-628, 717-718` — `.process-accordion-trigger`, `.process-accordion-link` use tokens ✓
- `app/globals.css:495-498` — `.contact-field:focus` does `outline: none` but replaces with `border-color` + `box-shadow` ring (Rule 6 escape clause satisfied) ✓

**Violations:**

| File:line | Current code | Issue | Severity |
|---|---|---|---:|
| `app/globals.css:475-478` | `:focus-visible { outline: 2px solid rgba(44, 24, 16, 0.45); outline-offset: 3px; }` | Hardcoded rgba + px instead of `--ring-focus-*` | moderate |
| `app/globals.css:480-484` | `a:focus-visible, button:focus-visible { outline: 2px solid #1A1814; outline-offset: 3px; }` | Hardcoded hex + px | moderate |
| `app/globals.css:487-491` | `.bg-\[\#1A1814\] :focus-visible, footer :focus-visible { outline: 2px solid rgba(237, 232, 223, 0.7); outline-offset: 3px; }` | Hardcoded rgba + px (the dark-surface focus ring — should be a fixed-context token pair) | moderate |
| `app/globals.css:516-519` | `input:focus-visible, textarea:focus-visible { outline: 2px solid rgba(237, 232, 223, 0.6); outline-offset: 2px; }` | Hardcoded rgba + px | moderate |
| `components/bella/CaseStudyCard.module.css:35-38` | `.link:focus-visible { outline: 2px solid var(--color-semantic-border-strong); outline-offset: 2px; }` | Uses a semantic token, not `--ring-focus-*`. Close but not canonical. | cosmetic |
| `app/globals.css:500-502` | `.contact-field:focus-visible { outline: none; }` | Removes outline with no replacement *in this rule*. The adjacent `.contact-field:focus` (L494) does provide a replacement, so keyboard focus is covered in practice. Edge-case conformance gap. | cosmetic |

**Count: 6 findings** (4 moderate + 2 cosmetic). No `outline: none` without replacement in user-facing code.

---

## Rule 7 — Body text ≥ 16px; line-height ≥ 1.5 body / ≥ 1.2 display

**Rule:** Body text below `--typography-font-size-base` (16px) is forbidden. 13–14px allowed only for genuine metadata (tag, eyebrow, footnote).

**Body copy below 16px floor:**

| File:line | Current | What kind of text | Severity |
|---|---|---|---:|
| `components/VideoWalkthrough.tsx:43` | `className="text-[15px] text-[#4A4640] leading-relaxed mb-5"` | Descriptive body copy under video thumbnail | moderate |
| `components/VideoCard.tsx:81` | `<p className="mb-4 flex-1 text-[15px] leading-[1.72] text-[#8A8480]">` | Card body (subtitle) | moderate |
| `components/VideoSection.tsx:55` | `<p className="mt-3 text-[15px] leading-[1.75] ...">` | Section body copy | moderate |
| `components/ExperienceCard.tsx:104` | `<li key={i} className="flex gap-3 text-[15px] leading-[1.75] ...">` | Bulleted highlights (body prose) | moderate |
| `components/ExperienceSection.tsx:212` | `<p className="text-[15px] leading-[1.75] text-[#4A4640]">` | Education description | moderate |
| `components/ContactSection.tsx:226` | `className="text-[15px] transition-colors footer-nav-link"` | Footer nav links (navigation, not metadata) | moderate |
| `components/MediaCard.tsx:136` | `<p className="mb-3 flex-1 text-[14px] ...">` | Card body copy (MediaCard is dead per Phase 1) | cosmetic |
| `components/CtrlAltDesignSection.tsx:155` | `className="mb-4 flex-1 text-[14px] leading-[1.65]"` | Prototype card subtitle (body copy) | moderate |
| `components/VideoModal.tsx:91` | `<p className="text-white/55 text-[14px] leading-relaxed mb-4">` | Modal body copy | moderate |
| `components/ExperienceCard.tsx:76` | `<div className="mt-1 text-[14px] leading-relaxed text-[#8A8480]">` | Role period + subtitle (arguably metadata — borderline) | cosmetic |
| `components/ExperienceSection.tsx:205` | `<div className="mt-1 text-[14px] leading-relaxed ...">` | Same pattern (borderline metadata) | cosmetic |
| `app/globals.css:1058` (`.cs-shell__summary`) | `font-size: var(--typography-font-size-sm); line-height: 1.65;` (=14px) | Case study sidebar summary (body copy, not metadata) | moderate |
| `components/ResumeModal.tsx:132,135,153,168,183,184,201,207` (8 uses) | `text-[13px]` on paragraph copy: job descriptions, education descriptions, bullet highlights | Résumé prose in modal is body copy (not tag/eyebrow) — 13px violates floor | moderate |

**Display/heading/line-height notes:**
- `app/globals.css:174` — `body { font-size: 17px; line-height: 1.65 }` ✓ (above floor)
- `app/globals.css:322,332,342` — display headings `line-height: 1.08 / 1.15 / 1.18` — within Rule 7 display budget (≥1.2 **for display** is allowed to break below tight per BELLA's own `--typography-line-height-tight: 1.1`) ✓
- `app/globals.css:395` — `line-height: 1.85` ✓
- `app/globals.css:1122` — `.cs-shell__tag { line-height: 1.4 }` — tag (metadata) ✓
- `app/globals.css:1098` — `.cs-shell__meta-row dd { font-size: 12px; line-height: 1.5 }` — metadata dd values (OK by scope), but 12px is below even the tag floor (13px). Edge.

**Count: 17 body-copy violations** across 11 files (counting ResumeModal's 8 sub-16px paragraphs as 8). The pattern: Tailwind arbitrary `text-[14px]` / `text-[15px]` is the house style for "prose that isn't the hero" — directly at odds with Rule 7.

---

## Rule 8 — No pure `#FFFFFF` or `#000000`

**Rule:** Pure white and pure black forbidden in consumer CSS. Use `--color-semantic-surface-*`, `--color-semantic-text-*`, `--color-brand-ink`, `--color-brand-parchment`.

**Violations — pure `#FFFFFF` / `#ffffff`:**

| File:line | Current code | Context | Severity |
|---|---|---|---:|
| `app/globals.css:9` | `--color-card: #ffffff;` | **Design token** defining card surface as pure white — cascaded everywhere the token is used | critical |
| `components/PersonalSection.tsx:44` | `el.style.background = "#FFFFFF";` | Hover state on personal cards | moderate |
| `app/about/page.tsx:511` | `color: "#FFFFFF"` | Dark-CTA heading | critical (also Rule 1) |
| `components/CaseStudyShell.tsx:322` | `color: "#FFFFFF"` | Dark-CTA heading (duplicate pattern) | critical (also Rule 1) |
| `components/VideoWalkthrough.tsx:58` | `color: "#FFFFFF"` | Overlay label on video cover | moderate |
| `components/CtrlAltDesignSection.tsx:10,11,12,13,14,191` | Lab category color map — 6 entries all `color: "#FFFFFF"` | Category pills (data-table style) | moderate |

**Violations — near-pure black (spirit of Rule 8):**

| File:line | Current code | Context | Severity |
|---|---|---|---:|
| `app/globals.css:10` | `--color-ink: #1a1a1a;` | Local token drift — BELLA has `--color-semantic-text-primary: #111111` and `--color-brand-ink: #0F1117`. `#1a1a1a` is a third ink value that conflicts. | moderate |
| `app/case-studies/brad-frost/page.tsx:101` | `background: "#0A0A0A"` | Near-black panel background — BELLA would use `--color-brand-ink` (`#0F1117`) | moderate |
| `components/VideoSection.tsx:63` | `bg-[#0d0d0d]` | Near-black video frame — same — use `--color-brand-ink` | moderate |
| `app/globals.css:437` | `.surface-dark { background: #1A1814; }` | Local "soot" token; not `#000` but close. Rule 8 doesn't strictly ban it, but combined with the ~20 other `bg-[#1A1814]` usages it's a convention split from BELLA's ink. | moderate |

**Note on `rgba(255,255,255,X)` alpha glass surfaces:**

`app/globals.css` and multiple components use `rgba(255, 255, 255, 0.6)` etc. extensively for glass overlays (e.g. `--color-glass: rgba(255, 255, 255, 0.68)`, inset highlights like `inset 0 1px 0 rgba(255, 255, 255, 0.9)`). BELLA's own tokens define these as `#FFFFFF47`, `#FFFFFF7A`, `#FFFFFFAD`, etc. Rule 8 targets **pure opaque** white/black; alpha variants are used by BELLA itself. However, consumers should reference `--color-alpha-glass-*` / `--color-semantic-surface-glass-*` rather than inline the rgba. Dozens of these sites exist — not counted as Rule 8 violations but flagged as **token-indirection debt** (~40+ sites; concentrated in `app/globals.css`, `app/command-center/map/SystemMap.tsx`, `app/command-center/CommandCenterDashboard.tsx`). If BELLA tightens Rule 8 in v0.2, this becomes the long tail.

**`#1A1814` (soot) proliferation:** 64 occurrences across 21 component files, 13 more in `app/**`. Not a direct Rule 8 violation (it's not `#000`) but a strong signal that BELLA needs a named "soot" token or the codebase needs to consolidate on `--color-brand-ink`. Currently three competing ink values are in use: `#0F1117` (BELLA brand-ink), `#1A1A1A` (local `--color-ink`), `#1A1814` (bespoke soot).

**Count: 13 direct pure-white/near-black findings in scope.**

---

## Recommendations, sorted by severity

### Critical — user-visible accessibility or theming regression
1. **Rule 1 (VideoModal.tsx, ExperienceCard.tsx, BackToWorkButton.tsx, Header.tsx, OverlayNav.tsx, ResumeModal.tsx, CaseStudyShell.tsx, app/about/page.tsx)** — migrate every `text-white`, `text-[var(--color-semantic-text-inverse)]`, `text-[var(--color-semantic-background)]`, and `color: "#FFFFFF"` on a dark surface to `--ink-on-dark-{strong,body,muted}`. The theme-flipping tokens are the priority because they silently break in dark mode. **11 sites.**
2. **Rule 8 (`app/globals.css:9`)** — `--color-card: #ffffff` is a design token that cascades; swap to `--color-semantic-surface-elevated` (`#FBFAF7`) or `--color-semantic-surface` (`#F0EDE8`). Single-line change, broadest impact.

### Moderate — token drift, brittle under future theme changes
3. **Rule 7 (17 sites)** — eliminate `text-[13px]` / `text-[14px]` / `text-[15px]` from body-copy positions. Ship as one coordinated commit: decide per-site which are genuine metadata (keep 13px tag / eyebrow) and which are body (promote to 16px). Worst offender: `ResumeModal.tsx` (8 sub-floor paragraphs).
4. **Rule 6 (`app/globals.css:475-491, 516-519`)** — swap the four global `:focus-visible` rules to `--ring-focus-{width,color,offset}`. The dark-surface focus rule (L487-491) should become a fixed-context ring token (BELLA v0.2 candidate).
5. **Rule 8 (`app/globals.css:10` `--color-ink: #1a1a1a`)** — deprecate the local ink token, point consumers at `--color-semantic-text-primary` or `--color-brand-ink`. Decide and stick with one.
6. **Rule 8 soot consolidation** — 64 `#1A1814` usages across 21 files. Either add a BELLA `--color-brand-soot` token or migrate every usage to `--color-brand-ink`. Currently this is the most-duplicated hex in the codebase.

### Cosmetic — convention, no functional impact
7. **Rule 5 (`app/globals.css:115-120` `.layout-grid`)** — unused class; either delete or convert to `auto-fill`.
8. **Rule 5 / Rule 2 (`components/ArtifactGallery.tsx`)** — dead component per Phase 1; include in the prune commit.
9. **Rule 4 (`.layout-container`)** — add `scroll-padding-top: calc(var(--header-height) + var(--spacing-4))` for belt-and-braces conformance.
10. **Rule 6 (`components/bella/CaseStudyCard.module.css:35-38`)** — swap `var(--color-semantic-border-strong)` → `var(--ring-focus-color)` so the canonical card matches the canonical rule.
11. **Alpha-glass indirection debt (~40 sites)** — long tail. Tackle opportunistically when touching a component; not worth a dedicated commit.

### Observation — prototypes and public demos
The `prototypes/**` and `public/demos/**` directories are in effect a graveyard of earlier design explorations, each self-contained and embedded via iframe. They violate every rule. They are deliberately excluded from this audit's fix scope because:
- They predate BELLA adoption
- Users view them as embedded iframes, not via the app's BELLA cascade
- Their value is as archived design artifacts

If the portfolio ever migrates these from iframe embeds to re-implemented React case studies, they'll need a separate compliance pass.

---

## Audit method

- **Rule 1:** `grep` for `text-white`, `bg-[#1A1814]`, `bg-black`, `bg-[#0F1117]`, `color: "#FFFFFF"`, `--color-semantic-text-inverse`, cross-referenced with dark-surface contexts
- **Rule 2:** `grep` for `grid-template-columns`, Tailwind `grid-cols-*`, `items-stretch`, `h-full`, `flex-1`, `min-height: NNNpx`, then file-level inspection of card grids
- **Rule 3:** `grep` for `text-overflow`, `line-clamp`, `-webkit-line-clamp`, `truncate`
- **Rule 4:** `grep` for `scroll-padding`, `scroll-margin`, `--header-height`, `position: fixed|sticky`
- **Rule 5:** Full listing of `grid-template-columns` + `grid-cols-N`; manual check of each fixed grid vs the data array length
- **Rule 6:** `grep` for `focus-visible`, `outline: none`, `outline: 0`, `--ring-focus`
- **Rule 7:** `grep` for `font-size: (10|11|12|13|14|15)px`, `text-[(10-15)px]`, `text-xs`, `text-sm`, `line-height: (1|1\.[0-4])` with per-match context inspection (metadata vs body)
- **Rule 8:** `grep` for `#fff|#FFF|#ffffff|#FFFFFF|#000|#000000|white|black|rgba(255,255,255)|rgba(0,0,0)`

All source reads were local only. No network calls. No build/lint re-run as part of audit.
