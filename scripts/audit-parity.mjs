/* Registry-vs-library parity gate (Pass E task 12, Elleta + Cowork
 * 20 Jul). Invariant: every slug exported from content/case-studies/
 * index.ts has exactly ONE WORK_ITEMS row with medium "case study"
 * whose href ends with that slug, and every case-study WORK_ITEMS row
 * resolves back to a registry slug. A case can never again be routable
 * but invisible in the library (filters-decision-support-system was,
 * found live 20 Jul). Side tables for case identity are rejected: the
 * EXTRA_CASES pattern is deleted; cluster exclusion is the inCluster
 * flag on the row, recorded in DESIGN.md. */
import { readFileSync } from "node:fs";
import { receipt } from "./lib/receipt.mjs";

let fails = 0;
/* the receipt (A1): offender, actual, expected — one format */
const fail = (offender, got, expected) => {
  fails++;
  console.error(receipt("parity", offender, got, expected));
};

/* registry slugs: the files index.ts actually exports */
const index = readFileSync("content/case-studies/index.ts", "utf8");
const files = [...index.matchAll(/from "\.\/([\w-]+)"/g)].map((m) => m[1]);
const registrySlugs = files.map((f) => {
  const src = readFileSync(`content/case-studies/${f}.ts`, "utf8");
  const m = src.match(/slug: "([^"]+)"/);
  if (!m) fail(`content/case-studies/${f}.ts`, "no slug export", "a slug field");
  return m?.[1];
}).filter(Boolean);

/* library rows: id / medium / href triples parsed from WORK_ITEMS */
const lib = readFileSync("lib/workLibrary.ts", "utf8");
const itemsSrc = lib.slice(lib.indexOf("WORK_ITEMS"), lib.indexOf("HUB_ITEM"));
const rows = [];
for (const block of itemsSrc.split(/\n  \{\n/).slice(1)) {
  const id = block.match(/id: "([^"]+)"/)?.[1];
  const medium = block.match(/medium: "([^"]+)"/)?.[1];
  const href = block.match(/href: "([^"]+)"/)?.[1];
  if (id && medium && href) rows.push({ id, medium, href });
}
const caseRows = rows.filter((r) => r.medium === "case study");

/* a) every registry slug -> exactly one case-study row */
for (const slug of registrySlugs) {
  const matches = caseRows.filter((r) => r.href.endsWith(`/case-studies/${slug}`));
  if (matches.length === 0)
    fail(`registry slug "${slug}"`, "0 case-study WORK_ITEMS rows (routable but invisible)", "exactly 1 row");
  if (matches.length > 1)
    fail(`registry slug "${slug}"`, `${matches.length} WORK_ITEMS rows (${matches.map((m) => m.id).join(", ")})`, "exactly 1 row");
}

/* b) every case-study row -> a registry slug */
for (const r of caseRows) {
  const slug = r.href.split("/case-studies/")[1];
  if (!slug || !registrySlugs.includes(slug))
    fail(`WORK_ITEMS row "${r.id}" (${r.href})`, "no matching registry slug (extra or mistyped)", "a registered case slug");
}

/* c) no side tables for case identity */
if (/EXTRA_CASES/.test(lib))
  fail("lib/workLibrary.ts", "an EXTRA_CASES side table", "case identity on the ONE WORK_ITEMS row (inCluster for exclusion)");

if (fails) {
  console.error(`parity gate: ${fails} failure(s)`);
  process.exit(1);
}
console.log(`parity gate: PASS (${registrySlugs.length} registry slugs = ${caseRows.length} library case rows)`);
