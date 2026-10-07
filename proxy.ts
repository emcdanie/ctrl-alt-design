import { NextResponse, type NextRequest } from "next/server";

/* Work (Elleta, 19 Sep 2026): the skill and case filters are gone, so
   old /work?skill= and ?case= links land on /work (the pattern studies
   left /work on 22 Sep 2026). This
   lives here, not in next.config redirects, because a config redirect
   carries the query through and would loop. */
export function proxy(request: NextRequest) {
  /* /cv (round 5, 7 Oct 2026): the shareable CV link. The site is served
     at that URL with the dialog open (components/CvRoute.tsx reads the
     path), so no route file repeats the Home page. */
  if (request.nextUrl.pathname === "/cv") return NextResponse.rewrite(new URL("/", request.url));
  const { searchParams } = request.nextUrl;
  if (!searchParams.has("skill") && !searchParams.has("case")) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.search = "";
  return NextResponse.redirect(url, 308);
}

export const config = { matcher: ["/work", "/cv"] };
