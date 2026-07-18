/* Copy gate: no em/en dashes in human copy, one positioning term.
 * Comments are exempt (not copy). */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir) => {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(tsx?|md|html)$/.test(p) && !p.endsWith(".d.ts")) out.push(p);
  }
  return out;
};

let fails = 0;
const fail = (m) => { fails++; console.error("COPY FAIL:", m); };
const isComment = (l) => /^\s*(\/\/|\*|\/\*)/.test(l);

/* VinylPlayer is frozen: the pre-commit hook false-positives its Apple
 * Music album id, so the file cannot be committed (see claude-progress). */
const EXEMPT = ["components/VinylPlayer.tsx"];
for (const f of [...walk("app"), ...walk("components"), ...walk("content/case-studies"), ...walk("lib"), ...walk("public/demos")]) {
  if (EXEMPT.some((e) => f.endsWith(e))) continue;
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((l, i) => {
    if (isComment(l)) return;
    if (/—|–/.test(l)) fail(`${f}:${i + 1} em/en dash in copy`);
    if (/AI-augmented|AI-assisted/.test(l)) fail(`${f}:${i + 1} banned positioning variant`);
    /* dash escapes render as real dashes even from string literals */
    if (/\\u201[34]/.test(l)) fail(`${f}:${i + 1} em/en dash hidden as a \\u escape`);
    /* JSX text does NOT process \uXXXX — it renders literally (the
       colophon bug). Escapes inside quoted strings are fine, so strip
       string spans first, then flag what remains. */
    const noStrings = l.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, "");
    if (/\\u[0-9a-fA-F]{4}/.test(noStrings)) {
      fail(`${f}:${i + 1} literal \\u escape in JSX text — it renders verbatim; type the real character`);
    }
  });
}
console.log(fails === 0 ? "copy gate: PASS" : `copy gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
