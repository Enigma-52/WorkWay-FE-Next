import { env } from "@/lib/config/env";
import { NextResponse } from "next/server";

// Thin public proxy exposing just the fields the ATS Finder tool needs
// (which ATS a company hires through, and where to apply) without exposing
// the full company detail payload used by the company page.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") || "";
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const backendUrl = new URL("/api/company/details", env.BACKEND_API_URL);
  backendUrl.searchParams.set("slug", slug);

  const response = await fetch(backendUrl.toString(), { cache: "no-store" });
  if (!response.ok) {
    return NextResponse.json({ error: "Lookup failed" }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json({
    name: data.name,
    slug: data.slug,
    platform: data.platform,
    website: data.website ?? null,
    logo_url: data.logo_url ?? null,
    totalJobs: data.totalJobs ?? 0,
  });
}
