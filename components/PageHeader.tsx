import Heading from "@/components/ui/Heading";

/* Shared page open (flat-headers pass 2026-07-17): eyebrow (Geist caps,
   tracked) + Heading page tier, flat on the ground. Bubble page
   headers are PARKED; the bubble language may return in the expression
   pass (git history is the archive). */
export default function PageHeader({
  eyebrow,
  title,
  accent,
}: {
  eyebrow: string;
  title: string;
  /** accent segment in iris after the title */
  accent?: string;
}) {
  return (
    <header className="layout-header">
      <p className="eyebrow" style={{ marginBottom: "var(--spacing-4)" }}>
        {eyebrow}
      </p>
      <Heading tier="page" as="h1" accent={accent}>
        {title}
      </Heading>
    </header>
  );
}
