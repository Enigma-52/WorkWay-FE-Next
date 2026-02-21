"use client"

import { useState } from "react"
import { backendStream } from "@/lib/api/client-stream"

type AgentEvent = {
  type: string
  content?: string
  tool?: string
  input?: any
  outputCount?: number
  preview?: any[]
  role?: string
}

export default function ChatUI() {
  const [input, setInput] = useState("")
  const [events, setEvents] = useState<AgentEvent[]>([])
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim()) return

    setEvents([])
    setLoading(true)

    try {
      await backendStream<AgentEvent>(
        "/api/chat",
        { message: input },
        (event) => {
          setEvents(prev => [...prev, event])
        }
      )
    } catch (err) {
      console.error("Stream error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">

      {/* Input */}
      <div className="flex gap-3">
        <input
          className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm"
          placeholder="Find software jobs at SpaceX..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Events */}
      <div className="mt-6 space-y-3">
        {events.map((e, i) => (
          <div
            key={i}
            className="rounded-md border border-border bg-background p-3 text-sm"
          >
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(e, null, 2)}
            </pre>
          </div>
        ))}
      </div>

    </div>
  )
}