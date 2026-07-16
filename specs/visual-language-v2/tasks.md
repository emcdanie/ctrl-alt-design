# Visual language v2 — tasks

- [x] Baseline: screenshot current case page + /about + /point-of-view + /contact + home (light/dark,
      1440 + 390) per harness doc.
- [x] Build `ui/BubbleHeading` (bubble + fitted Unique title + connector + reduced-motion) + CSS.
- [x] CaseStudyShell: replace sphere + flat display title with BubbleHeading (one device); remove the
      now-dead sphere-only styles; orphan grep.
- [x] PageHeader: `variant="bubble"` (iris/peri); apply on /about, /point-of-view, /contact.
- [x] Case-page tags: case-tint variant (AA both themes); confirm shared surfaces stay neutral.
- [x] Decision blocks: kicker + left rule use the case identity colour.
- [x] SegmentedControl: connected-container CSS polish.
- [x] BubbleCluster: 640-design-space scale wrapper (ResizeObserver); remove overflow-clip band-aid;
      bounds-check script at 1440/1024/768/390.
- [x] `/design-system` page: token swatch grid (runtime values), type/component/spacing/radius specimens,
      gate section. `/design-system/inspector` chromeless route.
- [x] `TokenInspector` component; embed as Code First decision evidence; link colophon -> /design-system.
- [x] Conformance spec §8; DESIGN.md pointer if needed.
- [x] npm run gate + tsc + routes 200 light/dark + NDA grep + orphan grep.
- [x] Proof screenshots (desktop + 390, light + dark) + report with diff summary.
