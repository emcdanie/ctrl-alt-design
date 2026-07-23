/* FOR AI (2026-07-17): generates public/llms.txt from the SAME registry
 * the site renders from (lib/content + lib/workLibrary compiled via a
 * lightweight extraction), so the agent surface cannot drift from the
 * real routes. Run via prebuild and checked by audit:agents. */
import { readFileSync, writeFileSync } from "node:fs";

// extract case registry without a TS runtime: slugs + titles + summaries
// (curation, Elleta 22 Jul 2026: three star cases; archived cases live
// in content/case-studies/_archive/ and never reach the agent surface)
const files = ["chip", "brad-frost", "design-system-transformation"];
const cases = files.map((f) => {
  const src = readFileSync(`content/case-studies/${f}.ts`, "utf8");
  const slug = src.match(/slug: "([^"]+)"/)[1];
  const title = src.match(/title: "([^"]+)"/)[1];
  const desc = (src.match(/description:\s*\n?\s*"([^"]+)"/) ?? [null, title])[1];
  return { slug, title, desc };
});

const txt = `# Elleta McDaniel, elleta.design

Product Designer specialising in AI-enabled design systems for complex,
multi-role B2B and enterprise products. This site is its own small design
system (BELLA): tokens, one control taxonomy, and a governance gate.

Positioning term: AI-enabled (never "AI-augmented" or "AI-assisted").

## Case studies
${cases.map((c) => c.desc && c.desc !== c.title ? `- /case-studies/${c.slug} : ${c.title}${/[.!?]$/.test(c.title) ? "" : "."} ${c.desc}` : `- /case-studies/${c.slug} : ${c.title}`).join("\n")}

## The system
- /design-system : BELLA inspecting itself, live token values, control taxonomy, the gate.
- /api/bella.json : machine-readable manifest (tokens, taxonomy, cases, rules). Read-only.
- /skills : skill overlap mapped to the work.
- /work : the library (curated default, ?explore for map/table/filters).

## Contact
- /contact : the contact form is the channel (no plaintext email anywhere, by design).
- /about : who she is and how she thinks (#how-i-think).

Generated from the live route registry at build time; audit:agents fails
the build if this file and the registry disagree.
`;
writeFileSync("public/llms.txt", txt);
console.log("llms.txt generated:", cases.length, "cases");
