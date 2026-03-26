"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Track {
  title: string;
  artist: string;
  /** Apple Music embed URL — get it from: song page → ··· → Share → Copy Embed Code → grab the src URL */
  appleMusicEmbed?: string;
  /** Direct link to the song on Apple Music (fallback if no embed) */
  appleMusicUrl?: string;
}

const tracks: Track[] = [
  {
    title: "6pm In Madrid",
    artist: "Atlas Hour",
    // To add Apple Music: open music.apple.com, find the song,
    // click ··· → Share Song → Copy Link, paste as appleMusicUrl below.
    // For embedded playback: ··· → Share Song → Copy Embed Code,
    // grab the src="https://embed.music.apple.com/..." URL and paste as appleMusicEmbed.
    appleMusicUrl: "",
    appleMusicEmbed: "",
  },
  {
    title: "Wash Away",
    artist: "Far Orange",
    appleMusicUrl: "",
    appleMusicEmbed: "",
  },
  {
    title: "8am In Juneau",
    artist: "Atlas Hour",
    appleMusicUrl: "",
    appleMusicEmbed: "",
  },
];

export default function VinylPlayer() {
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showEmbed, setShowEmbed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const track = tracks[currentTrack];
  const hasEmbed = !!track.appleMusicEmbed;
  const hasLink = !!track.appleMusicUrl;

  const togglePlay = useCallback(() => {
    if (hasEmbed) {
      setShowEmbed(true);
      setPlaying((p) => !p);
    } else if (hasLink) {
      window.open(track.appleMusicUrl, "_blank", "noopener,noreferrer");
    } else {
      // No audio source — just toggle the visual spin
      setPlaying((p) => !p);
    }
  }, [hasEmbed, hasLink, track.appleMusicUrl]);

  const nextTrack = useCallback(() => {
    setPlaying(false);
    setShowEmbed(false);
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  }, []);

  // Reset embed when track changes
  useEffect(() => {
    setShowEmbed(false);
  }, [currentTrack]);

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
        onClick={togglePlay}
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
          animation: playing ? "vinyl-spin 3s linear infinite" : "none",
          position: "relative",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 0 20px rgba(0,0,0,0.3)",
          transition: "box-shadow 0.3s ease",
          flexShrink: 0,
        }}
        role="button"
        aria-label={playing ? "Pause music" : "Play music"}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); togglePlay(); }}}
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
          {/* Play/pause icon */}
          {playing ? (
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

      {/* Track info */}
      <div style={{ textAlign: "center", minHeight: "48px" }}>
        <h4
          className="heading-item"
          style={{ fontSize: "15px", marginBottom: "2px" }}
        >
          {track.title}
        </h4>
        <p
          className="body-sm"
          style={{ margin: 0, fontSize: "12px" }}
        >
          {track.artist}
        </p>
      </div>

      {/* Apple Music embed (hidden player) */}
      {showEmbed && hasEmbed && (
        <iframe
          ref={iframeRef}
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          src={track.appleMusicEmbed}
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          style={{
            width: "100%",
            maxWidth: "260px",
            height: "52px",
            borderRadius: "10px",
            border: "none",
            overflow: "hidden",
          }}
        />
      )}

      {/* Apple Music link */}
      {hasLink && !showEmbed && (
        <a
          href={track.appleMusicUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            color: "var(--color-muted)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 10px",
            borderRadius: "6px",
            background: "rgba(0,0,0,0.04)",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1814")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.073-.006-.144-.01-.217-.014-.939-.04-1.877-.06-2.816-.06H8.9c-.94 0-1.878.02-2.816.06-.073.004-.144.008-.217.014-.552.033-1.063.085-1.564.15a5.022 5.022 0 00-1.877.727C1.308 1.744.563 2.744.246 4.054a9.23 9.23 0 00-.24 2.19c-.033.68-.05 1.36-.05 2.04v7.432c0 .68.017 1.36.05 2.04.02.73.085 1.46.24 2.19.317 1.31 1.062 2.31 2.18 3.043a5.022 5.022 0 001.877.726c.501.065 1.012.117 1.564.15.073.006.144.01.217.014.939.04 1.877.06 2.816.06h6.2c.94 0 1.878-.02 2.816-.06.073-.004.144-.008.217-.014.552-.033 1.063-.085 1.564-.15a5.022 5.022 0 001.877-.727c1.118-.732 1.863-1.732 2.18-3.042.155-.73.22-1.46.24-2.19.033-.68.05-1.36.05-2.04V8.164c0-.68-.017-1.36-.05-2.04zM16.95 17.08c0 .18-.1.34-.25.42l-.01.01c-.12.06-.27.08-.42.05-1.17-.22-2.35-.09-3.22.12-.89.22-1.55.52-1.55.52-.14.06-.3.04-.42-.04a.488.488 0 01-.22-.41v-6.42c0-.16.08-.32.21-.41.09-.06.2-.09.3-.09.04 0 .07 0 .11.02.87.22 1.75.14 2.48-.03.93-.21 1.61-.54 1.61-.54.14-.07.31-.05.44.04.13.1.21.25.21.42v6.32h-.01z"/>
          </svg>
          Listen on Apple Music
        </a>
      )}

      {/* Next track */}
      <button
        onClick={nextTrack}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--color-muted)",
          background: "none",
          border: "none",
          padding: "4px 8px",
          cursor: "pointer",
          transition: "color 0.15s",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1814")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
      >
        Next track →
      </button>

      {/* Track dots */}
      <div style={{ display: "flex", gap: "6px" }}>
        {tracks.map((_, i) => (
          <span
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: i === currentTrack ? "#1A1814" : "rgba(26,24,20,0.15)",
              transition: "background 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
