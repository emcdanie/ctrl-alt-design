"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface PrototypeEmbedProps {
  src: string;
  title: string;
  description?: string;
  height?: string;
}

export default function PrototypeEmbed({
  src,
  title,
  description,
  height = "650px",
}: PrototypeEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Description above */}
      {description && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--typography-font-size-base)",
            color: "#6f6a63",
            lineHeight: 1.6,
            marginBottom: "var(--spacing-5)",
            maxWidth: "680px",
          }}
        >
          {description}
        </p>
      )}

      {/* Embed container */}
      <div
        style={{
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          border: "1px solid rgba(26,24,20,0.1)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          background: "#0A0E1A",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px var(--spacing-4)",
            background: "rgba(26,24,20,0.95)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
            {/* Window dots */}
            <div style={{ display: "flex", gap: "6px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                }}
              />
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                }}
              />
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--typography-font-size-tag)",
                fontWeight: "var(--typography-font-weight-medium)",
                color: "rgba(255,255,255,0.45)",
                marginLeft: "var(--spacing-2)",
              }}
            >
              {title}
            </span>
          </div>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--typography-font-size-tag)",
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--spacing-1)",
              padding: "var(--spacing-1) 10px",
              borderRadius: "6px",
              transition: "color 0.15s, background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.8)";
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.4)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Open in new tab
            <Icon name="OpenNewWindow" size="sm" />
          </a>
        </div>

        {/* Loading state */}
        {!loaded && (
          <div
            style={{
              position: "absolute",
              top: "var(--spacing-10)",
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0A0E1A",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--spacing-3)",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  border: "2px solid rgba(255,255,255,0.1)",
                  borderTopColor: "rgba(255,255,255,0.5)",
                  borderRadius: "50%",
                  animation: "vinyl-spin 0.8s linear infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--typography-font-size-tag)",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                Loading prototype…
              </span>
            </div>
          </div>
        )}

        {/* Iframe — responsive: uses aspect-ratio on small screens, fixed height on desktop */}
        <iframe
          src={src}
          title={title}
          onLoad={() => setLoaded(true)}
          className="prototype-iframe"
          style={{
            width: "100%",
            height: height,
            border: "none",
            display: "block",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          allow="fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}
