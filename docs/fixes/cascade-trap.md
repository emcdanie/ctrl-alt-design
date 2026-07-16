# Fix: the cascade trap (theme token overrides don't apply)

## Symptom
You change an app theme token (a color, a spacing value) and nothing updates. BELLA's values keep winning.
Dark-mode overrides silently don't take.

## Root cause
BELLA ships an **unlayered `:root`**. Tailwind's `@theme` tokens live in a cascade **layer**. Unlayered
rules beat layered ones, so BELLA's `:root` overrides anything you put in `@theme`, no matter the source
order.

## The fix
Define the app's theme tokens in an **unlayered `:root` that loads AFTER the BELLA import**, so it wins on
both specificity-layer terms and order. Do not rely on `@theme` alone for values that must override BELLA.

```css
@import "bella/tokens.css";   /* BELLA's unlayered :root */
/* app authority — unlayered, after the import, so it wins */
:root { --iris: #5B4BD1; --ground: #F5F4EF; /* ... */ }
[data-theme="dark"] :root, :root[data-theme="dark"] { --iris: #A79CE2; --ground: #1B1B40; }
```

## Guard
If a token override isn't applying, check cascade **layer order first**, before touching the value.
