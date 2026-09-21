/* The site under audit. Browser audits read AUDIT_URL so a second
   worktree can run the gate against its own dev server (e.g. :3001);
   default is this repo's server on :3000. */
export const BASE = (process.env.AUDIT_URL ?? process.env.AUDIT_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
