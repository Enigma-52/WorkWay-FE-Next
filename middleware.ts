import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Protects /dashboard/* at the edge, before the page (and its data fetches)
// ever run. Previously this was only checked in dashboard/layout.tsx via a
// hard `redirect("/")`, which threw away the URL the visitor actually
// wanted — e.g. a Pro alert email linking straight to
// /dashboard/seeker/alerts would dead-end an unauthenticated click at the
// homepage instead of returning them to Alerts after signing in.
const PROTECTED_PREFIXES = ["/dashboard"];

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (!isProtected || req.auth) return;

  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  url.searchParams.set("authRedirect", pathname + search);
  return NextResponse.redirect(url);
});

export const config = {
  // Both forms listed explicitly rather than relying on ":path*" also
  // matching the bare prefix — a security gate shouldn't depend on subtle
  // path-to-regexp semantics being right.
  matcher: ["/dashboard", "/dashboard/:path*"],
};
