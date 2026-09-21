/**
 * Social Links — Single source of truth.
 *
 * Update URLs here and they propagate everywhere:
 * AboutSection, ContactActions, OverlayNav, ResumeModal.
 */

export const social = {
  linkedin: "https://www.linkedin.com/in/elleta-mcdaniel/",
} as const;

/* Email rule (constitution §6, amended 18 Sep 2026): the address is
   never in the HTML or the source as one string. It is assembled only
   when someone asks to copy it. */
const EMAIL_PARTS = ["elletamc", "gmail.com"] as const;
export const assembleEmail = () => EMAIL_PARTS.join("@");
