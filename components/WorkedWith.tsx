import SectionHeader from "@/components/ui/SectionHeader";
import { WORKED_WITH } from "@/components/ExperienceSection";

/* "Worked with" (about-rebuild lock, 18 Sep 2026): one row of official
   logos at one height, monochrome in the theme's ink. Each file is used
   as a CSS mask, so the mark itself is never redrawn or recoloured in
   the file: the page paints it with a token. Orgs without an approved
   official file render their name as text in the same row. Names and
   paths come from ExperienceSection (the NDA-exempt data). */
export default function WorkedWith() {
  return (
    <section id="worked-with" className="layout-section-tight">
      <div className="page-container">
        <SectionHeader title="Worked with" />
        <ul className="worked-with">
          {WORKED_WITH.map((o) => (
            <li key={o.name} className="worked-with__item">
              {o.src && o.ratio ? (
                <span
                  role="img"
                  aria-label={o.name}
                  className="worked-with__logo"
                  style={{ maskImage: `url(${o.src})`, WebkitMaskImage: `url(${o.src})`, aspectRatio: String(o.ratio) }}
                />
              ) : (
                <span className="worked-with__name">{o.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
