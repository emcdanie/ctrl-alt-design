"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Track {
  title: string;
  artist: string;
  src: string;
}

const tracks: Track[] = [
  { title: "6pm In Madrid", artist: "Atlas Hour", src: "/audio/6pm-in-madrid.mp3" },
  { title: "Wash Away", artist: "Far Orange", src: "/audio/wash-away.mp3" },
  { title: "8am In Juneau", artist: "Atlas Hour", src: "/audio/8am-in-juneau.mp3" },
];

export default function VinylPlayer() {
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = tracks[currentTrack];

  // Create and manage audio element
  useEffect(() => {
    const audio = new Audio(track.src);
    audioRef.current = audio;

    const onError = () => setAudioError(true);
    const onEnded = () => setCurrentTrack((prev) => (prev + 1) % tracks.length);

    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);

    // Reset error state for new track
    setAudioError(false); // eslint-disable-line react-hooks/set-state-in-effect

    if (playing) {
      audio.play().catch(() => setAudioError(true));
    }

    return () => {
      audio.pause();
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
      audio.src = "";
    };
  }, [currentTrack, track.src]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => setAudioError(true));
      setPlaying(true);
    }
  }, [playing]);

  const nextTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  }, []);

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

      {/* Audio error state */}
      {audioError && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            color: "var(--color-muted)",
            textAlign: "center",
            margin: 0,
            padding: "4px 8px",
            background: "rgba(0,0,0,0.04)",
            borderRadius: "6px",
          }}
        >
          Audio coming soon
        </p>
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
