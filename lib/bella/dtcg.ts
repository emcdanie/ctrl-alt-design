/* The DTCG shaping function, isolated (2026-07-27, spec
 * system-page-redesign).
 *
 * It lives apart from lib/bella/tokens.ts because tokens.ts reads the
 * stylesheets off disk with node:fs, which cannot ship to a browser.
 * The pipeline instrument on /design-system has to run the REAL
 * function the endpoint runs, not an imitation of it, so the pure part
 * moves here and both consumers import it:
 *   - lib/bella/tokens.ts  (server, adds the file reading)
 *   - components/ContractPipeline.tsx  (client, the MANIFEST stage)
 * One implementation, two callers. No node built-ins in this file. */

export type DtcgToken = { $value: string; $type?: string };
export type DtcgGroup = Record<string, DtcgToken>;

export function dtcgToken(raw: string): DtcgToken {
  const aliasMatch = raw.match(/^var\((--[a-z0-9-]+)\)$/i);
  const $value = aliasMatch ? `{${aliasMatch[1]}}` : raw;
  let $type: string | undefined;
  if (!aliasMatch) {
    if (/^#[0-9a-f]{3,8}$|^(rgba?|hsla?|color-mix)\(/i.test(raw)) $type = "color";
    else if (/^-?\d*\.?\d+(px|rem|em)$/.test(raw)) $type = "dimension";
    else if (/gradient|shadow/i.test(raw)) $type = undefined;
  }
  return $type ? { $value, $type } : { $value };
}

/* WCAG relative luminance and contrast ratio, the same maths
 * scripts/contrast-check.mjs runs in the gate. Shared here so the
 * REFUSAL stage computes a real ratio in the browser rather than
 * rendering a stored one. */
export function relativeLuminance([r, g, b]: [number, number, number]): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrastRatio(a: [number, number, number], b: [number, number, number]): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function toHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("")}`;
}

export function parseRgb(value: string): [number, number, number] | null {
  const m = value.match(/-?[\d.]+/g);
  if (m && m.length >= 3) return [Number(m[0]), Number(m[1]), Number(m[2])];
  return null;
}
