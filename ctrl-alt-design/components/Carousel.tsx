"use client";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&q=80",
    label: "UI Design",
  },
  {
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    label: "SaaS Dashboard",
  },
  {
    img: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&q=80",
    label: "Design Systems",
  },
  {
    img: "https://images.unsplash.com/photo-1612831455359-970e23a1e4e9?w=400&q=80",
    label: "Dark Mode UI",
  },
  {
    img: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&q=80",
    label: "Wireframes",
  },
  {
    img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&q=80",
    label: "Product Design",
  },
  {
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    label: "Data Viz",
  },
  {
    img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&q=80",
    label: "Figma",
  },
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
            className="flex-shrink-0 relative overflow-hidden"
            style={{
              width: "168px",
              height: "470px",
              ...(i % 2 === 0 ? patternA : patternB),
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.img}
              alt={slide.label}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark overlay for text legibility */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.10) 50%, transparent 100%)",
              }}
            />
            <span className="absolute bottom-8 left-0 right-0 text-center text-white text-[13px] font-medium tracking-wider leading-snug px-4">
              {slide.label}
            </span>
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
