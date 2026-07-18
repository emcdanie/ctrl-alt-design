---
name: portfolio-system
description: Layout & frame contract for elleta.design — conform every section to this; never invent inline values
---

# Portfolio layout system

Read `DESIGN.md` at the repo root before styling anything. It is the source of
truth for every frame on elleta.design. This skill is the enforcement summary.

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
- Type ramp (§5): 13/14/16/18/20/24/32/40/56 px only; body ≥16px. Faces (TYPE LOCK, per DESIGN.md §5): exactly two. Unique = hero/bubble display surfaces ONLY (bubble-heading title, home hero headline, keycap brand lockup); Geist = everything else including all section heads, eyebrows (caps + `--tracking-eyebrow`), and meta. No mono face exists; `--font-mono` is a legacy alias for Geist. Enforced by `audit:fonts` + `audit:tokens` in the gate. No ad-hoc clamp() — use the fluid tokens defined in globals (`--font-hero`, `--font-section-title`, `--font-subsection`, `--font-card-title`, `--font-body-size`). Font stacks are declared once, on `body` in `globals.css` (next/font vars only exist there); the `@theme inline` block just maps utilities onto them.

## Working rules

1. Never write a raw px or hex where a token exists (BELLA `lib/bella/bella.css` + `app/globals.css` `@theme`).
2. If a value is genuinely missing, add a named token and record it in `DESIGN.md` BEFORE using it.
3. New sections: `SectionShell` / `.layout-section` + `.layout-container`. No custom vertical padding.
4. After visual changes, re-check the frames against `DESIGN.md` (radius, padding, border+shadow tier, gap, section rhythm) at 1440/768/390.
