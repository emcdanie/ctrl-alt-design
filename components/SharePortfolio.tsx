"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/* Share my portfolio: the native share sheet where there is one;
   otherwise copy the URL and say so (aria-live) for 2 seconds. */
export default function SharePortfolio({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const share = async () => {
    const url = window.location.origin;
    const title = "Elleta McDaniel, design systems";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* dismissed or blocked: fall back to copying */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* clipboard blocked: nothing else to do quietly */
    }
  };

  return (
    <div className="share-portfolio">
      <Button onClick={share} className={className}>
        <Icon name="ShareIos" size="sm" />
        Share my portfolio
      </Button>
      <p className="share-portfolio__status" role="status" aria-live="polite">
        {copied ? (
"Link copied"
        ) : null}
      </p>
    </div>
  );
}
