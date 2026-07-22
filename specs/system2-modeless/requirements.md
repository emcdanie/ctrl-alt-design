# Requirements: /design-system2 (modeless grammar)

R1. /design-system2 renders 200 in both themes; /design-system, the site nav, and
    PR 37's branch are byte-identical to before this work.
R2. One ground: no band tints, no identity wash, no section-level background or
    background-image anywhere on the page (asserted).
R3. Every content unit renders through ui/Card EXCEPT the Type ramp (recorded
    deviation: Unique never inside a Card, runtime-enforced).
R4. Opening: kicker + Unique title + one positioning sentence + intro paragraphs +
    two demo keycaps + one text link; inspector card beside the intro at equal
    column width; columns top-aligned; no empty gap between title and body.
R5. Map rail carries the existing TODO(elleta) description slots (render nothing).
R6. One metadata register: every kicker/label on the page computes the same mono
    family and size as .ds-section__kicker; every note computes >= 16px (asserted).
R7. Rules 01-08, one line each, verbatim from page 1, each through a Card.
R8. Gate section = "How things slip": per-audit cards with receipt slots, the
    verbatim Resend line, the honest not-covered line, the green-next-to-reds line.
R9. Status: two equal columns, one card per row, lists verbatim from page 1.
R10. Inspector: one lane; 2px uniform VISUAL ring gap around the visible key
     including the 3D plate (asserted, both themes, ±1px); leaders anchored per
     referent zone (fill-hi upper face, fill-lo lower face, label on text, radius
     on a corner, edge below the key, hit area on the outline).
R11. Tokens only (new CSS lives in the allowlisted globals.css, values documented);
     body reading text >= 16px; no em or en dashes; ONE primary on the page.
R12. npm run gate 13/13 + tsc clean; /design-system2 in the axe, type, controls,
     contrast sweeps; full-page shots 1440 + 390 x both themes in
     _review/after/system2/.
R13. PR opened against fix/system-annotation-rebuild (diff = this work alone),
     preview link posted, STOP. No merge; Elleta compares and picks.
