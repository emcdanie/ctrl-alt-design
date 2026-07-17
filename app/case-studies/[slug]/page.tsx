import { notFound } from "next/navigation";
import Image from "next/image";
import { getCaseStudy, getAllSlugs, type CaseBlock } from "@/lib/content";
import { findWorkItemBySlug } from "@/lib/workLibrary";
import PrototypeEmbed from "@/components/PrototypeEmbed";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseStudyShell from "@/components/CaseStudyShell";
import { Body, PullQuote, Section, Eyebrow, H2 } from "@/components/CaseStudyTypography";
import { BoldText } from "@/lib/richtext";
import ChipReadinessMap from "@/components/ChipReadinessMap";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/** Renders inline **bold** markers inside a paragraph */
function RichBody({ text }: { text: string }) {
  return (
    <Body>
      <BoldText text={text} strongStyle={{ fontWeight: 600, color: "var(--color-ink)" }} />
    </Body>
  );
}

/* ── Block renderer — the ONE render path for case bodies ── */
function Block({ block, title, marker, markerText }: { block: CaseBlock; title: string; marker?: string; markerText?: string }) {
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
    case "demoStep":
      return (
        <div style={{ marginBottom: "var(--spacing-6)" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--typography-font-size-tag)",
              fontWeight: "var(--typography-font-weight-bold)",
              color: "var(--color-muted)",
              letterSpacing: "var(--typography-letter-spacing-wide)",
              textTransform: "uppercase",
              marginBottom: "var(--spacing-2)",
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
    case "summary":
      return (
        <div className="cs-summary-block">
          {[["Context", block.context], ["Approach", block.approach], ["Outcome", block.outcome]].map(([label, text]) => (
            <div key={label}>
              <p className="eyebrow">{label}</p>
              <RichBody text={text} />
            </div>
          ))}
        </div>
      );
    case "decision":
      return (
        <div
          className="cs-decision-block"
          style={
            marker
              ? ({ "--case-marker": marker, "--case-marker-text": markerText } as React.CSSProperties)
              : undefined
          }
        >
          <p className="eyebrow">Decision {block.index}</p>
          <H2>{block.title}</H2>
          {block.why && <RichBody text={block.why} />}
          {block.evidence && <Block block={block.evidence} title={title} marker={marker} markerText={markerText} />}
          {block.children?.map((child, i) => (
            <Block key={i} block={child} title={title} marker={marker} markerText={markerText} />
          ))}
        </div>
      );
    case "figure":
      return (
        <figure style={{ margin: "var(--spacing-6) 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            loading="lazy"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border-soft)",
            }}
          />
          {block.caption && (
            <figcaption
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--typography-font-size-sm)",
                color: "var(--color-muted)",
                marginTop: "var(--spacing-2)",
                lineHeight: 1.5,
              }}
            >
              {block.caption}
            </figcaption>
          )}
          {block.href && (
            <a
              href={block.href}
              target="_blank"
              rel="noopener noreferrer"
              className="demo-link"
              style={{ marginTop: "var(--spacing-3)" }}
            >
              <span style={{ fontSize: "var(--typography-font-size-sm)" }}>↗</span>{" "}
              {block.linkLabel}
            </a>
          )}
        </figure>
      );
    case "disclosure":
      return (
        <p
          role="note"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--typography-font-size-sm)",
            lineHeight: 1.6,
            color: "var(--color-ink-soft)",
            borderLeft: "3px solid var(--color-border-medium)",
            paddingLeft: "var(--spacing-4)",
            margin: "0 0 var(--spacing-8)",
          }}
        >
          {block.text}
        </p>
      );
    case "readinessMap":
      return <ChipReadinessMap rows={block.rows} />;
    case "lessons":
      return (
        <Section eyebrow="LESSONS" heading="What this changed">
          <RichBody text={block.text} />
        </Section>
      );
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

  const caseItem = findWorkItemBySlug(slug);

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
      >
        {/* ── Blocks mode, the one render path ── */}
        {cs.blocks ? (
          <>
            {cs.blocks.map((block, i) => (
              <Block
                key={i}
                block={block}
                title={cs.title}
                marker={caseItem ? `color-mix(in srgb, ${caseItem.hi} 70%, transparent)` : undefined}
                markerText={caseItem?.text}
              />
            ))}
          </>
        ) : null}
      </CaseStudyShell>
    </CaseStudyLayout>
  );
}
