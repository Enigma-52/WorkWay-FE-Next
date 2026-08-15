import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Protects /dashboard/* at the edge, before the page (and its data fetches)
// ever run. Previously this was only checked in dashboard/layout.tsx via a
// hard `redirect("/")`, which threw away the URL the visitor actually
// wanted — e.g. a Pro alert email linking straight to
// /dashboard/seeker/alerts would dead-end an unauthenticated click at the
// homepage instead of returning them to Alerts after signing in.
const PROTECTED_PREFIXES = ["/dashboard"];

// Job/company detail pages are `force-dynamic` in their route config — not
// an oversight, but a fix for a real incident: statically caching each one
// via Next's own ISR/dynamicParams writes a permanent per-slug file on disk
// that self-hosted deployments never evict, which grew to 2.85M files /
// 56.7GiB before it was switched to fully dynamic (see job/[jobSlug]/page.tsx
// and company/[companySlug]/page.tsx for the full comment). So caching here
// has to happen at the HTTP layer, not Next's file-based cache — setting
// Cache-Control here lets Cloudflare edge-cache the rendered output for the
// TTL window (confirmed working the same way for the homepage's ISR
// response: cf-cache-status flips EXPIRED/MISS → HIT with a climbing `age`
// header once a real Cache-Control is present), without ever touching
// Next's own per-slug disk cache — the origin still renders fresh on every
// cache miss, nothing new gets written to disk.
// Job content is effectively immutable once posted (no closure-sync exists
// yet to change it — see docs/FEATURES.md), so it tolerates a long TTL.
// Company pages carry an open-role count and domain breakdown that shift as
// new jobs are ingested through the day, so they get a shorter one — both
// are still far longer than the site's own "Updated daily" copy requires.
const EDGE_CACHE_RULES: { prefix: string; cacheControl: string }[] = [
  {
    prefix: "/job/",
    cacheControl: "public, s-maxage=21600, stale-while-revalidate=86400",
  },
  {
    prefix: "/company/",
    cacheControl: "public, s-maxage=3600, stale-while-revalidate=86400",
  },
];

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (isProtected && !req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    url.searchParams.set("authRedirect", pathname + search);
    return NextResponse.redirect(url);
  }

  const edgeCacheRule = EDGE_CACHE_RULES.find((rule) =>
    pathname.startsWith(rule.prefix)
  );
  if (edgeCacheRule) {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", edgeCacheRule.cacheControl);
    return res;
  }

  return;
});

export const config = {
  // Both forms listed explicitly rather than relying on ":path*" also
  // matching the bare prefix — a security gate shouldn't depend on subtle
  // path-to-regexp semantics being right.
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/job/:path*",
    "/company/:path*",
  ],
};
