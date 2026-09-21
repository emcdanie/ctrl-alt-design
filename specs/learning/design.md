# /learning: design

## CONCEPT LOCK (Elleta, 2026-09-19, approved in Cowork; authoritative)

1. **Thesis.** Everything I know has a source and a use: every entry says where I learned it and,
   when there is one, the project where it paid off.
2. **Format.** Nav, then layout `Section` + `SectionHeader`, then Footer. The library reuses the
   Work toolbar pieces (search input, `FilterChip`, `SegmentedControl`, the count row) and the
   existing skills `MatrixView` (extended, not rewritten). Cards are the flat `ui/Card`; only link
   cards lift. One skills list, `content/skills.ts`, feeds Work, Learning and the matrix.
3. **Spine.**
   1. Hero: "Where I learned it, where I *used* it." (used = Term), lead, computed stats line,
      earned-certificate badges, "Next up".
   2. The library, "Everything, findable.": search, Type and Topic chips with counts, live count,
      Clear filters; views Timeline, Table, Map, Skills (view and filters in the URL).
   3. Who I follow, "The people I learn from.": the circular people network with a detail card;
      a name list below 700px.
   4. Out in the world, "Where I showed up.": conference, workshop and hackathon cards, newest first.
4. **Cut.** The mock's Research map style, progress bars, the draft-data banner, the mock's
   placeholder entries, "Maker Program" (work, not learning), a Guardian entry until confirmed.
5. **Out of scope.** Real URLs for voices and certificates (open [CHECK]s), podcast and
   off-the-clock picks, LinkedIn fixes.

## Decisions (Elleta, 2026-09-19)

- `/skills` redirects permanently to `/learning?view=skills`; nav and footer say "Learning".
- Geist Mono returns as ONE role, `--font-code`, for metadata only (dates, stat lines, code-comment
  notes, credential IDs, the inspector cursor label, the Term popover word line). Never headings,
  body, buttons or nav. `audit:fonts` enforces it.
- Type chips come from the data: a type renders only when it has entries.
- Reading entries are generated from `content/voices.ts`, only for voices marked `verified: true`
  (default false). Unverified voices appear in Who I follow only.
- Podcast and Off the clock entries render in Timeline and Table only, never Map or Skills.
- Publication names stay as the voice detail card's source line (credits); design reference sites
  are never named.

## Map

Filled concentric bands: outer = learned from, middle = skills, inner = projects, "E" in the centre.
No lines at rest; selecting a dot draws its path and dims the rest. Key and detail cards float over
the map. Drag pans, Shift+scroll and +/- zoom, Recenter resets, Esc clears. Nodes are focusable
`role="button"`; decorative layers take `pointer-events: none`. Below 700px a skill list opens the
same detail card.

Colours: learned from = iris tint, skills = the CHIP identity tint, projects = the Code First tint.
Voice groups: specs and tokens = CHIP tint, rules and governance = Code First tint, AI experience = iris.
