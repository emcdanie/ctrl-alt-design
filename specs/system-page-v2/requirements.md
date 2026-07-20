# System v2 — requirements (testable)

1. /about theses: exactly three `.thesis-band` cards in ONE grid row at
   1440 (equal rendered heights), stacked at 390. Dark ground, case-colour
   core words, hover trace, focus-within ring all still present. No Unique
   below 24px. Copy byte-identical to current.
2. /design-system: a `nav[aria-label="System sections"]` with seven links
   (Identity, Type, Colour, Spacing, Controls, Inspector, Gate) in that
   order; page sections scroll in the same order. At 1440 the nav is a
   sticky left rail; at 390 a sticky horizontal pill row. Scrolling to a
   section moves `aria-current="true"` to its link; clicking a link lands
   on the section (scroll-margin clears the header). Tab reaches every
   link; Enter activates.
3. Identity band: eight sphere items, one orb size, one grid, name/token/
   value rows aligned across items. Travel Booking present.
4. Controls band: zero redrawn copies — FilterChip/Tag/StatusPill render
   through their ui/ imports; every specimen centred in `.ds-specimen__body`;
   no horizontal overflow at 390.
5. Annotation: every annotated specimen (opening keycaps, six controls,
   type display + three rows, eight spheres) exposes a Tokens trigger;
   click or focus+Enter reveals name + live resolved value per attached
   token; theme flip updates open values. TokenInspector renders its
   readout through the SAME component (its old readout markup gone).
6. Gate section: one status card per audit (ten), each with name, PASS
   chip, one-line description; snapshot date visible and reading
   21 Jul 2026; "ten audits" copy consistent on the page.
7. Case pages: related row renders exactly TWO cards at 1440 (wider than
   before), one column at 390; every cover box has the fixed aspect and
   `object-fit: cover`; Operational Clarity (no honest cover) shows the
   warm placeholder recipe, un-stretched.
8. Live sweep of all routes + published demos finds ZERO visible
   placeholder markers (TODO, "[ Your", "words here", TBD, lorem,
   placeholder as literal copy). token-parity.html shows no note where the
   "[ Your words here ]" block was.
9. /work Explorations: no Solution Canvas card; screener card unchanged;
   /demos/finviz-kpi-tree.html returns 404; no orphaned thumbnail on disk.
10. Per task: gate 10/10, tsc clean, commit. Final: routes 200 both themes,
    shots in _review/after/system-v2/, progress log updated, push.
