import type { ReactNode } from "react";

/* ExampleFrame (Elleta, 20 Sep 2026, case-study rebuild): the quiet
   frame a case-study example sits in. Card surface, one hairline, the
   card radius, and a slim top bar with three dots and a code-role path
   that names what you are looking at ("tokens / cascade").

   The body is a container (container-type: inline-size), so an example
   responds to the frame it is in rather than to the window, and it caps
   at 26rem and scrolls: a case section has to fit one screen, and a
   visual that grows past that would push the text off it. Because it
   scrolls it is a focusable group named by its caption, so a keyboard
   can reach the part of the example that is out of view (axe
   scrollable-region-focusable).

   The caption sits under the frame, not inside it. */
export default function ExampleFrame({
  path,
  caption,
  children,
}: {
  /** the code-role path in the top bar, e.g. "tokens / cascade" */
  path: string;
  caption: ReactNode;
  children: ReactNode;
}) {
  const capId = `case-frame-${path.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  return (
    <figure className="case-frame" data-component="ExampleFrame">
      <div className="case-frame__shell">
        <div className="case-frame__bar">
          <span className="case-frame__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="text-code case-frame__path">{path}</span>
        </div>
        <div className="case-frame__body" tabIndex={0} role="group" aria-labelledby={capId}>
          {children}
        </div>
      </div>
      <figcaption id={capId} className="case-frame__caption">{caption}</figcaption>
    </figure>
  );
}
