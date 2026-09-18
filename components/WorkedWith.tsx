import { readFileSync } from "node:fs";
import { join } from "node:path";
import { WORKED_WITH, type Org } from "@/components/ExperienceSection";

/* "Good company" (server component): one grid of marks inlined from
   public/logos so they paint in currentColor (the muted ink) in both
   themes. Each mark fits the grid's logo box by its own aspect ratio.
   Any id inside a file (a knockout mask) is suffixed per instance, so
   two copies on one page never share an id. */
const svgFor = (o: Org, uid: string) => {
  let svg = readFileSync(join(process.cwd(), "public/logos", `${o.file}.svg`), "utf8");
  for (const [, id] of svg.matchAll(/ id="([^"]+)"/g)) {
    svg = svg.replaceAll(`id="${id}"`, `id="${id}-${uid}"`).replaceAll(`url(#${id})`, `url(#${id}-${uid})`);
  }
  const [, , w, h] = (svg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 1 1").split(/[\s,]+/).map(Number);
  return { html: svg.replace("<svg", '<svg aria-hidden="true" focusable="false"'), ratio: w / h };
};

export default function WorkedWith() {
  return (
    <ul className="logo-grid">
      {WORKED_WITH.map((o, i) => {
        const { html, ratio } = svgFor(o, `ww${i}`);
        const style = { "--logo-ratio": ratio, ...(o.scale ? { "--logo-scale": o.scale } : {}) } as React.CSSProperties;
        return (
          <li key={o.file} className="logo-grid__cell">
            <span role="img" aria-label={o.name} className={o.lockup ? "logo-grid__lockup" : undefined}>
              <span className="logo-grid__logo" style={style} dangerouslySetInnerHTML={{ __html: html }} />
              {o.lockup ? (
                <span className="logo-grid__lockup-text" aria-hidden="true">
                  {o.lockup.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
