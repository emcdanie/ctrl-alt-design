import Link from "next/link";

/* Breadcrumb (Elleta, 20 Sep 2026, Part G item 2): ONLY on pages two
   levels deep, where it replaces the page label. Top-level pages don't
   get one, because the nav already says where you are.

   A nav > ol of links in muted ink with an iris hover, "/" separators
   that are aria-hidden (a screen reader reads the list structure, not
   the punctuation), and the current page as plain text carrying
   aria-current="page". It also emits BreadcrumbList JSON-LD, so the
   trail a person sees and the one a crawler reads are the same list. */
export type Crumb = { label: string; href?: string };

export default function Breadcrumb({ trail, baseUrl = "https://elleta.design" }: { trail: Crumb[]; baseUrl?: string }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${baseUrl}${c.href}` } : {}),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <ol className="crumbs__list text-code">
        {trail.map((c, i) => (
          <li key={c.label} className="crumbs__item">
            {i > 0 ? (
              <span aria-hidden="true" className="crumbs__sep">
                /
              </span>
            ) : null}
            {c.href ? (
              <Link href={c.href} className="crumbs__link">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </nav>
  );
}
