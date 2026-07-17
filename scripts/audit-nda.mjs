/* NDA content gate: greps TRACKED FILE CONTENTS across the whole tree
 * (never the diff — renames hid names before; see docs/fixes/).
 * NO banned term appears in this committed script: project terms live in
 * the gitignored _private/nda-terms.txt, merged with the user's global
 * ~/.claude/nda-terms.txt at runtime. The constitution (CLAUDE.md) is
 * committable because it references these files instead of naming names. */
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

let terms = [];
const readTerms = (p) =>
  readFileSync(p, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
const projectList = "_private/nda-terms.txt";
if (existsSync(projectList)) terms.push(...readTerms(projectList));
const globalList = join(homedir(), ".claude", "nda-terms.txt");
if (existsSync(globalList)) {
  terms.push(...readTerms(globalList));
}

const EXEMPT = ["scripts/audit-nda.mjs"];
const pattern = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
let out = "";
try {
  out = execSync(
    `git grep -inwE '${pattern}' -- app components content/case-studies lib public docs scripts specs`,
    { encoding: "utf8" }
  );
} catch (e) {
  out = e.stdout ?? ""; // git grep exits 1 on no matches
}
const hits = out
  .split("\n")
  .filter(Boolean)
  .filter((l) => !EXEMPT.some((x) => l.startsWith(x)));

if (hits.length) {
  for (const h of hits.slice(0, 20)) console.error("NDA FAIL:", h.slice(0, 160));
  console.error(`nda gate: ${hits.length} match(es)`);
  process.exit(1);
}
console.log("nda gate: PASS");
