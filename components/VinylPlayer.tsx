"use client";

import { useState } from "react";

const ALBUM_EMBED = "https://embed.music.apple.com/es/album/atlas-hour-beats/1647623734";
const ALBUM_TITLE = "Atlas Hour Beats";
const ALBUM_ARTIST = "Atlas Hour";

export default function VinylPlayer() {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <div
      className="card-elevated card-interactive"
      style={{
        padding: "24px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      {/* Record */}
      <div
        onClick={() => setShowPlayer((s) => !s)}
        style={{
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: `
            radial-gradient(circle at center, #2c2c2c 18%, transparent 18.5%),
            radial-gradient(circle at center, transparent 17%, #1a1814 17.5%, #1a1814 18.5%, transparent 19%),
            radial-gradient(circle at center, transparent 30%, rgba(60,56,50,0.4) 30.3%, transparent 30.6%),
            radial-gradient(circle at center, transparent 42%, rgba(60,56,50,0.3) 42.3%, transparent 42.6%),
            radial-gradient(circle at center, transparent 54%, rgba(60,56,50,0.3) 54.3%, transparent 54.6%),
            radial-gradient(circle at center, transparent 66%, rgba(60,56,50,0.3) 66.3%, transparent 66.6%),
            radial-gradient(circle at center, transparent 78%, rgba(60,56,50,0.3) 78.3%, transparent 78.6%),
            radial-gradient(circle at center, transparent 90%, rgba(60,56,50,0.2) 90.3%, transparent 90.6%),
            linear-gradient(135deg, #1a1814 0%, #2c2820 30%, #1a1814 60%, #2c2820 100%)
          `,
          cursor: "pointer",
          animation: showPlayer ? "vinyl-spin 3s linear infinite" : "none",
          position: "relative",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 0 20px rgba(0,0,0,0.3)",
          transition: "box-shadow 0.3s ease",
          flexShrink: 0,
        }}
        role="button"
        aria-label={showPlayer ? "Hide player" : "Play music"}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setShowPlayer((s) => !s); }}}
      >
        {/* Center label */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #b8956a 0%, #8a6e4a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        >
          {showPlayer ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="3" y="2" width="3" height="10" rx="1" fill="#1A1814" />
              <rect x="8" y="2" width="3" height="10" rx="1" fill="#1A1814" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 2.5l8 4.5-8 4.5V2.5z" fill="#1A1814" />
            </svg>
          )}
        </div>
      </div>

      {/* Album info */}
      <div style={{ textAlign: "center" }}>
        <h4
          className="heading-item"
          style={{ fontSize: "15px", marginBottom: "2px" }}
        >
          {ALBUM_TITLE}
        </h4>
        <p
          className="body-sm"
          style={{ margin: 0, fontSize: "12px" }}
        >
          {ALBUM_ARTIST}
        </p>
      </div>

      {/* Apple Music embed — appears when vinyl is clicked */}
      {showPlayer ? (
        <iframe
          allow="autoplay *; encrypted-media *;"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          src={ALBUM_EMBED}
          style={{
            width: "100%",
            maxWidth: "280px",
            height: "175px",
            borderRadius: "12px",
            border: "none",
            overflow: "hidden",
            background: "transparent",
          }}
          title={`${ALBUM_TITLE} — ${ALBUM_ARTIST}`}
        />
      ) : (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            color: "var(--color-muted)",
            margin: 0,
            textAlign: "center",
          }}
        >
          Tap the record to listen
        </p>
      )}
    </div>
  );
}
