import Image from "next/image";
import Link from "next/link";
import { tagColor } from "@/lib/tagColor";

/* ── Types ─────────────────────────────────────────────────────── */

interface MetaRow {
  label: string;
  value: string;
}

interface DemoLink {
  label: string;
  href: string;
}

interface ShellMedia {
  type: "video" | "image";
  src: string;
  alt?: string;
}

export interface CaseStudyShellProps {
  /** Back link destination — defaults to /#work */
  backHref?: string;
  /** Eyebrow text above title (e.g. "Design Systems · 2024") */
  eyebrow: string;
  /** Project title */
  title: string;
  /** Short summary / intro paragraph */
  summary: string;
  /** Metadata rows: Year, Role, Team, Timeline, Scope, etc. */
  metadata: MetaRow[];
  /** Tag pills */
  tags: string[];
  /** Hero media — shown at top of scrolling column */
  media: ShellMedia;
  /** Optional demo / prototype links */
  demoLinks?: DemoLink[];
  /** Optional live URL */
  liveUrl?: string;
  /** Previous case study (for nav) */
  prev?: { slug: string; title: string; category: string } | null;
  /** Next case study (for nav) */
  next?: { slug: string; title: string; category: string } | null;
  /** Scrolling content (sections, pull quotes, images…) */
  children: React.ReactNode;
}

/* ── Component ─────────────────────────────────────────────────── */

/**
 * Two-column case study shell.
 *
 * Desktop (≥1080px):
 *   Left — sticky panel with back button, title, summary, metadata, tags, CTA
 *   Right — scrolling content with hero media at top, then narrative sections
 *
 * Mobile (<1080px):
 *   Single column: back → hero → title/meta → content
 */
export default function CaseStudyShell({
  backHref = "/#work",
  eyebrow,
  title,
  summary,
  metadata,
  tags,
  media,
  demoLinks,
  liveUrl,
  prev,
  next,
  children,
}: CaseStudyShellProps) {
  return (
    <div className="cs-shell">
      {/* ════════════════════════════════════════════════════════════
          LEFT — Sticky sidebar panel (desktop only via CSS)
          ════════════════════════════════════════════════════════════ */}
      <aside className="cs-shell__left">
        <div className="cs-shell__sticky">
          {/* Back button */}
          <Link href={backHref} className="cs-shell__back">
            <span aria-hidden="true">←</span>
            <span>Back to work</span>
          </Link>

          {/* Eyebrow */}
          <p className="cs-shell__eyebrow">{eyebrow}</p>

          {/* Title */}
          <h1 className="cs-shell__title">{title}</h1>

          {/* Summary */}
          <p className="cs-shell__summary">{summary}</p>

          {/* Divider */}
          <div className="cs-shell__divider" />

          {/* Metadata */}
          <dl className="cs-shell__meta">
            {metadata.map(({ label, value }) => (
              <div key={label} className="cs-shell__meta-row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="cs-shell__tags">
              {tags.map((tag) => {
                const c = tagColor(tag);
                return (
                  <span
                    key={tag}
                    className="cs-shell__tag"
                    style={{
                      background: c.bg,
                      color: c.color,
                      borderColor: "rgba(44, 24, 16, 0.08)",
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          )}

          {/* Demo links + Live URL */}
          {((demoLinks && demoLinks.length > 0) || liveUrl) && (
            <div className="cs-shell__links">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo-link"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <span style={{ fontSize: "14px" }}>↗</span> Live preview
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
          )}

          {/* CTA */}
          <div className="cs-shell__cta">
            <Link href="/#contact" className="cs-shell__cta-btn">
              Get in touch <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════════
          RIGHT — Scrolling content column
          ════════════════════════════════════════════════════════════ */}
      <div className="cs-shell__right">
        {/* Mobile-only back link */}
        <div className="cs-shell__mobile-back">
          <Link href={backHref} className="cs-shell__back">
            <span aria-hidden="true">←</span>
            <span>Back to work</span>
          </Link>
        </div>

        {/* Hero media */}
        <div className="cs-shell__hero">
          <div className="cs-shell__hero-frame">
            <div className="cs-shell__hero-sheen" />
            {media.type === "video" ? (
              <>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="cs-shell__hero-media"
                >
                  <source src={media.src} type="video/mp4" />
                </video>
                <div className="cs-shell__hero-vignette" />
              </>
            ) : (
              <>
                <Image
                  src={media.src}
                  alt={media.alt ?? title}
                  fill
                  className="cs-shell__hero-media"
                  priority
                  sizes="(max-width: 1080px) 100vw, 860px"
                />
                <div className="cs-shell__hero-vignette-light" />
              </>
            )}
          </div>
        </div>

        {/* Mobile header — title, meta, tags (below hero on small screens) */}
        <div className="cs-shell__mobile-header">
          <p className="cs-shell__eyebrow">{eyebrow}</p>
          <h1 className="cs-shell__title">{title}</h1>
          <p className="cs-shell__summary">{summary}</p>
          <div className="cs-shell__divider" />
          <dl className="cs-shell__meta">
            {metadata.map(({ label, value }) => (
              <div key={label} className="cs-shell__meta-row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {tags.length > 0 && (
            <div className="cs-shell__tags">
              {tags.map((tag) => {
                const c = tagColor(tag);
                return (
                  <span
                    key={tag}
                    className="cs-shell__tag"
                    style={{
                      background: c.bg,
                      color: c.color,
                      borderColor: "rgba(44, 24, 16, 0.08)",
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          )}
          {((demoLinks && demoLinks.length > 0) || liveUrl) && (
            <div className="cs-shell__links">
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="demo-link">
                  <span style={{ fontSize: "14px" }}>↗</span> Live preview
                </a>
              )}
              {demoLinks?.map((demo) => (
                <a key={demo.href} href={demo.href} target="_blank" rel="noopener noreferrer" className="demo-link">
                  <span style={{ fontSize: "14px" }}>↗</span> {demo.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Narrative content */}
        <div className="cs-shell__content">
          {children}
        </div>

        {/* Prev / Next navigation */}
        {(prev || next) && (
          <div className="cs-shell__nav">
            {prev ? (
              <Link href={`/case-studies/${prev.slug}`} className="cs-shell__nav-link">
                <span className="section-label">← Previous</span>
                <span className="heading-item" style={{ lineHeight: 1.3 }}>{prev.title}</span>
                <span className="text-meta">{prev.category}</span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/case-studies/${next.slug}`}
                className="cs-shell__nav-link cs-shell__nav-link--next"
              >
                <span className="section-label">Next →</span>
                <span className="heading-item" style={{ lineHeight: 1.3, textAlign: "right" }}>{next.title}</span>
                <span className="text-meta">{next.category}</span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}

        {/* Bottom CTA (visible on all sizes within the scrolling column) */}
        <div className="cs-shell__bottom-cta">
          <div className="surface-dark" style={{
            borderRadius: "24px",
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}>
            <div>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "10px",
              }}>
                Have a project in mind?
              </p>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1.15,
                textTransform: "uppercase",
              }}>
                Open to full-time roles &<br />
                select freelance projects.
              </h2>
            </div>
            <Link
              href="/#contact"
              style={{
                alignSelf: "flex-start",
                background: "#EDE8DF",
                color: "#1A1814",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "13px",
                padding: "12px 24px",
                borderRadius: "999px",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Get in touch ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
