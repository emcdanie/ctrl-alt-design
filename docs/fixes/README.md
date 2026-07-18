# docs/fixes — hard-won fixes (never break this twice)

Roxanne's `slide-in-service.md` pattern. When something breaks more than once, research it, fix it, and
record the fix HERE as its own file. `CLAUDE.md` §10 points here. These are load-bearing rules, not notes —
each one exists because it already cost time once.

Rule: before "fixing" a recurring symptom, check whether there's already a file here for it. If there is,
apply the known fix. If there isn't and you just solved something painful, add one.

Current fixes:
- `cascade-trap.md` — theme token overrides not applying (BELLA `:root` beats `@theme`).
- `one-render-path.md` — "changes never go global" (duplicate/parallel implementations).
- `dark-mode-every-surface.md` — dark mode broken on some surfaces (hardcoded values).
- `focus-outline-dangling-selector.md` — a stray 2px outline / "weird line" around a whole shell.
- `turbopack-stale-css.md` — dev server serves stale CSS after globals edits (wipe `.next`).
- `git-mv-hides-content-from-scans.md` — renames hide file content from diff-based scans.
- `grep-c-exit-code-breaks-chains.md` — grep -c exit codes break && chains / gates.
