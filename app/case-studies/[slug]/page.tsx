import { notFound } from "next/navigation";
import Image from "next/image";
import { getCaseStudy, getAdjacentStudies, getAllSlugs, type CaseBlock } from "@/lib/content";
import PrototypeEmbed from "@/components/PrototypeEmbed";
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
        borderRadius: "var(--radius-xl)",
        marginBottom: "var(--spacing-8)",
        background: "var(--color-semantic-surface)",
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
        borderRadius: "var(--radius-xl)",
        marginBottom: "var(--spacing-8)",
        background: "var(--color-semantic-surface)",
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
            borderRadius: "var(--radius-xl)",
          }}
        />
      </div>
    </div>
  );
}

/* ── Block renderer — the ONE render path for case bodies ── */
function Block({ block, title }: { block: CaseBlock; title: string }) {
  switch (block.kind) {
    case "paragraph":
      return <RichBody text={block.text} />;
    case "pullQuote":
      return <PullQuote>{block.text}</PullQuote>;
    case "embed": {
      const dark = block.frame === "dark";
      return (
        <div
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            borderRadius: "var(--radius-2xl)",
            marginTop: "var(--spacing-6)",
            marginBottom: "var(--spacing-6)",
            background: dark ? "var(--color-brand-ink)" : "var(--color-semantic-surface)",
            border: dark
              ? "1px solid var(--color-alpha-parchment-6)"
              : "1px solid var(--color-semantic-border-subtle)",
          }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: block.aspect ?? "16/10",
              width: "100%",
              minHeight: `${block.minHeight ?? 480}px`,
            }}
          >
            <iframe
              src={block.src}
              title={block.title}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "var(--radius-2xl)",
              }}
            />
          </div>
        </div>
      );
    }
    case "video":
      return (
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "var(--radius-2xl)",
            overflow: "hidden",
            background: "var(--color-brand-ink)",
            boxShadow: "var(--shadow-lg)",
            marginTop: "var(--spacing-6)",
            marginBottom: "var(--spacing-6)",
          }}
        >
          <video autoPlay muted loop playsInline title={block.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
            <source src={block.src} type="video/mp4" />
          </video>
        </div>
      );
    case "youtube":
      return (
        <div style={{ marginTop: "var(--spacing-6)", marginBottom: "var(--spacing-6)" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "var(--radius-2xl)",
              overflow: "hidden",
              background: "var(--color-brand-ink)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <iframe
              src={block.src}
              title={block.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
          {block.caption && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--typography-font-size-tag)",
                color: "var(--color-semantic-text-secondary)",
                marginTop: "var(--spacing-3)",
                lineHeight: 1.5,
              }}
            >
              {block.caption}
            </p>
          )}
        </div>
      );
    case "demoStep":
      return (
        <div style={{ marginBottom: "28px" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--typography-font-size-tag)",
              fontWeight: "var(--typography-font-weight-bold)",
              color: "var(--color-muted)",
              letterSpacing: "var(--typography-letter-spacing-wide)",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            {block.index}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--typography-font-size-sm)",
              color: "var(--color-muted)",
              lineHeight: 1.6,
              marginBottom: "var(--spacing-3)",
              maxWidth: "520px",
            }}
          >
            {block.description}
          </p>
          {block.href && (
            <a href={block.href} target="_blank" rel="noopener noreferrer" className="demo-link">
              <span style={{ fontSize: "var(--typography-font-size-sm)" }}>↗</span> {block.linkLabel}
            </a>
          )}
        </div>
      );
    case "prototype":
      return <PrototypeEmbed src={block.src} title={block.title} height={block.height ?? "700px"} />;
    case "section":
      return (
        <Section eyebrow={block.eyebrow} heading={block.heading}>
          {block.children.map((child, i) => (
            <Block key={i} block={child} title={title} />
          ))}
        </Section>
      );
  }
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

  /* ── Build metadata rows (data override wins) ── */
  const metadata = cs.metadata ?? [
    { label: "Year", value: cs.year },
    cs.metrics?.role ? { label: "Role", value: cs.metrics.role } : null,
    cs.metrics?.team ? { label: "Team", value: cs.metrics.team } : null,
    { label: "Timeline", value: cs.timeline },
    { label: "Scope", value: cs.scope },
  ].filter(Boolean) as { label: string; value: string }[];


  return (
    <CaseStudyLayout>
      <CaseStudyShell
        slug={slug}
        eyebrow={cs.eyebrow ?? `${cs.category} · ${cs.year}`}
        title={cs.title}
        summary={cs.summary ?? cs.description}
        metadata={metadata}
        tags={cs.tags}
        demoLinks={cs.demoLinks}
        liveUrl={cs.liveUrl || undefined}
        prev={prev}
        next={next}
      >
        {/* ── Blocks mode, the one render path ── */}
        {cs.blocks ? (
          <>
            {cs.blocks.map((block, i) => (
              <Block key={i} block={block} title={cs.title} />
            ))}
          </>
        ) : (
        <>
        {/* Supporting images, right after hero, before text */}
        {cs.images.length > 0 && (
          <div style={{ marginBottom: "var(--spacing-12)" }}>
            {cs.images.length === 1 ? (
              <MediaBlock
                src={cs.images[0]}
                alt={`${cs.title}, detail`}
              />
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: cs.images.length >= 3 ? "1fr 1fr" : "1fr 1fr",
                gap: "var(--spacing-3)",
              }}>
                {cs.images.map((src, i) => (
                  <MediaBlock
                    key={i}
                    src={src}
                    alt={`${cs.title}, image ${i + 1}`}
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
            {/* Brief overview, short text, not a wall */}
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
                      alt={section.embedAlt || `${cs.title}, visual`}
                      aspectRatio={section.embedAspect || "3/2"}
                    />
                  )}

                  {showImageAfter && (
                    <MediaBlock
                      src={cs.fullWidthImage!}
                      alt={`${cs.title}, system view`}
                      aspectRatio="2/1"
                    />
                  )}
                </div>
              );
            })}

            <div style={{ marginBottom: "var(--spacing-12)" }}>
              <span
                className="surface-dark"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "var(--spacing-2) var(--spacing-5)",
                  borderRadius: "var(--radius-full)",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--typography-font-size-tag)",
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
                gap: "var(--spacing-3)",
              }}>
                {cs.process.steps.map((step) => (
                  <div
                    key={step.number}
                    className="card-default"
                    style={{ padding: "var(--spacing-5)" }}
                  >
                    <span
                      className="eyebrow"
                      style={{ display: "block", marginBottom: "var(--spacing-2)" }}
                    >
                      {step.number}
                    </span>
                    <h3
                      className="heading-item"
                      style={{ marginBottom: "6px", fontSize: "var(--typography-font-size-base)" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="body-sm"
                      style={{
                        margin: 0,
                        color: "var(--color-ink-soft)",
                        lineHeight: 1.6,
                        fontSize: "var(--typography-font-size-tag)",
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
              <div style={{ marginTop: "var(--spacing-6)" }}>
                <span
                  className="surface-dark"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "var(--spacing-2) var(--spacing-5)",
                    borderRadius: "var(--radius-full)",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--typography-font-size-tag)",
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
            alt={`${cs.title}, final view`}
            aspectRatio="2/1"
          />
        )}
        </>
        )}
      </CaseStudyShell>
    </CaseStudyLayout>
  );
}
