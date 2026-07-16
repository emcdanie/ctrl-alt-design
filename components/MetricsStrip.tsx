/**
 * MetricsStrip — at-a-glance facts strip for the About page.
 *
 * Originally a hover-to-reveal 4-card strip on the landing dashboard;
 * relocated to About and simplified to always-visible detail lines
 * (no hover, no expand/collapse — every card renders the same way,
 * every time).
 *
 * Layout per BELLA v0.1 Rule 2: items-stretch grid + h-full + flex-col
 * with the detail line as the flex-1 body. Body text is 16px per Rule 7.
 */

interface MetricItem {
  stat: string;
  label: string;
  detail: string;
}

const metrics: MetricItem[] = [
  { stat: "E2E", label: "END TO END",           detail: "Tokens to governance to shipped code" },
  { stat: "2",  label: "DESIGN SYSTEMS BUILT", detail: "A B2B travel platform / Brad Frost Atomic System" },
  { stat: "B2B", label: "PRIMARY DOMAIN",      detail: "Travel, finance, govtech" },
  { stat: "BCN", label: "BASED IN",            detail: "Canet de Mar, Spain" },
];

function MetricCard({ item }: { item: MetricItem }) {
  return (
    <div
      className="card-default"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "var(--spacing-6)",
        textAlign: "left",
      }}
    >
      {/* Stat */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 4vw, 48px)",
          fontWeight: "var(--typography-font-weight-bold)",
          color: "var(--color-ink)",
          lineHeight: 1,
          marginBottom: "var(--spacing-2)",
        }}
      >
        {item.stat}
      </div>

      {/* Eyebrow label */}
      <div
        className="eyebrow"
        style={{ marginBottom: "var(--spacing-3)" }}
      >
        {item.label}
      </div>

      {/* Detail, always visible. flex:1 so cards share height via Rule 2. */}
      <p
        style={{
          flex: 1,
          margin: 0,
          fontFamily: "var(--font-body)",
          fontSize: "var(--typography-font-size-base)",
          lineHeight: "var(--typography-line-height-normal)",
          color: "var(--color-ink-soft)",
        }}
      >
        {item.detail}
      </p>
    </div>
  );
}

export default function MetricsStrip() {
  return (
    <div
      className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4"
      role="list"
      aria-label="At-a-glance facts"
    >
      {metrics.map((item) => (
        <div key={item.stat} role="listitem" className="h-full">
          <MetricCard item={item} />
        </div>
      ))}
    </div>
  );
}
