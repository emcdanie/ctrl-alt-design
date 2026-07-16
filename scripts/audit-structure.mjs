/* Structural gate — fails the build when per-page drift patterns return.
 * Runs alongside audit:contrast (npm run audit:structure). */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

let fails = 0;
const fail = (msg) => { fails++; console.error("STRUCTURE FAIL:", msg); };

/* 1. ONE case-study render path — no per-case route dirs */
for (const entry of readdirSync("app/case-studies")) {
  if (entry !== "[slug]" && statSync(join("app/case-studies", entry)).isDirectory()) {
    fail(`per-case route dir exists: app/case-studies/${entry} — cases render via [slug] only`);
  }
}

/* helpers */
const walk = (dir, exts) => {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p, exts));
    else if (exts.some((x) => p.endsWith(x))) out.push(p);
  }
  return out;
};
const appFiles = walk("app", [".tsx", ".css"]);
const componentFiles = walk("components", [".tsx", ".css"]);

/* 2. zero amber — no amber-named token or warm-amber hex in app/components */
for (const f of [...appFiles, ...componentFiles]) {
  const s = readFileSync(f, "utf8");
  if (/amber/i.test(s)) fail(`amber reference in ${f}`);
  if (/#(C4956A|F2A25C|F59E0B|D97706)\b/i.test(s) && !f.includes("globals.css")) {
    fail(`warm amber hex in ${f}`);
  }
}

/* 3. every page sits in the container/rhythm system */
const pageOk = /layout-container|page-container|layout-section|CaseStudyShell/;
for (const f of appFiles.filter((f) => f.endsWith("page.tsx"))) {
  const s = readFileSync(f, "utf8");
  if (!pageOk.test(s)) fail(`${f} lacks the container/section system (layout-*/page-container/CaseStudyShell)`);
}

/* 4. no arbitrary px type in components (recorded proto exceptions excluded) */
const EXEMPT = ["Hero.module.css", "BubbleCluster.module.css", "ThemeSwitch.module.css",
  "WorkSidebar", "VinylPlayer.tsx", "CaseCard.module.css", "WorkLibrary.module.css"];
for (const f of [...appFiles, ...componentFiles]) {
  if (EXEMPT.some((e) => f.includes(e))) continue;
  const s = readFileSync(f, "utf8");
  const m = s.match(/text-\[[0-9.]+px\]/);
  if (m) fail(`arbitrary type size ${m[0]} in ${f} — use the ramp tokens`);
}

console.log(fails === 0 ? "structure gate: PASS" : `structure gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
