import OverlayNav from "@/components/OverlayNav";

interface CaseStudyLayoutProps {
  children: React.ReactNode;
}

/**
 * Canonical shell for every case study page.
 * Provides: page background and the overlay nav. The back link lives
 * INSIDE CaseStudyShell's container so it tracks the content column.
 *
 * Replaces CaseStudyShell — CaseStudyShell now re-exports this.
 */
export default function CaseStudyLayout({ children }: CaseStudyLayoutProps) {
  return (
    <main id="main-content" className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />
      <div className="relative">{children}</div>
    </main>
  );
}