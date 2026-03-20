"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Carousel from "@/components/Carousel";
import CaseStudyGrid from "@/components/CaseStudyGrid";
import VideoWalkthrough from "@/components/VideoWalkthrough";
import ProcessSection from "@/components/ProcessSection";
import CtrlAltDesignSection from "@/components/CtrlAltDesignSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import ResumeModal from "@/components/ResumeModal";

export default function Home() {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <main className="bg-[#EDE8DF] text-[#1A1814] min-h-screen overflow-x-hidden">
      <Header onResumeClick={() => setResumeOpen(true)} />
      <Hero />
      <Carousel />
      <CaseStudyGrid />
      <VideoWalkthrough />
      <ProcessSection />
      <CtrlAltDesignSection />
      <ExperienceSection />
      <ContactSection />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </main>
  );
}
