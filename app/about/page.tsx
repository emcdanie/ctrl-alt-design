import Link from "next/link";
import OverlayNav from "@/components/OverlayNav";
import GetInTouch from "@/components/GetInTouch";
import PawTrail from "@/components/PawTrail";
import Heading from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import Section, { SectionList, SectionTags } from "@/components/Section";
import WorkedWith from "@/components/WorkedWith";
import ExperienceSection from "@/components/ExperienceSection";

/* About: hero, then short lead, track record, the pack, (testimonials
   to come), new tricks and house rules on the shared Section, a paw trail
   in each gap, and a closing contact card with the one Get in touch.
   Copy is Elleta's, used verbatim. */
export default function AboutPage() {
  return (
    <main id="main-content" className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />

      {/* Hero: the Section hero variant, directly under the nav */}
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
        side={<SectionTags items={["Figma", "Storybook", "React", "Design tokens", "Accessibility", "Governance"]} />}
      >
        <ExperienceSection />
      </Section>

      <Section trail id="the-pack" label="The pack" title="Good" accent="company" after="." wide>
        <WorkedWith />
      </Section>

      {/* Testimonials slot: content coming. */}

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
          <div>
            <h3 className="heading-item">Kindness</h3>
            <p>Docs written for the person reading them at <strong>5pm on a Friday</strong>.</p>
          </div>
          <div>
            <h3 className="heading-item">Respect</h3>
            <p>
              For the designer&apos;s craft and the engineer&apos;s time. <strong>I check it can be built</strong>{" "}
              before I design it three ways.
            </p>
          </div>
          <div>
            <h3 className="heading-item">Sharing</h3>
            <p>
              I learned all of this in public, from Brad Frost, Vitaly Friedman, Nathan Curtis, Romina
              Kavčić and the Into Design Systems crowd. So I give it back: <strong>BELLA is open for anyone to
              read</strong>.
            </p>
          </div>
          <div>
            <h3 className="heading-item">Love of the craft</h3>
            <p>Naming, tokens, governance. <strong>The unglamorous stuff</strong> is my favourite stuff.</p>
          </div>
        </div>
      </Section>

      {/* Contact card: the page's one contact CTA (the nav keeps its own) */}
      <section id="contact" className="section section--ruled" aria-labelledby="contact-title">
        <PawTrail />
        <div className="container">
          <div className="contact-close">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="contact-close__photo" src="/images/thumbnails/Me.jpeg" alt="Elleta McDaniel" width={240} height={240} />
            <div className="contact-close__text">
              <Heading tier="section" as="h2" id="contact-title" accent="notes" after=".">
                Let&apos;s compare
              </Heading>
              <p className="text-lead contact-close__lead">
                Open to full-time roles and select freelance projects, working remotely from near Barcelona.
              </p>
              <ul className="text-body contact-close__lines">
                <li>Straight to me: you talk to the person designing your system.</li>
                <li>EU working hours, remote-first.</li>
                <li>We start small: an audit or one component.</li>
              </ul>
              <GetInTouch />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
