/* Copy gate: no em/en dashes in human copy, one positioning term, no
 * placeholder words ("to come", "coming soon", "lorem", "TBD"; job 38,
 * 5 Oct 2026: unfinished slots shipped). Word-boundary, any case. No
 * allowlist: a real sentence that trips it ("the years to come") gets
 * reworded, not excused. The one exact-string exception is Elleta's real
 * job title (REAL_TITLES, job 40). Comments are exempt (not copy). */
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
const PLACEHOLDER = /\b(?:to come|coming soon|lorem|tbd)\b/i;
/* the positioning term, any case (job 40: "AI-Assisted" slipped past the
   case-sensitive check). One exception, by Elleta's call (5 Oct 2026): a
   real job title is quoted exactly, so her own role title passes, as that
   exact string only. */
const OFF_TERM = /AI-augmented|AI-assisted/i;
const REAL_TITLES = ["AI-Assisted Design Systems Engineer · Maker Program"];
const isComment = (l) => /^\s*(\/\/|\*|\/\*)/.test(l);

for (const f of [...walk("app"), ...walk("components"), ...walk("content/case-studies"), ...walk("lib"), ...walk("public/demos")]) {
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((l, i) => {
    if (isComment(l)) return;
    if (/—|–/.test(l)) fail(`${f}:${i + 1}`, "an em/en dash in copy", "a period, a comma, or that");
    const ph = l.match(PLACEHOLDER);
    if (ph) fail(`${f}:${i + 1}`, `placeholder "${ph[0]}"`, "the finished copy, or nothing rendered");
    const term = REAL_TITLES.reduce((x, t) => x.split(t).join(""), l).match(OFF_TERM);
    if (term) fail(`${f}:${i + 1}`, term[0], '"AI-enabled" (the one positioning term)');
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
