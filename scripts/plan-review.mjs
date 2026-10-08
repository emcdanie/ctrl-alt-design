// Second-model review of a plan issue (CLAUDE.md section 12).
// Run: npm run plan:review -- <issue#>
// Reads the issue, asks Codex (read-only sandbox, uses Elleta's own sign-in) to
// challenge it, posts the answer as an issue comment. If Codex is missing or out
// of quota it says so and exits 0: the plan still goes to Elleta.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const issue = process.argv[2];
if (!issue || !/^\d+$/.test(issue)) {
  console.error("usage: npm run plan:review -- <issue#>");
  process.exit(1);
}

const { title, body } = JSON.parse(
  execFileSync("gh", ["issue", "view", issue, "--json", "title,body"], { encoding: "utf8" }),
);

const prompt = `You're a senior design engineer reviewing a plan for elleta.design (Next.js, BELLA design system, CLAUDE.md rules). Find what's wrong or missing: wrong defaults, accessibility, phones (375), dark mode, scope creep, cheaper alternatives. Max 10 points, most important first. Say 'agree' for decisions you'd keep. Read CLAUDE.md in the working directory for the rules. Do not edit any file.

# ${title}

${body}`;

const out = join(mkdtempSync(join(tmpdir(), "plan-review-")), "review.md");
const run = spawnSync(
  "codex",
  ["exec", "--sandbox", "read-only", "--ephemeral", "--output-last-message", out, prompt],
  { encoding: "utf8" },
);

let review = "";
try {
  review = readFileSync(out, "utf8").trim();
} catch {}

if (run.error || run.status !== 0 || !review) {
  const why = run.error ? "Codex CLI not found" : `Codex did not return a review (exit ${run.status}; quota or sign-in?)`;
  console.log(`plan:review skipped: ${why}. The plan still goes to Elleta without a second opinion.`);
  process.exit(0);
}

execFileSync("gh", ["issue", "comment", issue, "--body", `## Second opinion (Codex)\n\n${review}`], { stdio: "inherit" });
console.log(`plan:review: posted on #${issue}`);
