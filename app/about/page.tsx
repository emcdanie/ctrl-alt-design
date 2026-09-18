"use client";

import { useState } from "react";
import OverlayNav from "@/components/OverlayNav";
import Heading from "@/components/ui/Heading";
import SectionHeader from "@/components/ui/SectionHeader";
import Section, { SectionList } from "@/components/Section";
import WorkedWith from "@/components/WorkedWith";
import ExperienceSection from "@/components/ExperienceSection";
import ResumeModal from "@/components/ResumeModal";
import ContactActions from "@/components/ContactActions";

/* About, minimal (specs/about-rebuild/design.md, CONCEPT LOCK 18 Sep
   2026): Hi, Worked with, Experience, Say hi. Everything else was cut on
   purpose and comes back one piece at a time, each its own decision.
   Style rule: no eyebrow labels, no one-purple-word headlines, no card
   grids. */
export default function AboutPage() {
  const [resumeOpen, setResumeOpen] = useState(false);
  return (
    <main id="main-content" className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />

      {/* Hi. TODO(elleta): the two lines are drafted from her own copy
          ("I read code", "AI-enabled design systems"); confirm or
          replace. */}
      {/* Flat hero: starts directly under the nav, no card, no gap */}
      <section className="about-hi-section">
        <div className="page-container about-hi">
          <div className="about-hi__text">
            <Heading tier="page" as="h1">
              Hi, I&apos;m Elleta.
            </Heading>
            <p className="body-lg about-hi__line">
              I design AI-enabled design systems, and I read the code they ship in.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="about-hi__art"
            src="/images/about/elleta-bella-walk.png"
            alt="Illustration: Elleta walking her dog Bella on a lead."
            width={628}
            height={880}
          />
        </div>
      </section>

      <Section
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

      <WorkedWith />

      <ExperienceSection onResumeClick={() => setResumeOpen(true)} />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />

      <section id="say-hi" className="layout-section-tight">
        <div className="page-container">
          <SectionHeader title="Say hi" />
          <ContactActions />
        </div>
      </section>
    </main>
  );
}
