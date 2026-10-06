"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { social, assembleEmail } from "@/lib/social";

/* The two ways to reach Elleta: the header's two 44px icons ("icons",
   Elleta, 4 Oct 2026, hero v3 lock) and the same pair as labelled rows
   in the phone menu sheet ("menu", 18f).
   Copy email assembles the address on click (§6); if the clipboard is
   unavailable it falls back to opening the mail app, so the action never
   silently fails. */
export default function ContactActions({ layout }: { layout: "icons" | "menu" }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(t);
  }, [copied]);

  const copyEmail = async () => {
    const address = assembleEmail();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${address}`;
    }
  };

  const status = (
    <span role="status" aria-live="polite" className="sr-only">
      {copied ? "Email address copied to the clipboard" : ""}
    </span>
  );

  if (layout === "icons") {
    return (
      <div className="contact-actions contact-actions--icons">
        <a
          className="nav-icon"
          href={social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="linkedin"
          aria-label="LinkedIn (opens in a new tab)"
        >
          <LinkedInIcon size="solid-md" />
        </a>
        <button
          type="button"
          className="nav-icon"
          onClick={copyEmail}
          data-umami-event="copy-email"
          aria-label={copied ? "Email copied" : "Copy email"}
        >
          <Icon name={copied ? "Check" : "Mail"} size="md" />
        </button>
        {status}
      </div>
    );
  }

  /* the phone menu sheet (18f): the header's two icons as labelled 44px
     rows, so below 380px, where the header drops them, nothing is lost */
  return (
    <div className="contact-actions contact-actions--menu">
      <a className="menu-contact" href={social.linkedin} target="_blank" rel="noopener noreferrer" data-umami-event="linkedin">
        <span className="nav-icon" aria-hidden="true">
          <LinkedInIcon size="solid-md" />
        </span>
        LinkedIn<span className="sr-only"> (opens in a new tab)</span>
      </a>
      <button type="button" className="menu-contact" onClick={copyEmail} data-umami-event="copy-email">
        <span className="nav-icon" aria-hidden="true">
          <Icon name={copied ? "Check" : "Mail"} size="md" />
        </span>
        {copied ? "Email copied" : "Copy email"}
      </button>
      {status}
    </div>
  );
}
