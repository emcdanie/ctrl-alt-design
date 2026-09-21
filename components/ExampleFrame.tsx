import type { CSSProperties, ReactNode } from "react";

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
  demo = false,
  children,
}: {
  /** the code-role path in the top bar, e.g. "tokens / cascade" */
  path: string;
  caption: ReactNode;
  /** holds a FrameDemo: no padding, no height cap, no scroll of its own */
  demo?: boolean;
  children: ReactNode;
}) {
  const capId = `case-frame-${path.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  return (
    <figure className={demo ? "case-frame case-frame--demo" : "case-frame"} data-component="ExampleFrame">
      <div className="case-frame__shell">
        <div className="case-frame__bar">
          <span className="case-frame__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="text-code case-frame__path">{path}</span>
        </div>
        <div className="case-frame__body" tabIndex={demo ? undefined : 0} role="group" aria-labelledby={capId}>
          {children}
        </div>
      </div>
      <figcaption id={capId} className="case-frame__caption">{caption}</figcaption>
    </figure>
  );
}

/* FrameDemo (Part S, 21 Sep 2026): a working prototype from public/demos,
   embedded in an ExampleFrame. A fixed height per breakpoint (measured
   from the demo, so nothing scrolls inside it), a title for assistive
   tech, lazy loading. The demo follows the page's theme itself and
   honours reduced motion. The frame's caption carries the full-screen
   link. */
export function FrameDemo({
  src,
  title,
  heights,
}: {
  src: string;
  title: string;
  /** px at 1100px and up, 1024 to 1099px, 700 to 1023px, below 700px:
   *  demos change layout at different widths, so each band is measured */
  heights: [number, number, number, number];
}) {
  const [lg, mdHi, md, sm] = heights;
  return (
    <iframe
      className="case-demo"
      src={src}
      title={title}
      loading="lazy"
      style={
        {
          "--embed-h-lg": `${lg}px`,
          "--embed-h-mdhi": `${mdHi}px`,
          "--embed-h-md": `${md}px`,
          "--embed-h-sm": `${sm}px`,
        } as CSSProperties
      }
    />
  );
}
