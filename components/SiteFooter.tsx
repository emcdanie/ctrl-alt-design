"use client";

import Link from "next/link";
import BrandWordmark from "@/components/bella/BrandWordmark/BrandWordmark";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { ResumeLink } from "@/components/ResumeModal";
import { social } from "@/lib/social";

/* The site footer, one on every route (Elleta, 5 Oct 2026, job E1; the
   footer lock of 4 Oct, concept-lock-2026-10-04-home-footer-templates):
   back to top as a half-round tab centred on the footer's top edge, the
   page links in a row, the elsewhere links in a row, the small print with
   the colophon, then the pattern ELLETA. "Let's compare notes." and its
   "Let's talk" were cut in that lock; /contact stays reachable from the
   nav menu. LinkedIn carries its icon everywhere. */

const external = (href: string, label: string, event: string, icon?: React.ReactNode) => (
  <a className="site-footer__link" href={href} target="_blank" rel="noopener noreferrer" data-umami-event={event}>
    {icon}
    {label} ↗<span className="sr-only"> (opens in a new tab)</span>
  </a>
);

const toTop = () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  document.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
};

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <button type="button" className="site-footer__top" onClick={toTop} aria-label="Back to top" data-bracket="off" data-umami-event="back-to-top">
        {/* the debossed chevron (H3): decorative, the button carries the name */}
        <svg className="site-footer__chevron" viewBox="0 0 36 18" aria-hidden="true" focusable="false">
          <path className="site-footer__chevron-hi" d="M3 15.5 18 4.5l15 11" />
          <path className="site-footer__chevron-line" d="M3 15.5 18 4.5l15 11" />
        </svg>
      </button>
      {/* on the content edge, x192 at 1440 like every v3 page (Site v3, 4 Oct late) */}
      <div className="container container--case">
        <nav className="site-footer__row" aria-label="Footer pages">
          <p className="site-footer__label">Pages</p>
          <ul className="site-footer__list">
            <li><Link className="site-footer__link" href="/work">Work</Link></li>
            <li><Link className="site-footer__link" href="/design-system">System</Link></li>
            <li><Link className="site-footer__link" href="/learning">Learning</Link></li>
            <li><Link className="site-footer__link" href="/about">About</Link></li>
          </ul>
        </nav>
        <div className="site-footer__row">
          <p className="site-footer__label">Elsewhere</p>
          <ul className="site-footer__list">
            <li>{external(social.linkedin, "LinkedIn", "linkedin", <LinkedInIcon />)}</li>
            <li>{external("https://github.com/emcdanie/bella", "BELLA on GitHub", "github")}</li>
            <li>{external("https://emcdanie.github.io/bella/", "Storybook", "storybook")}</li>
            <li><ResumeLink className="site-footer__link" /></li>
          </ul>
        </div>
        <div className="site-footer__legal">
          <p>
            © 2026 Elleta McDaniel ·{" "}
            {/* the two links keep one line at 390: the break comes before them */}
            <span className="site-footer__keep">
              <Link className="site-footer__link site-footer__link--small" href="/accessibility">Accessibility</Link> ·{" "}
              <Link className="site-footer__link site-footer__link--small" href="/privacy">Privacy</Link>
            </span>
          </p>
          <p>
            Built on BELLA ·{" "}
            <Link className="site-footer__link site-footer__link--small" href="/design-system">
              how this site works <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
        <div className="site-footer__mark">
          <BrandWordmark size="full-bleed" />
        </div>
      </div>
    </footer>
  );
}
