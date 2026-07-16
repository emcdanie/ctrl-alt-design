# A dangling selector merges into the NEXT rule

**Symptom:** every case page grew a faint 2px vertical line at both
container edges ("the weird line").

**Why:** an automated edit removed one selector from a multi-selector
rule and left `.cs-shell,` dangling; CSS joined it to the following
`:focus-visible { outline: ... }` rule, outlining the whole shell.

**Fix:** after any scripted CSS surgery, grep for `,$` followed by a
comment or blank lines before the next `{`, and re-run the visual sweep.
Prefer replacing WHOLE rules over splicing selector lists.

**Recurred:** introduced 2026-07-16 during dedupe, found by the P5 line
hunt the same day.
