/* audit:breakpoints (RG guard, LD4–LD6, Elleta 10 Oct 2026).
 * Static — no browser. Checks all .css files in app/ and components/ for:
 *   1. breakpoints: any @media width value not in {640, 768, 1024, 1440}px
 *      or their exact rem equivalents {40, 48, 64, 90}rem
 *   2. position:absolute/fixed outside the named exempt files (canvas / figure
 *      compositions that are deliberately positioned)
 *   3. transform:scale outside the named exempt files
 *
 * RATCHET: scripts/lib/breakpoint-debt.json records today's violation counts.
 * Fails only when a violation INCREASES above its recorded debt. The debt
 * count may only shrink; printed on every run.
 *
 * NOTE: stylelint --suppress-base was not available in 17.16.0; fell back
 * to a counted debt list in scripts/lib/breakpoint-debt.json.
 *
 * UPDATE_BP_DEBT=1 rewrites the debt file with current violations (run once
 * on install, again after a deliberate cleanup). */

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { receipt } from "./lib/receipt.mjs";

const UPDATE = process.env.UPDATE_BP_DEBT === "1";
const DEBT_PATH = "scripts/lib/breakpoint-debt.json";

/* BELLA breakpoints */
const ALLOWED_PX = new Set([640, 768, 1024, 1440]);
const ALLOWED_REM = new Set([40, 48, 64, 90]);

/* position:absolute/fixed and transform:scale are tracked by COUNT per file
 * (debt stores the count; only increases above the stored count are new).
 * No files are fully exempt: the ratchet records today's count. */

const walk = (dir, exts, out = []) => {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    if (["node_modules", ".next", ".git"].includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, exts, out);
    else if (exts.includes(extname(p))) out.push(p);
  }
  return out;
};

const cssFiles = walk("app", [".css"], []).concat(walk("components", [".css"], []));

/* ── breakpoint extraction ── */
function checkBreakpoints(file) {
  const src = readFileSync(file, "utf8");
  const bad = [];
  const re = /@media[^{]*\(\s*(?:max-width|min-width|width)\s*:\s*([0-9]+(?:\.[0-9]+)?)(px|rem)\s*\)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const val = parseFloat(m[1]);
    const unit = m[2];
    const ok = unit === "px" ? ALLOWED_PX.has(val) : unit === "rem" ? ALLOWED_REM.has(val) : false;
    if (!ok) bad.push(`${val}${unit}`);
  }
  return [...new Set(bad)];
}

function countPosition(src) {
  return (src.match(/position\s*:\s*(absolute|fixed)/g) ?? []).length;
}

function countScale(src) {
  return (src.match(/transform\s*:[^;]*scale\s*\(/g) ?? []).length;
}

function countHeight(src) {
  /* height or max-height with a raw px or rem value (not var(), not %) */
  return (src.match(/\b(?:max-)?height\s*:\s*[0-9]+(?:\.[0-9]+)?(?:px|rem)\b/g) ?? []).length;
}

const violations = { breakpoints: {}, position: {}, scale: {}, height: {} };

for (const file of cssFiles) {
  const rel = relative(process.cwd(), file).replace(/\\/g, "/");
  const src = readFileSync(file, "utf8");
  const bad = checkBreakpoints(file);
  if (bad.length) violations.breakpoints[rel] = bad;
  const pc = countPosition(src);
  if (pc > 0) violations.position[rel] = pc;
  const sc = countScale(src);
  if (sc > 0) violations.scale[rel] = sc;
  const hc = countHeight(src);
  if (hc > 0) violations.height[rel] = hc;
}

const debt = existsSync(DEBT_PATH)
  ? JSON.parse(readFileSync(DEBT_PATH, "utf8"))
  : { breakpoints: {}, position: [], scale: [] };

if (UPDATE) {
  writeFileSync(DEBT_PATH, JSON.stringify({
    "$description": "Breakpoint/position/scale/height violations recorded on guard install day. May only shrink.",
    updatedAt: new Date().toISOString().slice(0, 10),
    breakpoints: violations.breakpoints,
    position: violations.position,
    scale: violations.scale,
    height: violations.height,
  }, null, 2) + "\n");
  const posCt = Object.values(violations.position).reduce((s, v) => s + v, 0);
  const scaleCt = Object.values(violations.scale).reduce((s, v) => s + v, 0);
  const htCt = Object.values(violations.height).reduce((s, v) => s + v, 0);
  console.log(`Debt file updated: ${Object.keys(violations.breakpoints).length} files with stray breakpoints, ${posCt} position, ${scaleCt} scale, ${htCt} height → ${DEBT_PATH}`);
  process.exit(0);
}

let fails = 0;

/* breakpoints */
const bpDebt = debt.breakpoints ?? {};
let bpTotal = 0;
let bpNew = 0;
for (const [file, vals] of Object.entries(violations.breakpoints)) {
  bpTotal += vals.length;
  const knownCount = (bpDebt[file] ?? []).length;
  if (vals.length > knownCount) {
    fails++;
    const extra = vals.filter((v) => !(bpDebt[file] ?? []).includes(v));
    bpNew++;
    console.error(receipt("breakpoints", file, `${vals.length} stray (${extra.join(", ")})`, `<= ${knownCount} (debt)`));
  }
}
const bpDebtTotal = Object.values(bpDebt).reduce((s, v) => s + v.length, 0);
console.log(`audit:breakpoints  breakpoints: ${bpTotal} stray value(s) in ${Object.keys(violations.breakpoints).length} file(s) (debt: ${bpDebtTotal}; new files with violations: ${bpNew})`);

/* position — count per file */
const posDebt = debt.position ?? {};
let posTotal = 0;
let posNew = 0;
for (const [file, count] of Object.entries(violations.position)) {
  posTotal += count;
  const knownCount = posDebt[file] ?? 0;
  if (count > knownCount) {
    fails++;
    posNew++;
    console.error(receipt("breakpoints", file, `${count} position:absolute/fixed (debt: ${knownCount})`, "count may only shrink"));
  }
}
const posDebtTotal = Object.values(posDebt).reduce((s, v) => s + v, 0);
console.log(`  position: ${posTotal} in ${Object.keys(violations.position).length} file(s) (debt: ${posDebtTotal}; new: ${posNew})`);

/* scale — count per file */
const scaleDebt = debt.scale ?? {};
let scaleTotal = 0;
let scaleNew = 0;
for (const [file, count] of Object.entries(violations.scale)) {
  scaleTotal += count;
  const knownCount = scaleDebt[file] ?? 0;
  if (count > knownCount) {
    fails++;
    scaleNew++;
    console.error(receipt("breakpoints", file, `${count} transform:scale (debt: ${knownCount})`, "count may only shrink"));
  }
}
const scaleDebtTotal = Object.values(scaleDebt).reduce((s, v) => s + v, 0);
console.log(`  scale: ${scaleTotal} in ${Object.keys(violations.scale).length} file(s) (debt: ${scaleDebtTotal}; new: ${scaleNew})`);

/* height/max-height — count per file */
const htDebt = debt.height ?? {};
let htTotal = 0;
let htNew = 0;
for (const [file, count] of Object.entries(violations.height)) {
  htTotal += count;
  const knownCount = htDebt[file] ?? 0;
  if (count > knownCount) {
    fails++;
    htNew++;
    console.error(receipt("breakpoints", file, `${count} fixed height/max-height px/rem (debt: ${knownCount})`, "count may only shrink"));
  }
}
const htDebtTotal = Object.values(htDebt).reduce((s, v) => s + v, 0);
console.log(`  height: ${htTotal} in ${Object.keys(violations.height).length} file(s) (debt: ${htDebtTotal}; new: ${htNew})`);

process.exit(fails > 0 ? 1 : 0);
