"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

/* Music returns (Pass E task 7): recovered from pre-lock history
 * (4859a8a^) and rebuilt on the current system — ui/Card surface, her
 * periwinkle-centre stash edit folded in, type on the ramp, a real
 * button for the play control, spin honours prefers-reduced-motion
 * (.vinyl-disc in globals.css). The disc face is fixed-context
 * artwork (recorded exception, DESIGN.md icons note). */

const ALBUM_EMBED = "https://embed.music.apple.com/es/album/atlas-hour-beats/1647623734";
const ALBUM_TITLE = "Atlas Hour Beats";
const ALBUM_ARTIST = "Atlas Hour";

/* The disc face is fixed-context ARTWORK (recorded exception, DESIGN.md
 * icons note): groove rings and platter sheen, not themed surfaces. */
const DISC_ART = [
  "radial-gradient(circle at center, #2c2c2c 18%, transparent 18.5%)", // token-waiver: vinyl artwork
  "radial-gradient(circle at center, transparent 17%, #1a1814 17.5%, #1a1814 18.5%, transparent 19%)", // token-waiver: vinyl artwork
  "radial-gradient(circle at center, transparent 30%, rgba(60,56,50,0.4) 30.3%, transparent 30.6%)", // token-waiver: vinyl artwork
  "radial-gradient(circle at center, transparent 42%, rgba(60,56,50,0.3) 42.3%, transparent 42.6%)", // token-waiver: vinyl artwork
  "radial-gradient(circle at center, transparent 54%, rgba(60,56,50,0.3) 54.3%, transparent 54.6%)", // token-waiver: vinyl artwork
  "radial-gradient(circle at center, transparent 66%, rgba(60,56,50,0.3) 66.3%, transparent 66.6%)", // token-waiver: vinyl artwork
  "radial-gradient(circle at center, transparent 78%, rgba(60,56,50,0.3) 78.3%, transparent 78.6%)", // token-waiver: vinyl artwork
  "radial-gradient(circle at center, transparent 90%, rgba(60,56,50,0.2) 90.3%, transparent 90.6%)", // token-waiver: vinyl artwork
  "linear-gradient(135deg, #1a1814 0%, #2c2820 30%, #1a1814 60%, #2c2820 100%)", // token-waiver: vinyl artwork
].join(", ");

export default function VinylPlayer() {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <Card className="h-full">
      <div
        style={{
          padding: "var(--spacing-6)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--spacing-4)",
        }}
      >
        {/* Record: a real button, keyboard reachable and labelled */}
        <button
          type="button"
          onClick={() => setShowPlayer((s) => !s)}
          aria-label={showPlayer ? "Hide the album player" : "Play music, opens the album player"}
          aria-expanded={showPlayer}
          className="vinyl-disc"
          data-spinning={showPlayer || undefined}
          style={{
            width: "140px" /* token-waiver: vinyl artwork geometry (fixed-context illustration, recorded) */,
            height: "140px" /* token-waiver: vinyl artwork geometry */,
            borderRadius: "50%",
            border: "none",
            background: DISC_ART,
            cursor: "pointer",
            position: "relative",
            boxShadow: "var(--shadow-soft)",
            flexShrink: 0,
          }}
        >
          {/* Centre label: her periwinkle edit (pre-lush stash), no gold */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "42px" /* token-waiver: vinyl artwork geometry */,
              height: "42px" /* token-waiver: vinyl artwork geometry */,
              borderRadius: "50%",
              background: "var(--color-semantic-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            {showPlayer ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="3" y="2" width="3" height="10" rx="1" fill="var(--color-brand-ink)" />
                <rect x="8" y="2" width="3" height="10" rx="1" fill="var(--color-brand-ink)" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M4 2.5l8 4.5-8 4.5V2.5z" fill="var(--color-brand-ink)" />
              </svg>
            )}
          </span>
        </button>

        {/* Album info (her stash hunks: ramp sizes) */}
        <div style={{ textAlign: "center" }}>
          <h3 className="heading-item" style={{ fontSize: "var(--typography-font-size-base)", marginBottom: "var(--spacing-1)" }}>
            {ALBUM_TITLE}
          </h3>
          <p className="body-sm" style={{ margin: 0, fontSize: "var(--typography-font-size-tag)" }}>
            {ALBUM_ARTIST}
          </p>
        </div>

        {/* Apple Music embed, appears when the record is playing */}
        {showPlayer ? (
          <iframe
            allow="autoplay *; encrypted-media *;"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            src={ALBUM_EMBED}
            style={{
              width: "100%",
              maxWidth: "280px",
              height: "175px",
              borderRadius: "var(--radius-lg)",
              border: "none",
              overflow: "hidden",
              background: "transparent",
            }}
            title={`${ALBUM_TITLE}, ${ALBUM_ARTIST}`}
          />
        ) : (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--typography-font-size-tag)",
              color: "var(--color-muted)",
              margin: 0,
              textAlign: "center",
            }}
          >
            Tap the record to listen
          </p>
        )}
      </div>
    </Card>
  );
}
