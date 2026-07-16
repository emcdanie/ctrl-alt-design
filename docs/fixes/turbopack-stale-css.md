# Turbopack serves stale CSS after globals.css edits

**Symptom:** new classes/tokens missing from the served chunk while the file
on disk is correct; "fixes" appear not to work; gates fail on already-fixed
values.

**Fix:** stop the dev server, `rm -rf .next`, restart. Never trust a red
audit result until it ran against a fresh `.next`.

**Recurred:** 2026-07-15 (standout), 2026-07-16 x3 (keycap logo, keycap
contrast fix, logo label fix).
