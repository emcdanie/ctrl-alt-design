import { describe, it, expect } from "vitest";
import { relativeLuminance, contrastRatio, toHex, parseRgb } from "./dtcg";

/* The only unit tests in the repo (spec specs/audit-debt). Scope is the
   four PURE functions in dtcg.ts. The gate is the test suite for
   everything else; these four are logic the gate can only reach
   indirectly, through a browser, which is how the parseRgb bug below
   survived a green gate for a whole day. */

describe("relativeLuminance", () => {
  it("matches the WCAG reference values", () => {
    expect(relativeLuminance([0, 0, 0])).toBeCloseTo(0, 5);
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 5);
    /* mid grey #808080 is famously ~0.2159, not 0.5 */
    expect(relativeLuminance([128, 128, 128])).toBeCloseTo(0.2159, 3);
  });
});

describe("contrastRatio", () => {
  it("gives 21:1 for black on white", () => {
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 4);
  });
  it("is symmetric", () => {
    const a: [number, number, number] = [46, 41, 55];
    const b: [number, number, number] = [253, 252, 249];
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
  });
  it("gives 1:1 for a colour against itself", () => {
    expect(contrastRatio([90, 90, 90], [90, 90, 90])).toBeCloseTo(1, 10);
  });
});

describe("toHex", () => {
  it("pads single-digit channels", () => {
    expect(toHex([0, 0, 0])).toBe("#000000");
    expect(toHex([1, 2, 3])).toBe("#010203");
  });
  it("rounds fractional channels", () => {
    expect(toHex([45.6, 40.4, 55.5])).toBe("#2e2838");
  });
});

describe("parseRgb", () => {
  it("reads legacy rgb() and rgba()", () => {
    expect(parseRgb("rgb(46, 41, 55)")).toEqual([46, 41, 55]);
    expect(parseRgb("rgba(46, 41, 55, 0.5)")).toEqual([46, 41, 55]);
  });

  /* THE BUG the code review found, and the reason these tests exist.
     parseRgb regex-scraped the first three numbers with no regard for
     colour space, so color(srgb 0.29 0.34 0.47) came back as
     [0.29, 0.34, 0.47] and was read downstream as 0-255, i.e. near
     black. Both tokens the pipeline instrument reads happen to resolve
     to rgb() today, so it was latent, but --color-semantic-accent-subtle
     is already a color-mix(). The instrument would have displayed a
     confidently wrong contrast ratio on a page whose entire argument is
     that the number is real.

     Correct behaviour: refuse what it cannot interpret. */
  it("returns null for a colour space it cannot interpret", () => {
    expect(parseRgb("color(srgb 0.291137 0.342118 0.47898)")).toBeNull();
    expect(parseRgb("color(display-p3 0.2 0.3 0.4)")).toBeNull();
    expect(parseRgb("lab(52% 40 59)")).toBeNull();
    expect(parseRgb("oklch(0.7 0.1 200)")).toBeNull();
  });

  it("returns null for junk", () => {
    expect(parseRgb("")).toBeNull();
    expect(parseRgb("transparent")).toBeNull();
  });
});
