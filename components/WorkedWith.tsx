import { readFileSync } from "node:fs";
import { join } from "node:path";
import { WORKED_WITH, WORKED_THROUGH, type Org } from "@/components/ExperienceSection";

/* "Good company" (server component): each mark is inlined from
   public/logos so it paints in currentColor (the muted ink) in
   both themes. Any id inside a file (a knockout mask) is suffixed per
   instance, so two copies on one page never share an id. */
const svgFor = (o: Org, uid: string) => {
  let svg = readFileSync(join(process.cwd(), "public/logos", `${o.file}.svg`), "utf8");
  for (const [, id] of svg.matchAll(/ id="([^"]+)"/g)) {
    svg = svg.replaceAll(`id="${id}"`, `id="${id}-${uid}"`).replaceAll(`url(#${id})`, `url(#${id}-${uid})`);
  }
  return svg.replace("<svg", '<svg aria-hidden="true" focusable="false"');
};

function Grid({ orgs, group, sub }: { orgs: Org[]; group: string; sub?: boolean }) {
  return (
    <ul className={sub ? "logo-grid logo-grid--sub" : "logo-grid"}>
      {orgs.map((o, i) => (
        <li key={o.file} className="logo-grid__cell">
          <span
            role="img"
            aria-label={o.name}
            className="logo-grid__logo"
            style={o.scale ? ({ "--logo-scale": o.scale } as React.CSSProperties) : undefined}
            dangerouslySetInnerHTML={{ __html: svgFor(o, `${group}${i}`) }}
          />
        </li>
      ))}
    </ul>
  );
}

export default function WorkedWith() {
  return (
    <>
      <Grid orgs={WORKED_WITH} group="ww" />
      {WORKED_THROUGH.map((row, r) => (
        <div key={row.label}>
          <p className="text-meta logo-grid__label">{row.label}</p>
          <Grid orgs={row.orgs} group={`wt${r}-`} sub />
        </div>
      ))}
    </>
  );
}
