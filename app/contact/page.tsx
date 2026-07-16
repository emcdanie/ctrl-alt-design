import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import ContactSection from "@/components/ContactSection";
import TestimonialSection from "@/components/TestimonialSection";

export const metadata: Metadata = {
  title: "Contact, Elleta McDaniel",
  description: "Get in touch, open to full-time roles and select freelance projects.",
};

/* Contact is its own route (IA consolidation); ContactSection keeps its
 * form + footer treatment. */
export default function ContactPage() {
  return (
    <main id="main-content" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <OverlayNav />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingTop: "var(--header-height)" }}>
        <section className="layout-section" style={{ paddingBottom: "var(--spacing-8)" }}>
          <div className="layout-container">
            <PageHeader eyebrow="Get in touch" title="Contact" />
          </div>
        </section>
        <TestimonialSection />
        <ContactSection />
      </div>
    </main>
  );
}
