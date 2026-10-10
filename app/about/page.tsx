import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { TextLink, textLinkClass } from "@/components/ui/TextLink";
import { Beat, CaseQuote } from "@/components/case/CasePage";
import CaseFigure from "@/components/case/CaseFigure";
import ExperienceSection, { KindnessProof } from "@/components/ExperienceSection";
import { ResumeLink } from "@/components/ResumeModal";
import { BuildFlow, HeroPlates } from "@/components/about/AboutPictures";
import { TESTIMONIALS, type Testimonial } from "@/content/testimonials";
import st from "@/components/about/About.module.css";

/* About on Template / Page (Site v3, Figma e7U5Hxpr441rT719SPclas, 1440
   403:7256, 390 403:7591; Elleta, 4 Oct 2026, "reworked 4 Oct late").
   One layout Section on the 1056 body, text on its left edge: the hero,
   then five numbered beats (the short lead, how I work with AI, track
   record, word of mouth, house rules). Copy as approved in the frames.
   Cut: Good company, the paw trail, logo tiles, a second contact CTA (the
   site footer carries contact), and the Pack with its dog illustration
   (Elleta, 4 Oct late: no dog illustrations). */

const quote = (name: string) => TESTIMONIALS.find((t) => t.name === name) as Testimonial;
const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
const roleLine = (t: Testimonial) => [t.role, t.company].filter(Boolean).join(" · ");

const FEATURE = quote("Brad Frost");
const SMALL = ["Xavier Boluda", "Mario Mezini", "Ian Frost"].map(quote);

export default function AboutPage() {
  return (
    <main id="main-content" className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />

      <Section width="case-edge" labelledBy="about-title">
        <div className={st.page}>
          {/* 0 · Hero */}
          <div id="about-hero" className={st.hero}>
            <div className={st.head}>
              <p className={st.kicker}>About</p>
              <Heading tier="page" id="about-title" className={st.title} accent="Bella.">
                Fluent in design, code and
              </Heading>
              <p className={st.lead}>
                I&apos;m a design engineer for design systems: tokens, components, and the decisions behind them, written
                down kindly so designers and developers can both use them.
              </p>
              <p className={st.avail}>Open to full-time roles and select freelance projects, working remotely from near Barcelona.</p>
              <div className={st.actions}>
                <ResumeLink button="primary" label="View CV" />
                <Button href="/contact">Let&apos;s talk</Button>
              </div>
            </div>
            <div className={st.plates}>
              <HeroPlates />
            </div>
          </div>

          {/* 1 · The short lead */}
          <Beat
            id="short-lead"
            num="1"
            label="The short lead"
            heading="A shared language, not a rulebook."
            lead="Teams move fast. A good system helps them move together."
            align="edge"
          >
            <ul className={st.points}>
              <li>Token architecture</li>
              <li>Component libraries in Storybook</li>
              <li>Governance and contribution</li>
              <li>AI-ready docs and MCP</li>
            </ul>
            <div className={st.body}>
              <p>
                Components get duplicated. Decisions get made under sprint pressure and nobody writes them down. The file
                meant to be the source of truth turns into the one nobody trusts. I dig out the structure underneath and
                write it down, so design and dev can talk again. Then I hand it over: the system belongs to the team, not
                to me. It&apos;s the part I&apos;d do for free.
              </p>
            </div>
          </Beat>

          {/* 2 · How I work with AI */}
          <Beat
            id="how-i-work"
            num="2"
            label="How I work with AI"
            heading="Design systems that hold up when AI shows up."
            lead="Claude writes the code. I design the context, contracts and gates it works inside, and I decide what merges."
            align="edge"
          >
            <p className={st.linkRow}>
              <TextLink href="/design-system">
                See how this site is built <span aria-hidden="true">→</span>
              </TextLink>
              <TextLink href="/accessibility">
                Accessibility <span aria-hidden="true">→</span>
              </TextLink>
            </p>
            <CaseFigure
              n={1}
              caption="How this site gets built. Cowork plans, Claude Code builds, the gate checks; I review the screenshots and decide what merges. Human steps are marked."
            >
              <BuildFlow />
            </CaseFigure>
            <div className={st.body}>
              <p>
                But the tools are the easy part. A system only sticks when the people using it trust it, so I work with
                teams, not against them: pairing with engineers, bringing designers into the decisions, and building the
                relationships that shape how a company actually uses its system.
              </p>
              <p>
                At a global fashion retailer I was the first to bring AI into their design-system work: I used it to audit and ship faster
                while updating the system, then built the tools so the team could carry on without me. My most recent
                example is the site you&apos;re on. It runs on BELLA, my own design system: tokens, components in
                Storybook, and docs an AI can read.
              </p>
            </div>
          </Beat>

          {/* 3 · Track record */}
          <Beat
            id="track-record"
            num="3"
            label="Track record"
            heading="Where I've been."
            lead="Five teams, one thread: making the system the thing people trust."
            align="edge"
          >
            <ExperienceSection />
            <p className={st.linkRow}>
              <ResumeLink className={textLinkClass} label="View CV" />
            </p>
          </Beat>

          {/* 4 · Word of mouth */}
          <Beat
            id="word-of-mouth"
            num="4"
            label="Word of mouth"
            heading="In their own words."
            lead="Four of fifteen recommendations, quoted as written."
            align="edge"
          >
            <CaseQuote quote={FEATURE.quote} name={FEATURE.name} role={roleLine(FEATURE)} />
            <ul className={st.small}>
              {SMALL.map((t) => (
                <li key={t.name}>
                  <figure className={st.quote}>
                    <blockquote>
                      <p>{t.quote}</p>
                    </blockquote>
                    <figcaption className={st.by}>
                      <span className={st.avatar} aria-hidden="true">
                        {initials(t.name)}
                      </span>
                      <span className={st.who}>
                        <span className={st.name}>{t.name}</span>
                        <span className={st.role}>{roleLine(t)}</span>
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <p className={st.linkRow}>
              <TextLink href="https://www.linkedin.com/in/elleta-mcdaniel/details/recommendations/" external trackEvent="linkedin">
                Read all 15 on LinkedIn <span aria-hidden="true">↗</span>
              </TextLink>
            </p>
          </Beat>

          {/* 5 · House rules */}
          <Beat id="house-rules" num="5" label="House rules" heading="Four things I care about." align="edge">
            <ul className={st.cards}>
              <li>
                <div className={st.card} data-card>
                  <h3 className="heading-item">Kindness</h3>
                  <p>Docs written for the person reading them at 5pm on a Friday.</p>
                  <KindnessProof className={st.proof} />
                </div>
              </li>
              <li>
                <div className={st.card} data-card>
                  <h3 className="heading-item">Respect</h3>
                  <p>For the designer&apos;s craft and the engineer&apos;s time. I check it can be built before I design it three ways.</p>
                  <p className={st.proof}>
                    Proof: a frontend lead wrote that I treat technical constraints as creative opportunities rather than
                    obstacles.
                  </p>
                </div>
              </li>
              <li>
                <div className={st.card} data-card>
                  <h3 className="heading-item">Sharing</h3>
                  <p>
                    I learned all of this in public, from Brad Frost, Vitaly Friedman, Nathan Curtis, Romina Kavčić and the
                    Into Design Systems crowd. So I give it back: BELLA is open for anyone to read.
                  </p>
                  <p className={st.proof}>Proof: BELLA is public on GitHub, with its Storybook.</p>
                </div>
              </li>
              <li>
                <div className={st.card} data-card>
                  <h3 className="heading-item">Love of the craft</h3>
                  <p>Naming, tokens, governance. The unglamorous stuff is my favourite stuff.</p>
                  <p className={st.proof}>Proof: on Drift I counted seventeen buttons doing one job; the system kept one.</p>
                </div>
              </li>
            </ul>
          </Beat>
        </div>
      </Section>
    </main>
  );
}
