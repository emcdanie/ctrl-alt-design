import { readFileSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import Heading from "@/components/ui/Heading";
import { PawIcon } from "@/components/PawTrail";
import FooterEmail from "@/components/FooterEmail";
import SharePortfolio from "@/components/SharePortfolio";
import FooterCta from "@/components/FooterCta";
import { ResumeLink } from "@/components/ResumeModal";
import { BUILDING } from "@/content/building";
import { social } from "@/lib/social";

/* Site footer: navy with cream text in both themes. The "Made with"
   marquee along the top edge; the contact band (photo, "Let's compare
   notes.", the one Get in touch, Share) beside the Building card with
   the link columns under it; then ELLETA in Unique as
   one word with Bella on the last A, and the small print. The wordmark
   is decorative: the nav carries the real one. */
const version = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")).version as string;
/* "v0.1" from "0.1.0" */
const liveTag = `v${version.split(".").slice(0, 2).join(".")}`;

const MADE_WITH = ["Figma", "Claude Code", "Next.js", "Vercel", "Storybook", "BELLA", "Geist & Unique", "GitHub", "a lot of coffee", "Bella's supervision"];

const external = (href: string, label: string, key: string) => (
  <a key={key} className="site-footer__link" href={href} target="_blank" rel="noopener noreferrer">
    {label} ↗<span className="sr-only"> (opens in a new tab)</span>
  </a>
);

const COLUMNS: { label: string; links: React.ReactNode[] }[] = [
  {
    label: "Pages",
    links: [
      <Link key="work" className="site-footer__link" href="/work">Work</Link>,
      <Link key="system" className="site-footer__link" href="/design-system">System</Link>,
      <Link key="skills" className="site-footer__link" href="/skills">Skills</Link>,
      <Link key="about" className="site-footer__link" href="/about">About</Link>,
    ],
  },
  {
    label: "Elsewhere",
    links: [
      external(social.linkedin, "LinkedIn", "li"),
      external("https://github.com/emcdanie/bella", "BELLA on GitHub", "gh"),
      external("https://emcdanie.github.io/bella/", "Storybook", "sb"),
    ],
  },
  {
    label: "Say hi",
    links: [
      <FooterEmail key="email" />,
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      {/* "Made with": a slow marquee along the footer's top edge, edge to
          edge of the screen (outside the container); the loop copy is
          hidden from AT, and reduced motion shows one static, wrapped line */}
      <div className="made-with" role="region" tabIndex={0} aria-label="Made with">
        <div className="made-with__track">
          <ul className="made-with__list">
            {MADE_WITH.map((m) => (
              <li key={m}>Made with {m}</li>
            ))}
          </ul>
          <ul className="made-with__list" aria-hidden="true">
            {MADE_WITH.map((m) => (
              <li key={m}>Made with {m}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container site-footer__inner">
        {/* contact band: the site's one closing CTA (About's old contact
            card lives here now) */}
        <div className="site-footer__contact" id="contact">
          <div className="site-footer__hello">
            <Image className="site-footer__photo" src="/images/thumbnails/Me.jpeg" alt="Elleta McDaniel" width={192} height={192} />
            <div>
              <Heading tier="section" as="h2" accent="notes" after=".">
                Let&apos;s compare
              </Heading>
              <p className="text-lead site-footer__lead">
                Open to full-time roles and select freelance projects, working remotely from near Barcelona.
              </p>
              <ul className="site-footer__lines">
                <li>Straight to me: you talk to the person designing your system.</li>
                <li>EU working hours, remote-first.</li>
                <li>We start small: an audit or one component.</li>
              </ul>
              <div className="site-footer__actions">
                <FooterCta />
                <SharePortfolio className="btn-pill" />
              </div>
            </div>
          </div>

          {/* right column: the link columns, their top on the heading's
              top; what is live and what is next under them */}
          <div className="site-footer__side">
            <nav className="site-footer__cols" aria-label="Footer">
              {COLUMNS.map((c) => (
                <div key={c.label}>
                  <p className="site-footer__label">
                    <PawIcon />
                    {c.label}
                  </p>
                  <ul className="site-footer__list">
                    {c.links.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="building">
              <p className="building__top">
                <span className="building__dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="building__status">
                  <span aria-hidden="true">● </span>Building
                </span>
              </p>
              <p className="building__line">
                ~/elleta.design $ <b>git tag</b>
              </p>
              <p className="building__line">
                <span className="building__live">{liveTag}</span> ← live
              </p>
              <p className="building__line">
                <span className="building__next">{BUILDING.next}</span> ← in progress
              </p>
              <ul className="building__items">
                {BUILDING.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <a className="site-footer__link building__details" href={BUILDING.detailsUrl} target="_blank" rel="noopener noreferrer">
                View details ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>

        {/* brand row: ELLETA as one word with Bella on the last A; the
            small print sits right, bottom on the wordmark's baseline */}
        <div className="site-footer__brand">
          <div className="site-footer__mark" aria-hidden="true">
            <span className="site-footer__wordmark">
              ELLET
              <span className="site-footer__a">
                A
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="site-footer__bella" src="/images/bella/set/bella-portrait.svg" alt="" />
              </span>
            </span>
          </div>
          <div className="text-meta site-footer__small">
            {/* slot: "This page weighs XX KB" (filled by the footprint branch) */}
            <p>© 2026 Elleta McDaniel · Built with help from AI, reviewed line by line by me.</p>
            <p className="site-footer__legal">
              <span>v{version}</span>
              <Link className="site-footer__link site-footer__link--small" href="/accessibility">Accessibility</Link>
              <Link className="site-footer__link site-footer__link--small" href="/privacy">Privacy</Link>
              <ResumeLink className="site-footer__link site-footer__link--small" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
