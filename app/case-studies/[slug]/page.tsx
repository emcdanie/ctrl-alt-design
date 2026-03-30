import { notFound } from "next/navigation";
import Image from "next/image";
import { getCaseStudy, getAdjacentStudies, getAllSlugs } from "@/lib/content";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseStudyShell from "@/components/CaseStudyShell";
import { Body, PullQuote, Section, Eyebrow, H2 } from "@/components/CaseStudyTypography";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/** Renders inline **bold** markers inside a paragraph */
function RichBody({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Body>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} style={{ fontWeight: 600, color: "var(--color-ink)" }}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </Body>
  );
}

/** Media block — full-width image inside the content column */
function MediaBlock({
  src,
  alt,
  aspectRatio = "16/10",
}: {
  src: string;
  alt: string;
  aspectRatio?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio,
        width: "100%",
        overflow: "hidden",
        borderRadius: "16px",
        marginBottom: "32px",
        background: "#f0ebe3",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1080px) 100vw, 800px"
      />
    </div>
  );
}

/** Embed block — interactive HTML visual inside the content column */
function EmbedBlock({
  src,
  alt,
  aspectRatio = "3/2",
}: {
  src: string;
  alt: string;
  aspectRatio?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: "16px",
        marginBottom: "32px",
        background: "#f0ebe3",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Desktop: aspect-ratio driven. Mobile: min-height fallback */}
      <div
        style={{
          position: "relative",
          aspectRatio,
          width: "100%",
          minHeight: "360px",
        }}
      >
        <iframe
          src={src}
          title={alt}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: "16px",
          }}
        />
      </div>
    </div>
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

  /* ── Build metadata rows ── */
  const metadata = [
    { label: "Year", value: cs.year },
    cs.metrics?.role ? { label: "Role", value: cs.metrics.role } : null,
    cs.metrics?.team ? { label: "Team", value: cs.metrics.team } : null,
    { label: "Timeline", value: cs.timeline },
    { label: "Scope", value: cs.scope },
  ].filter(Boolean) as { label: string; value: string }[];

  /* ── Determine hero media ── */
  const heroMedia: { type: "video" | "image" | "embed"; src: string } = cs.heroVideo
    ? { type: "video", src: cs.heroVideo }
    : cs.heroImage.endsWith(".html")
      ? { type: "embed", src: cs.heroImage }
      : { type: "image", src: cs.heroImage };

  return (
    <CaseStudyLayout>
      <CaseStudyShell
        eyebrow={`${cs.category} · ${cs.year}`}
        title={cs.title}
        summary={cs.description}
        metadata={metadata}
        tags={cs.tags}
        media={heroMedia}
        demoLinks={cs.demoLinks}
        liveUrl={cs.liveUrl || undefined}
        prev={prev}
        next={next}
      >
        {/* ────────────────────────────────────────────────────────
            VISUAL NARRATIVE — images lead, text supports
            ──────────────────────────────────────────────────────── */}

        {/* Supporting images — right after hero, before text */}
        {cs.images.length > 0 && (
          <div style={{ marginBottom: "48px" }}>
            {cs.images.length === 1 ? (
              <MediaBlock
                src={cs.images[0]}
                alt={`${cs.title} — detail`}
              />
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: cs.images.length >= 3 ? "1fr 1fr" : "1fr 1fr",
                gap: "12px",
              }}>
                {cs.images.map((src, i) => (
                  <MediaBlock
                    key={i}
                    src={src}
                    alt={`${cs.title} — image ${i + 1}`}
                    aspectRatio="4/3"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Narrative mode (detailed sections) ── */}
        {cs.narrative ? (
          <>
            {/* Brief overview — short text, not a wall */}
            <Section eyebrow="OVERVIEW" heading={cs.overview.headline}>
              <RichBody text={cs.overview.body} />
            </Section>

            {cs.narrative.map((section, idx) => {
              // Interleave: after every 3rd section, show full-width image if available
              const showImageAfter = (idx + 1) % 3 === 0 && cs.fullWidthImage;

              return (
                <div key={idx}>
                  <Section
                    eyebrow={section.label || ""}
                    heading={section.heading}
                  >
                    {section.paragraphs.map((para, pIdx) => {
                      const isPullQuote =
                        para.startsWith('"') || para.startsWith("\u201c");
                      return isPullQuote ? (
                        <PullQuote key={pIdx}>{para}</PullQuote>
                      ) : (
                        <RichBody key={pIdx} text={para} />
                      );
                    })}
                  </Section>

                  {/* Embedded visual attached to this section */}
                  {section.embedSrc && (
                    <EmbedBlock
                      src={section.embedSrc}
                      alt={section.embedAlt || `${cs.title} — visual`}
                      aspectRatio={section.embedAspect || "3/2"}
                    />
                  )}

                  {showImageAfter && (
                    <MediaBlock
                      src={cs.fullWidthImage!}
                      alt={`${cs.title} — system view`}
                      aspectRatio="2/1"
                    />
                  )}
                </div>
              );
            })}

            <div style={{ marginBottom: "48px" }}>
              <span
                className="surface-dark"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "8px 20px",
                  borderRadius: "999px",
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {cs.outcomes.completionTag}
              </span>
            </div>
          </>
        ) : (
          /* ── Structured mode ── */
          <>
            <Section eyebrow="OVERVIEW" heading={cs.overview.headline}>
              <RichBody text={cs.overview.body} />
            </Section>

            <Section eyebrow="THE PROBLEM" heading={cs.problem.title}>
              <RichBody text={cs.problem.body} />
            </Section>

            <Section eyebrow="PROCESS" heading={cs.process.title}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}>
                {cs.process.steps.map((step) => (
                  <div
                    key={step.number}
                    className="card-default"
                    style={{ padding: "20px" }}
                  >
                    <span
                      className="eyebrow"
                      style={{ display: "block", marginBottom: "8px" }}
                    >
                      {step.number}
                    </span>
                    <h3
                      className="heading-item"
                      style={{ marginBottom: "6px", fontSize: "15px" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="body-sm"
                      style={{
                        margin: 0,
                        color: "var(--color-ink-soft)",
                        lineHeight: 1.6,
                        fontSize: "13px",
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section eyebrow="OUTCOMES" heading={cs.outcomes.title}>
              <RichBody text={cs.outcomes.body} />
              <div style={{ marginTop: "24px" }}>
                <span
                  className="surface-dark"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "8px 20px",
                    borderRadius: "999px",
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {cs.outcomes.completionTag}
                </span>
              </div>
            </Section>
          </>
        )}

        {/* Full-width closing image */}
        {cs.fullWidthImage && !cs.narrative && (
          <MediaBlock
            src={cs.fullWidthImage}
            alt={`${cs.title} — final view`}
            aspectRatio="2/1"
          />
        )}
      </CaseStudyShell>
    </CaseStudyLayout>
  );
}
