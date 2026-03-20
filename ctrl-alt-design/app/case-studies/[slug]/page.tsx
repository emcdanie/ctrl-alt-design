import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCaseStudy, getAdjacentStudies } from "@/data/caseStudies";
import caseStudies from "@/data/caseStudies";

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const { prev, next } = getAdjacentStudies(slug);

  return (
    <main className="bg-[#EDE8DF] min-h-screen">

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-[#EDE8DF]/90 backdrop-blur-md border-b border-[#1A1814]/08">
        <Link href="/" className="text-[13px] font-medium text-[#1A1814]">
          Elleta McDaniel
        </Link>
        <div className="hidden md:flex items-center gap-8 text-[13px] text-[#4A4640]">
          <Link href="/#work" className="hover:text-[#1A1814] transition-colors">Work</Link>
          <Link href="/#capabilities" className="hover:text-[#1A1814] transition-colors">Capabilities</Link>
          <Link href="/#experience" className="hover:text-[#1A1814] transition-colors">Experience</Link>
        </div>
        <Link
          href="/#contact"
          className="text-[13px] font-semibold bg-[#1A1814] text-[#EDE8DF] px-4 py-2 rounded-full hover:bg-[#4A4640] transition-colors"
        >
          Get in touch ↗
        </Link>
      </nav>

      {/* ── Back nav strip ──────────────────────────────────────── */}
      <div className="pt-[57px]">
        <div className="px-6 md:px-10 py-3 border-b border-[#1A1814]/08">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-[13px] text-[#8A8480] hover:text-[#1A1814] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Case Studies
          </Link>
        </div>
      </div>

      {/* ── Two-column layout ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row min-h-screen">

        {/* ── LEFT — sticky sidebar ────────────────────────────── */}
        <aside className="md:w-[320px] lg:w-[360px] flex-shrink-0 md:sticky md:top-[98px] md:self-start md:h-[calc(100vh-98px)] md:overflow-y-auto px-6 md:px-8 py-10 md:py-12 flex flex-col justify-between border-r border-[#1A1814]/08 no-scrollbar">
          <div>
            <p className="section-label mb-4">{cs.category}</p>

            <h1 className="font-display font-black text-[2rem] leading-[1.05] text-[#1A1814] mb-5">
              {cs.title}
            </h1>

            <p className="text-[13px] text-[#4A4640] leading-relaxed mb-8">
              {cs.description}
            </p>

            {/* Meta table */}
            <div className="space-y-0">
              <div className="flex items-center justify-between py-3 border-t border-[#1A1814]/10">
                <span className="text-[13px] text-[#8A8480] uppercase tracking-wide">Year</span>
                <span className="text-[13px] font-medium text-[#1A1814]">{cs.year}</span>
              </div>
              {cs.metrics?.role && (
                <div className="flex items-start justify-between py-3 border-t border-[#1A1814]/10 gap-4">
                  <span className="text-[13px] text-[#8A8480] uppercase tracking-wide flex-shrink-0">Role</span>
                  <span className="text-[13px] font-medium text-[#1A1814] text-right">{cs.metrics.role}</span>
                </div>
              )}
              {cs.metrics?.team && (
                <div className="flex items-start justify-between py-3 border-t border-[#1A1814]/10 gap-4">
                  <span className="text-[13px] text-[#8A8480] uppercase tracking-wide flex-shrink-0">Team</span>
                  <span className="text-[13px] font-medium text-[#1A1814] text-right">{cs.metrics.team}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-3 border-t border-[#1A1814]/10">
                <span className="text-[13px] text-[#8A8480] uppercase tracking-wide">Timeline</span>
                <span className="text-[13px] font-medium text-[#1A1814]">{cs.timeline}</span>
              </div>
              <div className="flex items-start justify-between py-3 border-t border-[#1A1814]/10 gap-4">
                <span className="text-[13px] text-[#8A8480] uppercase tracking-wide flex-shrink-0">Scope</span>
                <span className="text-[13px] font-medium text-[#1A1814] text-right">{cs.scope}</span>
              </div>
              {cs.liveUrl && (
                <div className="flex items-center justify-between py-3 border-t border-[#1A1814]/10">
                  <span className="text-[13px] text-[#8A8480] uppercase tracking-wide">Live</span>
                  <a
                    href={cs.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-semibold text-[#1A1814] underline underline-offset-4 hover:text-[#4A4640]"
                  >
                    Preview ↗
                  </a>
                </div>
              )}
              <div className="flex items-start justify-between py-3 border-t border-b border-[#1A1814]/10 gap-4">
                <span className="text-[13px] text-[#8A8480] uppercase tracking-wide flex-shrink-0">Tools</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {cs.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="mt-10 text-[13px] text-[#8A8480] hover:text-[#1A1814] transition-colors flex items-center gap-2"
          >
            ← All work
          </Link>
        </aside>

        {/* ── RIGHT — scrolling content ────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Hero image */}
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={cs.heroImage}
              alt={cs.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, calc(100vw - 360px)"
            />
          </div>

          {/* ── NARRATIVE LAYOUT ──────────────────────────────── */}
          {cs.narrative ? (
            <div className="max-w-[860px] mx-auto px-6 md:px-12">

              {/* Overview headline */}
              <div className="py-14 border-b border-[#1A1814]/08">
                <p className="section-label mb-5">Overview</p>
                <p className="font-display font-bold text-[1.65rem] md:text-[2rem] text-[#1A1814] leading-[1.25] mb-6">
                  {cs.overview.headline}
                </p>
                <p className="text-[18px] text-[#4A4640] leading-[1.75]">
                  {cs.overview.body}
                </p>
              </div>

              {/* Supporting images */}
              {cs.images.length > 0 && (
                <div className="py-10 border-b border-[#1A1814]/08">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cs.images.map((src, i) => (
                      <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                        <Image
                          src={src}
                          alt={`${cs.title} — image ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 420px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Narrative sections */}
              {cs.narrative.map((section, idx) => (
                <div
                  key={idx}
                  className="py-12 border-b border-[#1A1814]/08"
                >
                  {section.label && (
                    <p className="section-label mb-4">{section.label}</p>
                  )}
                  <h2 className="font-display font-bold text-[1.35rem] md:text-[1.6rem] text-[#1A1814] leading-snug mb-6">
                    {section.heading}
                  </h2>
                  <div className="space-y-5">
                    {section.paragraphs.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-[18px] text-[#4A4640] leading-[1.75]"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Completion tag */}
              <div className="py-12 border-b border-[#1A1814]/08">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#1A1814] text-[#EDE8DF] text-[13px] font-semibold tracking-widest uppercase">
                  {cs.outcomes.completionTag}
                </span>
              </div>

            </div>

          ) : (
            /* ── STRUCTURED LAYOUT (fallback) ───────────────── */
            <>
              <div className="px-8 md:px-12 py-12 border-b border-[#1A1814]/08">
                <p className="section-label mb-5">Overview</p>
                <p className="font-display font-bold text-2xl md:text-[1.9rem] text-[#1A1814] leading-snug mb-6 max-w-2xl">
                  {cs.overview.headline}
                </p>
                <p className="text-[15px] text-[#4A4640] leading-relaxed max-w-xl">
                  {cs.overview.body}
                </p>
              </div>

              {cs.images.length > 0 && (
                <div className="px-8 md:px-12 py-10 border-b border-[#1A1814]/08">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cs.images.map((src, i) => (
                      <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                        <Image
                          src={src}
                          alt={`${cs.title} image ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-8 md:px-12 py-12 border-b border-[#1A1814]/08">
                <p className="section-label mb-5">The Problem</p>
                <h2 className="font-display font-black text-2xl md:text-3xl text-[#1A1814] uppercase mb-5 leading-tight max-w-xl">
                  {cs.problem.title}
                </h2>
                <p className="text-[15px] text-[#4A4640] leading-relaxed max-w-xl">
                  {cs.problem.body}
                </p>
              </div>

              <div className="px-8 md:px-12 py-12 border-b border-[#1A1814]/08">
                <p className="section-label mb-5">Process</p>
                <h2 className="font-display font-black text-2xl md:text-3xl text-[#1A1814] uppercase mb-8 leading-tight max-w-xl">
                  {cs.process.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cs.process.steps.map((step) => (
                    <div key={step.number} className="bg-white/60 rounded-2xl p-6 border border-[#1A1814]/08">
                      <span className="section-label text-[#1A1814]/30 mb-3 block">{step.number}</span>
                      <h3 className="font-display font-bold text-[15px] text-[#1A1814] mb-2">{step.title}</h3>
                      <p className="text-[13px] text-[#4A4640] leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-8 md:px-12 py-12 border-b border-[#1A1814]/08">
                <p className="section-label mb-5">Outcomes</p>
                <h2 className="font-display font-black text-2xl md:text-3xl text-[#1A1814] uppercase mb-5 leading-tight max-w-xl">
                  {cs.outcomes.title}
                </h2>
                <p className="text-[15px] text-[#4A4640] leading-relaxed max-w-xl mb-8">
                  {cs.outcomes.body}
                </p>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#1A1814] text-[#EDE8DF] text-[13px] font-semibold tracking-widest uppercase">
                  {cs.outcomes.completionTag}
                </span>
              </div>
            </>
          )}

          {/* Full-width image */}
          {cs.fullWidthImage && (
            <div className="px-6 md:px-12 py-10 border-b border-[#1A1814]/08">
              <div className="relative aspect-[2/1] rounded-2xl overflow-hidden">
                <Image
                  src={cs.fullWidthImage}
                  alt={`${cs.title} full view`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, calc(100vw - 360px)"
                />
              </div>
            </div>
          )}

          {/* ── Prev / Next ──────────────────────────────────── */}
          <div className="px-6 md:px-12 py-10 border-b border-[#1A1814]/08">
            <div className="flex items-stretch justify-between gap-4">
              {prev ? (
                <Link
                  href={`/case-studies/${prev.slug}`}
                  className="group flex flex-col gap-1.5 max-w-[45%]"
                >
                  <span className="section-label">← Previous</span>
                  <span className="font-display font-bold text-[15px] text-[#1A1814] group-hover:text-[#4A4640] transition-colors leading-snug">
                    {prev.title}
                  </span>
                  <span className="text-[13px] text-[#8A8480]">{prev.category}</span>
                </Link>
              ) : <div />}
              {next ? (
                <Link
                  href={`/case-studies/${next.slug}`}
                  className="group flex flex-col items-end gap-1.5 max-w-[45%]"
                >
                  <span className="section-label">Next →</span>
                  <span className="font-display font-bold text-[15px] text-[#1A1814] group-hover:text-[#4A4640] transition-colors leading-snug text-right">
                    {next.title}
                  </span>
                  <span className="text-[13px] text-[#8A8480]">{next.category}</span>
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* ── CTA ─────────────────────────────────────────── */}
          <div className="px-6 md:px-12 py-16">
            <div className="bg-[#1A1814] rounded-3xl px-10 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <p className="section-label text-white/40 mb-3">Have a project in mind?</p>
                <h2 className="font-display font-black text-2xl md:text-3xl text-white leading-tight uppercase">
                  Open to full-time roles &<br />select freelance projects.
                </h2>
              </div>
              <Link
                href="/#contact"
                className="flex-shrink-0 bg-[#EDE8DF] text-[#1A1814] font-semibold text-[13px] px-6 py-3 rounded-full hover:bg-white transition-colors uppercase tracking-wide"
              >
                Get in touch ↗
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
