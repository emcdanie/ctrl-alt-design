/**
 * Accessibility Testing — Dev-only utilities.
 *
 * Runs axe-core accessibility audit in development and logs violations
 * to the console. Zero impact on production bundle.
 *
 * Usage: call initA11yAudit() once in a client component (dev only).
 */

/**
 * Dynamically imports axe-core and runs an audit on the document body.
 * Only runs in development mode.
 */
export async function initA11yAudit() {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "development") return;

  try {
    // Dynamic import — only loaded in dev, never bundled in production
    const axe = await import("axe-core");

    // Wait for DOM to settle
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const results = await axe.default.run(document.body, {
      rules: {
        // Focus on key areas
        "color-contrast": { enabled: true },
        "image-alt": { enabled: true },
        "button-name": { enabled: true },
        "link-name": { enabled: true },
        region: { enabled: true },
        "heading-order": { enabled: true },
      },
    });

    if (results.violations.length === 0) {
      console.log(
        "%c[a11y] No accessibility violations found",
        "color: #22c55e"
      );
    } else {
      console.group(
        `%c[a11y] ${results.violations.length} accessibility violation(s) found`,
        "color: #ef4444; font-weight: bold"
      );
      results.violations.forEach((v) => {
        console.groupCollapsed(
          `%c${v.impact?.toUpperCase()} — ${v.description}`,
          `color: ${v.impact === "critical" || v.impact === "serious" ? "#ef4444" : "#f59e0b"}`
        );
        console.log("Help:", v.helpUrl);
        console.log(
          "Nodes:",
          v.nodes.map((n) => n.target.join(", "))
        );
        console.groupEnd();
      });
      console.groupEnd();
    }
  } catch {
    console.log(
      "%c[a11y] axe-core not installed. Run: npm i -D axe-core",
      "color: #8C8CA0; font-style: italic"
    );
  }
}
