import Link from "next/link";
import BrandWordmark from "@/components/bella/BrandWordmark/BrandWordmark";
import Heading from "@/components/ui/Heading";
import FooterCta from "@/components/FooterCta";
import { ResumeLink } from "@/components/ResumeModal";
import { social } from "@/lib/social";

/* Site footer, from footer-mock.html (Elleta, 22 Sep 2026): the panel
   ground in both themes, "Let's compare notes.", one line and the one
   "Let's talk" beside the pages and elsewhere columns, one small-print
   row with the only version label, then the pattern ELLETA at the
   content width (same left edge as the text), flush with the bottom edge. */

const external = (href: string, label: string) => (
  <a className="site-footer__link" href={href} target="_blank" rel="noopener noreferrer">
    {label} ↗<span className="sr-only"> (opens in a new tab)</span>
  </a>
);

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <Heading tier="section" as="h2" accent="notes" after=".">
          Let&apos;s compare
        </Heading>
        <div className="site-footer__row" id="contact">
          <div>
            <p className="site-footer__lead">
              Open to full-time roles and select freelance projects, working remotely from near Barcelona. You talk to
              the person designing your system.
            </p>
            <FooterCta />
          </div>
          <nav aria-label="Footer pages">
            <p className="site-footer__label">pages</p>
            <ul className="site-footer__list">
              <li><Link className="site-footer__link" href="/work">Work</Link></li>
              <li><Link className="site-footer__link" href="/design-system">System</Link></li>
              <li><Link className="site-footer__link" href="/learning">Learning</Link></li>
              <li><Link className="site-footer__link" href="/about">About</Link></li>
            </ul>
          </nav>
          <div>
            <p className="site-footer__label">elsewhere</p>
            <ul className="site-footer__list">
              <li>{external(social.linkedin, "LinkedIn")}</li>
              <li>{external("https://github.com/emcdanie/bella", "BELLA on GitHub")}</li>
              <li>{external("https://emcdanie.github.io/bella/", "Storybook")}</li>
              <li><ResumeLink className="site-footer__link" /></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__legal">
          <p>
            © 2026 Elleta McDaniel ·{" "}
            <Link className="site-footer__link site-footer__link--small" href="/accessibility">Accessibility</Link> ·{" "}
            <Link className="site-footer__link site-footer__link--small" href="/privacy">Privacy</Link>
          </p>
          <p>Built on BELLA · v0.2</p>
        </div>
        <div className="site-footer__mark">
          <BrandWordmark size="full-bleed" />
        </div>
      </div>
    </footer>
  );
}
