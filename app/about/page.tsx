import Image from "next/image";
import Link from "next/link";
import OverlayNav from "@/components/OverlayNav";
import Heading from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import Section, { SectionList } from "@/components/Section";
import Card from "@/components/ui/Card";
import { TESTIMONIALS } from "@/content/testimonials";
import WorkedWith from "@/components/WorkedWith";
import ExperienceSection from "@/components/ExperienceSection";

/* About: hero, then short lead, track record, the pack, (testimonials
   to come), new tricks and house rules on the shared Section, a paw trail
   in each gap; the site footer carries the closing contact band.
   Copy is Elleta's, used verbatim. */
export default function AboutPage() {
  return (
    <main id="main-content" className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />

      {/* Hero: the Section hero variant, one section gap under the nav */}
      <Section
        variant="hero"
        id="about-hero"
        title="Fluent in design, code and"
        accent="dog"
        after="."
        lede={
          <>
            I build design systems that give designers and developers a <strong>shared language</strong>: tokens,
            components, and the decisions behind them, written down kindly so everyone can use them.
          </>
        }
        side={
          <figure className="section-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="section-figure__art"
              src="/images/bella/set/elleta-bella-obi-walk.webp"
              alt="Illustration: Elleta walking her dogs Bella and Obi on leads."
              width={1216}
              height={1095}
            />
            <figcaption className="text-meta">
              Bella speaks dog, I speak design. We agreed on five words. That&apos;s a design{" "}
              <span className="nowrap">
                system.
                <span className="caption-heart" aria-hidden="true">
                  <Icon name="HeartSolid" style={{ width: "0.9em", height: "0.9em" }} />
                </span>
              </span>
            </figcaption>
          </figure>
        }
      />

      <Section
        trail
        id="short-lead"
        label="The short lead"
        title="A shared language, not a"
        accent="rulebook"
        after="."
        lede="A product grows faster than the rules holding it together."
        side={
          <SectionList
            items={[
              "Token architecture",
              "Component libraries in Storybook",
              "Governance and contribution",
              "AI-ready docs and MCP",
            ]}
          />
        }
      >
        <p>
          Components get duplicated. Decisions get made under sprint pressure and nobody writes them
          down. The file meant to be the <strong>source of truth</strong> turns into the one nobody trusts.
          Digging out the structure underneath, <strong>so design and dev can talk again</strong>, is the part
          I&apos;d do for free.
        </p>
      </Section>

      <Section
        trail
        id="track-record"
        label="Track record"
        title="Where I've"
        accent="been"
        after="."
      >
        <ExperienceSection />
      </Section>

      <Section
        trail
        id="the-pack"
        label="The pack"
        title="Good"
        accent="company"
        after="."
        art={<Image className="illo" src="/images/bella/set/bella-and-obi.webp" alt="" width={1040} height={900} />}
      >
        <WorkedWith />
      </Section>

      <Section trail id="word-of-mouth" label="Word of mouth" title="In their own" accent="words" after=".">
        <ul className="quotes">
          {TESTIMONIALS.map((t) => (
            <li key={t.name}>
              <Card className="quotes__card">
                <blockquote className="quotes__quote">
                  <p>{t.quote}</p>
                </blockquote>
                <p className="quotes__name">
                  {t.href ? (
                    <a href={t.href} target="_blank" rel="noopener noreferrer">
                      {t.name}
                      <span className="sr-only"> (LinkedIn, opens in a new tab)</span>
                    </a>
                  ) : (
                    t.name
                  )}
                </p>
                <p className="text-meta quotes__role">{[t.role, t.company].filter(Boolean).join(" · ")}</p>
              </Card>
            </li>
          ))}
        </ul>
        <p>
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

      <Section
        trail
        id="new-tricks"
        label="New tricks"
        title="Design systems that don't fall apart when"
        accent="AI"
        after=" shows up."
        lede="AI is part of how I work, not a trick in the deck."
        side={
          <SectionList
            items={[
              "Claude for synthesis and audits",
              "Figma MCP and Code Connect",
              "Storybook as the source of truth",
              "Pairing with engineers",
              "Decisions written down, together",
            ]}
          />
        }
      >
        <p>
          I use Claude to <strong>synthesise research and audits</strong>, draft docs, and check my own work. I&apos;m
          happy to try a new tool the week it lands: Figma MCP, Code Connect, Storybook. But the tools
          are the easy part. A system only sticks when the people using it trust it, so <strong>I work with
          teams, not against them</strong>: pairing with engineers, bringing designers into the decisions, and
          building the relationships that shape how a company actually uses its system.
        </p>
        <p>
          At Mango I was <strong>the first to bring AI into their design-system work</strong>: I used it to audit and
          ship faster while updating the system, then built the tools so the team could carry on
          without me. My most recent example is the site you&apos;re on. It runs on <strong>BELLA, my own
          design system</strong>: tokens, components in Storybook, and docs an AI can read.
        </p>
        <p>
          <Link href="/design-system" className="text-action">
            See how this site is built →
          </Link>
        </p>
      </Section>

      <Section trail id="house-rules" label="House rules" title="Four things I" accent="care" after=" about.">
        <div className="cares">
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
            <p>Naming, tokens, governance. <strong>The unglamorous stuff</strong> is my favourite stuff.</p>
          </Card>
        </div>
      </Section>
    </main>
  );
}
