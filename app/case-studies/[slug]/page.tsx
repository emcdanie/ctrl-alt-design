import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCaseStudy, getAdjacentStudies } from "@/data/caseStudies";
import caseStudies from "@/data/caseStudies";
import CustomCursor from "@/components/CustomCursor";
import OverlayNav from "@/components/OverlayNav";

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

const TAG_COLORS = [
  { bg: "#E8F2FA", color: "#2A6A9E" },
  { bg: "#F0EDF8", color: "#5C4A9A" },
  { bg: "#FDF3E3", color: "#9A6020" },
  { bg: "#EBF5EC", color: "#2A7A32" },
  { bg: "#FAF0EC", color: "#9A4020" },
  { bg: "#F5EDF5", color: "#8A3A8A" },
];

function tagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
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

// Visual placeholder component — marks where real assets should go
function VisualPlaceholder({ label, aspectRatio = "16/9" }: { label: string; aspectRatio?: string }) {
  return (
    <div style={{
      aspectRatio,
      background: "linear-gradient(135deg, #E8E4DC 0%, #D8D4CC 100%)",
      borderRadius: "12px",
      border: "2px dashed rgba(26,24,20,0.2)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "24px",
    }}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(26,24,20,0.4)" }}>
        Visual Needed
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(26,24,20,0.6)", textAlign: "center", lineHeight: 1.4 }}>
        {label}
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

  const metaItems = [
    { label: "YEAR", value: cs.year },
    cs.metrics?.role ? { label: "ROLE", value: cs.metrics.role } : null,
    cs.metrics?.team ? { label: "TEAM", value: cs.metrics.team } : null,
    { label: "TIMELINE", value: cs.timeline },
    { label: "SCOPE", value: cs.scope },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <main className="bg-[#EDE8DF] min-h-screen">
      <CustomCursor />
      <OverlayNav />

      {/* ── Fixed floating back button ───────────────────────────── */}
      <Link
        href="/#work"
        className="hover:opacity-75 transition-opacity duration-150"
        style={{
          position: "fixed",
          bottom: "28px",
          left: "28px",
          zIndex: 50,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 600,
          color: "#EDE8DF",
          textDecoration: "none",
          background: "#1A1814",
          borderRadius: "999px",
          padding: "10px 20px",
          letterSpacing: "0.02em",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        }}
      >
        ← All work
      </Link>

      {/* ── HERO — two-column intro ──────────────────────────────── */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "100px 40px 72px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "72px",
        alignItems: "center",
      }} className="grid-cols-1 md:grid-cols-2">

        {/* LEFT — title, description, meta */}
        <div>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#8A8A8A",
            marginBottom: "16px",
          }}>
            {cs.category} · {cs.year}
          </p>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 4.5vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "#1A1A1A",
            margin: "0 0 20px 0",
          }}>
            {cs.title}
          </h1>

          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "17px",
            color: "#555555",
            lineHeight: 1.65,
            marginBottom: "36px",
          }}>
            {cs.description}
          </p>

          {/* Meta grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px 32px",
            marginBottom: "28px",
            paddingBottom: "28px",
            borderBottom: "1px solid rgba(26,24,20,0.1)",
          }}>
            {metaItems.map(item => (
              <div key={item.label}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#8A8A8A", marginBottom: "3px" }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#1A1A1A", lineHeight: 1.4 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
            {cs.tags.map(tag => {
              const c = tagColor(tag);
              return (
                <span key={tag} style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: 500,
                  background: c.bg,
                  color: c.color,
                  letterSpacing: "0.02em",
                }}>
                  {tag}
                </span>
              );
            })}
          </div>

          {cs.liveUrl && (
            <a
              href={cs.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600, color: "#1A1814", textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              Live preview ↗
            </a>
          )}
        </div>

        {/* RIGHT — video or hero image */}
        <div style={{ borderRadius: "16px", overflow: "hidden", background: "#0A0A1C", aspectRatio: "4/3", position: "relative" }}>
          {cs.heroVideo ? (
            <video
              autoPlay muted loop playsInline
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
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
              sizes="50vw"
            />
          )}
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
        <div style={{ borderTop: "1px solid rgba(26,24,20,0.1)" }} />
      </div>

      {/* ── CONTENT — single centered column ────────────────────── */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "72px 40px 80px" }}>

        {/* Supporting images / visual placeholders */}
        {cs.images.length > 0 && (
          <div style={{ marginBottom: "64px" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cs.images.map((src, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image src={src} alt={`${cs.title} — image ${i + 1}`} fill className="object-cover" sizes="(max-width: 640px) 100vw, 350px" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── NARRATIVE ──────────────────────────────────────────── */}
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
                      <blockquote key={pIdx} style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(18px, 2.2vw, 22px)",
                        fontStyle: "italic",
                        fontWeight: 400,
                        color: "#1A1A1A",
                        borderLeft: "3px solid #1A1814",
                        paddingLeft: "24px",
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        background: "#F0EDE8",
                        borderRadius: "0 6px 6px 0",
                        margin: "8px 0",
                        lineHeight: 1.5,
                      }}>
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
          /* ── STRUCTURED fallback ─────────────────────────────── */
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

            {/* Visual placeholder — after problem */}
            <div style={{ marginBottom: "56px" }}>
              <VisualPlaceholder label="Problem framing — audit screenshot or annotation" aspectRatio="16/9" />
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

            {/* Visual placeholder — after process */}
            <div style={{ marginBottom: "56px" }}>
              <VisualPlaceholder label="Key deliverable — component overview, flow diagram, or final design" aspectRatio="4/3" />
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

        {/* ── Prev / Next ──────────────────────────────────────── */}
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

        {/* ── CTA ──────────────────────────────────────────────── */}
        <div style={{ background: "#1A1814", borderRadius: "24px", padding: "56px 48px", display: "flex", flexDirection: "column", gap: "32px" }} className="md:flex-row md:items-center md:justify-between">
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
    </main>
  );
}
