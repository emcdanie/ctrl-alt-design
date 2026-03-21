"use client";

import { useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import OverlayNav from "@/components/OverlayNav";
import Hero from "@/components/Hero";
import Carousel from "@/components/Carousel";
import MetricsStrip from "@/components/MetricsStrip";
import CaseStudyGrid from "@/components/CaseStudyGrid";
import VideoWalkthrough from "@/components/VideoWalkthrough";
import CtrlAltDesignSection from "@/components/CtrlAltDesignSection";
import ExperienceSection from "@/components/ExperienceSection";
import AboutSection from "@/components/AboutSection";
import PersonalSection from "@/components/PersonalSection";
import ContactSection from "@/components/ContactSection";
import ResumeModal from "@/components/ResumeModal";

export default function Home() {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <main className="bg-[#EDE8DF] text-[#1A1A1A] min-h-screen overflow-x-hidden">
      <CustomCursor />
      <OverlayNav />
      <Hero />
      <Carousel />
      <MetricsStrip />
      <CaseStudyGrid />
      <VideoWalkthrough />
      <CtrlAltDesignSection />
      <AboutSection />
      <PersonalSection />
      <ExperienceSection onResumeClick={() => setResumeOpen(true)} />
      <ContactSection />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </main>
  );
}
