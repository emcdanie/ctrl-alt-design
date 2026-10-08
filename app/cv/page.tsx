"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import Heading from "@/components/ui/Heading";
import ResumeModal from "@/components/ResumeModal";

export default function CvPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  return (
    <>
      <OverlayNav />
      <Section id="cv" labelledBy="cv-heading">
        <Heading as="h1" tier="page" id="cv-heading">CV</Heading>
      </Section>
      <ResumeModal open={open} onClose={() => { setOpen(false); router.push("/"); }} />
    </>
  );
}
