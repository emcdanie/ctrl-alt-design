/* Copy gate: no em/en dashes in human copy, one positioning term.
 * Comments are exempt (not copy). */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { receipt } from "./lib/receipt.mjs";

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
/* the receipt (A1): offender, actual, expected — one format */
const fail = (offender, got, expected) => { fails++; console.error(receipt("copy", offender, got, expected)); };
const isComment = (l) => /^\s*(\/\/|\*|\/\*)/.test(l);

/* VinylPlayer is frozen: the pre-commit hook false-positives its Apple
 * Music album id, so the file cannot be committed (see claude-progress). */
const EXEMPT = ["components/VinylPlayer.tsx"];
for (const f of [...walk("app"), ...walk("components"), ...walk("content/case-studies"), ...walk("lib"), ...walk("public/demos")]) {
  if (EXEMPT.some((e) => f.endsWith(e))) continue;
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((l, i) => {
    if (isComment(l)) return;
    if (/—|–/.test(l)) fail(`${f}:${i + 1}`, "an em/en dash in copy", "a period, a comma, or that");
    if (/AI-augmented|AI-assisted/.test(l)) fail(`${f}:${i + 1}`, l.match(/AI-augmented|AI-assisted/)[0], '"AI-enabled" (the one positioning term)');
    /* dash escapes render as real dashes even from string literals */
    if (/\\u201[34]/.test(l)) fail(`${f}:${i + 1}`, "an em/en dash hidden as a \\u escape", "a period, a comma, or that");
    /* JSX text does NOT process \uXXXX — it renders literally (the
       colophon bug). Escapes inside quoted strings are fine, so strip
       string spans first, then flag what remains. */
    const noStrings = l.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, "");
    if (/\\u[0-9a-fA-F]{4}/.test(noStrings)) {
      fail(`${f}:${i + 1}`, "a literal \\u escape in JSX text (renders verbatim)", "the real character");
    }
  });
}
console.log(fails === 0 ? "copy gate: PASS" : `copy gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
