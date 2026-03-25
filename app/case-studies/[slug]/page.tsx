import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCaseStudy, getAdjacentStudies } from "@/data/caseStudies";
import caseStudies from "@/data/caseStudies";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseStudyHero from "@/components/CaseStudyHero";
import ArtifactGallery from "@/components/ArtifactGallery";

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

function RichPara({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "#2C2C2C", lineHeight: 1.8, marginBottom: "24px" }}>
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
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "72px 24px 96px" }}>

        {/* Supporting images */}
        {cs.images.length > 0 && (
          <ArtifactGallery
            items={cs.images.map((src, i) => ({
              src,
              alt: `${cs.title} — image ${i + 1}`,
              aspectRatio: "4/3",
            }))}
            columns={2}
            className="mb-16"
          />
        )}

        {/* Narrative or structured content */}
        {cs.narrative ? (
          <div>
            <section style={{ marginBottom: "80px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8A8A8A", marginBottom: "14px" }}>OVERVIEW</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.12, marginBottom: "24px" }}>
                {cs.overview.headline}
              </h2>
              <RichPara text={cs.overview.body} />
            </section>

            {cs.narrative.map((section, idx) => (
              <section key={idx} style={{ marginBottom: "80px" }}>
                {section.label && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8A8A8A", marginBottom: "14px" }}>
                    {section.label}
                  </p>
                )}
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3.2vw, 34px)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.15, marginBottom: "24px" }}>
                  {section.heading}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {section.paragraphs.map((para, pIdx) => {
                    const isPullQuote = para.startsWith('"') || para.startsWith('\u201c');
                    return isPullQuote ? (
                      <blockquote key={pIdx} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(19px, 2.4vw, 24px)", fontStyle: "italic", fontWeight: 400, color: "#2C2A28", borderLeft: "3px solid #3A3430", paddingLeft: "28px", paddingTop: "20px", paddingBottom: "20px", paddingRight: "8px", background: "#F5F2EE", borderRadius: "0 6px 6px 0", margin: "24px 0", lineHeight: 1.55 }}>
                        {para}
                      </blockquote>
                    ) : (
                      <RichPara key={pIdx} text={para} />
                    );
                  })}
                </div>
              </section>
            ))}

            {cs.demoLinks && cs.demoLinks.length > 0 && (
              <div style={{ marginBottom: "48px" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8A8A8A", marginBottom: "16px" }}>LIVE DEMOS</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {cs.demoLinks.map((demo) => (
                    <a
                      key={demo.href}
                      href={demo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="demo-link"
                    >
                      <span style={{ fontSize: "14px" }}>↗</span> {demo.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: "80px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", padding: "10px 22px", borderRadius: "999px", background: "#1A1814", color: "#EDE8DF", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {cs.outcomes.completionTag}
              </span>
            </div>
          </div>

        ) : (
          <div>
            <section style={{ marginBottom: "64px", paddingBottom: "64px", borderBottom: "1px solid rgba(26,24,20,0.08)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8A8A8A", marginBottom: "14px" }}>OVERVIEW</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.12, marginBottom: "24px" }}>
                {cs.overview.headline}
              </h2>
              <RichPara text={cs.overview.body} />
            </section>

            <section style={{ marginBottom: "64px", paddingBottom: "64px", borderBottom: "1px solid rgba(26,24,20,0.08)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8A8A8A", marginBottom: "14px" }}>THE PROBLEM</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3.2vw, 34px)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.15, marginBottom: "24px" }}>
                {cs.problem.title}
              </h2>
              <RichPara text={cs.problem.body} />
            </section>

            <section style={{ marginBottom: "64px", paddingBottom: "64px", borderBottom: "1px solid rgba(26,24,20,0.08)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8A8A8A", marginBottom: "14px" }}>PROCESS</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3.2vw, 34px)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.15, marginBottom: "32px" }}>
                {cs.process.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cs.process.steps.map((step) => (
                  <div key={step.number} style={{ background: "rgba(255,255,255,0.55)", borderRadius: "14px", padding: "24px", border: "1px solid rgba(26,24,20,0.07)" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8A8A8A", display: "block", marginBottom: "10px" }}>{step.number}</span>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px", lineHeight: 1.3 }}>{step.title}</h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#4A4640", lineHeight: 1.65, margin: 0 }}>{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: "64px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8A8A8A", marginBottom: "14px" }}>OUTCOMES</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3.2vw, 34px)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.15, marginBottom: "24px" }}>
                {cs.outcomes.title}
              </h2>
              <RichPara text={cs.outcomes.body} />
              {cs.demoLinks && cs.demoLinks.length > 0 && (
                <div style={{ marginTop: "36px", marginBottom: "32px" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8A8A8A", marginBottom: "16px" }}>LIVE DEMOS</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    {cs.demoLinks.map((demo) => (
                      <a
                        key={demo.href}
                        href={demo.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="demo-link"
                      >
                        <span style={{ fontSize: "14px" }}>↗</span> {demo.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ marginTop: "36px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "10px 22px", borderRadius: "999px", background: "#1A1814", color: "#EDE8DF", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
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
