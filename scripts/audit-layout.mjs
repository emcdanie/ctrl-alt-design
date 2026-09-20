/* Layout-system gate (specs/layout-system, 18 Sep 2026). Static, no
 * browser. Replaces the old per-route drift capture (not in the gate,
 * failing since July, checking a retired type ramp).
 *
 * 1. Every route is listed in ROUTES below. A page file that isn't
 *    listed fails, so a new page can't skip the layout system.
 * 2. A route marked "section" must render layout Section
 *    (components/layout/Section) and must not write a raw <section>.
 * 3. SectionHeader takes layout="stacked" (default) or "split", nothing
 *    else; no page reshapes .l-header with its own grid.
 *
 * A route is allowlisted for one of two reasons, and the reason string
 * says which: "pending" means it has not moved yet, "article" means it
 * is on the case-study article system instead and audit:visual owns it.
 * 4. No custom spacing in app/ or components/sections/: arbitrary
 *    Tailwind margin/padding (mt-[, py-[ ...) or inline margin/padding.
 *    Spacing comes from Section, SectionHeader and the tokens.
 *
 * Allowlisted routes carry their reason: "pending" means the route
 * moves onto the system in its own commit (the entry goes then);
 * "special" means a content layout that keeps its inner grid but
 * uses Section and the tokens for outer spacing. */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { receipt } from "./lib/receipt.mjs";

const PENDING = "pending: moves onto Section + SectionHeader in its own commit";
/* The case-study route is an ARTICLE, not a page of Sections: hero, then
   CaseSections, then the close. It is on a system, just a different one,
   and audit:visual polices that one (the article template law: a text
   column plus exactly one named, captioned ExampleFrame, alternation,
   one screen per section). Elleta, 20 Sep 2026, once all three cases
   moved over. */
const ARTICLE = "article: CaseSection + ExampleFrame, enforced by audit:visual";

/* file -> "section" | { allow: reason } */
const ROUTES = {
  "app/about/page.tsx": "section",
  "app/page.tsx": "section",
  "app/contact/page.tsx": "section",
  "app/quick/page.tsx": "section",
  "app/design-system/page.tsx": { allow: PENDING },
  "app/design-system/inspector/page.tsx": { allow: PENDING },
  "app/learning/page.tsx": "section",
  "app/case-studies/[slug]/page.tsx": { allow: ARTICLE },
  "app/not-found.tsx": "section",
  "app/privacy/page.tsx": "section",
  "app/accessibility/page.tsx": "section",
  "app/work/page.tsx": "section",
  "app/work/studies/[slug]/page.tsx": "section",
};

const SPACING_DIRS = ["app", "components/sections"];
const ARBITRARY = /(?<![\w-])-?(?:m|p)[trblxyse]?-\[/;
const INLINE = /style=\{\{[^}]*\b(?:margin|padding)\w*\s*:/;

let fails = 0;
const fail = (offender, got, expected) => {
  fails++;
  console.error(receipt("layout", offender, got, expected));
};

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const allowed = (file) => typeof ROUTES[file] === "object";

/* 1 + 2: routes */
const pages = [...walk("app").filter((f) => f.endsWith("/page.tsx")), "app/not-found.tsx"];
for (const file of pages) {
  const entry = ROUTES[file];
  if (!entry) {
    fail(file, "a route audit:layout doesn't list", 'an entry in ROUTES ("section", or an allowlist reason)');
    continue;
  }
  if (entry !== "section") continue;
  const src = readFileSync(file, "utf8");
  if (!src.includes('from "@/components/layout/Section"'))
    fail(file, "no layout Section", "sections built with components/layout/Section");
  const raw = src.match(/<section\b/g)?.length ?? 0;
  if (raw) fail(file, `${raw} raw <section>`, "<Section> from components/layout");
}
for (const file of Object.keys(ROUTES))
  if (!existsSync(file)) fail(file, "listed but missing", "delete the entry with the route");

/* 3: SectionHeader layouts */
const LAYOUTS = new Set(["split", "stacked"]);
for (const file of [...walk("app"), ...walk("components")].filter((f) => /\.(tsx|jsx)$/.test(f))) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/<SectionHeader\b[^>]*?\blayout=(?:"([^"]*)"|\{([^}]*)\})/g)) {
    const v = m[1] ?? m[2];
    if (!LAYOUTS.has(v)) fail(file, `SectionHeader layout=${v}`, 'layout="split" or layout="stacked"');
  }
}
/* only the layout CSS in app/globals.css may shape .l-header */
for (const file of [...walk("app"), ...walk("components")].filter((f) => f.endsWith(".css") && f !== "app/globals.css")) {
  if (/\.l-header[^{]*\{[^}]*grid-template-columns/.test(readFileSync(file, "utf8")))
    fail(file, "a stylesheet reshaping .l-header", "SectionHeader's layout prop");
}

/* 4: custom spacing */
for (const dir of SPACING_DIRS) {
  if (!existsSync(dir)) continue;
  for (const file of walk(dir).filter((f) => /\.(tsx|ts|jsx)$/.test(f))) {
    if (allowed(file)) continue;
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (ARBITRARY.test(line)) fail(`${file}:${i + 1}`, "an arbitrary margin/padding class", "spacing from Section, SectionHeader and the tokens");
        if (INLINE.test(line)) fail(`${file}:${i + 1}`, "inline margin/padding", "spacing from Section, SectionHeader and the tokens");
      });
  }
}

const pending = Object.values(ROUTES).filter((e) => typeof e === "object" && e.allow === PENDING).length;
const article = Object.values(ROUTES).filter((e) => typeof e === "object" && e.allow === ARTICLE).length;
if (fails) {
  console.error(`layout gate: ${fails} failure(s)`);
  process.exit(1);
}
console.log(`layout gate: PASS (${pages.length} routes, ${pages.length - pending - article} on the Section system, ${article} on the article system, ${pending} still pending)`);
