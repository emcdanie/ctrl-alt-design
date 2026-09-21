/* one paw, pointing up, centred on 0,0 */
export const PAW =
  '<ellipse cx="0" cy="3" rx="5.2" ry="4.4"/><ellipse cx="-5.6" cy="-3.2" rx="1.9" ry="2.5" transform="rotate(-20 -5.6 -3.2)"/><ellipse cx="-2" cy="-6.4" rx="1.9" ry="2.6"/><ellipse cx="2" cy="-6.4" rx="1.9" ry="2.6"/><ellipse cx="5.6" cy="-3.2" rx="1.9" ry="2.5" transform="rotate(20 5.6 -3.2)"/>';

/** One paw print as a 1em inline icon in
 *  currentColor. Decorative: aria-hidden. */
export function PawIcon() {
  return (
    <svg
      className="paw-icon"
      viewBox="-8 -9.5 16 17"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: PAW }}
    />
  );
}
