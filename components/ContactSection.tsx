"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { social } from "@/lib/social";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassBanner from "@/components/ui/GlassBanner";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const footerNav = {
  Work: [
    { label: "Case Studies", href: "/work" },
    { label: "Design Lab", href: "/about#design-lab" },
    { label: "Process", href: "/about#process" },
    { label: "Archive", href: "#" },
  ],
  Contact: [
    { label: "LinkedIn", href: social.linkedin },
  ],
};

export default function ContactSection() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  // Footer copyright year — gated to client-only to remove the (very rare)
  // SSR/CSR year-boundary hydration risk. Same pattern as the
  // CommandCenterDashboard "Last Raven" date.
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    setSendError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setSendError(true);
      }
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  const fieldStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    background: "var(--color-card)",
    border: hasError
      ? "1px solid var(--case-writing-text)"
      : "1px solid var(--color-border-medium)",
    borderRadius: "var(--radius-xl)",
    padding: "var(--spacing-4) var(--spacing-5)",
    fontSize: "var(--typography-font-size-base)",
    lineHeight: 1.5,
    color: "var(--color-ink)",
    outline: "none",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
    fontFamily: "var(--font-body)",
  });

  return (
    <footer
      id="contact"
      style={{
        paddingTop: "var(--spacing-8)",
        paddingBottom: "var(--spacing-12)",
        /* anchor jumps must not slide the heading under the sticky nav */
        scrollMarginTop: "calc(var(--header-height) + var(--spacing-4))",
      }}
    >
      <div className="layout-container">
        {/* Two-column layout on the shared glass CTA surface */}
        <GlassBanner className="mb-16 grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-2">
          {/* Left, form */}
          <div>
            <SectionHeader label="Get in touch" title={<>Let&apos;s work together.</>} />

            {submitted ? (
              <div className="rounded-2xl border p-6 text-center" style={{ borderColor: "var(--case-clarity-text)", background: "color-mix(in srgb, var(--case-clarity-hi) 18%, transparent)" }}>
                <div className="text-2xl mb-2" style={{ color: "var(--case-clarity-text)" }}>✓</div>
                <p className="text-[length:var(--typography-font-size-sm)] font-medium" style={{ color: "var(--color-ink)" }}>Message sent</p>
                <p className="text-[length:var(--typography-font-size-base)] mt-1" style={{ color: "var(--color-ink-soft)" }}>
                  Thanks for reaching out, I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="sr-only">Your name</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="contact-field"
                    style={fieldStyle(!!errors.name)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="contact-name-error" role="alert" className="text-[length:var(--typography-font-size-tag)] mt-1" style={{ color: "var(--case-writing-text)" }}>{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="sr-only">Email address</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="contact-field"
                    style={fieldStyle(!!errors.email)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="contact-email-error" role="alert" className="text-[length:var(--typography-font-size-tag)] mt-1" style={{ color: "var(--case-writing-text)" }}>{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="sr-only">Your message</label>
                  <textarea
                    id="contact-message"
                    placeholder="Tell me about your project…"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="contact-field"
                    style={{ ...fieldStyle(!!errors.message), minHeight: "160px", resize: "vertical" }}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="contact-message-error" role="alert" className="text-[length:var(--typography-font-size-tag)] mt-1" style={{ color: "var(--case-writing-text)" }}>{errors.message}</p>
                  )}
                </div>

                {sendError && (
                  <p role="alert" className="text-[length:var(--typography-font-size-tag)]" style={{ color: "var(--case-writing-text)" }}>
                    Something went wrong, please try emailing me directly at elletamc@gmail.com
                  </p>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={sending}
                  className="w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending…" : "Send message"}
                </Button>
              </form>
            )}
          </div>

          {/* Right, info + nav */}
          <div className="flex flex-col justify-between gap-10">
            <div>
              <h3
                className="font-display font-bold text-[length:var(--typography-font-size-2xl)] mb-2"
                style={{ color: "var(--color-ink)" }}
              >
                Elleta McDaniel
              </h3>
              <p
                className="text-[length:var(--typography-font-size-base)] leading-relaxed max-w-sm"
                style={{ color: "var(--color-ink-soft)" }}
              >
                Product Designer specialising in Design Systems and Complex Platforms.
                Open to freelance, consulting, and full-time roles.
              </p>
            </div>

            {/* Footer nav */}
            <div className="grid grid-cols-2 gap-[var(--grid-gap)]">
              {Object.entries(footerNav).map(([section, links]) => (
                <div key={section}>
                  <p
                    className="text-[length:var(--typography-font-size-tag)] font-medium uppercase tracking-widest mb-3"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    {section}
                  </p>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-[length:var(--typography-font-size-base)] transition-colors footer-nav-link"
                          style={{ color: "var(--color-ink-soft)" }}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </GlassBanner>

        {/* Bottom bar */}
        <div className="divider mb-6" style={{ backgroundColor: "var(--color-border-soft)" }} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-[length:var(--typography-font-size-tag)]" style={{ color: "var(--color-muted)" }}>
            ©{" "}
            <span suppressHydrationWarning style={{ display: "inline-block", minWidth: "4ch" }}>
              {year ?? ", "}
            </span>{" "}
            Elleta McDaniel. All rights reserved.
          </p>
          <p className="text-[length:var(--typography-font-size-tag)]" style={{ color: "var(--color-muted)" }}>
            This site is its own small design system. I built and ship it in Next.js: tokens, components, and a governance gate that won’t let it drift. The proof is the thing you’re looking at.{" "}
            <Link href="/design-system" className="footer-nav-link" style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
              See the system
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
