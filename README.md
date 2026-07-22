# ctrl-alt-design

The portfolio at [elleta.design](https://www.elleta.design). Built as a working
design system, not a brochure: every page ships through a 13-audit gate, every
token comes from [BELLA](https://github.com/emcdanie/bella), and the repo is
governed by a written constitution that AI agents and humans both follow.

## Why this repo is public

I design AI-enabled design systems for complex B2B SaaS and e-commerce. This
repo is the practice applied to my own site. The interesting part is not the
pages, it is the harness around them:

- **`CLAUDE.md`** is the constitution. Tokens, type, layout, control taxonomy,
  copy rules, NDA rules. Agents read it before every session.
- **`DESIGN.md`** holds the layout and frame contract the audits point to.
- **`specs/`** holds a design.md, requirements.md and tasks.md per feature.
  Spec first, then build.
- **`docs/`** holds briefs, fixes that must never regress, and audit notes.

## The gate

`npm run gate` runs 13 audits locally and in CI on every PR. Structure,
contrast (WCAG AA, AAA-minded), copy rules, control taxonomy, font usage,
token discipline, data parity, axe-core over every route in both themes,
computed type sizes, and visual assertions. Main is protected; the gate is a
required check. Green or it does not merge.

## Stack

Next.js, Tailwind CSS, BELLA design tokens (DTCG), deployed on Vercel.

## Running it

npm install, npm run dev, npm run gate before any PR.
