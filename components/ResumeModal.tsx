"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { assembleEmail, social } from "@/lib/social";

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

/* Grouped, design systems first (round 7, 7 Oct 2026); content from
   _private/content/cv-2026-09.md. */
const skillGroups = [
  { label: "Design systems", items: ["Token architecture", "Component APIs", "Governance and contribution", "Documentation", "Adoption metrics", "Accessibility (WCAG 2.2 AA)"] },
  { label: "AI workflows", items: ["Claude / Claude Code", "Figma MCP", "Code Connect", "AI-readable docs"] },
  { label: "Build", items: ["Figma (advanced)", "Storybook", "React", "TypeScript", "HTML/CSS", "Next.js", "Git"] },
  { label: "Product", items: ["Research and usability testing", "Information architecture", "Complex B2B flows", "Multi-role dashboards"] },
];

const projects = [
  { name: "BELLA", text: "My open design system: token pipeline, React components in Storybook, visual and contract tests, and docs written for people and AI (MCP-readable). Powers elleta.design." },
  { name: "CHIP", text: "A design-system agent built solo in five days for the Anthropic Claude Code hackathon: it watches for drift, drafts fixes and waits for approval." },
];

/* Courses, workshops, conferences, hackathons: these live in the CV
   only since the minimal About (about-rebuild lock, 18 Sep 2026). Moved
   verbatim from the retired About learning section; the hackathon is
   from the CHIP case ("Five days, solo, for the Anthropic Claude Code
   hackathon"). */
/* One date-range formatter for the dialog and the PDF: periods are stored
   "start, end" and read "start to end" (constitution section 6). */
const formatPeriod = (period: string) => period.replace(", ", " to ");

const credentials = [
  { period: "2024, 2025", title: "Brad Frost Web Maker Program", issuer: "Brad Frost" },
  { period: "2025", title: "Design Tokens Course", issuer: "Romina Kavčič, The Design System Guide" },
  { period: "2025, 2026", title: "Into Design Systems (conference)", issuer: "Into Design Systems" },
  { period: "2025", title: "Smart Interface Design Patterns (workshop)", issuer: "Vitaly Friedman, Smashing Magazine" },
  { period: "2026", title: "Designing Complex UIs in the Age of AI (workshop)", issuer: "Vitaly Friedman, Smashing Magazine" },
  { period: "2026", title: "Claude Code hackathon", issuer: "Anthropic" },
];

const education = [
  {
    period: "Nov 2022, Jan 2023",
    institution: "Ironhack",
    degree: "UX/UI Design",
  },
  {
    /* filled from her LinkedIn (Elleta, 21 Jul, via Cowork) */
    period: "Apr 2021, Jan 2022",
    institution: "SheCodes",
    degree: "Frontend Developer, Information Technology",
  },
  {
    period: "2012, 2013",
    institution: "IDEP Barcelona",
    degree: "Postgraduate, Fashion Design and Image",
  },
  {
    period: "2005, 2009",
    institution: "Arizona State University",
    degree: "BSc Design, Interior Architecture, 3.9 GPA",
  },
];

type CvRole = {
  period: string;
  title: string;
  company: string;
  highlights: string[];
  clients?: CvRole[];
};

const roles: CvRole[] = [
  {
    period: "Oct 2025, Present",
    title: "AI-Enabled Design Systems Engineer",
    company: "Brad Frost Web (Maker Program) · Contract",
    highlights: [
      "Build Claude-powered workflows for prototyping, component audits and system documentation.",
      "Built a Figma component library aligned with reusable web components and a multi-theme architecture, translating an existing code-based system into production-ready Figma components.",
      "Shape governance, documentation and design-to-code alignment, applying Atomic Design across HTML, CSS, JavaScript and static-site tooling.",
    ],
  },
  /* elleta.design: the same grouping as ExperienceSection (About lock
     beat 6), so the page and the CV never disagree */
  {
    period: "Oct 2025, Present",
    title: "Design Systems Consultant",
    company: "elleta.design",
    highlights: [],
    clients: [
      {
        period: "Apr 2026, Jul 2026",
        title: "Design Systems Specialist",
        company: "a global fashion retailer",
        highlights: [
          "Owned component governance for the retailer's cross-platform design system across Web, iOS and Android: defined, governed and released components across shared Figma libraries, documented in Zeroheight.",
          "First to bring AI into the team's design-system work: built workflows with Claude, Figma MCP and the Desktop Bridge for automated audits, machine-readable component patterns and documentation.",
          "Built the tooling and docs the team needed to adopt Code Connect themselves, so design-to-code parity didn't depend on me.",
          "Ran accessibility and dark-mode audits; defined metrics for adoption, coverage, efficiency and quality.",
        ],
      },
      {
        period: "Oct 2025, Dec 2025",
        title: "UX / Product Designer",
        company: "UN Office at Geneva (UNOG)" /* TODO(elleta): exact entry wording is yours; the name is restored per _private/nda-employers.txt (Pass E task 9) */,
        highlights: [
          "Designed a high-fidelity operational dashboard prototype across multiple teams, turning complex workflows into clear data visualisation.",
          "Ran stakeholder interviews with technical and non-technical users; designed modular components and layouts for a scalable, accessible dashboard.",
        ],
      },
    ],
  },
  {
    period: "Jul 2024, Feb 2026",
    title: "Product & Design Systems Designer",
    company: "a B2B travel platform",
    highlights: [
      "Built the company's first design system from scratch (tokens, components, themes) and integrated the tokens into production code with engineering; wrote the documentation from day one.",
      "Led the UX transformation of a legacy platform across booking, admin, finance and multi-role dashboards.",
      "Re-architected and shipped end-to-end booking for flights and car rental: search, filters, sorting, seat selection, upsells and post-booking, within API and edge-case constraints.",
      "Ran research with clients and shipped the features they requested.",
      "Delivered prototypes for executive and investor presentations that supported funding for product and team growth.",
    ],
  },
  {
    period: "Feb 2023, Feb 2024",
    title: "UX/UI Designer",
    company: "VML",
    highlights: [
      "Designed mobile-native banking experiences on a client team, from wireframes to high-fidelity prototypes.",
      "Ran UX research, benchmarking and usability evaluations; worked with product managers and developers on consistent, accessible implementation.",
    ],
  },
  /* Pre-design roles (Elleta, 21 Jul, via Cowork): public on her
     LinkedIn by her choice; names scoped in _private/nda-employers.txt
     to ExperienceSection + this surface only. Highlights are
     TODO(elleta) content slots and render NOTHING until her words
     land. Order confirmed by Elleta (Co.Lab before Allianz, 21 Jul). */
  {
    period: "Feb 2022, Mar 2022",
    title: "Frontend Developer",
    company: "Co.Lab" /* TODO(elleta): exact entry wording is yours */,
    highlights: [],
  },
  {
    period: "Jun 2022, Sep 2022",
    title: "DevOps Engineer",
    company: "Allianz Technology" /* TODO(elleta): exact entry wording is yours */,
    highlights: [],
  },
  {
    period: "Dec 2020, Jan 2022",
    title: "Client Account Manager",
    company: "ADP" /* TODO(elleta): exact entry wording is yours */,
    highlights: [],
  },
  {
    /* Combined earlier-roles entry per Dirk's advice (Elleta, 21 Jul).
       TODO(elleta): confirm the ecological fashion brand name. */
    period: "2011, 2020",
    title: "Earlier career",
    company: "",
    highlights: [
      "Project Partner Manager, HP (2014 to 2020)",
      "Junior Fashion Designer, ecological fashion brand internship (2016)",
      "B2B & Consumer Sales Representative, Apple (2011 to 2013)",
    ],
  },
];

const PROFILE =
  "Design engineer who works where design meets code. I build token architectures, component libraries and the governance and documentation that keep them true in production, and I make them readable by AI as well as by people. I use Claude, Figma MCP and Code Connect daily to audit, document and ship faster, and I read the code so design and engineering stay aligned. Background in front-end development and product design for complex B2B SaaS, fintech and institutional platforms.";

/* the one shared address (deep link, constitution: elleta.design/cv) */
const CV_URL = "https://elleta.design/cv";
const SHARE_TITLE = "Elleta McDaniel, CV";
const SHARE_TEXT = "Elleta McDaniel, Design Engineer, Design Systems. Curriculum vitae.";
const MAILTO = `mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(`${SHARE_TEXT}\n${CV_URL}`)}`;

const track = (method: "native" | "email" | "copy-link") =>
  (window as unknown as { umami?: { track: (n: string, d?: object) => void } }).umami?.track("cv-share", { method });

/* false on the server and during hydration, true after: the portal target
   (document.body) must not be touched while rendering on the server, or
   /cv, which renders with the dialog open, crashes with a 500 (round 6) */
const noopSubscribe = () => () => {};
const useMounted = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

export default function ResumeModal({ open: wanted, onClose }: ResumeModalProps) {
  const mounted = useMounted();
  const open = wanted && mounted;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [menuFrom, setMenuFrom] = useState<"header" | "bar" | null>(null);
  const menuOpen = menuFrom !== null;
  const focusShare = (from: string | null) =>
    panelRef.current?.querySelector<HTMLElement>(`[data-cv-share="${from}"] button`)?.focus();

  /* the address is assembled here, on open, in the browser: the dialog is
     portalled only while open, so no static HTML or source holds it
     (constitution section 6) */
  useEffect(() => {
    setEmail(open ? assembleEmail() : "");
    if (!open) setMenuFrom(null);
  }, [open]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(assembleEmail());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* no clipboard: the site's other copy buttons fail the same quiet way */
    }
  };

  /* phones with a native share sheet use it; everything else gets the menu */
  const share = async (from: "header" | "bar") => {
    const native = typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches;
    if (!native) {
      setMenuFrom((v) => (v === from ? null : from));
      return;
    }
    track("native");
    try {
      await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: CV_URL });
    } catch {
      /* the sheet was dismissed */
    }
  };
  const copyLink = async () => {
    track("copy-link");
    try {
      await navigator.clipboard.writeText(CV_URL);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* quiet, as above */
    }
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* modal means the page behind is out of reach: inert for focus and the
     accessibility tree (aria-modal alone is not honoured everywhere) */
  useEffect(() => {
    if (!open) return;
    const behind = [...document.body.children].filter(
      (el): el is HTMLElement => el instanceof HTMLElement && !el.hasAttribute("data-cv-modal") && !el.inert && el.tagName !== "SCRIPT"
    );
    behind.forEach((el) => { el.inert = true; });
    return () => behind.forEach((el) => { el.inert = false; });
  }, [open]);

  /* Focus management — capture opener, focus the dialog, restore on close */
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      closeBtnRef.current?.focus();
    } else {
      openerRef.current?.focus();
      openerRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (menuFrom) {
          focusShare(menuFrom);
          setMenuFrom(null);
          return;
        }
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose, menuFrom]);

  if (!open) return null;

  /* through a portal to <body> (job Q, 7 Oct 2026): the dialog sat inside
     a parent's stacking context, so the site header drew over it on a
     phone. data-cv-modal lets the print sheet show only this dialog. */
  const shareMenu = (
    <div className="cv-share-menu" data-from={menuFrom} data-cv-noprint role="group" aria-label="Share this CV">
      <a href={MAILTO} className="cv-share-menu__item" onClick={() => { track("email"); setMenuFrom(null); }}>
        Email this CV
      </a>
      <button type="button" className="cv-share-menu__item" onClick={copyLink}>
        Copy link
      </button>
      <span className="cv-share-menu__status" role="status" aria-live="polite">{linkCopied ? "Link copied" : ""}</span>
    </div>
  );

  /* through a portal to <body> (job Q, 7 Oct 2026): the dialog sat inside
     a parent's stacking context, so the site header drew over it on a
     phone. data-cv-modal lets the print sheet show only this dialog.
     Phones (round 5): full screen, one scroll, sticky header and action bar. */
  return createPortal(
    <div data-cv-modal className="fixed inset-0 z-[9996] flex items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[color:var(--modal-backdrop)] modal-backdrop" onClick={onClose} />

      {/* Modal */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-modal-title"
        className="relative bg-[color:var(--surface-paper)] w-full max-sm:h-dvh sm:rounded-3xl sm:max-w-3xl sm:max-h-[92vh] flex flex-col sm:shadow-2xl"
      >

        {/* Header */}
        <div data-cv-noprint className="bg-[color:var(--surface-paper)] border-b border-[color:var(--ink-on-paper-border)] px-5 sm:px-8 py-2 sm:py-3 flex items-center justify-between gap-3 sm:rounded-t-3xl flex-shrink-0">
          <p className="section-label">Curriculum Vitae</p>
          <div className="flex items-center gap-3" data-cv-noprint>
            {/* the PDF is this dialog printed (scripts/build-cv-pdf.mjs), so the
                two never disagree */}
            {/* a wrapper hides it: .btn-key's display is unlayered, so a utility on the Button would lose */}
            <span className="cv-share cv-desk" data-cv-share="header">
              <Button variant="secondary" onClick={() => share("header")}>
                Share
              </Button>
              {menuFrom === "header" && shareMenu}
            </span>
            <span className="max-sm:hidden">
              <Button variant="secondary" href="/cv/Elleta_McDaniel_Product_Designer_CV.pdf" download trackEvent="cv-download">
                Download PDF
              </Button>
            </span>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="cv-close"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div data-cv-body className="cv-body overflow-y-auto no-scrollbar px-5 sm:px-8 py-5 sm:py-7">

          {/* Name + contact */}
          <div>
            {/* h2 (not h1), the page h1 stays unique; it is the dialog's title, so the header does not repeat the name (job Q) */}
            <h2 id="resume-modal-title" className="font-display font-bold text-[length:var(--typography-font-size-2xl)] text-[color:var(--ink-on-paper)] leading-snug mb-0.5">
              Elleta McDaniel
            </h2>
            <p className="text-[length:var(--typography-font-size-tag)] text-[color:var(--ink-on-paper-soft)] font-medium mb-2">
              Design Engineer · Design Systems
            </p>
            <p className="cv-where">
              <span>Barcelona, Spain</span>
              <span>Open to Hybrid/Remote</span>
            </p>
            <ul className="cv-contacts">
              <li>
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" data-umami-event="cv-linkedin" className="cv-contacts__link">
                  <span data-cv-noprint className="cv-contacts__lead"><LinkedInIcon />LinkedIn<span aria-hidden="true">↗</span></span>
                  <span className="cv-print-only">linkedin.com/in/elleta-mcdaniel</span>
                </a>
              </li>
              <li className="cv-contacts__email">
                <span className="cv-contacts__address">{email}</span>
                <span data-cv-noprint>
                  <Button variant="secondary" onClick={copyEmail} trackEvent="cv-copy-email" ariaLabel="Copy email address">
                    Copy
                  </Button>
                </span>
                <span data-cv-noprint className="cv-contacts__status" role="status" aria-live="polite">{copied ? "Copied" : ""}</span>
              </li>
            </ul>
          </div>

          {/* Profile */}
          <div>
            <p className="section-label mb-3">Profile</p>
            <p className="text-[length:var(--typography-font-size-base)] text-[color:var(--ink-on-paper-soft)] leading-relaxed">
              {PROFILE}
            </p>
          </div>

          {/* Employment */}
          <div className="cv-section">
            <p className="section-label mb-4">Employment</p>
            <div data-cv-entries className="cv-entries">
              {roles.map((role) => (
                <div key={role.title + role.company} className="cv-row">
                  <span className="text-[length:var(--typography-font-size-tag)] text-[color:var(--ink-on-paper-muted)] font-medium pt-0.5 leading-snug">{formatPeriod(role.period)}</span>
                  <div>
                    <p className="text-[length:var(--typography-font-size-tag)] font-semibold text-[color:var(--ink-on-paper)] leading-snug">
                      {role.title}{" "}
                      {role.company && (
                        <span className="font-normal text-[color:var(--ink-on-paper-soft)]">@ {role.company}</span>
                      )}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {role.highlights.map((h) => (
                        <li key={h} className="card-list-item text-[length:var(--typography-font-size-base)] text-[color:var(--ink-on-paper-soft)] leading-relaxed">
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    {role.clients?.map((c) => (
                      <div key={c.company} className="mt-4">
                        <p className="text-[length:var(--typography-font-size-tag)] font-semibold text-[color:var(--ink-on-paper)] leading-snug">
                          {c.title}{" "}
                          <span className="font-normal text-[color:var(--ink-on-paper-soft)]">@ {c.company} · {formatPeriod(c.period)}</span>
                        </p>
                        <ul className="mt-2 space-y-1">
                          {c.highlights.map((h) => (
                            <li key={h} className="card-list-item text-[length:var(--typography-font-size-base)] text-[color:var(--ink-on-paper-soft)] leading-relaxed">
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="cv-section">
            <p className="section-label mb-4">Projects</p>
            <div data-cv-entries className="cv-entries">
              {projects.map((p) => (
                <div key={p.name} className="cv-row">
                  <span className="text-[length:var(--typography-font-size-tag)] font-semibold text-[color:var(--ink-on-paper)] pt-0.5 leading-snug">{p.name}</span>
                  <p className="text-[length:var(--typography-font-size-base)] text-[color:var(--ink-on-paper-soft)] leading-relaxed">{p.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills: four labelled groups, design systems first */}
          <div className="cv-section">
            <p className="section-label mb-4">Skills</p>
            <div data-cv-entries className="cv-entries">
              {skillGroups.map((g) => (
                <div key={g.label} className="cv-row">
                  <span className="text-[length:var(--typography-font-size-tag)] text-[color:var(--ink-on-paper-muted)] font-medium pt-0.5 leading-snug">{g.label}</span>
                  <ul className="cv-skills">
                    {g.items.map((k) => (
                      <li key={k}>
                        <Tag outline>{k}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="cv-section">
            <p className="section-label mb-4">Credentials</p>
            <div data-cv-entries className="cv-entries">
              {credentials.map((c) => (
                <div key={c.title} className="cv-row">
                  <span className="text-[length:var(--typography-font-size-tag)] text-[color:var(--ink-on-paper-muted)] font-medium pt-0.5">{formatPeriod(c.period)}</span>
                  <div>
                    <p className="text-[length:var(--typography-font-size-tag)] font-semibold text-[color:var(--ink-on-paper)]">{c.title}</p>
                    <p className="text-[length:var(--typography-font-size-tag)] text-[color:var(--ink-on-paper-soft)]">{c.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="cv-section">
            <p className="section-label mb-4">Education</p>
            <div data-cv-entries className="cv-entries">
              {education.map((ed) => (
                <div key={ed.institution} className="cv-row">
                  <span className="text-[length:var(--typography-font-size-tag)] text-[color:var(--ink-on-paper-muted)] font-medium pt-0.5">{formatPeriod(ed.period)}</span>
                  <div>
                    <p className="text-[length:var(--typography-font-size-tag)] font-semibold text-[color:var(--ink-on-paper)]">{ed.institution}</p>
                    <p className="text-[length:var(--typography-font-size-tag)] text-[color:var(--ink-on-paper-soft)]">{ed.degree}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Phones: Download PDF and Share stay in reach (desktop has them in the header) */}
        <div data-cv-noprint className="cv-actionbar">
          <Button variant="primary" href="/cv/Elleta_McDaniel_Product_Designer_CV.pdf" download trackEvent="cv-download">
            Download PDF
          </Button>
          <span className="cv-share" data-cv-share="bar">
            <Button variant="secondary" onClick={() => share("bar")}>
              Share
            </Button>
            {menuFrom === "bar" && shareMenu}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* "CV" as a small text link (the footer's small print, the case ending's
   "View CV"), or, with `button`, the Button that opens it (the About
   hero's one primary, site v3): opens the modal. */
export function ResumeLink({ className = "", label = "CV", button }: { className?: string; label?: string; button?: "primary" | "secondary" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {button ? (
        <Button variant={button} className={className} onClick={() => setOpen(true)} trackEvent="cv-open">
          {label}
        </Button>
      ) : (
        <button type="button" className={className} onClick={() => setOpen(true)} data-umami-event="cv-open">
          {label}
        </button>
      )}
      <ResumeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
