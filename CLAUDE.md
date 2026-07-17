# CLAUDE.md — the elleta.design constitution

This is the persistent brain for the `ctrl-alt-design` repo (Next.js + Tailwind, deployed to Vercel).
Every session, every ticket, every agent obeys this file. It is the constitution, not notes.
Pairs with `docs/portfolio-conformance-spec.md` (visual contract), `docs/portfolio-ia-spec.md`
(navigation/IA), and `docs/harness-and-baseline.md` (how to make changes safely).

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
5. **Prove it globally.** After any change, run `npm run gate`, tsc, all routes 200 (light + dark), and the
   NDA content-grep. Report a diff summary. Green or it isn't done.

## 1. Tokens (never hardcode)
- **No hardcoded hex or px in components.** Reference tokens only. No arbitrary Tailwind `text-[Npx]` /
  `bg-[#...]`. Spacing and type come from the scale, not ad-hoc values.
- **Body min 16px.** Never smaller for reading text.
- **No pure white and no pure black** as surfaces/text. Warm neutrals only.
- BELLA core: ground `#F5F4EF` (light) / navy `#1B1B40` (dark); ink `#1A1720` / `#F4EFE6`;
  accent iris `#5B4BD1` / periwinkle `#A79CE2`. **No amber anywhere.**
- Cascade trap: BELLA's unlayered `:root` beats `@theme`. Keep app theme tokens in an unlayered
  `:root` that loads AFTER imports so they win.

## 1b. IA (nav)
- Primary nav (Elleta, 2026-07-17, supersedes the four-item cap): **Work · System · Skills ·
  About · Contact**. /design-system is a first-class page (the system inspecting itself);
  the footer "See the system" colophon link stays.

## 2. Layout
- One centered container, **max-width 1240px**, consistent horizontal padding, every page. Never full-bleed text.
- Vertical rhythm from the scale (`--space-section` = 96px desktop). No inline/ad-hoc paddings.
- Cards fill the grid evenly (equal heights, consistent gaps).

## 3. Type
- **Exactly two typefaces (revised 2026-07-17, supersedes the hero-only lock).** Unique 700 = ALL
  display headings: home hero headline, page titles, section headers, case-study display headlines,
  and the keycap brand lockup, always all-caps with the established accent-word treatment where the
  design already does that. Every display heading renders through the ONE `ui/Heading` primitive
  (tiers: hero / page / section / case). Page openings are FLAT (eyebrow + Heading, the Work
  pattern); bubble page headers are parked (last live at e25eefc, may return in the expression
  pass). The elevation/orb tokens stay: keycaps, the home cluster, and the About portrait still
  consume them.
- Unique never renders below 24px except the keycap logo (the gate enforces this), and never in
  body, UI, card titles, eyebrows, meta, nav links, buttons, or chips.
- Geist = everything else. Eyebrows stay Geist caps with `--tracking-eyebrow`.

## 4. Color & dark mode
- **Colour affordance rule (2026-07-17):** saturated iris at body scale means INTERACTIVE, and only
  that. Eyebrows/kickers are wayfinding and wear `--color-eyebrow` (muted ink), never iris. Inline
  body links are iris AND underlined. Decorative purple uses periwinkle tints, never the saturated
  iris fill. Display headings keep their iris accent word (out of this rule's scope). Enforced by
  the eyebrow check in `audit:structure`.
- Every surface/text/border resolves from semantic tokens via `[data-theme="dark"]`. No hardcoded values.
- Dark mode is a first-class contract on EVERY surface, not an afterthought — case pages included.
- The dark keycap logo must not bloom a heavy glow on navy; tone the plate/shadow.

## 5. Controls (one taxonomy — see conformance spec §7)
The raised **keycap** is reserved for the brand logo and TRUE actions only. Do not use it for filters,
toggles, or sort.
- **Button (keycap):** primary (filled iris) + secondary (neutral). Max ONE primary per view.
- **SegmentedControl:** mutually exclusive views (e.g. TABLE/MAP/TIMELINE). Single-select, `aria-current`,
  lighter than a keycap.
- **FilterChip:** multi-select filters. Flat/outline, `aria-pressed`. Not a keycap.
- **Select:** dropdowns (e.g. sort). Native styled, not a keycap.
- **Tag:** non-interactive metadata. Visually distinct from FilterChip.
- **StatusPill:** quiet status (e.g. "current focus"), non-interactive.
- One light source, upper-left: highlights top-left, shadows down-right (bubbles, keycaps, cards).

## 6. Copy & voice
- **Positioning term is "AI-enabled" / "AI enablement".** Never "AI-augmented" or "AI-assisted". Keep the
  phrase in one constant and reference it.
- **No em or en dashes (—, –) anywhere.** Use a period, a comma, or "that".
- Decision-led, NDA-safe, honest. No invented metrics or exaggerated outcomes.

## 7. NDA (hard rule)
- No real internal screens, dashboards, metrics, or client tool/team names from any employer or
  client. Abstract to a descriptor ("a UN agency in Geneva"). Recreated/abstract diagrams only.
  Banned terms live in `_private/nda-terms.txt` (gitignored), merged with the global
  `~/.claude/nda-terms.txt`; the pre-commit hook and `audit:nda` read from both, so no name is
  ever written in a committed file, this one included.
- Employer history (company names as where I worked) is fine; the client work as a case *subject* must be
  scrubbed of internal specifics.
- The NDA check greps file **contents across the whole tree**, not diffs or filenames — renamed files hid
  names before. Never rely on the diff alone.

## 8. Working method (spec → review → execute)
Use the `portfolio-spec` skill. For any non-trivial task:
1. I give intent (often a screenshot / Figma link / description).
2. You generate `specs/<slug>/design.md`, `requirements.md`, `tasks.md`. **Stop and let me review.**
3. On my go, execute the checked-off tasks start to finish.
4. Verify against the gate. Report a diff summary + before/after screenshots where visual.

## 9. The gate (`npm run gate`) — un-regressable
Must pass before any work is "done":
- `audit:structure` — per-case route dirs, container/section system, no arbitrary `text-[Npx]`, no amber.
- `audit:contrast` — WCAG AA (AAA-minded); Unique below 24px fails outside the keycap logo.
- `audit:copy` — fails on `—`/`–` and on "AI-augmented" / "AI-assisted".
- `audit:controls` — keycap used as filter/toggle/sort fails; >1 primary per view fails; filters/toggles
  missing `aria-pressed`/`aria-current` fail.
- `audit:fonts` — any face other than the Unique/Geist tokens fails; Unique outside the Heading
  primitive, home hero, or keycap lockup fails; any mono family reference fails.
- `audit:tokens` — colour literals and raw spacing (>=4px) in `app/**`/`components/**` fail;
  `token-waiver:` inline comments mark the reviewed proto-exact/artwork exceptions.
- tsc clean; all routes 200 (light + dark); NDA content-grep clean.

## 10. How this file was built and stays alive
Like a real steering doc: when something keeps going wrong, research it, fix it, and record the fix HERE
(or in the paired spec) so it never breaks again. Update this constitution deliberately, not with churn.
When something breaks more than once, record the fix as a file in `docs/fixes/` and reference it here;
keep `docs/fixes/README.md` current. Before debugging a familiar-feeling symptom, check that folder first.

---

# Repo operations (kept from the previous harness file)

## Before doing anything
1. Read `claude-progress.md` — current verified state and last session's handoff.
2. Read `feature_list.json` — pick the highest-priority item not yet passing. One item at a time.
3. If the task involves a prototype, open its folder README first (e.g. `prototypes/finviz-3/README.md`).

## Repo-specific working rules
- **Prototypes are single-file.** Each lives in `prototypes/<name>/index.html`, self-contained (inline CSS/JS, no build step). A README maps design decisions to their sources.
- **Never modify `Artifacts/*/versions/`** — those are historical snapshots.
- **Design work needs design verification.** "It renders" isn't done. Done = interactions verified, hooks/copy checked against the relevant brief, WCAG basics considered, README updated.
- **Evidence before passing.** Update `feature_list.json` only with a note on how it was verified. Never delete or reword entries — only change status and evidence.
- **Content drafts** (LinkedIn etc.) belong in Notion's Content Lab, not this repo — except `prototypes/linkedin-preview/`.
- **File locations:** save deliverables into THIS folder — never cloud drives or scratch folders Elleta can't see. NDA-sensitive material goes in `_private/` (gitignored).
- **The pre-commit hook false-positives** the Apple Music album id in `components/VinylPlayer.tsx` as a phone number — that file stays uncommitted (see `docs/fixes/`).

## End of session
- Update `claude-progress.md`: what was done, how verified, known risks, next best action.
- Leave no half-finished prototype states.
- If git is in use for the change, commit with a descriptive message.

## Key references
- Layout & frame contract: `DESIGN.md` (tokens, ramps, recorded exceptions; audit tooling points here).
- Finviz project: `finviz-event-storming.md` + `finviz-ai-solution-canvas.md`, brief at interface-design-patterns-ux-training.notion.site (Brief #2).
- Voice & content rules: the `linkedin-post` skill (installed in Claude, not this repo).
