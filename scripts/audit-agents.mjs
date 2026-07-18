/* Agent-surface gate (2026-07-17): llms.txt routes and the bella.json
 * case slugs must match the live registry. An agent surface that lies
 * is worse than none; drift here fails the build. */
import { readFileSync, readdirSync } from "node:fs";

let failures = 0;
const fail = (m) => { failures++; console.log(`AGENTS FAIL ${m}`); };

const registry = readdirSync("content/case-studies")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "design-lab.ts")
  .map((f) => readFileSync(`content/case-studies/${f}`, "utf8").match(/slug: "([^"]+)"/)?.[1])
  .filter(Boolean);
// design-lab ships when its blocks are authored; exclude while unrouted
const exported = readFileSync("content/case-studies/index.ts", "utf8");
const live = registry.filter((slug) => exported.includes(slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())) || exported.includes(slug));

const llms = readFileSync("public/llms.txt", "utf8");
for (const slug of live) {
  if (!llms.includes(`/case-studies/${slug}`)) fail(`llms.txt missing live case route: ${slug}`);
}
for (const m of llms.matchAll(/\/case-studies\/([a-z0-9-]+)/g)) {
  if (!live.includes(m[1])) fail(`llms.txt lists a route not in the registry: ${m[1]}`);
}

const bella = readFileSync("app/api/bella.json/route.ts", "utf8");
if (!bella.includes("caseStudies.map")) fail("bella.json no longer derives cases from the live registry");

if (failures) { console.log(`agents gate: ${failures} failure(s)`); process.exit(1); }
console.log("agents gate: PASS");
