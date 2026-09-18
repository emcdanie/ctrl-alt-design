/* Type lock (2026-07-17): exactly two faces.
 * - No mono family may exist anywhere (Geist Mono retired; --font-mono is
 *   a legacy alias that resolves to Geist in globals.css).
 * - No font-family literal outside the token layer (app/globals.css):
 *   components/pages may only reference var(--font-*) tokens.
 * - Unique (--font-hero-display / --font-unique) renders only through
 *   the display Heading primitive (ui/Heading.tsx -> .display-heading
 *   classes in globals.css), the .kbd-logo brand lockup, the home hero
 *   headline (Hero.module.css), and the font loader (app/layout.tsx).
 *   Bubble page headers are parked (last live at e25eefc). Raw Unique
 *   anywhere else fails. Floor: 24px, enforced by audit:contrast. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { receipt } from "./lib/receipt.mjs";

const ROOTS = ["app", "components"];
const EXT = /\.(tsx|ts|css)$/;
const TOKEN_LAYER = new Set(["app/globals.css"]);
const UNIQUE_ALLOWED = new Set(["app/globals.css", "app/layout.tsx"]);
/* in globals.css, Unique may only be SET on these selectors (plus the font tokens) */
const UNIQUE_SELECTORS = [".nav-wordmark", ".site-footer__wordmark", "[data-bella-logo]"];

const MONO_FAMILY = /geist mono|jetbrains|ui-monospace|\bmonospace\b|chivo|source code|courier/i;
const OTHER_FAMILY = /\b(fraunces|jakarta|cormorant|georgia)\b/i;

let failures = 0;
/* the receipt (A1): offender, actual, expected — one format */
const fail = (f, line, got, expected) => {
  failures++;
  console.log(receipt("fonts", `${f}:${line}`, got, expected));
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
      if (MONO_FAMILY.test(l)) fail(file, n, `a mono family reference (${l.trim().slice(0, 50)})`, "Geist only, mono is retired");
      if (OTHER_FAMILY.test(l)) fail(file, n, `a foreign family (${l.trim().slice(0, 50)})`, "the two faces: Unique display, Geist everything else");
      // font-family / fontFamily literals must be var(--font-*) tokens
      const decl = l.match(/font-family\s*:\s*([^;{}]+)|fontFamily\s*:\s*"([^"]+)"/);
      if (decl && !TOKEN_LAYER.has(file)) {
        const val = (decl[1] ?? decl[2] ?? "").trim();
        if (!val.startsWith("var(--font-")) fail(file, n, `font-family literal "${val.slice(0, 40)}"`, "a var(--font-*) token");
      }
      // Unique outside the allowed hero/bubble surfaces
      if (/--font-hero-display|--font-unique|"Unique"|'Unique'/.test(l) && !UNIQUE_ALLOWED.has(file)) {
        fail(file, n, `a Unique reference (${l.trim().slice(0, 40)})`, "Unique only on the ELLETA wordmarks and the BELLA logo");
      }
    });
  }
}

/* selector-aware leg: in globals.css, a rule that SETS Unique must be
   one of the wordmark selectors (headings are Geist, 18 Sep 2026) */
{
  const css = readFileSync("app/globals.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!/font-family\s*:\s*var\(--font-(hero-display|unique)\)/.test(m[2])) continue;
    const sels = m[1].split(",").map((x) => x.trim()).filter(Boolean);
    const bad = sels.filter((x) => !UNIQUE_SELECTORS.some((ok) => x === ok || x.startsWith(ok + " ") || x.startsWith(ok + ":")));
    if (bad.length) fail("app/globals.css", 0, `Unique set on ${bad.join(", ")}`, "Unique only on " + UNIQUE_SELECTORS.join(", "));
  }
}

if (failures) {
  console.log(`fonts gate: ${failures} failure(s)`);
  process.exit(1);
}
console.log("fonts gate: PASS");
