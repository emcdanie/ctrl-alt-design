import { readFileSync } from "node:fs";
import { join } from "node:path";

/* The audit count, DERIVED (2026-07-27, spec system-page-redesign).
 *
 * The number was typed into four surfaces and had gone stale in all of
 * them: the page intro, the status card and the gate section all said
 * "thirteen" and the maturity map said "a 13-audit gate" while the gate
 * actually ran fifteen. A number that lives in four places drifts in
 * four places. It now comes from the ONE source of truth, the gate
 * script in package.json, so adding an audit moves every surface.
 *
 * Server-only: called from the page (a server component) and passed
 * down as a prop. */

export function auditNames(): string[] {
  const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
  const gate: string = pkg.scripts?.gate ?? "";
  return [...new Set([...gate.matchAll(/audit:[a-z]+/g)].map((m) => m[0]))];
}

export function auditCount(): number {
  return auditNames().length;
}

/* Where each audit LIVES, derived from the same package.json entry that
 * runs it (28 Jul, the gate explorer). The explorer states the file for
 * every check, and a typed list of sixteen paths is sixteen chances to
 * be wrong the next time a script is renamed. Reading the script body
 * means the page cannot claim a file the gate does not run.
 *
 * An audit may run more than one script (audit:agents generates the
 * surfaces, then checks them), so this returns all of them in order. */
export function auditFiles(): Record<string, string[]> {
  const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
  const scripts: Record<string, string> = pkg.scripts ?? {};
  const out: Record<string, string[]> = {};
  for (const name of auditNames()) {
    const body = scripts[name] ?? "";
    out[name] = [...body.matchAll(/scripts\/[A-Za-z0-9._-]+\.mjs/g)].map((m) => m[0]);
  }
  return out;
}

/* Spelled out for prose, so a sentence reads as a sentence. Falls back
 * to the digits past the range we would ever plausibly reach. */
const WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen", "twenty",
];

export function spellCount(n: number): string {
  return WORDS[n] ?? String(n);
}
