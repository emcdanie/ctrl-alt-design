import OverlayNav from "@/components/OverlayNav";
import BackToWorkButton from "@/components/BackToWorkButton";

interface CaseStudyLayoutProps {
  children: React.ReactNode;
}

/**
 * Canonical shell for every case study page.
 * Provides: page background, overlay nav, sticky back button.
 *
 * Replaces CaseStudyShell — CaseStudyShell now re-exports this.
 */
export default function CaseStudyLayout({ children }: CaseStudyLayoutProps) {
  return (
    <main className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />
      <BackToWorkButton />
      <div className="relative">{children}</div>
    </main>
  );
}