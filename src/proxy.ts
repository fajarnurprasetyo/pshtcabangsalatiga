import { auth } from "@/libs/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname, search } = req.nextUrl;

  if (
    !pathname.endsWith("/") &&
    !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)
  ) {
    return NextResponse.redirect(
      new URL(`${req.nextUrl.pathname}/`, req.nextUrl),
    );
  }

  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      return NextResponse.redirect(
        new URL(
          `/login/?callbackUrl=${encodeURIComponent(`${pathname}${search}`)}`,
          req.nextUrl,
        ),
      );
    }
  }
});

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|static/|.*.png$|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest).*)",
      // missing: [
      //   { type: "header", key: "next-router-prefetch" },
      //   { type: "header", key: "purpose", value: "prefetch" },
      // ],
    },
  ],
};
