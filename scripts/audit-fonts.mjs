/* Type lock (2026-07-17): exactly two faces.
 * - No mono family may exist anywhere (Geist Mono retired; --font-mono is
 *   a legacy alias that resolves to Geist in globals.css).
 * - No font-family literal outside the token layer (app/globals.css):
 *   components/pages may only reference var(--font-*) tokens.
 * - Unique (--font-hero-display / --font-unique) renders only in the
 *   hero/bubble display surfaces: the token layer (globals.css: the
 *   .bubble-heading__title, .kbd-logo brand lockup rules), the home hero
 *   headline (Hero.module.css), and the font loader (app/layout.tsx). */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components"];
const EXT = /\.(tsx|ts|css)$/;
const TOKEN_LAYER = new Set(["app/globals.css"]);
const UNIQUE_ALLOWED = new Set(["app/globals.css", "components/Hero.module.css", "app/layout.tsx"]);

const MONO_FAMILY = /geist mono|jetbrains|ui-monospace|\bmonospace\b|chivo|source code|courier/i;
const OTHER_FAMILY = /\b(fraunces|jakarta|cormorant|georgia)\b/i;

let failures = 0;
const fail = (f, line, msg) => {
  failures++;
  console.log(`FONT FAIL ${f}:${line} ${msg}`);
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
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((l, i) => {
      const n = i + 1;
      if (/font-waiver:/.test(l)) return; // reviewed exception, reason inline
      if (MONO_FAMILY.test(l)) fail(file, n, `mono family reference: ${l.trim().slice(0, 60)}`);
      if (OTHER_FAMILY.test(l)) fail(file, n, `foreign family reference: ${l.trim().slice(0, 60)}`);
      // font-family / fontFamily literals must be var(--font-*) tokens
      const decl = l.match(/font-family\s*:\s*([^;{}]+)|fontFamily\s*:\s*"([^"]+)"/);
      if (decl && !TOKEN_LAYER.has(file)) {
        const val = (decl[1] ?? decl[2] ?? "").trim();
        if (!val.startsWith("var(--font-")) fail(file, n, `font-family literal: ${val.slice(0, 50)}`);
      }
      // Unique outside the allowed hero/bubble surfaces
      if (/--font-hero-display|--font-unique|"Unique"|'Unique'/.test(l) && !UNIQUE_ALLOWED.has(file)) {
        fail(file, n, `Unique outside hero-bubble surfaces: ${l.trim().slice(0, 60)}`);
      }
    });
  }
}

if (failures) {
  console.log(`fonts gate: ${failures} failure(s)`);
  process.exit(1);
}
console.log("fonts gate: PASS");
