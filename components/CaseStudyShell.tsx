import Link from "next/link";
import { findWorkItemBySlug, relatedWorkItems } from "@/lib/workLibrary";
import { Tag } from "@/components/ui/Tag";
import Heading from "@/components/ui/Heading";
import CtaBanner from "@/components/ui/CtaBanner";
import SectionHeader from "@/components/ui/SectionHeader";
import CaseCard from "@/components/CaseCard";

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
  slug,
  children,
}: CaseStudyShellProps) {
  const caseItem = findWorkItemBySlug(slug);
  const related = relatedWorkItems(slug);
  const MetaList = () => (
    <dl className="cs-shell__meta">
      {metadata.map(({ label, value }) => (
        <div key={label} className="cs-shell__meta-row">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
  const TagRow = () =>
    tags.length > 0 ? (
      <div className="cs-shell__tags">
        {tags.map((tag) => (
          <Tag
            key={tag}
            identity
            style={
              caseItem
                ? ({ "--case-tint-text": caseItem.text, "--case-tint-hi": caseItem.hi } as React.CSSProperties)
                : undefined
            }
          >
            {tag}
          </Tag>
        ))}
      </div>
    ) : null;

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
          <p className="cs-shell__eyebrow" style={caseItem ? { color: caseItem.text } : undefined}>{eyebrow}</p>

          {/* Title */}
          {/* title lives in the flat case Heading (right column) */}

          {/* Summary */}
          <p className="cs-shell__summary">{summary}</p>

          {/* Divider */}
          <div className="cs-shell__divider" />

          {/* Metadata */}
          <MetaList />

          {/* Tags */}
          <TagRow />

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

          {/* Template rule (Pass B 2026-07-18): ONE contact action per
              case page. The sidebar is information; the closing
              CtaBanner is the ask. No button here. */}
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════════
          RIGHT, Scrolling content column
          ════════════════════════════════════════════════════════════ */}
      <div className="cs-shell__right">
        <Link href="/work" className="cs-shell__backlink cs-shell__backlink--mobile">
          <span aria-hidden="true">←</span> Back to Work
        </Link>

        {/* Flat case title (flat-headers pass): Heading case tier in the
            case identity colour; bubbles are parked. */}
        <div className="cs-shell__hero">
          <Heading tier="case" as="h1" style={caseItem ? { color: caseItem.text } : undefined}>
            {title}
          </Heading>
        </div>

        {/* Mobile header, title, meta, tags (below hero on small screens) */}
        <div className="cs-shell__mobile-header">
          <p className="cs-shell__eyebrow" style={caseItem ? { color: caseItem.text } : undefined}>{eyebrow}</p>
          <p className="cs-shell__summary">{summary}</p>
          <div className="cs-shell__divider" />
          <MetaList />
          <TagRow />
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

        {/* End sequence (Pass C 2026-07-18): "More work like this", 3
            case cards by skill overlap with this case (matrix data),
            deterministic, the ONE Card; then the single closing CTA. */}
        {related.length > 0 && (
          <section className="cs-shell__related" aria-label="More work like this">
            <SectionHeader label="Related" title="More work like this" />
            <div className="cs-shell__related-grid">
              {related.map((i) => (
                <CaseCard key={i.id} item={i} />
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA (visible on all sizes within the scrolling column) */}
        <div className="cs-shell__bottom-cta">
          <CtaBanner title={<>Open to full-time roles &<br />select freelance projects.</>} />
        </div>
      </div>
    </div>
  );
}
