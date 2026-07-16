# git mv renames hide file CONTENT from diff-based scans

**Symptom:** the NDA diff scan passed while renamed demo files still
contained the banned client name inside the HTML.

**Why:** rename detection shows "rename" with no content hunk, so
`git diff | grep` never sees the file body.

**Fix:** after any rename, grep the file CONTENTS directly; the release
check greps the whole tracked tree (`git grep`), not the diff.

**Recurred:** travel-demo rename (2026-07-16).
