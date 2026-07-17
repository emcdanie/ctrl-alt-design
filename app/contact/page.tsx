import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";

export const metadata: Metadata = {
  title: "Contact, Elleta McDaniel",
  description: "Get in touch, open to full-time roles and select freelance projects.",
};

/* Contact: compact bubble hero, social proof strip, then the form.
   No 100dvh flex-end push: the first screen holds the bubble and the
   start of the proof/form instead of a half-empty fold. */
export default function ContactPage() {
  return (
    <main id="main-content">
      <OverlayNav />
      <section
        className="layout-section-tight"
        style={{ paddingTop: "calc(var(--header-height) + var(--spacing-8))" }}
      >
        <div className="layout-container">
          <PageHeader eyebrow="Get in touch" title="Contact" variant="bubble" />
        </div>
      </section>
      <TestimonialSection />
      <ContactSection />
    </main>
  );
}
