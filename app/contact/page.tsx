import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
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
      <section
        style={{
          paddingTop: "calc(var(--header-height) + var(--spacing-8))",
          paddingBottom: "var(--spacing-6)",
        }}
      >
        <div className="layout-container">
          <PageHeader eyebrow="Contact" title="Let&apos;s work together." />
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
