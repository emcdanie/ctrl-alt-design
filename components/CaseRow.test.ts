import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { CASES, HOME_CASES, HOME_LEAD } from "../content/cases";

/* Home and /work list cases through the SAME component and the SAME data
   (W1 release, 22 Sep 2026). A static source check: the two pages import
   CaseRowList from components/CaseRow and their rows from content/cases,
   and nothing else renders a case card of its own. */
const read = (p: string) => readFileSync(p, "utf8");

describe("one case row", () => {
  for (const page of ["app/work/page.tsx"]) {
    it(`${page} renders CaseRowList from components/CaseRow`, () => {
      const src = read(page);
      expect(src).toMatch(/import \{ CaseRowList \} from "@\/components\/CaseRow";/);
      expect(src).toMatch(/from "@\/content\/cases";/);
      expect(src).toMatch(/<CaseRowList rows=\{/);
      expect(src).not.toMatch(/CaseStudyCard|CaseCard/);
    });
  }

  /* Home · v2 (Gate 2, 3 Oct 2026): the same CaseRow in its featured
     and card layouts, rows from content/cases */
  it("app/page.tsx renders CaseRow from components/CaseRow", () => {
    const src = read("app/page.tsx");
    expect(src).toMatch(/import CaseRow from "@\/components\/CaseRow";/);
    expect(src).toMatch(/import \{ HOME_LEAD \} from "@\/content\/cases";/);
    expect(src).not.toMatch(/CaseStudyCard|CaseCard/);
  });

  it("Home leads with Drift, Federated, CHIP", () => {
    expect(HOME_LEAD.map((c) => c.id)).toEqual(["drift", "federated", "chip"]);
  });

  it("/quick shows the first three cases, in the /work order", () => {
    expect(HOME_CASES.map((c) => c.id)).toEqual(["drift", "booking", "theming"]);
    expect(HOME_CASES).toEqual(CASES.slice(0, 3));
  });
});
