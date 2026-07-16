import Link from "next/link";
import { findWorkItemBySlug } from "@/lib/workLibrary";
import { Button } from "@/components/ui/Button";
import BubbleHeading from "@/components/ui/BubbleHeading";

/* ── Types ─────────────────────────────────────────────────────── */

interface MetaRow {
  label: string;
  value: string;
}

interface DemoLink {
  label: string;
  href: string;
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
  /** Optional demo / prototype links */
  demoLinks?: DemoLink[];
  /** Optional live URL */
  liveUrl?: string;
  /** Previous case study (for nav) */
  prev?: { slug: string; title: string; category: string } | null;
  /** Next case study (for nav) */
  next?: { slug: string; title: string; category: string } | null;
  /** Case slug — resolves the case colours for the sphere + headline */
  slug: string;
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
  eyebrow,
  title,
  summary,
  metadata,
  tags,
  demoLinks,
  liveUrl,
  prev,
  next,
  slug,
  children,
}: CaseStudyShellProps) {
  const caseItem = findWorkItemBySlug(slug);
  return (
    <div className="cs-shell">
      {/* ════════════════════════════════════════════════════════════
          LEFT, Sticky sidebar panel (desktop only via CSS)
          ════════════════════════════════════════════════════════════ */}
      <aside className="cs-shell__left">
        <div className="cs-shell__sticky">
          <Link href="/work" className="cs-shell__backlink">
            <span aria-hidden="true">←</span> Back to Work
          </Link>

          {/* Eyebrow */}
          <p className="cs-shell__eyebrow">{eyebrow}</p>

          {/* Title */}
          {/* title lives in the BubbleHeading (right column, §8) */}

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
                return (
                  <span
                    key={tag}
                    className="cs-shell__tag cs-shell__tag--identity"
                    style={
                      caseItem
                        ? ({ "--case-tint-text": caseItem.text, "--case-tint-hi": caseItem.hi } as React.CSSProperties)
                        : undefined
                    }
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
                  <span style={{ fontSize: "var(--typography-font-size-sm)" }}>↗</span> Live preview
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
                  <span style={{ fontSize: "var(--typography-font-size-sm)" }}>↗</span> {demo.label}
                </a>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="cs-shell__cta">
            <Button href="/contact" variant="primary">
              Get in touch <span aria-hidden="true">↗</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════════
          RIGHT, Scrolling content column
          ════════════════════════════════════════════════════════════ */}
      <div className="cs-shell__right">
        <Link href="/work" className="cs-shell__backlink cs-shell__backlink--mobile">
          <span aria-hidden="true">←</span> Back to Work
        </Link>

        {/* §8: THE title device, the case title inside its identity bubble,
            connector feeding the content below */}
        <div className="cs-shell__hero cs-shell__hero--bubble">
          <BubbleHeading title={title} hi={caseItem?.hi} lo={caseItem?.lo} />
        </div>

        {/* Mobile header, title, meta, tags (below hero on small screens) */}
        <div className="cs-shell__mobile-header">
          <p className="cs-shell__eyebrow">{eyebrow}</p>
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
                return (
                  <span
                    key={tag}
                    className="cs-shell__tag cs-shell__tag--identity"
                    style={
                      caseItem
                        ? ({ "--case-tint-text": caseItem.text, "--case-tint-hi": caseItem.hi } as React.CSSProperties)
                        : undefined
                    }
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
                  <span style={{ fontSize: "var(--typography-font-size-sm)" }}>↗</span> Live preview
                </a>
              )}
              {demoLinks?.map((demo) => (
                <a key={demo.href} href={demo.href} target="_blank" rel="noopener noreferrer" className="demo-link">
                  <span style={{ fontSize: "var(--typography-font-size-sm)" }}>↗</span> {demo.label}
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
            borderRadius: "var(--radius-2xl)",
            padding: "var(--spacing-8)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-5)",
          }}>
            <div>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--typography-font-size-tag)",
                fontWeight: "var(--typography-font-weight-medium)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--ink-on-dark-muted)",
                marginBottom: "10px",
              }}>
                Have a project in mind?
              </p>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--font-subsection)",
                fontWeight: "var(--typography-font-weight-bold)",
                color: "var(--ink-on-dark-strong)",
                lineHeight: 1.15,
                textTransform: "uppercase",
              }}>
                Open to full-time roles &<br />
                select freelance projects.
              </h2>
            </div>
            <Link
              href="/contact"
              style={{
                alignSelf: "flex-start",
                background: "var(--color-semantic-text-inverse)",
                color: "var(--color-ink)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "var(--typography-font-size-tag)",
                padding: "var(--spacing-3) var(--spacing-6)",
                borderRadius: "var(--radius-full)",
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
