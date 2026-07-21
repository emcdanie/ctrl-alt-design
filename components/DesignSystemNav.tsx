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

const SECTIONS = [
  { id: "ds-identity", label: "Identity" },
  { id: "ds-type", label: "Type" },
  { id: "ds-colour", label: "Colour" },
  { id: "ds-scales", label: "Spacing" },
  { id: "ds-controls", label: "Controls" },
  { id: "ds-inspector", label: "Inspector" },
  { id: "ds-agents", label: "Agents" },
  { id: "ds-rules", label: "Rules" },
  { id: "ds-gate", label: "Gate" },
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
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
