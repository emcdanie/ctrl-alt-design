# Tasks: system2-modeless

- [x] T0 Spec (this folder); commit the modeless audit doc the brief cites.
- [x] T1 components/DesignSystem2.tsx: composition (head, opening, identity, type,
      colour, scales, controls, agents, rules-as-law, status-rows-as-cards,
      how-things-slip) + Inspector2 (Card-wrapped, anchored leaders).
- [x] T2 app/design-system2/page.tsx (noindex, reuses DesignSystemNav).
- [x] T3 globals.css .ds2 block: opening alignment, rail label register, rules/
      status layouts, inspector chrome strip + asymmetric ringwrap geometry.
- [x] T4 Route joins axe/type/controls/contrast sweeps; audit:visual ds2 block
      (one ground, one register, ring gap, equal rows). audit:reuse static
      exemption twinned (runtime audit:type still covers the rendered page).
- [x] T5 Verified: gate 13/13, tsc clean, both routes 200 both themes, ring gap
      2.0px x4 both themes, leader anchors probe-verified per zone, shots in
      _review/after/system2/.
- [x] T6 PR 40 against fix/system-annotation-rebuild with the flags. STOPPED at
      preview; Elleta picks the winner.
