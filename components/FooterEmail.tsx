"use client";

import { useEffect, useState } from "react";
import { assembleEmail } from "@/lib/social";

/* The footer's email line. The address is never in the HTML (constitution
   §6): it is assembled only when someone asks to copy it. */
export default function FooterEmail() {
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
      <button type="button" className="site-footer__link" onClick={copy}>
        {copied ? "Email copied" : "Copy my email"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to the clipboard" : ""}
      </span>
    </>
  );
}
