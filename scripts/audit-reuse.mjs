/* Reuse gate: one implementation, no orphans. Every component under
 * components/ must be imported somewhere in app/ or components/.
 * A dead copy that nothing renders is exactly how two implementations
 * drift apart, so it fails the build. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, basename } from "node:path";

/* VinylPlayer: frozen (pre-commit hook false-positive, see docs/fixes).
 * components/motion/*: a barrel library re-exported via motion/index.ts;
 * its members are legitimately consumed through the barrel. */
const EXEMPT = ["components/VinylPlayer.tsx", "components/motion/"];

const walk = (dir, exts) => {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p, exts));
    else if (exts.some((x) => p.endsWith(x))) out.push(p);
  }
  return out;
};

const components = walk("components", [".tsx"]);
const sources = [...walk("app", [".tsx", ".ts"]), ...walk("components", [".tsx", ".ts"])]
  .map((f) => ({ f, s: readFileSync(f, "utf8") }));

let fails = 0;
for (const c of components) {
  if (EXEMPT.some((e) => c.includes(e))) continue;
  const name = basename(c, ".tsx");
  const used = sources.some(
    ({ f, s }) => f !== c && new RegExp(`from ["'][^"']*\\b${name}["']`).test(s)
  );
  if (!used) {
    fails++;
    console.error(`REUSE FAIL: ${c} is imported nowhere — delete it or wire it in (one implementation, no orphans)`);
  }
}

console.log(fails === 0 ? "reuse gate: PASS" : `reuse gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
