export type StreamEventHandler<T = any> = (event: T) => void

type StreamOptions = {
  signal?: AbortSignal
}

/**
 * backendStream
 * Client-side SSE consumer for streaming API routes.
 *
 * Usage:
 * await backendStream("/api/chat", body, onEvent)
 */
export async function backendStream<T = any>(
  url: string,
  body: any,
  onEvent: StreamEventHandler<T>,
  options?: StreamOptions
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    signal: options?.signal
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`Streaming request failed: ${response.status} ${text}`)
  }

  if (!response.body) {
    throw new Error("No response body for streaming request")
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  let buffer = ""

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // Split complete SSE events
    const events = buffer.split("\n\n")
    buffer = events.pop() || ""

    for (const event of events) {
      if (!event.startsWith("data:")) continue

      try {
        const json = JSON.parse(event.replace(/^data:\s*/, ""))
        onEvent(json)
      } catch (err) {
        console.error("Failed to parse SSE event:", event)
      }
    }
  }
}