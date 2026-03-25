"use client";

interface MetaItem {
  label: string;
  value: string;
}

interface DemoLink {
  label: string;
  href: string;
}

interface CaseStudySideCardProps {
  title: string;
  description: string;
  category: string;
  metadata: MetaItem[];
  tags: string[];
  demoLinks?: DemoLink[];
  liveUrl?: string;
}

/**
 * Sticky side card for case study pages.
 * Contains project metadata, tags, and demo links.
 * Stays visible while the main content scrolls alongside it.
 * Stacks above content on mobile (<1024px).
 */
export default function CaseStudySideCard({
  title,
  description,
  category,
  metadata,
  tags,
  demoLinks,
  liveUrl,
}: CaseStudySideCardProps) {
  return (
    <aside
      className="lg:sticky"
      style={{
        top: "96px",
        alignSelf: "start",
      }}
    >
      <div
        className="glass-card"
        style={{
          padding: "28px",
          borderRadius: "20px",
          maxWidth: "340px",
        }}
      >
        {/* Category */}
        <p className="eyebrow" style={{ marginBottom: "12px" }}>
          {category}
        </p>

        {/* Title */}
        <h2
          className="heading-subsection"
          style={{
            fontSize: "clamp(20px, 2.5vw, 26px)",
            marginBottom: "12px",
          }}
        >
          {title}
        </h2>

        {/* Description */}
        <p className="body-sm" style={{ marginBottom: "20px", lineHeight: 1.65 }}>
          {description}
        </p>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--color-border-soft)", marginBottom: "16px" }} />

        {/* Metadata */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          {metadata.map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--color-ink-muted)",
                }}
              >
                {item.label}
              </span>
              <span className="body-sm" style={{ color: "var(--color-ink-soft)", textAlign: "right", maxWidth: "60%" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
            {tags.map((tag) => (
              <span key={tag} className="tag" style={{ fontSize: "10px", padding: "4px 10px" }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Demo links */}
        {((demoLinks && demoLinks.length > 0) || liveUrl) && (
          <>
            <div style={{ height: "1px", background: "var(--color-border-soft)", marginBottom: "16px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo-link"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <span style={{ fontSize: "14px" }}>↗</span> View live prototype
                </a>
              )}
              {demoLinks?.map((demo) => (
                <a
                  key={demo.href}
                  href={demo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo-link"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <span style={{ fontSize: "14px" }}>↗</span> {demo.label}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
