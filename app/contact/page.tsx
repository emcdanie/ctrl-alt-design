import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact, Elleta McDaniel",
  description: "Get in touch, open to full-time roles and select freelance projects.",
};

/* Contact: short and single-purpose. Header, ways to reach her, CTA;
   testimonials live on About. Tight rhythm, no dead first fold. */
export default function ContactPage() {
  return (
    <main id="main-content">
      <OverlayNav />
      <section
        style={{ paddingTop: "calc(var(--header-height) + var(--spacing-8))", paddingBottom: "var(--spacing-4)" }}
      >
        <div className="layout-container">
          <PageHeader eyebrow="Get in touch" title="Contact" />
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
