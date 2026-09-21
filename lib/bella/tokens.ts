import { readFileSync } from "node:fs";
import { dtcgToken, type DtcgGroup } from "./dtcg";
import { join } from "node:path";

/* The token reader, extracted (2026-07-27, spec system-contract-visible)
 * from app/api/bella.json/route.ts so the served manifest and the
 * System page count the SAME tokens from the SAME files. One function,
 * two consumers, so the visible count cannot drift from the endpoint.
 * Behaviour is unchanged from the route: this is a move, not a rewrite. */

/* The DTCG shaping lives in ./dtcg.ts so the browser can run the same
 * function (the pipeline instrument's MANIFEST stage). Re-exported here
 * so existing server callers keep one import site. */
export { dtcgToken } from "./dtcg";
export type { DtcgToken, DtcgGroup } from "./dtcg";

export const TOKEN_SOURCES = ["lib/bella/bella.css", "app/globals.css"] as const;

export function readTokens(): { primitive: DtcgGroup; semantic: DtcgGroup; component: DtcgGroup } {
  const primitive: DtcgGroup = {};
  const semantic: DtcgGroup = {};
  const component: DtcgGroup = {};
  const place = (file: string, name: string, value: string) => {
    /* Tailwind @theme passthroughs (--x: var(--x)) are plumbing, not
       definitions; the unlayered :root value is the real one */
    if (value === `var(${name})`) return;
    const t = dtcgToken(value);
    if (name.startsWith("--color-semantic-")) semantic[name] ??= t;
    else if (name.startsWith("--component-") || file === "app/globals.css") component[name] ??= t;
    else primitive[name] ??= t;
  };
  for (const file of TOKEN_SOURCES) {
    const css = readFileSync(join(process.cwd(), file), "utf8");
    for (const m of css.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);/gim)) {
      place(file, m[1], m[2].trim());
    }
  }
  return { primitive, semantic, component };
}

/* The frame tokens every page shares (O.10, 21 Sep 2026, after
 * southleft.com/tokens.json): the numbers audit:frame holds every route
 * to, read from the same stylesheets, so the published frame is the
 * enforced one. */
const FRAME = {
  container: "--layout-max",
  gutter: "--layout-gutter",
  sectionRhythm: "--section-pad-y",
  titleMeasure: "--measure-title",
  proseMeasure: "--measure-body",
  radii: { small: "--radius-sm", inset: "--radius-md", control: "--radius-lg", card: "--radius-card", pill: "--radius-pill" },
} as const;

export function readFrame() {
  const { primitive, semantic, component } = readTokens();
  const all = { ...primitive, ...semantic, ...component };
  const pick = (name: string) => ({ token: name, ...all[name] });
  const { radii, ...rest } = FRAME;
  return {
    ...Object.fromEntries(Object.entries(rest).map(([k, n]) => [k, pick(n)])),
    radii: Object.fromEntries(Object.entries(radii).map(([k, n]) => [k, pick(n)])),
    enforcedBy: "audit:frame",
  };
}

/* The counts the System page renders. Derived, never typed: the beat
 * describes the pipeline, so its numbers must come out of the pipeline. */
export function tokenCounts() {
  const { primitive, semantic, component } = readTokens();
  const counts = {
    primitive: Object.keys(primitive).length,
    semantic: Object.keys(semantic).length,
    component: Object.keys(component).length,
    total: 0,
  };
  counts.total = counts.primitive + counts.semantic + counts.component;
  return counts;
}
