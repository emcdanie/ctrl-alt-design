/* Contract gate (bella-component-contract spec, 23 Jul 2026): the
 * system refuses a contract that lies. The component contract
 * (lib/bella/component-contract.json, served through /api/bella.json)
 * must describe REAL code:
 *   1. every entry's source file exists in components/
 *   2. every token $ref ({--name}) resolves in the token layer
 *      (app/globals.css or lib/bella/bella.css)
 *   3. every prop name and variant name appears in the source file
 *      (no invented props, no invented variants)
 * Failures print the A1 receipt; exit codes match the other audits. */
import { readFileSync, existsSync } from "node:fs";
import { receipt } from "./lib/receipt.mjs";

let fails = 0;
const fail = (offender, got, expected) => {
  fails++;
  console.error(receipt("contract", offender, got, expected));
};

const contract = JSON.parse(readFileSync("lib/bella/component-contract.json", "utf8"));

/* the token layer: every defined custom property */
const defined = new Set();
for (const file of ["app/globals.css", "lib/bella/bella.css"]) {
  for (const m of readFileSync(file, "utf8").matchAll(/(--[a-z0-9-]+)\s*:/gi)) {
    defined.add(m[1]);
  }
}
/* --cc is the per-card identity custom property, set inline by Card
   consumers (an API, not a stylesheet token) */
defined.add("--cc");

for (const c of contract.components) {
  /* 1. the component exists (no contract entry for deleted code) */
  if (!existsSync(c.source)) {
    fail(`contract entry "${c.name}"`, `source ${c.source} does not exist`, "a real component file (delete the entry with the component)");
    continue;
  }
  const src = readFileSync(c.source, "utf8");

  /* 2. every token $ref resolves */
  for (const ref of c.tokens ?? []) {
    const name = ref.replace(/[{}]/g, "");
    if (!defined.has(name)) {
      fail(`contract "${c.name}" token ${ref}`, "an unresolvable $ref", "a token defined in globals.css or bella.css");
    }
  }

  /* 3. props and variants are real (named in the source) */
  for (const p of c.props ?? []) {
    if (!src.includes(p.name)) {
      fail(`contract "${c.name}" prop "${p.name}"`, "not present in the source", `a prop named in ${c.source}`);
    }
  }
  for (const v of c.variants ?? []) {
    /* the variant's key term must appear in the source (first word) */
    const key = v.name.split(" ")[0];
    if (!new RegExp(key, "i").test(src)) {
      fail(`contract "${c.name}" variant "${v.name}"`, "not present in the source", `a variant keyed in ${c.source}`);
    }
  }
}

console.log(fails === 0 ? `contract gate: PASS (${contract.components.length} components, real)` : `contract gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
