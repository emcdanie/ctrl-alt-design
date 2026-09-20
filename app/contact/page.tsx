import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact, Elleta McDaniel",
  description: "Get in touch, open to full-time roles and select freelance projects.",
};

/* Contact rebuild (2026-07-17): ONE display heading on the page, then
   the panel, then the footer bar. Short and single-purpose. */
export default function ContactPage() {
  return (
    <main id="main-content">
      <OverlayNav />
      <Section id="contact" labelledBy="contact-title">
        <SectionHeader as="h1" id="contact-title" kicker="Contact" heading="Let&apos;s work" accent="together" after="." />
      </Section>
      <ContactSection />
    </main>
  );
}
