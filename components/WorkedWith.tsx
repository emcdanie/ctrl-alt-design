import { WORKED_WITH } from "@/components/ExperienceSection";

/* "Good company": one ruled cell per org, its mark left-aligned and
   painted with the theme ink (a CSS mask, so the file itself is never
   recoloured). Names come from ExperienceSection, the NDA-exempt data. */
export default function WorkedWith() {
  return (
    <ul className="worked-with">
      {WORKED_WITH.map((o) => (
        <li key={o.name} className="worked-with__cell">
          <span
            role="img"
            aria-label={o.name}
            className="worked-with__logo"
            style={{ maskImage: `url(${o.src})`, WebkitMaskImage: `url(${o.src})`, aspectRatio: String(o.ratio) }}
          />
        </li>
      ))}
    </ul>
  );
}
