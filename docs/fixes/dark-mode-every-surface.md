# Fix: dark mode broken on some surfaces

## Symptom
Dark mode looks right on the home page but breaks somewhere else — a case page with a light card on navy,
unreadable text, a border that stays light. Dark feels bolted on rather than designed.

## Root cause
Hardcoded `background` / `color` / `border` values instead of semantic tokens, and dark mode treated as an
afterthought on secondary surfaces (case pages especially).

## The fix
Every surface, text, and border resolves from **semantic tokens** via `[data-theme="dark"]`. No hardcoded
hex anywhere. Dark mode is a first-class contract on EVERY surface, not just the hero. Verify each route in
dark, case pages included.

## Guard
- `audit:contrast` runs in both themes; worst-gradient-stop check covers bubble labels on spheres.
- All routes must return 200 in light AND dark.
- The dark keycap logo must not bloom a heavy glow on navy — tone the plate/shadow.
