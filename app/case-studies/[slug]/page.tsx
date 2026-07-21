import { notFound } from "next/navigation";
import Image from "next/image";
import { getCaseStudy, getAllSlugs, type CaseBlock } from "@/lib/content";
import { findWorkItemBySlug } from "@/lib/workLibrary";
import PrototypeEmbed from "@/components/PrototypeEmbed";
import ScaledFrame from "@/components/ScaledFrame";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseStudyShell from "@/components/CaseStudyShell";
import { Body, PullQuote, Section, Eyebrow, H2 } from "@/components/CaseStudyTypography";
import { BoldText } from "@/lib/richtext";
import ChipReadinessMap from "@/components/ChipReadinessMap";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/* Per-case tab identity (Elleta, 21 Jul, audit finding 7): the tab wears
   the case NAME (the library title), never the thesis. Description is the
   top-level summary; where a case lacks one (Elleta, 21 Jul), the first
   sentence of its summary-block context, verbatim; else the route's
   existing description fallback. Unknown slug or missing library row
   inherits the root metadata. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  const caseItem = findWorkItemBySlug(slug);
  const summaryBlock = cs.blocks?.find((b) => b.kind === "summary");
  const contextFirstSentence =
    summaryBlock && "context" in summaryBlock
      ? summaryBlock.context.match(/^[\s\S]*?\./)?.[0]
      : undefined;
  return {
    ...(caseItem ? { title: `${caseItem.title}, Elleta McDaniel` } : {}),
    description: cs.summary ?? contextFirstSentence ?? cs.description,
  };
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
      /* Scaled to fit, never cropped (task 2): the full canvas scales
         to the container; embeds are for viewing (ScaledFrame
         suppresses pointer events). Interactive demos are "prototype"
         blocks behind the activation facade. */
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
          <ScaledFrame
            src={block.src}
            title={block.title}
            designWidth={block.designWidth}
            designHeight={block.designHeight}
          />
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
              /* reading text, 16px floor (type-floor sweep, 21 Jul) */
              fontSize: "var(--typography-font-size-base)",
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
      return (
        <PrototypeEmbed
          src={block.src}
          title={block.title}
          designWidth={block.designWidth}
          designHeight={block.designHeight}
          poster={block.poster}
          posterAlt={block.posterAlt}
        />
      );
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
          <div className="cs-decision-head">
            <p className="eyebrow">Decision {block.index}</p>
            <H2>{block.title}</H2>
            {/* the why-line is the visual key point ONLY when it is a
                single short statement (<=160 chars, Elleta 20 Jul);
                longer whys read as regular body ink until her
                per-decision key-line trims land via Cowork */}
            {block.why &&
              (block.why.length <= 160 ? (
                <p className="cs-decision-why">
                  <BoldText text={block.why} strongStyle={{ fontWeight: 700 }} />
                </p>
              ) : (
                <RichBody text={block.why} />
              ))}
          </div>
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
            /* reading text, 16px floor (type-floor sweep, 21 Jul) */
            fontSize: "var(--typography-font-size-base)",
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
      /* the takeaway band (readability pass): one token surface, the
         same recipe every case, findable by scroll */
      return (
        <div
          className="cs-lessons-band"
          style={
            marker
              ? ({ "--case-marker": marker, "--case-marker-text": markerText } as React.CSSProperties)
              : undefined
          }
        >
          <Section eyebrow="LESSONS" heading="What this changed">
            <RichBody text={block.text} />
          </Section>
        </div>
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

  /* ── Build metadata rows (data override wins). Canonical field set
     (Pass E task 11g): Role, Year, Type or Scope, Organisation, Tools
     where applicable; same labels, same order; omit empty rows rather
     than invent content. ── */
  const metadata = cs.metadata ?? ([
    cs.metrics?.role ? { label: "Role", value: cs.metrics.role } : null,
    cs.year ? { label: "Year", value: cs.year } : null,
    cs.scope ? { label: "Scope", value: cs.scope } : null,
  ].filter(Boolean) as { label: string; value: string }[]);


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
