/* Agent-surface gate (2026-07-17): llms.txt routes and the bella.json
 * case slugs must match the live registry. An agent surface that lies
 * is worse than none; drift here fails the build. */
import { readFileSync, readdirSync } from "node:fs";
import { receipt } from "./lib/receipt.mjs";

let failures = 0;
/* the receipt (A1): offender, actual, expected — one format */
const fail = (offender, got, expected) => { failures++; console.log(receipt("agents", offender, got, expected)); };

const registry = readdirSync("content/case-studies")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "design-lab.ts")
  .map((f) => readFileSync(`content/case-studies/${f}`, "utf8").match(/slug: "([^"]+)"/)?.[1])
  .filter(Boolean);
// design-lab ships when its blocks are authored; exclude while unrouted
const exported = readFileSync("content/case-studies/index.ts", "utf8");
const live = registry.filter((slug) => exported.includes(slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())) || exported.includes(slug));

const llms = readFileSync("public/llms.txt", "utf8");
for (const slug of live) {
  if (!llms.includes(`/case-studies/${slug}`)) fail("public/llms.txt", `no route for live case "${slug}"`, `/case-studies/${slug} listed`);
}
for (const m of llms.matchAll(/\/case-studies\/([a-z0-9-]+)/g)) {
  if (!live.includes(m[1])) fail("public/llms.txt", `route /case-studies/${m[1]} (not in the registry)`, "live registry routes only");
}

const bella = readFileSync("app/api/bella.json/route.ts", "utf8");
if (!bella.includes("caseStudies.map")) fail("app/api/bella.json/route.ts", "cases not derived from the registry", "caseStudies.map over the live registry");

if (failures) { console.log(`agents gate: ${failures} failure(s)`); process.exit(1); }
console.log("agents gate: PASS");
