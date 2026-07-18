/* Token lock (2026-07-17): no colour literals and no raw spacing in
 * app/** or components/**. Everything resolves from the token layer.
 * Allowlisted: app/globals.css (the app token/theme definition file).
 * Spacing scope: padding / margin / gap / scroll-margin values >= 4px
 * (0-3px hairlines, borders, and optical nudges are design details, not
 * scale spacing). Colour scope: hex / rgb() / hsl() anywhere, with the
 * `black`/`white` keywords permitted only inside mask-image hacks. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components"];
const EXT = /\.(tsx|ts|css)$/;
const ALLOW = new Set(["app/globals.css"]);

const COLOUR = /#[0-9a-fA-F]{3,8}\b|(?<![a-zA-Z-])rgba?\(|(?<![a-zA-Z-])hsla?\(/;
const SPACING_CSS = /(?:^|[^a-zA-Z-])(padding|margin|gap|row-gap|column-gap|scroll-margin)[a-z-]*\s*:\s*([^;{}]+)/g;
const SPACING_TSX = /(padding|margin|gap|rowGap|columnGap|scrollMargin)[A-Za-z]*\s*:\s*"([^"]+)"/g;
const RAW_LEN = /\b([4-9]|\d{2,})(?:\.\d+)?px\b|\b\d*\.?\d+rem\b/;

let failures = 0;
const fail = (f, line, msg) => {
  failures++;
  console.log(`TOKEN FAIL ${f}:${line} ${msg}`);
};

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(e)) out.push(p);
  }
  return out;
};

for (const root of ROOTS) {
  for (const file of walk(root)) {
    if (ALLOW.has(file)) continue;
    const lines = readFileSync(file, "utf8").split("\n");
    const isCss = file.endsWith(".css");
    lines.forEach((l, i) => {
      const n = i + 1;
      if (/token-waiver:/.test(l)) return; // reviewed exception, reason inline
      if (COLOUR.test(l)) fail(file, n, `colour literal: ${l.trim().slice(0, 70)}`);
      if (isCss) {
        for (const m of l.matchAll(SPACING_CSS)) {
          if (RAW_LEN.test(m[2])) fail(file, n, `raw spacing: ${m[0].trim().slice(0, 70)}`);
        }
      } else {
        for (const m of l.matchAll(SPACING_TSX)) {
          if (RAW_LEN.test(m[2])) fail(file, n, `raw spacing: ${m[0].trim().slice(0, 70)}`);
        }
      }
    });
  }
}

if (failures) {
  console.log(`tokens gate: ${failures} failure(s)`);
  process.exit(1);
}
console.log("tokens gate: PASS");
