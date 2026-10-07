"use client";

import { usePathname, useRouter } from "next/navigation";
import ResumeModal from "@/components/ResumeModal";

/* The shareable CV link (round 5, 7 Oct 2026): at /cv the site renders
   with the CV dialog open. Closing goes back to the page the visitor came
   from on this site, otherwise to Home. */
export default function CvRoute() {
  const router = useRouter();
  const open = usePathname() === "/cv";
  const close = () => {
    const fromSite = document.referrer.startsWith(window.location.origin);
    if (fromSite && window.history.length > 1) router.back();
    else router.push("/");
  };
  return <ResumeModal open={open} onClose={close} />;
}
