# Visual language v2 — requirements (all testable)

- [ ] Exactly ONE BubbleHeading on each of: every case page, /about, /point-of-view, /contact. Zero on
      subheadings (grep + visual check). Title inside the bubble, Unique 700, identity colour.
- [ ] Connector runs bubble -> first content block; aria-hidden; static under prefers-reduced-motion.
- [ ] Bubble label AA on worst gradient stop, both themes (audit:contrast).
- [ ] Case colour appears ONLY on: own bubble (home/map), own bubble-heading, own card accent, own page
      tags. Work filter chips, table tags, nav, buttons, stats all neutral. No skill-colour map exists.
- [ ] About stats remain quiet cards (restraint default).
- [ ] SegmentedControl reads as one connected control (container + hairline dividers, filled selected);
      Tab + Enter/Space; exactly one aria-current (audit:controls).
- [ ] No bubble visually cut on home or /work map at 1440/1024/768/390 (programmatic bounds check:
      every bubble rect within stage rect).
- [ ] /design-system renders swatches with real token names + live values (flip theme -> values change);
      type/component/spacing/radius specimens present; gate section lists the five audits.
- [ ] TokenInspector: hover/focus reveals driving token per zone; keyboard operable; embedded as Code
      First's evidence AND on /design-system.
- [ ] Colophon links to /design-system; top nav unchanged (4 items).
- [ ] Case sections carry case-colour kicker/left-rule skim anchors; no underlined body text.
- [ ] Standing gates: tokens-only, 1240 container, Unique 700 display only (>=24px rule; bubble titles
      >=28px), one primary per view, AI-enabled only, no em/en dashes (incl. public/demos), no amber,
      NDA grep clean, one implementation (orphan grep), tsc, routes 200 light+dark.
- [ ] Conformance spec gains §8 (bubble-heading + colour-as-identity + containment rules).
- [ ] Proof screenshots: one case page, /about, /point-of-view (bubble-heading + connector visible),
      home (constellation contained), desktop + 390px, light + dark.
