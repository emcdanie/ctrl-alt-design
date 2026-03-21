import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCaseStudy, getAdjacentStudies } from "@/data/caseStudies";
import caseStudies from "@/data/caseStudies";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseStudyHero from "@/components/CaseStudyHero";
import ArtifactPlaceholder from "@/components/ArtifactPlaceholder";

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

function RichPara({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "#2C2C2C", lineHeight: 1.75 }}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} style={{ fontWeight: 600, color: "#1A1A1A" }}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const { prev, next } = getAdjacentStudies(slug);

  const metadata = [
    { label: "Year", value: cs.year },
    cs.metrics?.role ? { label: "Role", value: cs.metrics.role } : null,
    cs.metrics?.team ? { label: "Team", value: cs.metrics.team } : null,
    { label: "Timeline", value: cs.timeline },
    { label: "Scope", value: cs.scope },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <CaseStudyLayout>
      <CaseStudyHero
        eyebrow={`${cs.category} · ${cs.year}`}
        title={cs.title}
        intro={cs.description}
        metadata={metadata}
        tags={cs.tags}
        media={
          cs.heroVideo
            ? { type: "video", src: cs.heroVideo }
            : { type: "image", src: cs.heroImage, alt: cs.title }
        }
        liveUrl={cs.liveUrl || undefined}
      />

      {/* ── Divider ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ borderTop: "1px solid rgba(26,24,20,0.1)" }} />
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "64px 24px 80px" }}>

        {/* Supporting images */}
        {cs.images.length > 0 && (
          <div style={{ marginBottom: "64px" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cs.images.map((src, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src={src}
                    alt={`${cs.title} — image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 350px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Narrative or structured content */}
        {cs.narrative ? (
          <div>
            <section style={{ marginBottom: "72px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "#8A8A8A", marginBottom: "12px" }}>OVERVIEW</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.15, marginBottom: "20px" }}>
                {cs.overview.headline}
              </h2>
              <RichPara text={cs.overview.body} />
            </section>

            {cs.narrative.map((section, idx) => (
              <section key={idx} style={{ marginBottom: "72px" }}>
                {section.label && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "#8A8A8A", marginBottom: "12px" }}>
                    {section.label}
                  </p>
                )}
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.2, marginBottom: "20px" }}>
                  {section.heading}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {section.paragraphs.map((para, pIdx) => {
                    const isPullQuote = para.startsWith('"') || para.startsWith('\u201c');
                    return isPullQuote ? (
                      <blockquote key={pIdx} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2.2vw, 22px)", fontStyle: "italic", fontWeight: 400, color: "#1A1A1A", borderLeft: "3px solid #1A1814", paddingLeft: "24px", paddingTop: "12px", paddingBottom: "12px", background: "#F0EDE8", borderRadius: "0 6px 6px 0", margin: "8px 0", lineHeight: 1.5 }}>
                        {para}
                      </blockquote>
                    ) : (
                      <RichPara key={pIdx} text={para} />
                    );
                  })}
                </div>
              </section>
            ))}

            <div style={{ marginBottom: "72px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", borderRadius: "999px", background: "#1A1814", color: "#EDE8DF", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {cs.outcomes.completionTag}
              </span>
            </div>
          </div>

        ) : (
          <div>
            <section style={{ marginBottom: "56px", paddingBottom: "56px", borderBottom: "1px solid rgba(26,24,20,0.08)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "#8A8A8A", marginBottom: "12px" }}>OVERVIEW</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.15, marginBottom: "20px" }}>
                {cs.overview.headline}
              </h2>
              <RichPara text={cs.overview.body} />
            </section>

            <section style={{ marginBottom: "56px", paddingBottom: "56px", borderBottom: "1px solid rgba(26,24,20,0.08)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "#8A8A8A", marginBottom: "12px" }}>THE PROBLEM</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.2, marginBottom: "20px" }}>
                {cs.problem.title}
              </h2>
              <RichPara text={cs.problem.body} />
            </section>

            <div style={{ marginBottom: "56px" }}>
              <ArtifactPlaceholder
                title="Problem Framing Artifact"
                description="Add an audit screenshot or annotated snapshot that documents the core problem context."
                aspectRatio="16/9"
              />
            </div>

            <section style={{ marginBottom: "56px", paddingBottom: "56px", borderBottom: "1px solid rgba(26,24,20,0.08)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "#8A8A8A", marginBottom: "16px" }}>PROCESS</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.2, marginBottom: "28px" }}>
                {cs.process.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cs.process.steps.map((step) => (
                  <div key={step.number} style={{ background: "rgba(255,255,255,0.5)", borderRadius: "12px", padding: "20px", border: "1px solid rgba(26,24,20,0.07)" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "#8A8A8A", display: "block", marginBottom: "8px" }}>{step.number}</span>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600, color: "#1A1A1A", marginBottom: "6px" }}>{step.title}</h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#4A4640", lineHeight: 1.6 }}>{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <div style={{ marginBottom: "56px" }}>
              <ArtifactPlaceholder
                title="Key Deliverable Artifact"
                description="Add a flow diagram, component overview, or final output that captures the implementation direction."
                aspectRatio="4/3"
              />
            </div>

            <section style={{ marginBottom: "56px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "#8A8A8A", marginBottom: "12px" }}>OUTCOMES</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.2, marginBottom: "20px" }}>
                {cs.outcomes.title}
              </h2>
              <RichPara text={cs.outcomes.body} />
              <div style={{ marginTop: "32px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", borderRadius: "999px", background: "#1A1814", color: "#EDE8DF", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {cs.outcomes.completionTag}
                </span>
              </div>
            </section>
          </div>
        )}

        {/* Full-width image */}
        {cs.fullWidthImage && (
          <div style={{ marginBottom: "64px" }}>
            <div className="relative aspect-[2/1] rounded-2xl overflow-hidden">
              <Image src={cs.fullWidthImage} alt={`${cs.title} full view`} fill className="object-cover" sizes="760px" />
            </div>
          </div>
        )}

        {/* Prev / Next */}
        <div style={{ borderTop: "1px solid rgba(26,24,20,0.1)", paddingTop: "48px", marginBottom: "64px" }}>
          <div className="flex items-stretch justify-between gap-4">
            {prev ? (
              <Link href={`/case-studies/${prev.slug}`} className="group flex flex-col gap-1.5 max-w-[45%]">
                <span className="section-label">← Previous</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600, color: "#1A1814", lineHeight: 1.3 }}>{prev.title}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#8A8480" }}>{prev.category}</span>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/case-studies/${next.slug}`} className="group flex flex-col items-end gap-1.5 max-w-[45%]">
                <span className="section-label">Next →</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600, color: "#1A1814", lineHeight: 1.3, textAlign: "right" }}>{next.title}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#8A8480" }}>{next.category}</span>
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{ background: "#1A1814", borderRadius: "24px", padding: "56px 48px", display: "flex", flexDirection: "column", gap: "32px" }}
          className="md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", marginBottom: "10px" }}>Have a project in mind?</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15, textTransform: "uppercase" }}>
              Open to full-time roles &<br />select freelance projects.
            </h2>
          </div>
          <Link
            href="/#contact"
            style={{ flexShrink: 0, background: "#EDE8DF", color: "#1A1814", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "13px", padding: "12px 24px", borderRadius: "999px", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}
          >
            Get in touch ↗
          </Link>
        </div>

      </div>
    </CaseStudyLayout>
  );
}
