# Work map: "connector lines on top of the bubbles"

Symptom (Elleta, 17 Jul, with screenshot): on the Work Map view the
connector lines appear to render OVER the bubbles. Home looks correct.

Diagnosis: NOT a z-order bug and NOT two implementations. Home and the
Work map share ONE BubbleCluster; .links sits at z-index 1 and .bub at
z-index 2, lines genuinely paint underneath. The Work map is the only
place with a FILTERED state: dimmed bubbles drop to opacity 0.35, and a
full-strength 1.5px hairline underneath a 35%-opacity disc shows through
it, which reads as a line on top. Home never dims, so it never shows.

Fix: connectors dim with their endpoints. Any line whose endpoint is
outside highlightIds gets .dimLine (opacity 0.18); through a dimmed disc
that is effectively invisible, and the surviving bright lines connect
only highlighted nodes.

Rule to keep: when a layer can go translucent, every layer beneath it is
part of its visual state. Dim them together.
