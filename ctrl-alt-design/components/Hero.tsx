"use client";

const stats = [
  { number: "3+", label: "Years Product Design" },
  { number: "2", label: "Design Systems Built from Scratch" },
  { number: "B2B", label: "SaaS & Enterprise Platforms" },
  { number: "BCN", label: "Barcelona — Open to Hybrid/Remote" },
];

export default function Hero() {
  return (
    <section className="pt-32 pb-10 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main heading */}
        <h1
          className="font-display font-medium text-[#1A1814] tracking-tight mb-6"
          style={{ fontSize: "80px", lineHeight: "88px" }}
        >
          Elleta McDaniel
        </h1>

        {/* Subtitle */}
        <p
          className="text-[15px] text-[#4A4640] mb-4"
          style={{ animationDelay: "100ms" }}
        >
          Product Designer — Design Systems, Data Platforms &amp; Complex UX
        </p>

        {/* Description */}
        <p
          className="text-[14px] text-[#8A8480] max-w-xl mx-auto leading-relaxed mb-8"
          style={{ animationDelay: "200ms" }}
        >
          I design scalable systems, intuitive workflows, and structured design
          languages that bring clarity to complex digital products.
        </p>

        {/* CTA */}
        <div className="mb-14">
          <a
            href="#contact"
            className="inline-block text-[15px] font-medium text-[#EDE8DF] bg-[#1A1814] rounded-full px-7 py-3 hover:opacity-80 transition-opacity duration-200"
          >
            Say Hi
          </a>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-white/60 rounded-2xl px-5 py-5 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] animate-[fadeInUp_0.6s_ease-out_forwards] opacity-0"
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="font-display font-black text-[#1A1814] text-3xl leading-none mb-1">
                {stat.number}
              </div>
              <div className="text-[13px] text-[#8A8480] leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
