"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { social, assembleEmail } from "@/lib/social";

/* The two ways to reach Elleta (About "Say hi", the menu, and the nav's
   two icons: "icons", Elleta, 4 Oct 2026, hero v3 lock, 44px targets).
   Copy email assembles the address on click (§6); if the clipboard is
   unavailable it falls back to opening the mail app, so the action never
   silently fails. */
export default function ContactActions({ layout = "row" }: { layout?: "row" | "stack" | "icons" }) {
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
          <LinkedInIcon />
        </a>
        <button
          type="button"
          className="nav-icon"
          onClick={copyEmail}
          data-umami-event="copy-email"
          aria-label={copied ? "Email copied" : "Copy email"}
        >
          <Icon name={copied ? "Check" : "Mail"} size="sm" />
        </button>
        {status}
      </div>
    );
  }

  return (
    <div className={`contact-actions contact-actions--${layout}`}>
      <Button onClick={copyEmail}>
        <Icon name={copied ? "Check" : "Copy"} size="sm" />
        {copied ? "Email copied" : "Copy email"}
      </Button>
      <Button href={social.linkedin} trackEvent="linkedin">
        LinkedIn <Icon name="OpenNewWindow" size="sm" />
        <span className="sr-only"> (opens in a new tab)</span>
      </Button>
      {status}
    </div>
  );
}
