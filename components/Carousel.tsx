"use client";

import Image from "next/image";

// Images from /public/images/carosel/ — fixed intentional order
const carouselImages = [
  "/images/carosel/TRAVEL.png",
  "/images/carosel/imag1.png",
  "/images/carosel/FINVIZ.png",
  "/images/carosel/IMG_3144.jpeg",
  "/images/carosel/BradFrostCommandCenter.png",
  "/images/carosel/image2.png",
  "/images/carosel/CTRL_ATL_TRAVEL.jpeg",
  "/images/carosel/IMG_3153.jpeg",
  "/images/carosel/imGE3.png",
  "/images/carosel/IMG_3170.jpeg",
  "/images/carosel/Me.jpeg",
  "/images/carosel/IMG_3182.jpeg",
];

// Doubled for seamless loop
const allImages = [...carouselImages, ...carouselImages];

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
    <div className="w-full relative overflow-hidden" style={{ flexShrink: 0 }}>
      <div className="carousel-track gap-[8px]">
        {allImages.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 relative overflow-hidden"
            style={{
              width: "168px",
              height: "470px",
              background: "#E8E3DA",
              ...(i % 2 === 0 ? patternA : patternB),
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="168px"
              quality={75}
              loading="lazy"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Edge fades — seamless with page background */}
      <div
        className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, var(--color-page) 0%, transparent 100%)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, var(--color-page) 0%, transparent 100%)" }}
      />
    </div>
  );
}
