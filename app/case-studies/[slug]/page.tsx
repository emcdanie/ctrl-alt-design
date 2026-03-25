import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCaseStudy, getAdjacentStudies } from "@/data/caseStudies";
import caseStudies from "@/data/caseStudies";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseStudySideCard from "@/components/CaseStudySideCard";
import ArtifactGallery from "@/components/ArtifactGallery";

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

function RichPara({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="body-reading" style={{ marginBottom: "var(--space-md)" }}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} style={{ fontWeight: 600, color: "var(--color-ink)" }}>{part.slice(2, -2)}</strong>
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
      {/* ── Hero area ── */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(96px, 10vh, 140px) var(--space-md) var(--space-lg)",
        }}
      >
        <p className="eyebrow" style={{ marginBottom: "var(--space-sm)" }}>
          {cs.category} · {cs.year}
        </p>
        <h1 className="heading-case-study" style={{ marginBottom: "var(--space-sm)", maxWidth: "720px" }}>
          {cs.title}
        </h1>
        <p className="body-lg" style={{ maxWidth: "600px", color: "var(--color-muted)", fontSize: "18px", lineHeight: 1.65 }}>
          {cs.description}
        </p>
      </div>

      {/* ── Hero media ── */}
      {(cs.heroVideo || cs.heroImage) && (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--space-md) var(--space-xl)" }}>
          <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "16/9", background: "#1A1814" }}>
            {cs.heroVideo ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={cs.heroVideo} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={cs.heroImage}
                alt={cs.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            )}
          </div>
        </div>
      )}

      {/* ── Divider ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--space-md)" }}>
        <div style={{ borderTop: "1px solid var(--color-border-soft)" }} />
      </div>

      {/* ── Two-column layout: Side card + Content ── */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "var(--space-xl) var(--space-md) var(--space-2xl)",
          display: "flex",
          gap: "var(--space-xl)",
          alignItems: "flex-start",
        }}
        className="flex-col lg:flex-row"
      >
        {/* Sticky side card — visible on lg+, stacked on mobile */}
        <div className="w-full lg:w-auto lg:shrink-0" style={{ maxWidth: "340px" }}>
          <CaseStudySideCard
            title={cs.title}
            description={cs.description}
            category={cs.category}
            metadata={metadata}
            tags={cs.tags}
            demoLinks={cs.demoLinks}
            liveUrl={cs.liveUrl || undefined}
          />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: "720px" }}>

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
              <section style={{ marginBottom: "var(--space-section)" }}>
                <p className="eyebrow" style={{ marginBottom: "14px" }}>OVERVIEW</p>
                <h2
                  className="heading-subsection"
                  style={{ marginBottom: "var(--space-md)" }}
                >
                  {cs.overview.headline}
                </h2>
                <RichPara text={cs.overview.body} />
              </section>

              {cs.narrative.map((section, idx) => (
                <section key={idx} style={{ marginBottom: "var(--space-section)" }}>
                  {section.label && (
                    <p className="eyebrow" style={{ marginBottom: "14px" }}>
                      {section.label}
                    </p>
                  )}
                  <h2
                    className="heading-subsection"
                    style={{
                      fontSize: "clamp(22px, 3vw, 30px)",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    {section.heading}
                  </h2>
                  <div>
                    {section.paragraphs.map((para, pIdx) => {
                      const isPullQuote = para.startsWith('"') || para.startsWith('\u201c');
                      return isPullQuote ? (
                        <blockquote key={pIdx} className="pull-quote">
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
                <div style={{ marginBottom: "var(--space-lg)" }}>
                  <p className="eyebrow" style={{ marginBottom: "var(--space-sm)" }}>LIVE DEMOS</p>
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

              <div style={{ marginBottom: "var(--space-section)" }}>
                <span className="surface-dark" style={{ display: "inline-flex", alignItems: "center", padding: "10px 22px", borderRadius: "999px", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {cs.outcomes.completionTag}
                </span>
              </div>
            </div>

          ) : (
            <div>
              <section style={{ marginBottom: "var(--space-xl)", paddingBottom: "var(--space-xl)", borderBottom: "1px solid var(--color-border-soft)" }}>
                <p className="eyebrow" style={{ marginBottom: "14px" }}>OVERVIEW</p>
                <h2 className="heading-subsection" style={{ marginBottom: "var(--space-md)" }}>
                  {cs.overview.headline}
                </h2>
                <RichPara text={cs.overview.body} />
              </section>

              <section style={{ marginBottom: "var(--space-xl)", paddingBottom: "var(--space-xl)", borderBottom: "1px solid var(--color-border-soft)" }}>
                <p className="eyebrow" style={{ marginBottom: "14px" }}>THE PROBLEM</p>
                <h2 className="heading-subsection" style={{ marginBottom: "var(--space-md)" }}>
                  {cs.problem.title}
                </h2>
                <RichPara text={cs.problem.body} />
              </section>

              <section style={{ marginBottom: "var(--space-xl)", paddingBottom: "var(--space-xl)", borderBottom: "1px solid var(--color-border-soft)" }}>
                <p className="eyebrow" style={{ marginBottom: "14px" }}>PROCESS</p>
                <h2 className="heading-subsection" style={{ marginBottom: "var(--space-lg)" }}>
                  {cs.process.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cs.process.steps.map((step) => (
                    <div key={step.number} className="card-default" style={{ padding: "var(--space-md)" }}>
                      <span className="eyebrow" style={{ display: "block", marginBottom: "10px" }}>{step.number}</span>
                      <h3 className="heading-item" style={{ marginBottom: "8px" }}>{step.title}</h3>
                      <p className="body-sm" style={{ margin: 0, color: "var(--color-ink-soft)", lineHeight: 1.65 }}>{step.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section style={{ marginBottom: "var(--space-xl)" }}>
                <p className="eyebrow" style={{ marginBottom: "14px" }}>OUTCOMES</p>
                <h2 className="heading-subsection" style={{ marginBottom: "var(--space-md)" }}>
                  {cs.outcomes.title}
                </h2>
                <RichPara text={cs.outcomes.body} />
                {cs.demoLinks && cs.demoLinks.length > 0 && (
                  <div style={{ marginTop: "var(--space-lg)", marginBottom: "var(--space-md)" }}>
                    <p className="eyebrow" style={{ marginBottom: "var(--space-sm)" }}>LIVE DEMOS</p>
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
                <div style={{ marginTop: "var(--space-lg)" }}>
                  <span className="surface-dark" style={{ display: "inline-flex", alignItems: "center", padding: "10px 22px", borderRadius: "999px", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {cs.outcomes.completionTag}
                  </span>
                </div>
              </section>
            </div>
          )}

          {/* Full-width image */}
          {cs.fullWidthImage && (
            <div style={{ marginBottom: "var(--space-xl)" }}>
              <div className="relative aspect-[2/1] rounded-2xl overflow-hidden">
                <Image src={cs.fullWidthImage} alt={`${cs.title} full view`} fill className="object-cover" sizes="720px" />
              </div>
            </div>
          )}

          {/* Prev / Next */}
          <div style={{ borderTop: "1px solid var(--color-border-soft)", paddingTop: "var(--space-lg)", marginBottom: "var(--space-xl)" }}>
            <div className="flex items-stretch justify-between gap-4">
              {prev ? (
                <Link href={`/case-studies/${prev.slug}`} className="group flex flex-col gap-1.5 max-w-[45%]">
                  <span className="section-label">← Previous</span>
                  <span className="heading-item" style={{ lineHeight: 1.3 }}>{prev.title}</span>
                  <span className="text-meta">{prev.category}</span>
                </Link>
              ) : <div />}
              {next ? (
                <Link href={`/case-studies/${next.slug}`} className="group flex flex-col items-end gap-1.5 max-w-[45%]">
                  <span className="section-label">Next →</span>
                  <span className="heading-item" style={{ lineHeight: 1.3, textAlign: "right" }}>{next.title}</span>
                  <span className="text-meta">{next.category}</span>
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* CTA */}
          <div
            className="surface-dark md:flex-row md:items-center md:justify-between"
            style={{ borderRadius: "24px", padding: "48px 40px", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}
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
      </div>
    </CaseStudyLayout>
  );
}
