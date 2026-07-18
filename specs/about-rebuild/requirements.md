# About rebuild — requirements

- [ ] About renders, in order: bubble hero + photo + spine bio, problem space,
      How I collaborate (unchanged), Experience, ONE Learning section, close + CTA.
- [ ] No project or experiment gallery on About; CTRL_ALT_DESIGN and the experiments
      render on /work under #design-lab; workLibrary design-lab href points there.
- [ ] Exactly one BubbleHeading on About (periwinkle identity), one h1.
- [ ] One accent highlight in the bio; iris eyebrows on every section; stats cards
      accent-tinted with the stat in accent-ink; Learning cards use accent tokens.
- [ ] No case colours anywhere on About.
- [ ] No hardcoded hex, px, or font-family in any file this rebuild touches.
- [ ] audit:structure fails literal font-family values and Unique tokens outside the
      sanctioned file list.
- [ ] Standing gates: tokens only; 1240 container + spacing scale; Unique 700 display
      only (bubble heading); control taxonomy, max one visible primary per view;
      dark mode every surface; "AI-enabled" only; no em/en dashes; NDA-safe; one
      implementation, no orphans.
- [ ] npm run gate green; tsc clean; all routes 200 light + dark; screenshots of
      About and /work, desktop + 390, light + dark.
