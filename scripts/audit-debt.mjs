/* Debt gate (spec specs/audit-debt, Elleta 2026-07-27).
 *
 * The other fifteen audits prove the code obeys the system's rules.
 * NONE of them ask whether the codebase is still earning its weight. In
 * one day a 678-line component was deleted, roughly a thousand lines of
 * CSS arrived, and four separate pieces of known debt shipped green.
 *
 * Static analysis only, no browser, so this is seconds where the
 * browser audits are minutes.
 *
 * Checks, in the order they ship (highest confidence first):
 *   1. BROKEN REFERENCES: a docs/ or specs/ markdown file citing a repo
 *      path that does not exist.
 *   2. DERIVED LISTS: the System page's gate table must agree with the
 *      audits the gate script actually runs. The COUNT is already
 *      derived; the LIST was hand-maintained, which is the same bug
 *      half-fixed.
 *   3. ORPHANED TOKENS: a custom property nothing consumes through a
 *      var() chain. "Consumed" means referenced by a var() in app/ or
 *      components/. Being serialised into /api/bella.json does NOT
 *      count: the manifest serialises every token, so if that counted,
 *      nothing would ever be orphaned and this check would be theatre.
 *   4. DEAD SELECTORS: an audit script tracking a selector that matches
 *      nothing must fail loudly. audit:visual tracked .ds-gate after it
 *      became a table and kept "passing".
 *
 * Exemptions live in ONE file, scripts/lib/debt-allowlist.json, each
 * with a reason and a date, capped and staleness-checked. The count
 * prints on every run. */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, extname } from "node:path";
import { receipt } from "./lib/receipt.mjs";

let fails = 0;
const fail = (offender, got, expected) => {
  fails++;
  console.error(receipt("debt", offender, got, expected));
};

const walk = (dir, exts, out = []) => {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === ".next" || e.startsWith(".")) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, exts, out);
    else if (exts.includes(extname(p))) out.push(p);
  }
  return out;
};

/* ── the allowlist, loaded and policed before anything uses it ── */
const ALLOW_PATH = "scripts/lib/debt-allowlist.json";
const allow = JSON.parse(readFileSync(ALLOW_PATH, "utf8"));
const allowed = new Set();
{
  const now = Date.now();
  const DAY = 86400000;
  for (const e of allow.entries) {
    if (!e.id || !e.reason || !e.reason.trim()) {
      fail(`${ALLOW_PATH} entry ${e.id ?? "(unnamed)"}`, "no written reason", "a reason for every exception");
      continue;
    }
    if (!e.date || Number.isNaN(Date.parse(e.date))) {
      fail(`${ALLOW_PATH} entry ${e.id}`, "no valid date", "an ISO date on every exception");
      continue;
    }
    const age = Math.floor((now - Date.parse(e.date)) / DAY);
    if (age > allow.staleAfterDays) {
      fail(`${ALLOW_PATH} entry ${e.id}`, `${age} days old`, `re-dated within ${allow.staleAfterDays} days, or removed`);
      continue;
    }
    allowed.add(e.id);
  }
  if (allow.entries.length > allow.maxEntries) {
    fail(ALLOW_PATH, `${allow.entries.length} entries`, `at most ${allow.maxEntries} (an uncapped allowlist is the hole section 9 bans)`);
  }
}

/* ── 1. BROKEN INTERNAL REFERENCES ──
   Every repo-relative path cited in a markdown doc must exist. Catches
   a spec citing a proto that was never committed. URLs, globs and
   <placeholder> syntax are ignored: only strings that look like real
   repo paths are checked. */
{
  /* SCOPE: docs/ and the constitution only. SPECS ARE EXCLUDED BY
     DESIGN: a spec legitimately cites files that do not exist yet
     (planned work) or that it is flagging AS missing, which is the
     spec doing its job. Checking them would fight their purpose and
     make the check noise. docs/ describes what IS. */
  const ROOTS = ["docs"];
  const files = [...ROOTS.flatMap((r) => walk(r, [".md"])), ...(existsSync("CLAUDE.md") ? ["CLAUDE.md"] : [])];
  const TOP = new Set(readdirSync(".").filter((e) => statSync(e).isDirectory() && !e.startsWith(".")));
  /* a path candidate: backticked, contains a slash, no glob/placeholder,
     not a URL, and rooted at a real top-level directory */
  const CAND = /`([^`\s]+\/[^`\s]*)`/g;
  const misses = [];
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    const seen = new Set();
    for (const m of src.matchAll(CAND)) {
      let p = m[1];
      if (/^https?:|^mailto:|[*?<>{}]/.test(p)) continue;
      p = p.replace(/[).,:;]+$/, "");
      /* a citation may carry a line reference: globals.css:66 or
         page.tsx:142,150 or globals.css:97-107. Strip it, the file is
         the thing being checked. */
      p = p.replace(/:[0-9][0-9,\-]*$/, "");
      const top = p.split("/")[0];
      if (!TOP.has(top)) continue;
      /* a directory reference is fine; so is a file */
      if (seen.has(p) || existsSync(p)) continue;
      if (allowed.has(`refs:${f}`)) continue;
      seen.add(p);
      misses.push([f, p]);
    }
  }

  /* GITIGNORED PATHS ARE DELIBERATELY ABSENT, NOT ROTTED (28 Jul).
     This check read the working tree, so it answered differently on a
     laptop than in CI: local-only material (the proto folder, the
     prototypes, the ignored IA spec) exists on the machine that wrote
     the citation and never exists in a clean checkout. It passed here
     and failed there on the identical commit, which makes the audit a
     coin toss rather than a check.

     .gitignore is committed, so asking git is the one question both
     environments answer the same way. A path the repo deliberately does
     not carry is not rot; a path nothing ignores and nothing provides
     still is. */
  const ignored = new Set();
  if (misses.length) {
    try {
      const out = execFileSync("git", ["check-ignore", "--stdin"], {
        input: misses.map(([, p]) => p).join("\n"),
        encoding: "utf8",
      });
      for (const line of out.split("\n")) if (line.trim()) ignored.add(line.trim());
    } catch (e) {
      /* exit 1 means "none of them are ignored", which is not an error.
         Anything else (no git, no repo) leaves the set empty, so every
         miss is reported: a check that cannot verify must fail loudly,
         never pass quietly. */
      if (e.status !== 1) {
        console.error("debt: git check-ignore unavailable, reporting every missing citation");
      }
    }
  }
  for (const [f, p] of misses) {
    if (ignored.has(p)) continue;
    fail(`${f} cites ${p}`, "a path that does not exist", "a real file or directory, or no citation");
  }
}

/* ── 2. DERIVED LISTS ──
   The System page renders a table of the gate's audits. The COUNT comes
   from lib/bella/gate.ts, derived from package.json. The LIST was typed
   by hand, so the table can silently describe a gate that no longer
   exists. Assert both directions. */
{
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const real = [...new Set([...(pkg.scripts?.gate ?? "").matchAll(/audit:[a-z]+/g)].map((m) => m[0]))];
  const SPINE = "components/BellaSpine.tsx";
  if (existsSync(SPINE)) {
    const src = readFileSync(SPINE, "utf8");
    const listed = [...new Set([...src.matchAll(/name:\s*"(audit:[a-z]+)"/g)].map((m) => m[1]))];
    for (const a of real) {
      if (!listed.includes(a)) fail(`${SPINE} gate table`, `no row for ${a}, which the gate runs`, "one row per audit the gate actually runs");
    }
    for (const a of listed) {
      if (!real.includes(a)) fail(`${SPINE} gate table`, `a row for ${a}, which the gate does NOT run`, "only audits the gate actually runs");
    }
  }
}

/* ── 3. ORPHANED TOKENS ──
   Consumed = referenced by a var() in app/ or components/, directly or
   through an alias chain (--a: var(--b) consumes --b; so does
   color-mix(... var(--x) ...)). Resolved transitively until the set
   stops growing. Counts are derived and printed, never typed. */
let tokenReport = "";
{
  /* SCOPE, and this is the whole judgement of the check.
     lib/bella/bella.css is GENERATED from tokens/*.json and is BELLA's
     published foundation: primitives exist because the system exports
     them, not because this site happens to consume them. Judging them
     as orphans reports 230 of 467, which is not a finding, it is a
     mis-scoped detector.
     The APP LAYER (app/globals.css) is different: we author it by hand,
     for this site, and a token we add and never use is genuine dead
     weight. The check judges the app layer and READS the foundation so
     alias chains still resolve into it. */
  const AUTHORED = "app/globals.css";
  const CSS_SOURCES = ["lib/bella/bella.css", AUTHORED];
  /* @theme blocks are OUT OF SCOPE, and this is a detector limit, not
     an exemption: Tailwind generates utility classes from @theme
     tokens (--color-cream becomes bg-cream), so they are consumed by
     class name, not by var(). This check reads var() and cannot see
     that. Judging them would report live design tokens as dead. If the
     check ever learns Tailwind's generation, widen this. */
  const authoredSrc = readFileSync(AUTHORED, "utf8");
  const themeRanges = [];
  for (const m of authoredSrc.matchAll(/@theme[^{]*\{/g)) {
    let depth = 1, i = m.index + m[0].length;
    while (i < authoredSrc.length && depth > 0) {
      if (authoredSrc[i] === "{") depth++;
      else if (authoredSrc[i] === "}") depth--;
      i++;
    }
    themeRanges.push([m.index, i]);
  }
  const inTheme = (idx) => themeRanges.some(([a, b]) => idx >= a && idx < b);
  /* a name declared in ANY @theme block is a Tailwind token wherever
     else it is redefined (the dark block overrides many of them), so
     exclude the NAME, not just that one declaration */
  const themeNames = new Set();
  for (const m of authoredSrc.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)) {
    if (inTheme(m.index)) themeNames.add(m[1]);
  }
  const authoredNames = new Set();
  for (const m of authoredSrc.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)) {
    if (!inTheme(m.index) && !themeNames.has(m[1])) authoredNames.add(m[1]);
  }
  /* every token definition, and the var()s its own value references */
  const defs = new Map();
  for (const f of CSS_SOURCES) {
    for (const m of readFileSync(f, "utf8").matchAll(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gim)) {
      const name = m[1];
      const refs = [...m[2].matchAll(/var\((--[a-z0-9-]+)/g)].map((x) => x[1]);
      if (!defs.has(name)) defs.set(name, new Set());
      refs.forEach((r) => defs.get(name).add(r));
    }
  }
  /* the roots: every var() used by real code, CSS or TSX */
  /* lib/ MUST be scanned: workLibrary.ts holds the case identity
     colours as var() strings, so omitting it reported live tokens as
     orphans. Found by verifying the first run instead of trusting it. */
  const consumers = [
    ...walk("app", [".tsx", ".ts", ".css"]),
    ...walk("components", [".tsx", ".ts", ".css"]),
    ...walk("lib", [".tsx", ".ts", ".css"]),
  ];
  const live = new Set();
  for (const f of consumers) {
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(/var\((--[a-z0-9-]+)/g)) live.add(m[1]);
    /* custom properties written from JS as inline style keys */
    for (const m of src.matchAll(/"(--[a-z0-9-]+)"\s*:/g)) live.add(m[1]);
  }
  /* walk the alias chains until closed */
  let grew = true;
  while (grew) {
    grew = false;
    for (const t of [...live]) {
      for (const r of defs.get(t) ?? []) {
        if (!live.has(r)) { live.add(r); grew = true; }
      }
    }
  }
  const orphans = [...authoredNames].filter((t) => !live.has(t) && !allowed.has(`token:${t}`));
  const shadow = [...defs.keys()].filter((t) => t.startsWith("--shadow")).length;
  tokenReport = `${defs.size} tokens (${shadow} shadow), ${authoredNames.size} authored, ${orphans.length} orphaned`;
  for (const t of orphans.slice(0, 40)) {
    fail(`${t}`, "defined but consumed by no var() in app/, components/ or lib/", "a consumer, deletion, or an allowlist entry with a reason");
  }
  if (orphans.length > 40) {
    fail("token sweep", `${orphans.length} orphaned tokens (first 40 shown)`, "zero orphaned tokens");
  }
}

/* ── 4. DEAD SELECTORS IN THE AUDIT SCRIPTS ──
   An audit that tracks a selector matching nothing keeps "passing"
   forever. audit:visual tracked .ds-gate after the gate became a table.
   The browser audits export TRACKED_SELECTORS; this asserts each is
   declared, and audit:visual asserts at runtime that each matches. */
{
  const DECLARING = ["scripts/audit-visual.mjs", "scripts/audit-type.mjs", "scripts/contrast-check.mjs"];
  for (const f of DECLARING) {
    if (!existsSync(f)) continue;
    const src = readFileSync(f, "utf8");
    if (!/export const TRACKED_SELECTORS/.test(src)) {
      fail(f, "no exported TRACKED_SELECTORS", "each browser audit declares the selectors it tracks so a dead one can fail loudly");
    }
  }
}

const suffix = `${allow.entries.length} allowlisted`;
if (fails > 0) {
  console.error(`debt gate: ${fails} failure(s) (${tokenReport}, ${suffix})`);
  process.exit(1);
}
console.log(`debt gate: PASS (${tokenReport}, ${suffix})`);
