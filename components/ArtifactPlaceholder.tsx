interface ArtifactPlaceholderProps {
  title: string;
  description: string;
  aspectRatio?: string;
  className?: string;
}

export default function ArtifactPlaceholder({
  title,
  description,
  aspectRatio = "16/9",
  className = "",
}: ArtifactPlaceholderProps) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        aspectRatio,
        borderRadius: "12px",
        border: "2px dashed rgba(26,24,20,0.2)",
        background: "#F5F4F1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "520px" }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "rgba(26,24,20,0.55)",
            marginBottom: "10px",
          }}
        >
          Artifact reconstruction in progress
        </p>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 600,
            color: "#1A1814",
            lineHeight: 1.25,
            marginBottom: "8px",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "#5D5852",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
