"use client";

import { useState } from "react";

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
            fontSize: "15px",
            color: "#6f6a63",
            lineHeight: 1.6,
            marginBottom: "20px",
            maxWidth: "680px",
          }}
        >
          {description}
        </p>
      )}

      {/* Embed container */}
      <div
        style={{
          borderRadius: "16px",
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
            padding: "10px 16px",
            background: "rgba(26,24,20,0.95)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.45)",
                marginLeft: "8px",
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
              fontSize: "11px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 10px",
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
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 1h6v6M9 1L1 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Loading state */}
        {!loaded && (
          <div
            style={{
              position: "absolute",
              top: "40px",
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
                gap: "12px",
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
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                Loading prototype…
              </span>
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          src={src}
          title={title}
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            minHeight: height,
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
