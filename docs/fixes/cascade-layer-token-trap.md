# Tailwind @theme tokens lose to BELLA's unlayered :root

**Symptom:** a token declared in `@theme` silently has no effect
(e.g. --header-height 70px lost to BELLA's 64px).

**Why:** `@theme` emits inside `@layer theme`; `lib/bella/bella.css` declares
`:root` UNLAYERED, and unlayered author styles beat every layer.

**Fix:** app tokens that override a BELLA default go in the unlayered
APP TOKEN AUTHORITY `:root` block in `app/globals.css` (after the imports).
Do NOT import bella into a low layer instead: Tailwind preflight
(`border: 0`, higher layer) would strip BELLA's component borders
(layer priority ignores specificity).

**Recurred:** case-page spacing (2026-07-16), formalised same day.
