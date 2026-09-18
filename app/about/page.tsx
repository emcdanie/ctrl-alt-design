"use client";

import { useState } from "react";
import OverlayNav from "@/components/OverlayNav";
import Heading from "@/components/ui/Heading";
import SectionHeader from "@/components/ui/SectionHeader";
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
      <section className="layout-section-tight" style={{ paddingTop: "calc(var(--header-height) + var(--spacing-12))" }}>
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
