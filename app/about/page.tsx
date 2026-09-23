import Link from "next/link";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import Spotlight from "@/components/Spotlight";
import { ScanPhrase, ScanPoint, ScanRead } from "@/components/ScanRead";
import SectionList from "@/components/ui/SectionList";
import Card from "@/components/ui/Card";
import { TESTIMONIALS } from "@/content/testimonials";
import WorkedWith from "@/components/WorkedWith";
import ExperienceSection from "@/components/ExperienceSection";
import Term, { TermHelp } from "@/components/ui/Term";

/* About: the opening, then short lead, track record, the pack, word of
   mouth, new tricks and house rules, each one a layout Section +
   SectionHeader (specs/layout-system); the site footer carries the
   closing contact band. Copy is Elleta's, used verbatim. */
export default function AboutPage() {
  return (
    <main id="main-content" className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />

      <Section id="about-hero" labelledBy="about-hero-title">
        <TermHelp />
        <SectionHeader
          as="h1"
          id="about-hero-title"
          kicker="About"
          heading="Fluent in design, code and"
          accent={<Term id="bella" />}
          after="."
          lead={
            <>
              I build design systems that give designers and developers a <strong>shared language</strong>: <span className="nowrap"><Term id="tokens" />,</span>{" "}
              components, and the decisions behind them, written down kindly so everyone can use them.
            </>
          }
        />
      </Section>

      <Section id="short-lead" label="The short lead">
        <SectionHeader
          heading="A shared language, not a"
          accent={<Term id="rulebook" />}
          after="."
          lead="Teams move fast. A good system helps them move together."
        >
          <p>
            Components get duplicated. Decisions get made under sprint pressure and nobody writes them
            down. The file meant to be the <Term id="source-of-truth" /> turns into the one nobody trusts. I dig out the
            structure underneath and write it down, <strong>so design and dev can talk again</strong>. Then I hand
            it over: the system belongs to the team, not to me. It&apos;s the part I&apos;d do for free.
          </p>
          <SectionList
            items={[
              "Token architecture",
              "Component libraries in Storybook",
              "Governance and contribution",
              "AI-ready docs and MCP",
            ]}
          />
        </SectionHeader>
      </Section>

      <Section id="track-record" label="Track record">
        <SectionHeader
          heading="Where I've"
          accent={<Term id="been" />}
          after="."
          lead="Five teams, one thread: making the system the thing people trust."
        />
        <ExperienceSection />
      </Section>

      <Section id="the-pack" label="The pack">
        <SectionHeader heading="Good" accent="company" after="." />
        <WorkedWith />
      </Section>

      <Section id="word-of-mouth" label="Word of mouth">
        <SectionHeader
          heading="In their own"
          accent={<Term id="words" />}
          after="."
          lead="Six of fifteen recommendations, quoted as written."
        />
        <ul className="quotes reveal-group">
          {TESTIMONIALS.map((t) => {
            const [before, after] = t.quote.split(t.bold);
            return (
              <li key={t.name} className="quotes__item">
                <span className="quotes__mark pattern-mark" aria-hidden="true">
                  “
                </span>
                <Card className="quotes__card">
                  <figure className="quotes__figure">
                    <blockquote className="quotes__quote">
                      <p>
                        {before}
                        <strong>{t.bold}</strong>
                        {after}
                        <span className="quotes__close" aria-hidden="true">
                          ”
                        </span>
                      </p>
                    </blockquote>
                    <figcaption>
                      <span className="quotes__name">
                        {t.href ? (
                          <a href={t.href} target="_blank" rel="noopener noreferrer">
                            {t.name}
                            <span className="sr-only"> (LinkedIn, opens in a new tab)</span>
                          </a>
                        ) : (
                          t.name
                        )}
                      </span>
                      <span className="text-meta quotes__role">{[t.role, t.company].filter(Boolean).join(" · ")}</span>
                    </figcaption>
                  </figure>
                </Card>
              </li>
            );
          })}
        </ul>
        <p className="quotes__more">
          <a
            className="text-action"
            href="https://www.linkedin.com/in/elleta-mcdaniel/details/recommendations/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read all 15 on LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </Section>

      <Section id="new-tricks" label="New tricks">
        <SectionHeader
          heading="Design systems that hold up when"
          accent={<Term id="ai" />}
          after=" shows up."
          lead="AI is part of how I work, not a trick in the deck."
        />
        {/* scan on the left, read on the right (Part J item 2). The
            paragraph text is hers, unchanged; the point wording was
            matched to the words the paragraphs already use, so a point
            and its phrase light each other. */}
        <Spotlight keys={["claude", "tools", "teams", "mango", "bella"]}>
          <ScanRead
            points={
              <>
                <ScanPoint k="claude">
                  <b>Claude</b> for research and audits
                </ScanPoint>
                <ScanPoint k="tools">
                  <b>Figma MCP</b>, Code Connect, Storybook
                </ScanPoint>
                <ScanPoint k="teams">
                  Working <b>with teams</b>, not against them
                </ScanPoint>
                <ScanPoint k="mango">
                  <b>First to bring AI</b> into a design-system team
                </ScanPoint>
                <ScanPoint k="bella">
                  This site runs on <b>BELLA</b>
                </ScanPoint>
              </>
            }
          >
            <p>
              <ScanPhrase k="claude">I use Claude to synthesise research and audits</ScanPhrase>, draft
              docs, and check my own work. I&apos;m happy to try a new tool the week it lands:{" "}
              <ScanPhrase k="tools">
                <span className="nowrap"><Term id="figma-mcp" />,</span>{" "}<span className="nowrap"><Term id="code-connect" />,</span>{" "}
                <span className="nowrap"><Term id="storybook" /></span>
              </ScanPhrase>
              .
            </p>
            <p>
              But the tools are the easy part. A system only sticks when the people using it trust
              it, so <ScanPhrase k="teams">I work with teams, not against them</ScanPhrase>: pairing
              with engineers, bringing designers into the decisions, and building the relationships
              that shape how a company actually uses its system.
            </p>
            <p>
              At Mango I was{" "}
              <ScanPhrase k="mango">the first to bring AI into their design-system work</ScanPhrase>:
              I used it to audit and ship faster while updating the system, then built the tools so
              the team could carry on without me. My most recent example is the site you&apos;re on.{" "}
              <ScanPhrase k="bella">
                It runs on <span className="nowrap"><Term id="bella-system" /></span>
              </ScanPhrase>
              , my own design system: tokens, components in Storybook, and docs an AI can read.
            </p>
            <p>
              <Link href="/design-system" className="text-action">
                See how this site is built <span aria-hidden="true">→</span>
              </Link>
            </p>
          </ScanRead>
        </Spotlight>
      </Section>

      <Section id="house-rules" label="House rules">
        <SectionHeader heading="Four things I" accent={<Term id="care" />} after=" about." />
        <div className="cares reveal-group">
          <Card className="cares__card">
            <h3 className="heading-item">Kindness</h3>
            <p>Docs written for the person reading them at <strong>5pm on a Friday</strong>.</p>
          </Card>
          <Card className="cares__card">
            <h3 className="heading-item">Respect</h3>
            <p>
              For the designer&apos;s craft and the engineer&apos;s time. <strong>I check it can be built</strong>{" "}
              before I design it three ways.
            </p>
          </Card>
          <Card className="cares__card">
            <h3 className="heading-item">Sharing</h3>
            <p>
              I learned all of this in public, from Brad Frost, Vitaly Friedman, Nathan Curtis, Romina
              Kavčić and the Into Design Systems crowd. So I give it back: <strong>BELLA is open for anyone to
              read</strong>.
            </p>
          </Card>
          <Card className="cares__card">
            <h3 className="heading-item">Love of the craft</h3>
            <p>Naming, tokens, <span className="nowrap"><Term id="governance" />.</span> <strong>The unglamorous stuff</strong> is my favourite stuff.</p>
          </Card>
        </div>
      </Section>
    </main>
  );
}
