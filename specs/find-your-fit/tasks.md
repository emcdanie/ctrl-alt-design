# Find your fit — tasks

- [ ] Baseline: screenshot /work (desktop + 390, light + dark) before any change.
- [ ] Extract the pin card from BubbleCluster into components/ui/RevealCard.tsx
      (markup + module styles move; BubbleCluster consumes it; zero visual diff on the
      hero peek, verified against the baseline).
- [ ] lib/fit.ts: SKILL_TRIGGERS (each SKILLS entry + synonyms), matchFit(text)
      returning { skills, cases, mapping } from WORK_ITEMS; unit-testable pure
      function.
- [ ] FitMatch section component on /work above the library controls: collapsed
      one-liner, textarea + secondary keycap on expand.
- [ ] Results: AI MATCH labelled summary block + up to 3 RevealCards in case identity
      colours + per-card "Why this match" details + Show everything link.
- [ ] Empty state and reset behaviour.
- [ ] Focus management, aria-live, reduced-motion pass.
- [ ] npm run gate; tsc; all routes 200 light + dark; NDA content-grep.
- [ ] Grep for orphaned pin-card copies (one RevealCard implementation only).
- [ ] After screenshots: /work with a match rendered, desktop + 390, light + dark.
