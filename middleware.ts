import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Protects /dashboard/* at the edge, before the page (and its data fetches)
// ever run. Previously this was only checked in dashboard/layout.tsx via a
// hard `redirect("/")`, which threw away the URL the visitor actually
// wanted — e.g. a Pro alert email linking straight to
// /dashboard/seeker/alerts would dead-end an unauthenticated click at the
// homepage instead of returning them to Alerts after signing in.
const PROTECTED_PREFIXES = ["/dashboard"];

// Stopgap until real job-closure tracking exists (see docs/FEATURES.md) —
// age-only cutoff, not verified-closed. This is a real 410 for every
// visitor, not just Googlebot: cloaking a status code by user-agent is
// exactly the deceptive pattern Google's guidelines prohibit, so a real
// person opening a saved/shared link to a >60-day-old posting sees "Gone"
// too, even if that specific listing happens to still be open. Matches the
// noindex threshold already applied in job/[jobSlug]/page.tsx.
const GONE_AFTER_DAYS = 100;

async function isJobGone(slug: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/job/details?slug=${encodeURIComponent(slug)}`,
    );
    if (!res.ok) return false;
    const job = await res.json();
    if (!job?.created_at) return false;
    const ageMs = Date.now() - new Date(job.created_at).getTime();
    return ageMs > GONE_AFTER_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    // Backend unreachable — fail open, let the page render normally rather
    // than 410-ing a job because of a transient network error.
    return false;
  }
}

export default auth(async (req) => {
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

  const jobMatch = pathname.match(/^\/job\/([^/]+)$/);
  if (jobMatch && (await isJobGone(jobMatch[1]))) {
    return new NextResponse("Gone", { status: 410 });
  }

  return;
});

export const config = {
  // Both forms listed explicitly rather than relying on ":path*" also
  // matching the bare prefix — a security gate shouldn't depend on subtle
  // path-to-regexp semantics being right.
  matcher: ["/dashboard", "/dashboard/:path*", "/job/:path*"],
};
