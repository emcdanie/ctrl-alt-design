"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { social } from "@/lib/social";
import { POSITIONING } from "@/lib/copy";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
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

/* Contact rebuild (2026-07-17): one page heading lives on the page, not
 * here. The panel has two real jobs: LEFT the human (portrait orb,
 * name, one line, quiet practical rows, the email/LinkedIn escape
 * hatch), RIGHT the form (visible labels, accessible required marks,
 * inline errors via aria-describedby, honest success and failure
 * states; posts to /api/contact -> Resend -> her inbox). The
 * mini-sitemap is gone: navigation lives in the nav and footer. */

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: "var(--typography-font-size-sm)",
  fontWeight: 600,
  color: "var(--color-ink)",
  marginBottom: "var(--spacing-1)",
};

const quietRow: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--typography-font-size-base)",
  color: "var(--color-ink-soft)",
  lineHeight: 1.6,
  margin: 0,
};

export default function ContactSection() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  // Footer copyright year — gated to client-only to remove the (very rare)
  // SSR/CSR year-boundary hydration risk.
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const fieldError = (key: keyof FormState, value: string): string | undefined => {
    if (key === "name" && !value.trim()) return "Name is required";
    if (key === "email") {
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
    }
    if (key === "message" && !value.trim()) return "Message is required";
    return undefined;
  };

  /* validate on blur, not only on submit: each field reports (or clears)
     its own error the moment the visitor leaves it */
  const handleBlur = (key: keyof FormState) => {
    setErrors((prev) => ({ ...prev, [key]: fieldError(key, form[key]) }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    for (const key of ["name", "email", "message"] as const) {
      const err = fieldError(key, form[key]);
      if (err) newErrors[key] = err;
    }
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
        body: JSON.stringify({ ...form, company: honeypot, startedAt }),
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
    border: hasError ? "1px solid var(--case-writing-text)" : "1px solid var(--color-border-medium)",
    borderRadius: "var(--radius-xl)",
    padding: "var(--spacing-3) var(--spacing-4)",
    fontSize: "var(--typography-font-size-base)",
    lineHeight: 1.5,
    color: "var(--color-ink)",
    outline: "none",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
    fontFamily: "var(--font-body)",
  });

  const linkStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--spacing-2)",
    minHeight: "var(--spacing-touch-target)",
    fontFamily: "var(--font-body)",
    fontSize: "var(--typography-font-size-base)",
    fontWeight: 600,
    color: "var(--color-accent-ink)",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  };

  return (
    <footer
      id="contact"
      style={{
        paddingBottom: "var(--spacing-12)",
        scrollMarginTop: "calc(var(--header-height) + var(--spacing-4))",
      }}
    >
      <div className="layout-container">
        <GlassBanner className="mb-16 grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-2">
          {/* ── Left: the human ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)" }}>
            {/* identity: one aligned group, portrait beside name/title */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-5)" }}>
              <div className="photo-bubble" style={{ width: "clamp(112px, 9vw, 140px)", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/thumbnails/Me.jpeg" alt="Elleta, portrait" />
              </div>
              <div>
                <p className="heading-item" style={{ margin: 0 }}>
                  Elleta McDaniel
                </p>
                <p style={{ ...quietRow, color: "var(--color-muted)", marginTop: "var(--spacing-1)" }}>
                  {/* positioning phrase from the ONE constant (21 Jul) */}
                  Product Designer specialising in {POSITIONING} and complex platforms.
                </p>
              </div>
            </div>

            {/* quiet practical rows, not cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
              <p style={quietRow}>Open to full-time roles and select freelance projects.</p>
              <p style={quietRow}>Based near Barcelona, CET, remote-friendly.</p>
            </div>

            {/* no plaintext email anywhere (constitution copy rule); the
                form is the channel, LinkedIn the alternative */}
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              <Icon name="Linkedin" size="sm" />
              linkedin.com/in/elleta-mcdaniel
            </a>
          </div>

          {/* ── Right: the form ── */}
          <div>
            {submitted ? (
              <div
                className="rounded-2xl border p-6 text-center"
                style={{
                  borderColor: "var(--case-clarity-text)",
                  background: "color-mix(in srgb, var(--case-clarity-hi) 18%, transparent)",
                }}
                role="status"
              >
                <div className="text-2xl mb-2" style={{ color: "var(--case-clarity-text)" }}>
                  ✓
                </div>
                <p
                  className="text-[length:var(--typography-font-size-sm)] font-medium"
                  style={{ color: "var(--color-ink)" }}
                >
                  Message sent
                </p>
                <p
                  className="text-[length:var(--typography-font-size-base)] mt-1"
                  style={{ color: "var(--color-ink-soft)" }}
                >
                  Thanks for reaching out. I usually reply within two days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* honeypot: humans never see or fill this */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
                  <label htmlFor="contact-company">Company</label>
                  <input
                    id="contact-company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="contact-name" style={labelStyle}>
                    Your name{" "}
                    <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>(required)</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onBlur={() => handleBlur("name")}
                    className="contact-field"
                    style={fieldStyle(!!errors.name)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      role="alert"
                      className="text-[length:var(--typography-font-size-tag)] mt-1"
                      style={{ color: "var(--case-writing-text)" }}
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" style={labelStyle}>
                    Email{" "}
                    <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>(required)</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="name@studio.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onBlur={() => handleBlur("email")}
                    className="contact-field"
                    style={fieldStyle(!!errors.email)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                  />
                  {errors.email && (
                    <p
                      id="contact-email-error"
                      role="alert"
                      className="text-[length:var(--typography-font-size-tag)] mt-1"
                      style={{ color: "var(--case-writing-text)" }}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" style={labelStyle}>
                    Your message{" "}
                    <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>(required)</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onBlur={() => handleBlur("message")}
                    className="contact-field"
                    style={{ ...fieldStyle(!!errors.message), minHeight: "160px", resize: "vertical" }}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      role="alert"
                      className="text-[length:var(--typography-font-size-tag)] mt-1"
                      style={{ color: "var(--case-writing-text)" }}
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {sendError && (
                  <p
                    role="alert"
                    className="text-[length:var(--typography-font-size-tag)]"
                    style={{ color: "var(--case-writing-text)" }}
                  >
                    Something went wrong sending this. Your message is still here, and you can
                    always reach me on LinkedIn instead.
                  </p>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={sending}
                  className="w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending…" : "Send message"}
                </Button>
              </form>
            )}
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
