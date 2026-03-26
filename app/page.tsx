"use client";

import { useState } from "react";
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

  return (
    <main className="bg-[var(--color-page)] text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <CustomCursor />
      <OverlayNav />

      {/* ═══════════════════════════════════════════════════════════════
          PART 1 — Editorial Landing (full viewport)
          Big typography, staggered entrance, editorial feel.
          ═══════════════════════════════════════════════════════════════ */}
      <Hero />

      {/* ═══════════════════════════════════════════════════════════════
          PART 2 — Dashboard (scrolled into via "View my work")
          Carousel bridges the two worlds, then dashboard content begins.
          WorkSidebar appears once you enter this zone.
          ═══════════════════════════════════════════════════════════════ */}
      <div className="dashboard-zone">
        <Carousel />
        <MetricsStrip />

        {/* Sidebar nav — appears when dashboard zone is in view */}
        <WorkSidebar />

        {/* Dashboard content — offset for sidebar on large screens */}
        <div className="dashboard-content">
          {/* Case Studies */}
          <CaseStudyGrid />

          {/* Process */}
          <ProcessSection />

          {/* Guardian Highlight */}
          <VideoWalkthrough />

          {/* CTRL_ALT_DESIGN Experiments */}
          <CtrlAltDesignSection />

          {/* About */}
          <AboutSection />

          {/* Experience */}
          <ExperienceSection onResumeClick={() => setResumeOpen(true)} />

          {/* Learning & Inspiration */}
          <LearningSection />

          {/* Contact */}
          <ContactSection />
        </div>
      </div>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </main>
  );
}
