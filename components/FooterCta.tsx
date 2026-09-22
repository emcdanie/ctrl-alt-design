"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

/* The footer's Get in touch: the cream primary pill everywhere except
   /contact, where it would point at the page you are on, next to "Send
   message", so it steps down to the outline pill. */
export default function FooterCta() {
  const onContact = usePathname() === "/contact";
  return (
    <Button href="/contact" variant={onContact ? "secondary" : "primary"} className="btn-pill">
      Let&rsquo;s talk
    </Button>
  );
}
