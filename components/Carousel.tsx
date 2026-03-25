"use client";

import Image from "next/image";

// Real work screenshots, photos, and looping videos — no text labels
const slides: { img?: string; video?: string }[] = [
  { img: "/images/thumbnails/TRAVEL.png" },
  { img: "/images/thumbnails/IMG_3144.jpeg" },
  { video: "/videos/DesignSystem.mov" },
  { img: "/images/thumbnails/imag1.png" },
  { img: "/images/thumbnails/FINVIZ.png" },
  { img: "/images/thumbnails/IMG_3153.jpeg" },
  { video: "/videos/hackathon-showreel.mp4" },
  { img: "/images/thumbnails/image2.png" },
  { img: "/images/thumbnails/AIPoweredSearch.png" },
  { img: "/images/thumbnails/IMG_3170.jpeg" },
  { video: "/videos/Prism.mov" },
  { img: "/images/thumbnails/imGE3.png" },
  { img: "/images/thumbnails/FormularOne.png" },
  { img: "/images/thumbnails/IMG_3182.jpeg" },
  { video: "/videos/eddie.mov" },
  { img: "/images/thumbnails/HealthForm.png" },
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
                onError={(e) => {
                  // Hide video if format not supported (e.g. .mov in Chrome)
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <Image
                src={slide.img!}
                alt=""
                fill
                sizes="168px"
                quality={75}
                loading="lazy"
                className="object-cover"
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
