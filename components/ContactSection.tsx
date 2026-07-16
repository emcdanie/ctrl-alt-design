"use client";

import { useEffect, useState } from "react";
import { social } from "@/lib/social";

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
    background: "rgba(255,255,255,0.04)",
    border: hasError
      ? "1px solid #f87171"
      : "1px solid rgba(243,238,231,0.25)",
    borderRadius: "var(--radius-xl)",
    padding: "18px var(--spacing-5)",
    fontSize: "var(--typography-font-size-lg)",
    lineHeight: 1.5,
    color: "var(--ink-on-dark-strong)",
    outline: "none",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
    fontFamily: "var(--font-body)",
  });

  return (
    <footer id="contact" className="bg-[#1A1814]" style={{ paddingTop: "var(--spacing-20)", paddingBottom: "var(--spacing-12)", color: "var(--ink-on-dark-body)" }}>
      <div className="layout-container">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--grid-gap)] mb-16">
          {/* Left, form */}
          <div>
            <p className="section-label mb-4" style={{ color: "var(--ink-on-dark-muted)" }}>
             Get in touch
            </p>
            <h2 className="heading-section mb-8" style={{ color: "var(--ink-on-dark-strong)" }}>
              Let&apos;s work together.
            </h2>

            {submitted ? (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
                <div className="text-2xl mb-2">✓</div>
                <p className="text-[length:var(--typography-font-size-sm)] font-medium" style={{ color: "var(--ink-on-dark-strong)" }}>Message sent</p>
                <p className="text-[length:var(--typography-font-size-base)] mt-1" style={{ color: "var(--ink-on-dark-body)" }}>
                  Thanks for reaching out, I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                    <p id="contact-name-error" role="alert" className="text-[length:var(--typography-font-size-tag)] text-red-400 mt-1">{errors.name}</p>
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
                    <p id="contact-email-error" role="alert" className="text-[length:var(--typography-font-size-tag)] text-red-400 mt-1">{errors.email}</p>
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
                    style={{ ...fieldStyle(!!errors.message), minHeight: "160px", resize: "none" }}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="contact-message-error" role="alert" className="text-[length:var(--typography-font-size-tag)] text-red-400 mt-1">{errors.message}</p>
                  )}
                </div>

                {sendError && (
                  <p role="alert" className="text-[length:var(--typography-font-size-tag)] text-red-400">
                    Something went wrong, please try emailing me directly at elletamc@gmail.com
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-key w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>

          {/* Right, info + nav */}
          <div className="flex flex-col justify-between gap-10">
            <div>
              <h3
                className="font-display font-bold text-[length:var(--typography-font-size-2xl)] mb-2"
                style={{ color: "var(--ink-on-dark-strong)" }}
              >
                Elleta McDaniel
              </h3>
              <p
                className="text-[length:var(--typography-font-size-base)] leading-relaxed max-w-sm"
                style={{ color: "var(--ink-on-dark-body)" }}
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
                    style={{ color: "var(--ink-on-dark-muted)" }}
                  >
                    {section}
                  </p>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-[length:var(--typography-font-size-base)] transition-colors footer-nav-link"
                          style={{ color: "var(--ink-on-dark-body)" }}
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
        </div>

        {/* Bottom bar */}
        <div className="divider mb-6" style={{ backgroundColor: "rgba(250,250,248,0.08)" }} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-[length:var(--typography-font-size-tag)]" style={{ color: "var(--ink-on-dark-muted)" }}>
            ©{" "}
            <span suppressHydrationWarning style={{ display: "inline-block", minWidth: "4ch" }}>
              {year ?? ", "}
            </span>{" "}
            Elleta McDaniel. All rights reserved.
          </p>
          <p className="text-[length:var(--typography-font-size-tag)]" style={{ color: "var(--ink-on-dark-muted)" }}>
            Designed with intention. Built with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
