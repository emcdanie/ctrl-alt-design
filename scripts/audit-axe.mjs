/* Accessibility gate (a11y pass, Elleta 21 Jul 2026): axe-core against
 * every route in BOTH themes; ZERO violations to pass. This is the
 * blind spot that let the readiness-map contrast fail ship: the
 * contrast audit samples key surfaces, axe checks every node and every
 * rule. "Incomplete" results (axe cannot auto-judge, e.g. text over
 * gradients) do not fail the gate; they are counted in the output and
 * verified manually when they change (see _review/audit notes). */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const axeSource = readFileSync("node_modules/axe-core/axe.min.js", "utf8");

const ROUTES = [
  "/",
  "/work",
  "/work?view=map",
  "/work?view=table",
  "/about",
  "/contact",
  "/skills",
  "/design-system",
  "/design-system/inspector",
  "/quick",
  "/case-studies/chip",
  "/case-studies/brad-frost",
  "/case-studies/design-system-transformation",
];

const browser = await chromium.launch();
let fails = 0;
let incompleteTotal = 0;

for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
  for (const route of ROUTES) {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle", timeout: 30000 });
    /* sweep so FadeIn content is visible to the contrast checks */
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 800) {
      await page.evaluate((v) => scrollTo(0, v), y);
      await page.waitForTimeout(30);
    }
    await page.evaluate(axeSource);
    const res = await page.evaluate(async () => {
      const r = await axe.run(document);
      return {
        violations: r.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target[0]),
        })),
        incomplete: r.incomplete.reduce((a, v) => a + v.nodes.length, 0),
      };
    });
    incompleteTotal += res.incomplete;
    for (const v of res.violations) {
      fails += v.nodes.length;
      console.error(`AXE FAIL [${theme}] ${route} ${v.id} (${v.impact}): ${v.nodes.join(", ")}`);
    }
  }
  await ctx.close();
}
await browser.close();

if (fails > 0) {
  console.error(`axe gate: ${fails} violation node(s)`);
  process.exit(1);
}
console.log(`axe gate: PASS (0 violations, ${ROUTES.length} routes x 2 themes; ${incompleteTotal} needs-review nodes recorded, not failures)`);
