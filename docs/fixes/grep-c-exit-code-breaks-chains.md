# grep -c exits 1 on zero matches and kills && chains

**Symptom:** an NDA scan that found ZERO matches (good) aborted the
commit chain, looking like a scan failure; twice a gate chained with `;`
let a real failure through instead.

**Fix:** never gate on `grep -c` inside `&&` chains. Capture the count,
then test it explicitly: `matches=$(... | grep -icwE ...); [ "$matches" = "0" ]`.
And never chain `gate; commit` with `;` - use `&&` so failures stop the
commit.

**Recurred:** 2026-07-16 x3.
