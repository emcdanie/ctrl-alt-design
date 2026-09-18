import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PawIcon } from "@/components/PawTrail";
import FooterEmail from "@/components/FooterEmail";
import { social } from "@/lib/social";

/* Site footer: navy with cream text in both themes. Three link columns
   and one Get in touch, then ELLETA in Unique filling the container
   width exactly (container query units), with Bella sitting on the last
   A, then the small print. The wordmark is decorative: the nav carries
   the real one. */
const version = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")).version as string;

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
      <Link key="contact" className="site-footer__link" href="/contact">Get in touch</Link>,
      <FooterEmail key="email" />,
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__cta">
            <p className="text-display-3 site-footer__line">
              Design systems, with the lights <span className="accent">on</span>.
            </p>
            <Button href="/contact">Get in touch</Button>
          </div>
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
        </div>

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

        <p className="text-meta site-footer__small">
          {/* slot: "This page weighs XX KB" (filled by the footprint branch) */}
          <span>v{version}</span>
          <span aria-hidden="true">·</span>
          <span>Built with Next.js + BELLA</span>
          <span aria-hidden="true">·</span>
          <span>© 2026 Elleta McDaniel</span>
        </p>
      </div>
    </footer>
  );
}
