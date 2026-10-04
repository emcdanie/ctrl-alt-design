import styles from "./Case.module.css";

/* A static case picture: the Figma frame's own art, exported at 2x so it
   never renders soft (audit:sharp), with the 390 frame's restacked crop
   below 640px. A picture is a flat image with a describing alt: the
   Case UI kit inside it is never live DOM. */
export default function CasePicture({
  src,
  phone,
  width,
  height,
  alt,
}: {
  /** the 1440 art at 2x */
  src: string;
  /** the 390 art at 2x */
  phone?: string;
  /** the 2x pixel size of `src` */
  width: number;
  height: number;
  alt: string;
}) {
  return (
    <picture>
      {phone ? <source media="(max-width: 639px)" srcSet={phone} /> : null}
      <img className={styles.picture} src={src} width={width} height={height} alt={alt} loading="lazy" decoding="async" />
    </picture>
  );
}
