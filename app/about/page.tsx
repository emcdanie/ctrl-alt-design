"use client";

import { useState } from "react";
import Link from "next/link";
import OverlayNav from "@/components/OverlayNav";
import Heading from "@/components/ui/Heading";
import Section, { SectionList, SectionTags } from "@/components/Section";
import PawTrail from "@/components/PawTrail";
import WorkedWith from "@/components/WorkedWith";
import ExperienceSection from "@/components/ExperienceSection";
import ResumeModal from "@/components/ResumeModal";

/* About (step 3, 18 Sep 2026): flat hero, six numbered sections built
   from the shared Section, a paw trail in each gap, and a close that
   hands off to the one contact CTA. Copy is Elleta's, used verbatim. */
export default function AboutPage() {
  const [resumeOpen, setResumeOpen] = useState(false);
  return (
    <main id="main-content" className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />

      {/* Flat hero: starts directly under the nav, no card, no gap */}
      <section className="about-hi-section">
        <div className="page-container about-hi">
          <div className="about-hi__text">
            <Heading tier="page" as="h1" accent="dog" after=".">
              Fluent in design, code and
            </Heading>
            <p className="body-lg about-hi__line">
              I build design systems that give designers and developers a shared language: tokens,
              components, and the decisions behind them, written down kindly so everyone can use them.
            </p>
          </div>
          <figure className="about-hi__figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="about-hi__art"
              src="/images/about/elleta-bella-walk.png"
              alt="Illustration: Elleta walking her dog Bella on a lead."
              width={628}
              height={880}
            />
            <figcaption className="about-hi__caption">
              Bella speaks dog, I speak design. We agreed on five words. That&apos;s a design system.
            </figcaption>
          </figure>
        </div>
      </section>

      <PawTrail from={0.86} to={0.03} />
      <Section
        id="short-version"
        index="01"
        label="the short version"
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
          down. The file meant to be the source of truth turns into the one nobody trusts. Digging out
          the structure underneath, so design and dev can talk again, is the part I&apos;d do for free.
        </p>
      </Section>

      <PawTrail from={0.03} to={0.74} />
      <Section
        id="lately"
        index="02"
        label="lately"
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
          I use Claude to synthesise research and audits, draft docs, and check my own work. I&apos;m
          happy to try a new tool the week it lands: Figma MCP, Code Connect, Storybook. But the tools
          are the easy part. A system only sticks when the people using it trust it, so I work with
          teams, not against them: pairing with engineers, bringing designers into the decisions, and
          building the relationships that shape how a company actually uses its system.
        </p>
        <p>
          At Mango I was the first to bring AI into their design-system work: I used it to audit and
          ship faster while updating the system, then built the tools so the team could carry on
          without me. My most recent example is the site you&apos;re on. It runs on BELLA, my own
          design system: tokens, components in Storybook, and docs an AI can read.
        </p>
        <p>
          <Link href="/design-system" className="text-action">
            See how this site is built →
          </Link>
        </p>
      </Section>

      <PawTrail from={0.74} to={0.03} />
      <Section id="worked-with" index="03" label="worked with" title="Good" accent="company" after=".">
        <WorkedWith />
      </Section>

      <PawTrail from={0.03} to={0.74} />
      <Section id="cares" index="04" label="what I care about" title="Four things I" accent="care" after=" about.">
        <div className="cares">
          <div>
            <h3 className="heading-item">Kindness</h3>
            <p>Docs written for the person reading them at 5pm on a Friday.</p>
          </div>
          <div>
            <h3 className="heading-item">Respect</h3>
            <p>
              For the designer&apos;s craft and the engineer&apos;s time. I check it can be built
              before I design it three ways.
            </p>
          </div>
          <div>
            <h3 className="heading-item">Sharing</h3>
            <p>
              I learned all of this in public, from Brad Frost, Vitaly Friedman, Nathan Curtis, Romina
              Kavčić and the Into Design Systems crowd. So I give it back: BELLA is open for anyone to
              read.
            </p>
          </div>
          <div>
            <h3 className="heading-item">Love of the craft</h3>
            <p>Naming, tokens, governance. The unglamorous stuff is my favourite stuff.</p>
          </div>
        </div>
      </Section>

      <PawTrail from={0.74} to={0.03} />
      <Section
        id="experience"
        index="05"
        label="experience"
        title="Where I've"
        accent="been"
        after="."
        side={<SectionTags items={["Figma", "Storybook", "React", "Design tokens", "Accessibility", "Governance"]} />}
      >
        <ExperienceSection onResumeClick={() => setResumeOpen(true)} />
      </Section>
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />

      <PawTrail from={0.03} to={0.74} />
      {/* TODO(elleta): placeholder copy from the build prompt, review */}
      <Section id="how-i-work" index="06" label="how I work" title="Simple, on" accent="purpose" after=".">
        <ol className="how">
          <li>
            <span className="how__num">01</span>
            <div>
              <h3 className="heading-item">You work with me</h3>
              <p>No account managers, no hand-offs. The person you talk to is the person doing the work.</p>
            </div>
          </li>
          <li>
            <span className="how__num">02</span>
            <div>
              <h3 className="heading-item">Remote, EU hours</h3>
              <p>Based near Barcelona, working with teams across Europe.</p>
            </div>
          </li>
          <li>
            <span className="how__num">03</span>
            <div>
              <h3 className="heading-item">Small first step</h3>
              <p>We start with an audit or one component, so you see how I work before committing.</p>
            </div>
          </li>
        </ol>
      </Section>

      {/* Close: one line and a text link. The one contact CTA is the
          footer's Get in touch; until the site footer ships (step 5) the
          link goes to /contact. */}
      <section className="about-close" aria-labelledby="about-close-title">
        <div className="page-container">
          <div className="about-close__row">
            <Heading tier="section" as="h2" id="about-close-title" accent="notes" after=".">
              Let&apos;s compare
            </Heading>
            <Link href="/contact" className="text-action">
              Start a conversation →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
