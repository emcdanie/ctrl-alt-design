"use client";

import { useState, useRef, useCallback } from "react";
import CustomCursor from "@/components/CustomCursor";
import OverlayNav from "@/components/OverlayNav";
import Hero from "@/components/Hero";
import Carousel from "@/components/Carousel";
import MetricsStrip from "@/components/MetricsStrip";
import CaseStudyGrid from "@/components/CaseStudyGrid";
import ProcessSection from "@/components/ProcessSection";
import VideoWalkthrough from "@/components/VideoWalkthrough";
import CtrlAltDesignSection from "@/components/CtrlAltDesignSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import LearningSection from "@/components/LearningSection";
import ContactSection from "@/components/ContactSection";
import ResumeModal from "@/components/ResumeModal";
import WorkSidebar from "@/components/WorkSidebar";

export default function Home() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  /** Scroll the snap shell to the dashboard view */
  const enterDashboard = useCallback(() => {
    const dash = shellRef.current?.querySelector<HTMLElement>(".view-dashboard");
    dash?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div ref={shellRef} className="snap-shell">
      <CustomCursor />
      <OverlayNav />

      {/* ═══════════════════════════════════════════════════════════════
          VIEW 1 — Landing  (hero + carousel, fills viewport)
          Normal site landing. Name, tagline, CTA, carousel.
          ═══════════════════════════════════════════════════════════════ */}
      <section className="view-landing">
        <Hero onEnterDashboard={enterDashboard} />
        <Carousel />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          VIEW 2 — Dashboard  (sidebar + scrollable content)
          Triggered by scroll or CTA click. Sidebar appears.
          Content scrolls inside the panel. Nav bar stays.
          ═══════════════════════════════════════════════════════════════ */}
      <section className="view-dashboard">
        {/* Sidebar — only visible in this view */}
        <WorkSidebar />

        {/* Scrollable content panel */}
        <div className="dashboard-panel">
          <CaseStudyGrid />
          <MetricsStrip />
          <ProcessSection />
          <VideoWalkthrough />
          <CtrlAltDesignSection />
          <AboutSection />
          <ExperienceSection onResumeClick={() => setResumeOpen(true)} />
          <LearningSection />
          <ContactSection />
        </div>
      </section>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
