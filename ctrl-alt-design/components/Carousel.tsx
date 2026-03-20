"use client";

// Real work screenshots, photos, and a looping video — no text labels
const slides: { img?: string; video?: string }[] = [
  { img: "/images/thumbnails/Screenshot 2026-03-17 at 21.45.53.png" },
  { img: "/images/thumbnails/IMG_3144.jpeg" },
  { img: "/images/thumbnails/Screenshot 2026-03-17 at 21.46.04.png" },
  { img: "/images/thumbnails/FINVIZ.png" },
  { img: "/images/thumbnails/IMG_3153.jpeg" },
  { img: "/images/thumbnails/Screenshot 2026-03-17 at 21.46.12.png" },
  { img: "/images/thumbnails/AIPoweredSearch.png" },
  { img: "/images/thumbnails/IMG_3170.jpeg" },
  { img: "/images/thumbnails/Screenshot 2026-03-17 at 21.46.17.png" },
  { img: "/images/thumbnails/FormularOne.png" },
  { img: "/images/thumbnails/IMG_3182.jpeg" },
  { img: "/images/thumbnails/Screenshot 2026-03-17 at 21.46.26.png" },
  { img: "/images/thumbnails/HealthForm.png" },
  { video: "/videos/hackathon-showreel.mp4" },
];

const allSlides = [...slides, ...slides];

const patternA = {
  borderTopLeftRadius: "0px",
  borderTopRightRadius: "70px",
  borderBottomRightRadius: "0px",
  borderBottomLeftRadius: "70px",
};

const patternB = {
  borderTopLeftRadius: "70px",
  borderTopRightRadius: "0px",
  borderBottomRightRadius: "70px",
  borderBottomLeftRadius: "0px",
};

export default function Carousel() {
  return (
    <section className="w-full py-6 relative overflow-hidden">
      <div className="carousel-track gap-[8px]">
        {allSlides.map((slide, i) => (
          <div
            key={i}
            className="flex-shrink-0 relative overflow-hidden bg-[#2A2420]"
            style={{
              width: "168px",
              height: "470px",
              ...(i % 2 === 0 ? patternA : patternB),
            }}
          >
            {slide.video ? (
              <video
                src={slide.video}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.img}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* Left fade */}
      <div
        className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, #EDE8DF 0%, transparent 100%)" }}
      />
      {/* Right fade */}
      <div
        className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, #EDE8DF 0%, transparent 100%)" }}
      />
    </section>
  );
}
