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
/* SIX-SECTION SPINE (spec system-page-redesign section J, 27 Jul
   2026). Was eleven entries for eleven bands; the page now reads as
   six movements in inverted-pyramid order, strongest proof first. The
   nine retired band ids survive as live anchors on their new parent
   sections, so every deep link that ever pointed at them still
   resolves. */
/* THE BEAT RAIL (27 Jul 2026). The page is now an explorable
   explanation on the case-study scroll spine, so the rail lists BEATS,
   not bands. Entries marked `soon` are the structure made visible
   before it is built: they render as quiet, non-linking placeholders so
   a reader can see where the argument is going. */
const SECTIONS = [
  /* SHORT labels (27 Jul): below 1280 this rail renders as a one-line
     pill bar. Sentence-length labels blew it open to 180px and it sat
     over the content. Short labels read better in the vertical rail
     too, so there is one set, not two. */
  { id: "ds-agent", label: "AI readiness", desc: "" },
  { id: "ds-pipeline", label: "The pipeline", desc: "" },
  { id: "ds-gate", label: "The gate", desc: "" },
  { id: "ds-maturity", label: "Maturity", desc: "" },
  { id: "ds-close", label: "The rules", desc: "" },
] as const;

/* Beats that are specced but not built. Shown so the spine is legible
   as a whole; they carry no href and are not scroll-spy targets. */
const SOON = [
  "Why a contract: the drift demo",
  "Ship a mistake: the gate demo",
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
      <p className="ds-nav__soonhead">Coming beats</p>
      <ul className="ds-nav__list ds-nav__list--soon">
        {SOON.map((s) => (
          <li key={s}>
            <span className="ds-nav__soon">{s}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
