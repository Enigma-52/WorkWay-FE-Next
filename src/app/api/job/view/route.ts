import { headers } from "next/headers";
import { env } from "@/lib/config/env";

export async function POST(req: Request) {
  const body = await req.text();
  const h = await headers();

  const backendUrl = new URL("/api/job/view", env.BACKEND_API_URL);

  const response = await fetch(backendUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "user-agent": h.get("user-agent") || "",
      "x-forwarded-for": h.get("x-forwarded-for") || "",
      "x-forwarded-proto": h.get("x-forwarded-proto") || "",
      "x-workway-next-ssr": "1",
    },
    body,
  });

  const responseText = await response.text();
  return new Response(responseText, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/json",
      "Cache-Control": "private, no-store",
    },
  });
}
