"use client";

import { useEffect, useState } from "react";

/**
 * The ONE sticky-rail scroll-spy (Elleta, 21 Jul, via Cowork; spec
 * specs/system-page-v2). Sticky left rail at >=1280px (>=1024 for the
 * case variant), a sticky horizontal pill row below that. Scroll-spy
 * highlights the current section (aria-current); links are real
 * anchors, so keyboard comes for free.
 *
 * GENERALIZED (case-scroll-template, Elleta's go 22 Jul): the section
 * set, aria label, and skin are props; the default stays the System
 * page map, byte-identical in behaviour. The "case" variant is the
 * scroll-spine skin (dashed connector, filled active dot, iris as the
 * active NAVIGATION affordance per the colour rule) and keeps the
 * hash in sync via replaceState so a step is linkable and
 * back/forward safe.
 */

export interface RailSection {
  id: string;
  label: string;
  /** one-line purpose description, HER voice; renders nothing empty */
  desc: string;
}

/* Rail purpose descriptions (v3 T3): one line under each label, HER
   voice; every slot is TODO(elleta) and renders NOTHING while empty. */
const SYSTEM_SECTIONS: RailSection[] = [
  { id: "ds-identity", label: "Identity", desc: "" /* TODO(elleta) */ },
  { id: "ds-type", label: "Type", desc: "" /* TODO(elleta) */ },
  { id: "ds-colour", label: "Colour", desc: "" /* TODO(elleta) */ },
  { id: "ds-scales", label: "Spacing", desc: "" /* TODO(elleta) */ },
  { id: "ds-controls", label: "Controls", desc: "" /* TODO(elleta) */ },
  { id: "ds-agents", label: "Agents", desc: "" /* TODO(elleta) */ },
  { id: "ds-rules", label: "Rules", desc: "" /* TODO(elleta) */ },
  { id: "ds-gate", label: "Gate", desc: "" /* TODO(elleta) */ },
];

export default function DesignSystemNav({
  sections = SYSTEM_SECTIONS,
  ariaLabel = "System sections",
  variant = "system",
}: {
  sections?: RailSection[];
  ariaLabel?: string;
  /** "case" = the scroll-spine skin + hash sync */
  variant?: "system" | "case";
} = {}) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
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
  }, [sections, variant]);

  /* linkable steps (case variant): the hash follows the active step
     OUTSIDE the render pass; replace, never push, so back/forward
     stays sane */
  useEffect(() => {
    if (variant !== "case" || !active) return;
    if (window.location.hash !== `#${active}`) {
      window.history.replaceState(null, "", `#${active}`);
    }
  }, [active, variant]);

  return (
    <nav className={`ds-nav${variant === "case" ? " ds-nav--case" : ""}`} aria-label={ariaLabel}>
      <ul className="ds-nav__list">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              className="ds-nav__link"
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
            >
              {variant === "case" && <span className="ds-nav__dot" aria-hidden="true" />}
              <span className="ds-nav__label">{s.label}</span>
              {s.desc.trim() !== "" && <span className="ds-nav__desc">{s.desc}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
