import OverlayNav from "@/components/OverlayNav";

interface CaseStudyLayoutProps {
  children: React.ReactNode;
}

/**
 * Canonical shell for every case study page.
 * Provides: page background and the overlay nav. The back link lives
 * INSIDE CaseStudyShell's container so it tracks the content column.
 *
 * Composes WITH CaseStudyShell (Layout = background + nav; Shell = case
 * header/meta/footer). They are separate live components; the page nests
 * CaseStudyShell inside CaseStudyLayout.
 */
export default function CaseStudyLayout({ children }: CaseStudyLayoutProps) {
  return (
    <main id="main-content" className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />
      <div className="relative">{children}</div>
    </main>
  );
}