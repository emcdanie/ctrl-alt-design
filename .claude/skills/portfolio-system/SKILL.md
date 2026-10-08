---
name: portfolio-system
description: Layout & frame contract for elleta.design — conform every section to this; never invent inline values
---

# Portfolio layout system

Read `docs/RULES.md` before styling anything. It is the one rule source for elleta.design.
This skill is the enforcement summary.

## Hard numbers

- Card radius: `--radius-2xl` (20px). ONE value for every card.
- Card padding: `--spacing-6` (24px), every side, every breakpoint.
- Card shadow: rest `--shadow-card-default`, hover/raised `--shadow-card-elevated`. No other tiers on cards.
- Card border: glass surfaces use `--color-semantic-border-glass-edge` (+ glass-top); opaque tiles use `--color-semantic-border-subtle`. 1px.
- Container: `.layout-container` = `--container-width` 1240px + `--container-padding` 32px.
- Section rhythm: `.layout-section` = `--spacing-20` (80px) desktop, `--spacing-16` (64px) ≤640px.
- Grid gap: `var(--grid-gap)` = `--spacing-8` (32px), everywhere.
- Touch targets ≥ 44px (`--spacing-touch-target`).
- Featured panels (`.feature-panel`) are the recorded exception: `--radius-3xl`.
- Type: Figtree 400 and 600 only, one style per role (`docs/RULES.md`). Reading text 18px or more, labels and UI 16px or more. Geist Mono only for real code and token names.

## Working rules

1. Never write a raw px or hex where a token exists (BELLA `lib/bella/bella.css` + `app/globals.css` `@theme`).
2. If a value is genuinely missing, add a named token in the `:root` BEFORE using it.
3. New sections: `Section` (`.section` + `.container`). No custom vertical padding.
4. After visual changes, re-check the frames against `docs/RULES.md` (radius, padding, border+shadow tier, gap, section rhythm) at 1440/768/390.
