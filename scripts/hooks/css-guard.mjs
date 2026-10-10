#!/usr/bin/env node
/* css-guard.mjs — Claude Code PostToolUse hook for .css edits.
 * Reads the hook JSON from stdin. If the edited file is not .css: exit 0.
 * If it IS .css: runs audit:breakpoints (static, no browser) on that file only.
 * If violations INCREASED above debt: exits 2 with the message on stderr.
 * The hook is NOT yet turned on — Elleta must OK the settings.json block below.
 *
 * settings.json block (do not add without Elleta's OK):
 * {
 *   "hooks": {
 *     "PostToolUse": [
 *       {
 *         "matcher": "Edit|Write|MultiEdit",
 *         "hooks": [
 *           {
 *             "type": "command",
 *             "command": "node scripts/hooks/css-guard.mjs"
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * }
 */

import { readFileSync, existsSync } from "node:fs";
import { relative } from "node:path";

let raw = "";
try {
  raw = readFileSync("/dev/stdin", "utf8");
} catch {
  process.exit(0);
}

let hook;
try {
  hook = JSON.parse(raw);
} catch {
  process.exit(0);
}

const filePath = hook?.tool_input?.file_path ?? hook?.input?.file_path ?? "";
if (!filePath.endsWith(".css")) process.exit(0);

/* Run audit:breakpoints restricted to this file */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

/* Inline the relevant checks rather than spawning a subprocess,
 * so this stays fast and doesn't need a shell round-trip. */
const DEBT_PATH = "scripts/lib/breakpoint-debt.json";
const ALLOWED_PX = new Set([640, 768, 1024, 1440]);
const ALLOWED_REM = new Set([40, 48, 64, 90]);

function checkBreakpoints(src) {
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

if (!existsSync(filePath)) process.exit(0);

const rel = relative(process.cwd(), filePath).replace(/\\/g, "/");
const src = readFileSync(filePath, "utf8");
const bad = checkBreakpoints(src);

if (bad.length === 0) process.exit(0);

const debt = existsSync(DEBT_PATH)
  ? JSON.parse(readFileSync(DEBT_PATH, "utf8"))
  : { breakpoints: {} };
const knownCount = (debt.breakpoints?.[rel] ?? []).length;

if (bad.length > knownCount) {
  const extra = bad.filter((v) => !(debt.breakpoints?.[rel] ?? []).includes(v));
  process.stderr.write(
    `css-guard: ${rel} — ${bad.length} stray breakpoint(s), ${extra.length} new: ${extra.join(", ")}\n` +
    `Only ${ALLOWED_PX.size + ALLOWED_REM.size} breakpoints allowed: ${[...ALLOWED_PX].join(", ")}px + ${[...ALLOWED_REM].join(", ")}rem\n`
  );
  process.exit(2);
}

process.exit(0);
