/* NDA content gate: greps TRACKED FILE CONTENTS across the whole tree
 * (never the diff — renames hid names before; see docs/fixes/).
 * NO banned term appears in this committed script: project terms live in
 * the gitignored _private/nda-terms.txt, merged with the user's global
 * ~/.claude/nda-terms.txt at runtime. The constitution (CLAUDE.md) is
 * committable because it references these files instead of naming names. */
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { receipt } from "./lib/receipt.mjs";
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

/* Employer scoping (Pass E task 9, Elleta 17 Jul): employment history
 * is public, internals are not. Employer and engagement org names
 * (gitignored _private/nda-employers.txt) are banned everywhere EXCEPT
 * the two Experience surfaces. No other file is exempt, ever. */
let employerTerms = [];
const employersList = "_private/nda-employers.txt";
if (existsSync(employersList)) employerTerms.push(...readTerms(employersList));
const EMPLOYER_OK = ["components/ExperienceSection.tsx", "components/ResumeModal.tsx"];

const EXEMPT = ["scripts/audit-nda.mjs"];
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SCAN_PATHS = "app components content/case-studies lib public docs scripts specs";

function grepHits(termList, extraExempt = []) {
  if (!termList.length) return [];
  const pattern = termList.map(esc).join("|");
  let out = "";
  try {
    out = execSync(`git grep -inwE '${pattern}' -- ${SCAN_PATHS}`, { encoding: "utf8" });
  } catch (e) {
    out = e.stdout ?? ""; // git grep exits 1 on no matches
  }
  return out
    .split("\n")
    .filter(Boolean)
    .filter((l) => ![...EXEMPT, ...extraExempt].some((x) => l.startsWith(x)));
}

const hits = [
  ...grepHits(terms),
  ...grepHits(employerTerms, EMPLOYER_OK),
];

if (hits.length) {
  /* the receipt (A1): the git-grep hit (file:line:content) is the
     offender; the banned term itself stays out of the committed log
     format (the lists are private by design) */
  for (const h of hits.slice(0, 20)) console.error(receipt("nda", h.slice(0, 120), "a banned term match", "no banned term anywhere in tracked content"));
  console.error(`nda gate: ${hits.length} match(es)`);
  process.exit(1);
}
console.log("nda gate: PASS");
