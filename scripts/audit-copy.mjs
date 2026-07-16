/* Copy gate: no em/en dashes in human copy, one positioning term.
 * Comments are exempt (not copy). */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir) => {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(tsx?|md)$/.test(p) && !p.endsWith(".d.ts")) out.push(p);
  }
  return out;
};

let fails = 0;
const fail = (m) => { fails++; console.error("COPY FAIL:", m); };
const isComment = (l) => /^\s*(\/\/|\*|\/\*)/.test(l);

for (const f of [...walk("app"), ...walk("components"), ...walk("content/case-studies"), ...walk("lib")]) {
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((l, i) => {
    if (isComment(l)) return;
    if (/—|–/.test(l)) fail(`${f}:${i + 1} em/en dash in copy`);
    if (/AI-augmented|AI-assisted/.test(l)) fail(`${f}:${i + 1} banned positioning variant`);
  });
}
console.log(fails === 0 ? "copy gate: PASS" : `copy gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
