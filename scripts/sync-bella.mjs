/* sync:bella — the copy-sync consumer model (Elleta, 2026-07-30: copy-sync,
 * not npm publish). BELLA is the source of truth; this repo vendors built
 * artifacts and pins them by hash.
 *
 * Two modes, one file:
 *   node scripts/sync-bella.mjs           pull from BELLA, rewrite the manifest
 *   node scripts/sync-bella.mjs --check    verify the vendored copy is unedited
 *
 * --check is what runs in the gate. It hashes every vendored file and compares
 * against lib/bella/sync-manifest.json, so a hand-edited or half-synced copy
 * fails locally instead of drifting silently. When the BELLA checkout is
 * present it also re-hashes upstream, which catches a stale vendored copy;
 * without it (CI) the manifest check still holds.
 *
 * Vendored files are DO NOT EDIT. A fix belongs upstream in BELLA, then a sync.
 */
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";

const BELLA = process.env.BELLA_SRC || join(process.env.HOME, "DEV/bella");
const MANIFEST = "lib/bella/sync-manifest.json";
const check = process.argv.includes("--check");

/* What this repo consumes from BELLA. Tokens first, then the components that
 * have been swapped. Add a line per component as the Phase 3 swaps land. */
const FILES = [
  { from: "tokens/bella.css", to: "lib/bella/bella.css" },
  { from: "src/components/Card/Card.tsx", to: "components/bella/Card/Card.tsx" },
  { from: "src/components/Card/Card.module.css", to: "components/bella/Card/Card.module.css" },
  { from: "src/components/shared/Trace.module.css", to: "components/bella/shared/Trace.module.css" },
];

const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const short = (h) => h.slice(0, 12);

if (check) {
  if (!existsSync(MANIFEST)) {
    console.error(`sync gate: ${MANIFEST} is missing. Run npm run sync:bella.`);
    process.exit(1);
  }
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
  const upstreamAvailable = existsSync(BELLA);
  let fails = 0;

  for (const { from, to } of FILES) {
    const recorded = manifest.files[to];
    if (!recorded) {
      console.error(`sync gate: ${to} is vendored but not in the manifest`);
      fails++;
      continue;
    }
    if (!existsSync(to)) {
      console.error(`sync gate: ${to} is in the manifest but missing from the tree`);
      fails++;
      continue;
    }
    const actual = sha(to);
    if (actual !== recorded) {
      console.error(
        `sync gate: ${to} was edited in place\n  vendored ${short(actual)}, manifest ${short(recorded)}\n  expected: an unedited copy. Fix it upstream in BELLA, then npm run sync:bella.`,
      );
      fails++;
      continue;
    }
    if (upstreamAvailable) {
      const src = join(BELLA, from);
      if (!existsSync(src)) {
        console.error(`sync gate: upstream ${from} no longer exists in BELLA`);
        fails++;
        continue;
      }
      const up = sha(src);
      if (up !== actual) {
        console.error(
          `sync gate: ${to} is STALE against BELLA\n  vendored ${short(actual)}, upstream ${short(up)}\n  expected: a current copy. Run npm run sync:bella and review the diff.`,
        );
        fails++;
      }
    }
  }

  const files = Object.keys(manifest.files);
  for (const to of files) {
    if (!FILES.some((f) => f.to === to)) {
      console.error(`sync gate: manifest lists ${to}, which this script no longer syncs`);
      fails++;
    }
  }

  if (fails) {
    console.log(`sync gate: ${fails} failure(s)`);
    process.exit(1);
  }
  console.log(
    `sync gate: PASS (${files.length} vendored file(s) at bella ${manifest.bella.version}, ${short(manifest.bella.commit)}${upstreamAvailable ? ", verified against upstream" : ", manifest only, no BELLA checkout"})`,
  );
  process.exit(0);
}

/* ---- sync mode ---- */
if (!existsSync(BELLA)) {
  console.error(`sync:bella: no BELLA checkout at ${BELLA}. Set BELLA_SRC.`);
  process.exit(1);
}

const git = (...args) => execFileSync("git", ["-C", BELLA, ...args], { encoding: "utf8" }).trim();
const version = JSON.parse(readFileSync(join(BELLA, "package.json"), "utf8")).version;
const commit = git("rev-parse", "HEAD");
if (git("status", "--porcelain")) {
  console.error("sync:bella: the BELLA checkout has uncommitted changes. Commit or stash there first, so the pinned commit describes what was synced.");
  process.exit(1);
}

const manifest = { bella: { version, commit, describe: git("describe", "--tags"), syncedFrom: "https://github.com/emcdanie/bella" }, files: {} };
for (const { from, to } of FILES) {
  const src = join(BELLA, from);
  if (!existsSync(src)) {
    console.error(`sync:bella: upstream ${from} does not exist`);
    process.exit(1);
  }
  mkdirSync(dirname(to), { recursive: true });
  const before = existsSync(to) ? sha(to) : null;
  copyFileSync(src, to);
  const after = sha(to);
  manifest.files[to] = after;
  console.log(`${before === after ? "  same" : before ? "UPDATED" : "    new"}  ${to}  ${short(after)}`);
}
writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\nsync:bella: ${FILES.length} file(s) at bella ${version} (${short(commit)}). Vendored files are DO NOT EDIT; fix upstream and re-sync.`);
