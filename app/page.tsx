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

export default function Home() {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <main className="bg-[var(--color-page)] text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <CustomCursor />
      <OverlayNav />

      {/* 1 — Hero */}
      <Hero />
      <Carousel />
      <MetricsStrip />

      {/* 2 — Case Studies */}
      <CaseStudyGrid />

      {/* 2b — Process (anchors footer #process link) */}
      <ProcessSection />

      {/* 3 — Guardian Highlight */}
      <VideoWalkthrough />

      {/* 4 — CTRL_ALT_DESIGN Experiments */}
      <CtrlAltDesignSection />

      {/* 5 — About */}
      <AboutSection />

      {/* 6 — Experience */}
      <ExperienceSection onResumeClick={() => setResumeOpen(true)} />

      {/* 7 — Learning & Inspiration */}
      <LearningSection />

      {/* 8 — Contact */}
      <ContactSection />

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </main>
  );
}
