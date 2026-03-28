import { env } from "@/lib/config/env";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const backendUrl = new URL("/api/company/search", env.BACKEND_API_URL);
  if (q) backendUrl.searchParams.set("q", q);

  const response = await fetch(backendUrl.toString(), { cache: "no-store" });
  if (!response.ok) {
    return NextResponse.json({ error: "Search failed" }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
