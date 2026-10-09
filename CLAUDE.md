# CLAUDE.md — the elleta.design constitution

This is the persistent brain for the `ctrl-alt-design` repo (Next.js + Tailwind, deployed to Vercel).
Every session, every ticket, every agent obeys this file. It is the constitution, not notes.
**`docs/RULES.md` is the one rule source** (one line per rule plus the check that enforces it; Elleta,
8 Oct 2026). Where this file and RULES.md disagree, RULES.md wins. Pairs with
`docs/harness-and-baseline.md` (how to make changes safely). The older DESIGN.md, conformance spec,
visual-language, motion and code-audit docs are in `docs/archive/` (history, not instruction).

If anything below conflicts with what a prompt asks, STOP and surface the conflict — do not silently
override the constitution.

---

## 0. Prime directives (read first)
1. **Harness yourself.** Do not create whatever you want. Do the smallest change that satisfies the task.
   No new components, routes, patterns, colors, or copy unless the task requires them.
2. **One implementation.** Edit the LIVE component/route and delete the old one. Never leave old + new
   both rendering. If a change isn't global, you edited a dead copy — grep for orphans before finishing.
3. **Spec before build.** For anything beyond a one-line fix, write a spec first (see §8). Do not vibe-code.
4. **Baseline before change.** Before altering an existing page, rebuild/confirm its current state from the
   real components as a baseline, THEN apply the change (see `docs/harness-and-baseline.md`).
5. **Prove it globally.** After any change, run `npm run check:fast` and the browser audits for the pages you touched (frame, contain, type, dark, axe on those routes). Do not run the full `npm run gate` locally (25 min; CI is the merge guard). Report a diff summary. Green or it isn't done.

## 1. Tokens (never hardcode)
- **No hardcoded hex or px in components.** Reference tokens only. No arbitrary Tailwind `text-[Npx]` /
  `bg-[#...]`. Spacing and type come from the scale, not ad-hoc values.
- **Body text 20px (Body/Base), small 18, labels and UI 16; nothing smaller** (Elleta, 4 Oct 2026,
  site v3, sizes from Figma 8 Oct; supersedes "Body min 16px").
- **Colour B (Elleta, 4 Oct 2026, site v3; supersedes the 22 Sep Geist refresh palette: ink
  `#121212`, pure white ground, the grey panel set).** BELLA's colour B tokens (`lib/bella/bella.css`,
  synced from BELLA, never restated as hex in the site). Light: background `#f6f7f9`, surface `#fff`,
  surface-inset `#eceef3`, text-primary `#1d2030`, text-body `#2b2f3d`, text-secondary `#474c5e`,
  border `#e4e6ec`, border-ink `#1d2030`, accent (ochre) `#e8a83e`. Dark: background `#0f1117`,
  surface `#171a22`, text-body `#eceef3`, and the rest from BELLA's dark theme. Chip fills
  chip-1/2/3, chip-text, danger-subtle/text and success-subtle/text come from BELLA too.
  **Colour lives in fills only**, plus focus and status. Ochre is the one accent fill
  and means CLICKABLE only (Elleta, 8 Oct 2026): buttons, links, a clickable card's hover and focus
  edge, the focus ring. Never on a tag, label, "chosen", key point, stat bar, annotation or
  decoration. A non-clickable highlight is an ink wash, an ink edge and a word or check icon.
  (text-primary on ochre; surface-glass-accent is its 15% tint, layered over `surface` wherever it must
  be opaque); the focus ring is 3px ochre-deep `#b97a14` in light, ochre in dark, 3px offset, focus
  only; links are ink text with a 2px ochre-deep underline (ochre in dark); the primary button is ochre with an ink label. Iris and periwinkle stay retired.
  **No amber anywhere.**
- **Pictures only (Elleta, 4 Oct 2026, site v3).** Inside case figures, and nowhere in site
  chrome: the Case UI kit (product theme, Default blue `#4A5BD4`, Federated `#121212`) and the
  markup rules: grey dashed `#8a8fa3` 1.5px dash 4/4, red `#b5323a` annotations (never on text),
  slot outlines 1px `#DF37AC` dash 2/2. They live on tokens like everything else.
- **Glass (Elleta, 4 Oct 2026, site v3):** `rgba(255,255,255,.18)`, `backdrop-filter: blur(8px)`
  (none on the Agent plate, so the face stays sharp), 1px `rgba(255,255,255,.65)` border,
  `inset 0 1px 0 rgba(255,255,255,.7)`. On tokens, never inline.
- Cascade trap: BELLA's unlayered `:root` beats `@theme`. Keep app theme tokens in an unlayered
  `:root` that loads AFTER imports so they win.

## 1b. IA (nav)
- Primary nav (Elleta, 2026-09-18, about-rebuild lock; supersedes 2026-07-17; "Skills" became
  "Learning" 2026-09-19, /skills redirects to /learning?view=skills): **Work · System ·
  Learning · About**, then a LinkedIn icon and a Copy-email icon, both 44px targets
  (`ContactActions layout="icons"`, email assembled on click; the menu keeps the labelled pair).
  The "Get in touch" button and the Home closing contact card are retired (Elleta, 4 Oct 2026,
  hero v3 lock; supersedes the 18 Sep "Get in touch" button). The /contact
  route stays until its own PR retires it. /design-system is a first-class page (the system inspecting itself);
  the footer "See the system" colophon link stays.
- **Work page (Elleta, 5 Oct 2026, Site v3 job 33; supersedes 2026-09-19).** Hero (kicker
  "Work", h1 "Selected work.", one lead). Then Home's case cards (`CaseRow` card,
  data `WORK_CASES` in `content/cases.ts`): Drift, Federated, CHIP and Theming as a 2x2 grid
  from 900px, one column below (Elleta, 5 Oct 2026, job 38: no lone last row). Booking platform, Search and Code First stay live,
  unlinked from /work. The pattern studies left /work on 22 Sep; their pages at
  `/work/studies/<id>` stay live, unlinked. Old `/work?skill=` and `?case=` links redirect
  (`proxy.ts`). The Cards · Map · Table switcher, Find my fit and the old row list stay retired.

## 2. Layout
- **Sections use Section + SectionHeader. No custom spacing.** (Elleta, 2026-09-18, layout system,
  `specs/layout-system`.) `components/layout/`: `Container` (content `--layout-max` 62.5rem (1,000px, system-page-mock, 22 Sep 2026) plus
  `--layout-gutter`), `Section.tsx` (section padding, the plain mono label on the hairline rule; no paw since Part Q, 2026-09-21), `SectionHeader`
  (`layout="stacked"`, the default since 2026-09-20: label, heading, then the lead and body under it,
  left-aligned, the text column capped at 42rem. Elleta: "the body text has moved above the image,
  that was not the idea, put it back under the heading". `layout="split"` puts the lead beside the
  heading from 1024px; it is kept as an option and used nowhere). Spacing comes from them and the `--section-*`
  tokens, never from a page. `audit:layout` enforces it and lists every route.
- **One container:** `.container` (`--container-max` = `--layout-max` plus two gutters, `--container-pad`
  = `--layout-gutter`), every page and the nav row. `.page-container` / `.layout-container` are aliases
  until every page migrates. Never full-bleed text.
- **One section rhythm:** every section pads by `--section-pad-y` (layout `Section`, `.l-section`);
  `.section--ruled` draws the hairline. `--space-section` is deleted (21 Sep 2026). Gaps inside a section use `--space-stack-sm/md/lg`. No inline/ad-hoc paddings.
- **Every page is Nav, then Sections, then Footer**, built from `Container` + the layout `Section`.
  (Elleta, 2026-09-20, Part E: /quick, /contact, the 404, /privacy and /accessibility moved over and the
  older section component was deleted; its `SectionList` followed on 24 Sep, when About's short lead moved to ScanRead.
  `prose` on a layout `Section` keeps its paragraphs on the body measure, for reading pages.
  The case route and /design-system render through CaseShellV2, whose hero and sections are on the
  same frame; audit:layout checks the shell's files. Nothing is allowlisted (21 Sep 2026).)
- **One `:root` for tokens**, at the top of `app/globals.css`. New tokens go there, never mid-file.
- Cards fill the grid evenly (equal heights, consistent gaps).
- **Layout B, the case template (Elleta, 4 Oct 2026, site v3 concept lock).** A case page body is
  1056 wide (192 side pad at 1440); the text column sits at x180, 696 wide; wide items (results,
  figures, quotes, next case) take the full 1056; 96 between sections; the template's 72/96/120
  spacing and the 192 pad are tokens (`--case-*` in the `:root`), never raw values. Rebuilt case
  pages use it; the 1,000px `--layout-max` frame stays for every other page until its own rebuild.

## 3. Type
- **Figtree, one style per role (Elleta, 4 Oct 2026, site v3; supersedes the 18 Sep Geist headings
  and the 22 Sep Geist 300 refresh).** Figtree for all text, from BELLA's type tokens. Headings are
  **SemiBold 600**, sentence case ("pages win"). The styles (BELLA Foundations): Display/Hero 60 ·
  Display/Page 60 · Display/Section 40 · Heading/Card 22 · Body/Lead 22 · Body/Base 20 ·
  Body/Small 18 · Label/Strong 18 · Label/Button 16 · Label/Table 16 · Label/Eyebrow 16 ·
  Code/Token 16. One style per role: page title Display/Page, section heading Display/Section,
  result numbers Display/Section (one size per page), card titles Heading/Card, page and beat
  leads Body/Lead, captions Body/Small, beat labels Label/Strong. Display sizes are fluid from 390
  to 1440 (the 390 frames draw the 1440 sizes; code scales them). Raw values only where the Site
  v3 build spec §3 lists them, each with a `TODO(bella)` comment, until BELLA ships the style
  (Home hero words 82, Body/Strong 20, the Next case title 32). Unique ONLY on the ELLETA
  wordmarks (nav + footer) and the BELLA logo. Every display heading renders through the ONE
  `ui/Heading` primitive (tiers: hero / page / section / case, plus `sub`), and no consumer sets
  its own heading size, tracking or leading. Page openings are FLAT (eyebrow + Heading). The
  elevation/orb tokens stay: keycaps, the home cluster, and the About portrait still consume them.
- **Migration (site v3).** Pages move to these locks when they are rebuilt from the Site v3 frames
  (Drift first, then Federated, 27). `audit:type`'s v3 leg lists the rebuilt routes and holds them
  to the 16/18 floors, Figtree 600 headings and no mono labels; a route joins the list in the
  commit that rebuilds it. Until then the shared tokens carry the older pages.
- Unique never renders below 24px (the gate enforces this; the ELLETA wordmark is 44/36px), and never in
  body, UI, card titles, eyebrows, meta, nav links, buttons, or chips.
- **Unique is retired (Elleta, 8 Oct 2026):** the wordmarks are SVG; the font, its tokens and the
  `audit:fonts` / `audit:type` allowances go in a follow-up PR (RULES.md marks it UNENFORCED).
  Until then the lines below about Unique describe the code, not the intent.
- **Unique never renders inside a Card (Elleta, 2026-07-21, card-voice).** Cards use the text
  face only (Figtree since site v3); card statements use the shared `.card-statement` recipe, card
  titles the shared `.heading-item` (Heading/Card). Enforced by the Unique-in-card check in
  `audit:reuse`.
- **No mono labels (Elleta, 4 Oct 2026, site v3; supersedes the 22 Sep mono label role).** Geist
  Mono through `--font-code` is Code/Token only (16px): real token and code names, such as
  `--accent` or `color.action.primary`. Eyebrows, labels, tags, status pills and meta are Figtree
  on the Label styles. `audit:fonts` allows the mono family only on the `--font-code` token line and
  fails `--font-code` on heading, body, button or nav selectors and elements.
- **Bracket words (site v3):** equal-padding boxes that hug their word (auto-layout), never a
  fixed width. Add and heart buttons share one height.
- **Style rule going forward (Elleta, 2026-09-18, about-rebuild lock).** No eyebrow label above
  every heading. Site v3 headings carry no accent word (iris is retired; the `accent` prop stays
  for pages not yet rebuilt). Never on card titles or body text. No card grids unless the content really is a set
  of cards. Applies to new and rebuilt surfaces; existing pages migrate when they are next touched.
- The site nav and footer are global landmarks and don't count toward one-primary-per-page.
- Name the UN as 'United Nations Geneva' (matches the CV).
- **Purple heading word = Term. Dotted underline = tap to learn. Bold = claim. Max one bold per
  paragraph.** (Elleta, 2026-09-19.) `components/ui/Term.tsx`, definitions in `content/glossary.ts`.
- **Type comes from the text utilities** (`.text-display-1/2/3`, `.text-lead`, `.text-body`,
  `.text-meta`, `.accent`). No page-specific font sizes: if a size is missing, add a token.
- **Never set heading widths in `ch` for Unique** (condensed, so `ch` wraps early): use
  `--measure-heading` (22em); every page h1 caps at `--measure-title` (15em), the Home hero at `--measure-hero` (11em, 23 Sep 2026: three lines at 1440) (Part Q, 2026-09-21: heroes are text only, titles bigger and wider, the hero lead on `--text-hero-lead`). Headings `text-wrap: balance`, paragraphs `text-wrap: pretty`.
- **Numbers in columns are right-aligned and tabular (Elleta, 2026-07-28, readability
  audit).** Any figure that sits in a column beside other figures (a table cell, a grid
  column, a stat row) uses `text-align: right` and `font-variant-numeric: tabular-nums`,
  so digits share a width and the values share a right edge. A column of numbers that
  starts wherever the previous word ended is not a column. Prose numbers are unaffected.
  Enforced by the numeric-alignment check in `audit:structure`.

## 4. Color & dark mode
- **Colour roles (Elleta, 4 Oct 2026, site v3; supersedes the 17 Jul iris affordance rule).**
  Text is text-primary (headings, labels), text-body (reading text) or text-secondary (meta, the
  quiet half). Ochre is a fill for clickable things only (see s1), never text; highlights are ink. Links are
  ink + underline; status uses the danger/success subtle fills with their text tokens; eyebrows are
  text-secondary. Case identity colours live inside the case pictures, not on site chrome. The live
  AA sweep in `audit:contrast` enforces contrast in both themes.
- Every surface/text/border resolves from semantic tokens via `[data-theme="dark"]`. No hardcoded values.
- Dark mode is a first-class contract on EVERY surface, not an afterthought — case pages included.
- The ELLETA wordmark is live text in `--color-ink`, so it flips with the theme; no plate, no glow.

## 5. Controls (one taxonomy)
The raised **keycap** is reserved for TRUE actions only. Do not use it for filters,
toggles, or sort.
- **Button (grammar v6, Elleta, 5 Oct 2026 lock, repeated 8 Oct; supersedes the iris grammar v5):**
  ochre is the CTA colour. PRIMARY = the BELLA keycap in ochre with an ink label (7.76:1), max ONE per
  view; hover and press only deepen the fill. SECONDARY = transparent, 1.5px ink outline (light) or
  light outline (dark), ink label, 44px. TERTIARY = text link: ink text + 2px ochre-deep underline
  (light) or ochre (dark). Targets 44px or more for primary and secondary, 24px or more elsewhere.
  Focus ring as every control. Source: concept-lock-2026-10-05-interaction-colour.
- **SegmentedControl:** mutually exclusive views (e.g. TABLE/MAP/TIMELINE). Single-select, `aria-current`,
  lighter than a keycap.
- **FilterChip:** multi-select filters. Flat/outline, `aria-pressed`. Not a keycap.
- **Select:** RETIRED 2026-07-27, pending a real dropdown surface. The primitive had no
  consumer once the /design-system specimen showcase was retired, and /work sorts through
  table headers by design, so nothing on the site renders a dropdown. Rather than keep
  dead code alive with an audit allowlist (see the no-exemptions rule in section 9), the
  component, its contract entry and its manifest taxonomy line were deleted together.
  Restore from git the moment a surface genuinely needs one; do not rebuild it from
  scratch.
- **Tag:** non-interactive metadata. Visually distinct from FilterChip.
- **StatusPill:** quiet status (e.g. "current focus"), non-interactive.
- One light source, upper-left: highlights top-left, shadows down-right (bubbles, keycaps, cards).

## 6. Copy & voice
- **Positioning term is "AI-enabled" / "AI enablement".** Never "AI-augmented" or "AI-assisted". Keep the
  phrase in one constant and reference it.
- **No em or en dashes (—, –) anywhere.** Use a period, a comma, or "that".
- **No email address in the HTML or the source as one string** (amended 2026-09-18, about-rebuild
  lock; was "rendered anywhere", 2026-07-17). `assembleEmail()` in `lib/social.ts` joins it only
  when someone clicks Copy email; scrapers find nothing to harvest.
- Decision-led, NDA-safe, honest. No invented metrics or exaggerated outcomes.

## 7. NDA (hard rule)
- No real internal screens, dashboards, metrics, or client tool/team names from any employer or
  client. Abstract to a descriptor ("a UN agency in Geneva"). Recreated/abstract diagrams only.
  INTERNAL terms live in `_private/nda-terms.txt` (gitignored, banned EVERYWHERE), merged with the
  global `~/.claude/nda-terms.txt`; the pre-commit hook and `audit:nda` read from both, so no name
  is ever written in a committed file, this one included.
- **Employer scoping (2026-07-20, Pass E task 9).** Employment history is public; case content stays
  abstracted. Employer and engagement org names live in `_private/nda-employers.txt` (gitignored)
  and are banned everywhere EXCEPT `components/ExperienceSection.tsx` and
  `components/ResumeModal.tsx`. No other file is exempt, ever. The library data, tags, and matrix
  stay name-free; case studies keep industry-not-client naming, recreated artifacts, and their
  disclosure lines.
- The NDA check greps file **contents across the whole tree**, not diffs or filenames — renamed files hid
  names before. Never rely on the diff alone.
- **Apple exception (Elleta, 2026-07-21, deliberate — do NOT "fix").** Apple is a public past
  employer (B2B & Consumer Sales Representative, 2011-2013) referenced only in the two Experience
  surfaces, but the word is deliberately NOT in `_private/nda-employers.txt`: "Apple" also appears
  legitimately as a platform name in Apple Music/Podcasts URLs and comments (VinylPlayer, the About
  podcast list, a globals.css comment, audit-copy, two briefs), so a repo-wide ban would fail the
  gate on all of them. Verified 2026-07-21: outside the two exempt surfaces, "Apple" occurs nowhere
  as an employer reference. If protection is ever wanted anyway, teach `audit:nda` per-term
  allowlisting first; do not just add the word to the list.

## 7b. Branch flow (Elleta, 2026-07-21, via Cowork — every session follows this)
- **No direct pushes to main.** Terminal sessions work on short-lived branches
  (`<type>/<slug>`, e.g. `fix/thesis-theme`), open a PR, and merge only on green.
- The PR carries the template: what changed, local gate output (CI cannot run
  audit:nda — the private lists never leave this machine), screenshots for
  anything visual, and the Elleta-approval line for content changes.
- Include the Vercel preview link in the PR body once the bot posts it.
- CI (`.github/workflows/gate.yml`) runs tsc + the full gate on every PR and
  every push to main; the `gate` check is REQUIRED by branch protection, and
  force-pushes to main are blocked.
- **Break-glass (approved history surgery only, e.g. the NDA scrub class of
  event):** temporarily lift protection with
  `gh api -X DELETE repos/emcdanie/ctrl-alt-design/branches/main/protection`,
  do the approved surgery, then re-apply protection immediately (the settings
  are recorded in `docs/branch-protection.json`; re-apply with
  `gh api -X PUT .../protection --input docs/branch-protection.json`). Every
  break-glass use gets a line in `claude-progress.md` with her approval.

## 8. Working method (spec → review → execute)
Use the `portfolio-spec` skill. For any non-trivial task:
1. I give intent (often a screenshot / Figma link / description).
2. You generate `specs/<slug>/design.md`, `requirements.md`, `tasks.md`. **Stop and let me review.**
3. On my go, execute the checked-off tasks start to finish.
4. Verify against the gate. Report a diff summary + before/after screenshots where visual.

## 9. The gate (`npm run gate`) — un-regressable
Must pass before any work is "done":
- `audit:structure` — per-case route dirs, container/section system, no arbitrary `text-[Npx]`, no amber.
  No `TodoNote` in a production build's HTML (it reads `.next/server/app`, so build first; Elleta, 1 Oct 2026).
- `audit:layout` — every route is listed; a route on the layout system renders the layout `Section`
  and no raw `<section>`; `SectionHeader` layout is "stacked" (default) or "split" and no stylesheet reshapes
  `.l-header`; no arbitrary margin/padding classes or inline margin/padding in `app/` (and
  in a sections folder under components, once one exists). Routes not yet moved are allowlisted as pending, special content layouts with
  a reason.
- `audit:frame` — the rendered frame (Playwright, `AUDIT_URL`), every route plus each case at 1440,
  1024 and 390: one content edge; two h1 recipes (display on Home, page everywhere else) at their
  size and within `--measure-title`; h1 and h2 50 characters or fewer; every top-level section
  pads by `--section-pad-y`; radii from the set (`--radius-sm/md/lg/card`, pill); at most 2 card
  signatures per route; no line wider than `--measure-body`. A deliberate exception carries
  `data-frame-exempt="<reason>"` and is printed on every run. The frame tokens are published in
  `/api/bella.json` (`frame`). Runs with reduced motion and without it (job 38, 5 Oct 2026);
  audit:layout reads source, so motion cannot change it.
- `audit:contain` — every panel or figure with a visible box (Playwright, `AUDIT_URL`), every
  route at 1440, 1024 and 390, both themes, every tab state: no descendant, SVG shapes included,
  leaves the panel's content box; no shape straddles its SVG's viewBox edge (cut off); no pin or
  badge overlaps a button, link or drawn control (an SVG `.lc` group). Deliberate clipping (an
  HTML ancestor hiding overflow, an SVG `clip-path` or `mask`) is not counted. (Elleta, 22 Sep 2026.)
- `audit:clip` — the clip sweep (`scripts/clip-sweep.mjs`; Elleta, 5 Oct 2026, job 34): every route
  at 1440, 1280, 1110, 1024 and 390, both themes, animations at their end state. No text or control
  partly visible under an ancestor that hides, clips or masks it (fades included); no text clipped
  by its own box (an ellipsis counts); no horizontal scroller holding text without a tab stop and a
  name. audit:contain allows deliberate clipping; this checks that nothing readable is cut by it.
  No rendered text under 12px effective: font-size times every transform, scale, zoom, SVG
  viewBox and iframe scale on the way to the screen. Runs with reduced motion and without it
  (job 38, 5 Oct 2026). No allowlist: the Theming hero collage that had one is drawn at 1:1
  since audit fix D3 (5 Oct 2026).
- `audit:sharp` — every raster image on every route, and inside its demo iframes (every tab
  of a before/after too), renders at most half its natural pixel width at 1440 and 390, on a 2x
  screen: nothing is stretched soft. No 2x source? Cap the display width, never upscale.
- `audit:contrast` — WCAG AA (AAA-minded); Unique below 24px fails everywhere, no exceptions.
- `audit:copy` — fails on `—`/`–`, on "AI-augmented" / "AI-assisted", and on placeholder words
  ("to come", "coming soon", "lorem", "TBD"; word-boundary, any case; job 38). No allowlist.
- `audit:controls` — keycap used as filter/toggle/sort fails; >1 primary per view fails; filters/toggles
  missing `aria-pressed`/`aria-current` fail.
- `audit:fonts` — any face other than the font tokens (Figtree text, Geist Mono code, Unique
  wordmark; Geist sans until the last page leaves it) fails; Unique set on anything but
  the ELLETA wordmarks or the BELLA logo fails; any mono family reference outside the `--font-code`
  token fails, and `--font-code` on headings, body, buttons or nav fails.
- `audit:tokens` — colour literals and raw spacing (>=4px) in `app/**`/`components/**` fail;
  `token-waiver:` inline comments mark the reviewed proto-exact/artwork exceptions. One ground
  per route (rendered, `AUDIT_URL`, 1440, both themes): body and main compute one colour (job 38); the
  footer is the one second ground and computes `--color-semantic-raised` (Elleta, 6 Oct 2026, jobs G1 + H1).
- `audit:dark` — every case-study demo embed renders a dark ground in dark; a figure caption or
  short panel label naming one theme ("BELLA · light", "light mode") renders that theme's
  ground (luminance >= 0.5 light, <= 0.2 dark) whatever the page theme (job 38).
- `audit:parity` — every case-study slug has exactly one `WORK_ITEMS` row and vice versa; side
  tables for case identity (the deleted `EXTRA_CASES` pattern) fail.
- `audit:contract` — every component in the contract exists, token $refs resolve, no entry for a
  deleted component (the machine-readable component contract at /api/bella.json). bella.json is
  GENERATED from source (tokens + `lib/bella/component-contract.json`); patch the source, never
  the served artifact.
- `audit:axe` — axe-core over every route in BOTH themes, and the server status of each (200, never a Next error shell: a page that crashes on the server still looks fine in the browser, round 6); zero violations to pass (needs-review
  nodes are counted, not failed, and verified by hand when they change).
- `audit:type` — also runs `scripts/audit-roles.mjs` (one type style per role, TY, 7 Oct 2026): on the rendered page chrome
  (pictures excluded), every route at 1440 and 375: weights 400 and 600 only (700 on `<strong>`, 800 on a quote mark),
  every h1 on the Display/Page size (Display/Hero on Home), mono only on `code`, `pre`, `kbd`, `samp`, nothing under
  16px. `/design-system` is deferred in the script until the W PR merges. No local font-size or weight on a role.
- `audit:type` — no Card surface renders reading text below 16px COMPUTED; the shared
  `.card-body` recipe never computes below 18px; sitewide, any P/LI with own text past ~40
  chars computes >= 16px. Metadata rows (tags/pills/eyebrows/kickers) are a deliberate
  separate tier and exempt. Section index labels count as metadata: short labels only, never
  sentences. Nothing visible renders below 14px. Every heading is the text face (never Unique) and leads
  >= 1.0; Unique renders only on the wordmarks; every h2 display head on a page computes one size.
  The v3 leg (site v3, 4 Oct 2026) holds every rebuilt route to the v3 locks: reading text >= 18px,
  everything visible >= 16px, headings Figtree 600, mono only on `code`.
- `audit:visual` — one ground on /design-system (band backgrounds equal the page ground,
  no exceptions since the 23 Jul DS2 no-wash port), sibling specimen cards render equal
  heights, cover placeholders clear 3:1 against both gradient stops, both themes.
- `audit:order` — accessibility-tree snapshots (tests/a11y, Playwright `toMatchAriaSnapshot`, light
  theme at 1440 and 390) fail when reading order changes; then lists CSS that reorders content
  visually, for review. Browser audits read `AUDIT_URL` (default `http://localhost:3000`).
- `audit:debt` — nothing rots quietly: a doc citing a file that does not exist, a token
  nothing consumes through a `var()` chain, a gate table describing audits that no longer
  run, or an audit tracking a selector that matches nothing. Static analysis, about a second.
- **How it runs (Elleta, 2026-10-07, gate speed; updated 2026-10-09).** Locally: `npm run check:fast` (tsc, tests, the static audits, about 10 s; the pre-commit hook runs it) plus the browser audits for the pages you touched (frame, contain, type, dark, axe on those routes — about 2–5 min). Do NOT run the full `npm run gate` locally (25 min). CI splits the audits into parallel jobs (`static`, `build`, 7 `browser` shards) behind one required check named `gate`; CI is the merge guard and the source of truth. An audit's rules and thresholds never change to make it faster.
  `audit:sync` reads BELLA's `origin/main`, not the branch checked out in ~/DEV/bella.
  The pre-commit hook (`.git/hooks/pre-commit`, local, not in the repo) runs `check:fast`;
  a fresh clone has to install it by hand, or commits go out unchecked.
- `npm test` runs FIRST in the gate: the pure functions in `lib/bella/dtcg.ts` (vitest). A
  broken function fails in a second rather than after two minutes of browser work. Tests are
  not an audit and do not change the derived count.
- tsc clean; all routes 200 (light + dark); NDA content-grep clean.
- **Home JS budget (not gated; Elleta, 4 Oct 2026): 240 KB gzipped.** The framework chunks
  alone are about 158 KB; the earlier 146 KB was below that floor.

**No per-element exemptions (Elleta, 2026-07-27, hard rule).** The gate has no opt-out.
If something cannot pass an audit, it does not get to be live DOM. No `data-example`, no
skip attributes, no "ignore this node" hooks, ever. **An audit you can opt out of is not
an audit.** When an illustration genuinely has to show rule-breaking output (a bad
example, an off-brand artifact), it ships as a PICTURE, a flat `<img>` with a describing
`alt`, so there is nothing for an audit to read and therefore nothing to skip. The only
allowlists that may exist are the file-level ones already recorded in the audit scripts,
each with its reason inline; do not extend them to keep new code alive.

**The one allowlist, and why it is not the same hole.** `audit:debt` reads
`scripts/lib/debt-allowlist.json`. That rule above governs RENDERED OUTPUT: if an element
cannot pass, it does not get to be live DOM. `audit:debt` judges CODE INVENTORY, where
"this doc is a dated historical record" is a true fact about intent that no static analysis
can derive. It is capped so it cannot grow into the hole: every entry needs a written reason
and a date, the audit prints the count on every run, it FAILS above 15 entries, and it FAILS
on any entry older than 180 days that has not been re-dated.

## 10. How this file was built and stays alive
Like a real steering doc: when something keeps going wrong, research it, fix it, and record the fix HERE
(or in the paired spec) so it never breaks again. Update this constitution deliberately, not with churn.
When something breaks more than once, record the fix as a file in `docs/fixes/` and reference it here;
keep `docs/fixes/README.md` current. Before debugging a familiar-feeling symptom, check that folder first.

---

## 11. Cowork relay, lanes (Elleta, 2026-10-08; supersedes 2026-10-03)
- Elleta types `go a`, `go b` or `go figma` (or `/go-a`, `/go-b`, `/go-figma`). Read ONLY `docs/reference/inbox/lanes/<lane>.md` and
  `lanes/README.md`. Plain `go`: ask "which lane: a, b or figma?" and wait. Never guess.
- On session start, after /clear or after compaction: re-read `lanes/README.md` and your lane file before anything else.
- Claim a job before starting: `[ ]` to `[doing <lane> HH:MM]`. Skip any job not marked `[ ]`.
  Done is `[done HH:MM, PR #n green]`. Only Cowork moves jobs between lanes.
- Report to `docs/reference/inbox/reports/<lane>.md` (under 15 lines, then "Needs Elleta" as
  numbered yes/no or pick-one items). Never write `report.md`, and never move, rename or rewrite
  `next.md` or another lane's file.
- Log any decision made alone in `docs/reference/decisions-while-away.md`; checkpoint screenshots go
  in `docs/reference/inbox/screens/`.
- Commit only when the lane file asks for it, never push to main. `docs/reference/inbox` is
  gitignored; never commit it.

## 12. Plan first for bigger jobs (Elleta, 2026-10-07)
- A job is "big" if next.md says [plan], or it touches more than one page/component, or a layout.
  Small fixes (one file, no layout) skip this section.
- Big job, step 1: open a GitHub issue with `gh issue create --label plan`, using
  .github/ISSUE_TEMPLATE/plan.md: goal, what changes, what doesn't, the decisions with your
  default for each, risks, how we'll verify (widths, themes, audits).
- Step 2: run `npm run plan:review -- <issue#>`. A second model (Codex) reviews the plan and its
  comment is posted on the issue.
- Step 3: read the review, update the plan (edit the issue body), and list in report.md only
  the decisions where the two models disagree or that are brand/money/taste. STOP for Elleta.
- Step 4: on "go", build from the issue. The PR says "Closes #<issue>".
- Defaults, not waiting: anywhere else, pick the sensible default, log it in
  decisions-while-away.md and keep going. Stop only for brand, money, taste, merges, or a
  rule conflict.

---

# Repo operations (kept from the previous harness file)

## Before doing anything
1. Read the **most recent session record** in `docs/session-*.md` (newest by date). It is the
   backward record: what shipped, what broke, what was learned, and which decisions are still
   open. It is committed, so it survives; `claude-progress.md` is local-only and does not.
   **Start with `_private/docs/session-2026-09-18.md`** (local only; the private session record).
2. Read `claude-progress.md` — current verified state and last session's forward handoff.
3. Read `feature_list.json` — pick the highest-priority item not yet passing. One item at a time.
4. If the task involves a prototype, open its folder README first (e.g. `prototypes/finviz-3/README.md`).

## Repo-specific working rules
- **Prototypes are single-file.** Each lives in `prototypes/<name>/index.html`, self-contained (inline CSS/JS, no build step). A README maps design decisions to their sources.
- **Never modify `Artifacts/*/versions/`** — those are historical snapshots.
- **Design work needs design verification.** "It renders" isn't done. Done = interactions verified, hooks/copy checked against the relevant brief, WCAG basics considered, README updated.
- **Evidence before passing.** Update `feature_list.json` only with a note on how it was verified. Never delete or reword entries — only change status and evidence.
- **Content drafts** (LinkedIn etc.) belong in Notion's Content Lab, not this repo — except `prototypes/linkedin-preview/`.
- **File locations:** save deliverables into THIS folder — never cloud drives or scratch folders Elleta can't see. NDA-sensitive material goes in `_private/` (gitignored).

## End of session
- Write or update the **session record** at `docs/session-<YYYY-MM-DD>.md`: what shipped, what
  broke and what it taught, open decisions, standing debt. It is committed and it is what the
  next session reads first. Be honest about what was not verified.
- Update `claude-progress.md`: what was done, how verified, known risks, next best action.
- Leave no half-finished prototype states.
- If git is in use for the change, commit with a descriptive message.

## Key references
- Layout & frame contract: `docs/RULES.md` (rules and their checks; the old DESIGN.md is in `docs/archive/`).
- Finviz project: `finviz-event-storming.md` + `finviz-ai-solution-canvas.md`, brief at interface-design-patterns-ux-training.notion.site (Brief #2).
- Voice & content rules: the `linkedin-post` skill (installed in Claude, not this repo).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
