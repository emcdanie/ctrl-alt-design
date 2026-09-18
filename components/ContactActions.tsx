"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { social, assembleEmail } from "@/lib/social";

/* The two ways to reach Elleta (About "Say hi" + the nav's "Get in
   touch", about-rebuild lock 18 Sep 2026). Copy email assembles the
   address on click (§6); if the clipboard is unavailable it falls back
   to opening the mail app, so the action never silently fails. */
export default function ContactActions({ layout = "row" }: { layout?: "row" | "stack" }) {
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

  return (
    <div className={`contact-actions contact-actions--${layout}`}>
      <Button onClick={copyEmail} dataCursor="copy">
        <Icon name={copied ? "Check" : "Copy"} size="sm" />
        {copied ? "Email copied" : "Copy email"}
      </Button>
      <a className="btn-key" href={social.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="open">
        LinkedIn <Icon name="OpenNewWindow" size="sm" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to the clipboard" : ""}
      </span>
    </div>
  );
}
