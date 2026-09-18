# Layout system

Three shared parts plus tokens. Every page is Nav, then Sections, then
Footer, and every section is built from these, never from its own
spacing.

## Tokens (app/globals.css, the site token layer)

| Token | Value | Job |
| --- | --- | --- |
| `--layout-max` | 74rem (1184px) | content width; gutters sit outside it |
| `--layout-gutter` | clamp(1.5rem, 4vw, 3rem) | side gutters |
| `--section-pad-y` | 3.2rem | section padding, top and bottom |
| `--section-label-gap` | 0.75rem | label to rule |
| `--section-rule-gap` | 2rem | rule to heading |
| `--section-lead-gap` | 1rem | heading to lead, lead to body |
| `--section-content-gap` | 3.5rem | SectionHeader to the content after it |

`--container-max` and `--container-pad` are derived from these, so the
one `.container` (and the nav row) follow them.

**These move into BELLA later** (as `layout.*` and `section.*` tokens);
the site keeps only the aliases then.

## Components (components/layout/)

- `Container`: max width plus gutters. Nothing else.
- `Section`: a `<section>` with the section padding, the paw label
  sitting on the hairline rule, named by that label
  (`aria-labelledby`). Wraps its children in `Container`. The first
  section on a page clears the sticky nav.
- `SectionHeader`: heading left (about 40%), lead and body right
  (about 60%, max 42rem) from 1024px; stacked below. Content after it
  gets `--section-content-gap` above.

## Enforcement

`audit:layout` (in the gate) lists every route. It fails when a page has
a top-level `<section>` that isn't `Section`, or when a file in `app/`
or `components/sections/` sets its own spacing (`mt-[`, `py-[`, inline
margin or padding). Pages with a special inner layout keep their grid
and are allowlisted with a reason; pages not yet moved are allowlisted
as pending until their commit.
