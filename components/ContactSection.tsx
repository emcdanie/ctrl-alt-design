"use client";

import { useState } from "react";
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
    { label: "Case Studies", href: "#work" },
    { label: "Design Lab", href: "#design-lab" },
    { label: "Process", href: "#process" },
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

  const fieldClass = (hasError: boolean) =>
    `w-full rounded-xl px-4 py-3 text-[16px] transition-[border-color] duration-150 ${
      hasError ? "border-red-400" : ""
    }`;

  const fieldStyle = (hasError: boolean): React.CSSProperties => ({
    background: "rgba(255,255,255,0.06)",
    border: hasError ? "1px solid #f87171" : "1px solid rgba(255,255,255,0.25)",
    color: "#ffffff",
    outline: "none",
  });

  return (
    <footer id="contact" className="bg-[#1A1814] text-[#EDE8DF] pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          {/* Left — form */}
          <div>
            <p className="section-label mb-4" style={{ color: "#9A9590" }}>
              — Get in touch
            </p>
            <h2 className="heading-section mb-8" style={{ color: "#EDE8DF" }}>
              Let&apos;s work together.
            </h2>

            {submitted ? (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
                <div className="text-2xl mb-2">✓</div>
                <p className="text-[14px] text-green-300 font-medium">Message sent</p>
                <p className="text-[13px] text-[#A8A4A0] mt-1">
                  Thanks for reaching out — I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    aria-label="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={fieldClass(!!errors.name)}
                    style={fieldStyle(!!errors.name)}
                  />
                  {errors.name && (
                    <p className="text-[13px] text-red-400 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    aria-label="Email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={fieldClass(!!errors.email)}
                    style={fieldStyle(!!errors.email)}
                  />
                  {errors.email && (
                    <p className="text-[13px] text-red-400 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <textarea
                    rows={4}
                    placeholder="Tell me about your project…"
                    aria-label="Your message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${fieldClass(!!errors.message)} resize-none`}
                    style={fieldStyle(!!errors.message)}
                  />
                  {errors.message && (
                    <p className="text-[13px] text-red-400 mt-1">{errors.message}</p>
                  )}
                </div>

                {sendError && (
                  <p className="text-[13px] text-red-400">
                    Something went wrong — please try emailing me directly at elletamc@gmail.com
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#EDE8DF] text-[#1A1814] text-[16px] font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>

          {/* Right — info + nav */}
          <div className="flex flex-col justify-between gap-10">
            <div>
              <h3 className="font-display font-bold text-[22px] text-[#EDE8DF] mb-2">
                Elleta McDaniel
              </h3>
              <p className="text-[16px] text-[#A8A4A0] leading-relaxed max-w-sm">
                Product Designer specialising in Design Systems and Complex Platforms.
                Open to freelance, consulting, and full-time roles.
              </p>
            </div>

            {/* Footer nav */}
            <div className="grid grid-cols-2 gap-8">
              {Object.entries(footerNav).map(([section, links]) => (
                <div key={section}>
                  <p className="text-[13px] font-medium uppercase tracking-widest text-[#B0AAA5] mb-3">
                    {section}
                  </p>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-[15px] text-[#A8A4A0] hover:text-[#EDE8DF] transition-colors"
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
          <p className="text-[13px] text-[#B0AAA5]">
            © {new Date().getFullYear()} Elleta McDaniel. All rights reserved.
          </p>
          <p className="text-[13px] text-[#B0AAA5]">
            Designed with intention. Built with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
