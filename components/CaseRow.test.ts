import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { CASES, HOME_CASES } from "../content/cases";

/* Home and /work list cases through the SAME component and the SAME data
   (W1 release, 22 Sep 2026). A static source check: the two pages import
   CaseRowList from components/CaseRow and their rows from content/cases,
   and nothing else renders a case card of its own. */
const read = (p: string) => readFileSync(p, "utf8");

describe("one case row", () => {
  for (const page of ["app/page.tsx", "app/work/page.tsx"]) {
    it(`${page} renders CaseRowList from components/CaseRow`, () => {
      const src = read(page);
      expect(src).toMatch(/import \{ CaseRowList \} from "@\/components\/CaseRow";/);
      expect(src).toMatch(/from "@\/content\/cases";/);
      expect(src).toMatch(/<CaseRowList rows=\{/);
      expect(src).not.toMatch(/CaseStudyCard|CaseCard/);
    });
  }

  it("Home shows the first three cases, in the /work order", () => {
    expect(HOME_CASES.map((c) => c.id)).toEqual(["drift", "booking", "theming"]);
    expect(HOME_CASES).toEqual(CASES.slice(0, 3));
  });
});
