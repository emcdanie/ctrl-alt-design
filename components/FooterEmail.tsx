"use client";

import { useEffect, useState } from "react";
import { assembleEmail } from "@/lib/social";

/* Copy my email (the footer, and the policy pages). The address is never in the HTML (constitution
   §6): it is assembled only when someone asks to copy it. */
export default function FooterEmail({ className = "site-footer__link" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(t);
  }, [copied]);
  const copy = async () => {
    const address = assembleEmail();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${address}`;
    }
  };
  return (
    <>
      <button type="button" className={className} onClick={copy}>
        {copied ? "Email copied" : "Copy my email"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to the clipboard" : ""}
      </span>
    </>
  );
}
