"use client";

const personalCards = [
  {
    label: "Currently listening",
    emoji: "🎧",
    value: "Add your current listen",
    subtext: "Artist or album",
  },
  {
    label: "Favourite book",
    emoji: "📖",
    value: "Add a book you love",
    subtext: "Author",
  },
  {
    label: "Favourite podcast",
    emoji: "🎙",
    value: "Add a podcast you recommend",
    subtext: "Where you listen",
  },
];

export default function PersonalSection() {
  return (
    <section className="pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        <p className="section-label mb-8">— Outside of work</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {personalCards.map((card) => (
            <div
              key={card.label}
              style={{
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid rgba(26,24,20,0.08)",
                background: "#F8F7F4",
                transition: "background 200ms ease, box-shadow 200ms ease, transform 200ms ease",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "#FFFFFF";
                el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "#F8F7F4";
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "12px", lineHeight: 1 }}>{card.emoji}</div>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#8A8480",
                marginBottom: "6px",
              }}>
                {card.label}
              </p>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "17px",
                fontWeight: 600,
                color: "#1A1814",
                lineHeight: 1.3,
                marginBottom: "4px",
              }}>
                {card.value}
              </p>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "#8A8480",
              }}>
                {card.subtext}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
