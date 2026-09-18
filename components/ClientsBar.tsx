import { CLIENT_WORDMARKS } from "@/components/ExperienceSection";

/* The Clients bar (About lock beat 2, 18 Sep 2026): one row of text
   wordmarks under the statement hero, the proof strip. Names are READ
   from the Experience data, never typed here, so the one private-list
   name stays in the NDA-exempt file. Employers and clients only, never
   an employer's customers. Text, not logos (logo artwork is out of
   scope). */
export default function ClientsBar() {
  return (
    <section className="clients-bar" aria-labelledby="clients-bar-label">
      <p id="clients-bar-label" className="section-label">
        Where I&apos;ve worked
      </p>
      <ul className="clients-bar__list">
        {CLIENT_WORDMARKS.map((name) => (
          <li key={name} className="clients-bar__name">
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}
