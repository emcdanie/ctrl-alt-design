interface LogoContainerProps {
  src?: string;
  alt: string;
  bg?: string;
  /** Pixel size applied to both width and height. Default: 44 */
  size?: number;
}

/**
 * Consistent square logo container used across ExperienceSection,
 * CaseStudyGrid, and any other place that renders a company/client logo.
 */
export default function LogoContainer({ src, alt, bg = "#E8E4DC", size = 44 }: LogoContainerProps) {
  const radius = Math.round(size * 0.22); // ~10px at 44px, scales with size

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${radius}px`,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          style={{ width: "78%", height: "78%", objectFit: "contain" }}
          onError={e => {
            (e.currentTarget.parentElement as HTMLElement).style.background = "#E8E4DC";
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: `${Math.round(size * 0.32)}px`,
            fontWeight: 700,
            color: "#1A1A1A",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
