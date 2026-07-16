import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact — Elleta McDaniel",
  description: "Get in touch — open to full-time roles and select freelance projects.",
};

/* Contact is its own route (IA consolidation); ContactSection keeps its
 * form + footer treatment. */
export default function ContactPage() {
  return (
    <main id="main-content" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <OverlayNav />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingTop: "var(--header-height)" }}>
        <ContactSection />
      </div>
    </main>
  );
}
