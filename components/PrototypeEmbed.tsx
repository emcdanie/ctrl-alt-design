"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface PrototypeEmbedProps {
  src: string;
  title: string;
  description?: string;
  height?: string;
  /** static poster: the resting facade at every width */
  poster?: string;
  posterAlt?: string;
}

export default function PrototypeEmbed({
  src,
  title,
  description,
  height = "650px",
  poster,
  posterAlt,
}: PrototypeEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  /* Click-to-activate at EVERY width (Elleta, 20 Jul, supersedes the
   * matchMedia split): the poster facade is the resting state
   * everywhere, with a labelled activation control; the iframe mounts
   * only on explicit activation. No audio, no load, no hydration
   * poster-flash before the visitor asks for it. SSR and no-JS render
   * the facade with the open-in-new-tab link as the working path. */
  const [active, setActive] = useState(false);
  const showIframe = active;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Description above */}
      {description && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--typography-font-size-base)",
            color: "var(--color-muted)",
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
          border: "1px solid var(--color-border-medium)",
          boxShadow: "var(--shadow-soft)",
          background: "var(--color-brand-ink)",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--spacing-2) var(--spacing-4)",
            background: "color-mix(in srgb, var(--color-brand-ink) 95%, transparent)",
            borderBottom: "1px solid var(--color-alpha-parchment-6)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
            {/* Window dots */}
            <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "color-mix(in srgb, white 12%, transparent)",
                }}
              />
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "color-mix(in srgb, white 12%, transparent)",
                }}
              />
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "color-mix(in srgb, white 12%, transparent)",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--typography-font-size-tag)",
                fontWeight: "var(--typography-font-weight-medium)",
                color: "color-mix(in srgb, white 45%, transparent)",
                marginLeft: "var(--spacing-2)",
              }}
            >
              {title}
            </span>
          </div>
          {showIframe && (
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--typography-font-size-tag)",
                fontWeight: 600,
                color: "color-mix(in srgb, white 40%, transparent)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--spacing-1)",
                padding: "var(--spacing-1) var(--spacing-2)",
                borderRadius: "6px",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "color-mix(in srgb, white 80%, transparent)";
                e.currentTarget.style.background = "color-mix(in srgb, white 8%, transparent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "color-mix(in srgb, white 40%, transparent)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Open in new tab
              <Icon name="OpenNewWindow" size="sm" />
            </a>
          )}
        </div>

        {showIframe ? (
          <>
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
                  background: "var(--color-brand-ink)",
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
                      border: "2px solid color-mix(in srgb, white 10%, transparent)",
                      borderTopColor: "color-mix(in srgb, white 50%, transparent)",
                      borderRadius: "50%",
                      animation: "vinyl-spin 0.8s linear infinite",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--typography-font-size-tag)",
                      color: "color-mix(in srgb, white 30%, transparent)",
                    }}
                  >
                    Loading prototype…
                  </span>
                </div>
              </div>
            )}

            {/* Live iframe (mounts only on activation) */}
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
          </>
        ) : (
          /* The facade: poster + one labelled activation control */
          <div>
            <button
              type="button"
              onClick={() => setActive(true)}
              aria-label={`Load the interactive prototype: ${title}`}
              style={{
                display: "block",
                width: "100%",
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              {poster && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={poster}
                  alt={posterAlt ?? `${title}, static preview`}
                  style={{ width: "100%", display: "block" }}
                />
              )}
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--spacing-2)",
                  padding: "var(--spacing-3) var(--spacing-4)",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--typography-font-size-sm)",
                  fontWeight: 600,
                  color: "color-mix(in srgb, white 85%, transparent)",
                }}
              >
                <Icon name="Play" size="sm" />
                Load the interactive prototype
              </span>
            </button>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--spacing-1)",
                padding: "var(--spacing-2) var(--spacing-4) var(--spacing-3)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--typography-font-size-tag)",
                fontWeight: 600,
                color: "color-mix(in srgb, white 55%, transparent)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                borderTop: "1px solid var(--color-alpha-parchment-6)",
              }}
            >
              Open prototype in new tab
              <Icon name="OpenNewWindow" size="sm" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
