"use client";

import { useEffect, useState } from "react";

/**
 * The System page map (Elleta, 21 Jul, via Cowork; spec
 * specs/system-page-v2). Modeless-style section nav: sticky left rail
 * at >=1280px, a sticky horizontal pill row below that. Scroll-spy
 * highlights the current section (aria-current); links are real
 * anchors, so keyboard comes for free. The section order here IS the
 * page's band order; unlisted bands (For agents, Rules, Status) keep
 * the last listed highlight.
 */

/* Rail purpose descriptions (v3 T3): one line under each label, HER
   voice; every slot is TODO(elleta) and renders NOTHING while empty.
   COUNT NOTE: the brief said "all ten"; the map has NINE sections.
   The tenth is hers to name if the count was literal. */
const SECTIONS = [
  /* the lead proof leads the map too (spec system-page-redesign) */
  { id: "ds-pipeline", label: "Pipeline", desc: "" /* TODO(elleta) */ },
  { id: "ds-identity", label: "Identity", desc: "" /* TODO(elleta) */ },
  { id: "ds-type", label: "Type", desc: "" /* TODO(elleta) */ },
  { id: "ds-colour", label: "Colour", desc: "" /* TODO(elleta) */ },
  { id: "ds-scales", label: "Spacing", desc: "" /* TODO(elleta) */ },
  { id: "ds-controls", label: "Controls", desc: "" /* TODO(elleta) */ },
  { id: "ds-ai-readiness", label: "AI readiness", desc: "" /* TODO(elleta) */ },
  { id: "ds-maturity", label: "Maturity", desc: "" /* TODO(elleta) */ },
  { id: "ds-agents", label: "Agents", desc: "" /* TODO(elleta) */ },
  { id: "ds-rules", label: "Rules", desc: "" /* TODO(elleta) */ },
  { id: "ds-gate", label: "Gate", desc: "" /* TODO(elleta) */ },
] as const;

export default function DesignSystemNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (targets.length === 0) return;
    /* the active section is the last one whose top has crossed the
       upper third of the viewport */
    const pick = () => {
      let current = targets[0].id;
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.34) current = el.id;
      }
      /* at page bottom the last section may never reach the upper
         third; when fully scrolled, it is the current one */
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = targets[targets.length - 1].id;
      }
      setActive(current);
    };
    pick();
    const io = new IntersectionObserver(pick, {
      rootMargin: "-34% 0px -60% 0px",
    });
    targets.forEach((el) => io.observe(el));
    window.addEventListener("scroll", pick, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", pick);
    };
  }, []);

  return (
    <nav className="ds-nav" aria-label="System sections">
      <ul className="ds-nav__list">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              className="ds-nav__link"
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
            >
              <span className="ds-nav__label">{s.label}</span>
              {s.desc.trim() !== "" && <span className="ds-nav__desc">{s.desc}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
