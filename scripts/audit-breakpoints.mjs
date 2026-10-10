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

/* Files where position:absolute/fixed and transform:scale are structural */
const POSITION_EXEMPT = new Set([
  "components/Hero.module.css",
  "components/Home.module.css",
  "components/BellaSpine.module.css",
  "components/SpecimenFrame.module.css",
  "components/ThemingCase.module.css",
  "components/SystemBeat.module.css",
  "components/about/AboutPictures.module.css",
  "components/case/Case.module.css",
  "components/case/DriftFigures.module.css",
  "components/case/pictures/Chip.module.css",
  "components/case/pictures/FederatedPicturesA.module.css",
  "components/case/pictures/FederatedPicturesB.module.css",
  "components/case/pictures/DriftPictures.module.css",
  "components/case/kit/Kit.module.css",
  "components/bella/shared/Trace.module.css",
  "components/bella/Button/Button.module.css",
  "components/WorkLibrary.module.css",
  "components/Learning.module.css",
  "app/globals.css",
]);
const SCALE_EXEMPT = POSITION_EXEMPT;

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

function checkPosition(file) {
  if (POSITION_EXEMPT.has(file)) return false;
  return /position\s*:\s*(absolute|fixed)/.test(readFileSync(file, "utf8"));
}

function checkScale(file) {
  if (SCALE_EXEMPT.has(file)) return false;
  return /transform\s*:[^;]*scale\s*\(/.test(readFileSync(file, "utf8"));
}

const violations = { breakpoints: {}, position: [], scale: [] };

for (const file of cssFiles) {
  const rel = relative(process.cwd(), file).replace(/\\/g, "/");
  const bad = checkBreakpoints(file);
  if (bad.length) violations.breakpoints[rel] = bad;
  if (checkPosition(file)) violations.position.push(rel);
  if (checkScale(file)) violations.scale.push(rel);
}

const debt = existsSync(DEBT_PATH)
  ? JSON.parse(readFileSync(DEBT_PATH, "utf8"))
  : { breakpoints: {}, position: [], scale: [] };

if (UPDATE) {
  writeFileSync(DEBT_PATH, JSON.stringify({
    "$description": "Breakpoint/position/scale violations recorded on guard install day. May only shrink.",
    updatedAt: new Date().toISOString().slice(0, 10),
    breakpoints: violations.breakpoints,
    position: violations.position,
    scale: violations.scale,
  }, null, 2) + "\n");
  console.log(`Debt file updated: ${Object.keys(violations.breakpoints).length} files with stray breakpoints, ${violations.position.length} with position, ${violations.scale.length} with scale → ${DEBT_PATH}`);
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
/* file not in debt at all but has violations */
for (const [file] of Object.entries(violations.breakpoints)) {
  if (bpDebt[file] === undefined && violations.breakpoints[file].length > 0) {
    /* already reported above */
  }
}
const bpDebtTotal = Object.values(bpDebt).reduce((s, v) => s + v.length, 0);
console.log(`audit:breakpoints  breakpoints: ${bpTotal} stray value(s) in ${Object.keys(violations.breakpoints).length} file(s) (debt: ${bpDebtTotal}; new files with violations: ${bpNew})`);

/* position */
const posDebt = new Set(debt.position ?? []);
const posNew = violations.position.filter((f) => !posDebt.has(f));
if (posNew.length) {
  fails++;
  for (const f of posNew) console.error(receipt("breakpoints", f, "position:absolute/fixed outside exempt list", "use layout tokens"));
}
console.log(`  position: ${violations.position.length} file(s) (debt: ${posDebt.size}; new: ${posNew.length})`);

/* scale */
const scaleDebt = new Set(debt.scale ?? []);
const scaleNew = violations.scale.filter((f) => !scaleDebt.has(f));
if (scaleNew.length) {
  fails++;
  for (const f of scaleNew) console.error(receipt("breakpoints", f, "transform:scale outside exempt list", "use intrinsic sizing"));
}
console.log(`  scale: ${violations.scale.length} file(s) (debt: ${scaleDebt.size}; new: ${scaleNew.length})`);

process.exit(fails > 0 ? 1 : 0);
