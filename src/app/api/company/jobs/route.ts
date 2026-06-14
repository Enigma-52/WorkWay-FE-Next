import { env } from "@/lib/config/env";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") || "";
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "5";

  const backendUrl = new URL("/api/company/jobs", env.BACKEND_API_URL);
  if (slug) backendUrl.searchParams.set("slug", slug);
  backendUrl.searchParams.set("page", page);
  backendUrl.searchParams.set("limit", limit);

  const response = await fetch(backendUrl.toString(), { cache: "no-store" });
  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
