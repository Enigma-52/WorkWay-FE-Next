import { headers } from "next/headers"
import { env } from "@/lib/config/env"

export async function POST(req: Request) {
  const body = await req.text()

  const h = await headers()
  const cookie = h.get("cookie") || ""
  const auth = h.get("authorization") || ""

  const backendUrl = new URL("/api/chat", env.BACKEND_API_URL)

  const response = await fetch(backendUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie,
      authorization: auth,
      "x-workway-next-ssr": "1"
    },
    body
  })

  if (!response.body) {
    return new Response("Streaming failed", { status: 500 })
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    }
  })
}