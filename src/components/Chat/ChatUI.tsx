"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { backendStream } from "@/lib/api/client-stream"
import { MapPin, Building2, ExternalLink } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type AgentEvent = {
  type?: string
  content?: string
  tool?: string
  input?: Record<string, unknown>
  outputCount?: number
  preview?: Array<Record<string, unknown>>
  role?: string
  message?: string
  candidate_ids?: number[]
  count?: number
  jobs?: Array<Record<string, unknown>>
  error?: string
  [key: string]: unknown
}

type Turn = {
  userMessage: string
  events: AgentEvent[]
  status: "streaming" | "done" | "error"
}

/** Job-like shape from tools or parsed JSON (all optional for flexibility) */
type JobLike = {
  title?: string
  company?: string
  url?: string
  location?: string
  slug?: string
  id?: number
  similarity?: number
  domain?: string
  employment_type?: string
  [key: string]: unknown
}

const INITIAL_VISIBLE = 3
const MAX_VISIBLE = 15

function isJobLike(r: Record<string, unknown>): boolean {
  return (
    (r.title != null && String(r.title).trim() !== "") ||
    (r.company != null && (r.url != null || r.slug != null || r.id != null))
  )
}

function asJobLike(row: unknown): JobLike {
  const r = (row || {}) as Record<string, unknown>
  return {
    title: r.title != null ? String(r.title) : undefined,
    company: r.company != null ? String(r.company) : undefined,
    url: r.url != null ? String(r.url) : undefined,
    location: r.location != null ? String(r.location) : undefined,
    slug: r.slug != null ? String(r.slug) : undefined,
    id: typeof r.id === "number" ? r.id : undefined,
    similarity: typeof r.similarity === "number" ? r.similarity : undefined,
    domain: r.domain != null ? String(r.domain) : undefined,
    employment_type: r.employment_type != null ? String(r.employment_type) : undefined,
  }
}

function normalizeToolResult(event: AgentEvent | unknown[]): {
  count: number
  items: Array<{ label: string; sub?: string }>
  jobs: JobLike[]
  raw?: unknown
} {
  let jobs: JobLike[] = []
  if (Array.isArray(event)) {
    const items = event.map((row: unknown) => {
      const r = row as Record<string, unknown>
      if (isJobLike(r)) {
        jobs.push(asJobLike(r))
        const t = asJobLike(r)
        return { label: t.title || t.company || "—", sub: t.company ? ` @ ${t.company}` : undefined }
      }
      if (r.domain != null) return { label: String(r.domain), sub: undefined }
      if (r.experience_level != null) return { label: String(r.experience_level), sub: undefined }
      const title = r.title != null ? String(r.title) : ""
      const company = r.company != null ? ` @ ${r.company}` : ""
      return { label: title || "—", sub: company || undefined }
    })
    return { count: event.length, items, jobs, raw: event }
  }
  const preview = event.preview ?? event.jobs ?? []
  const arr = Array.isArray(preview) ? preview : []
  const count = event.count ?? event.candidate_ids?.length ?? arr.length ?? event.outputCount ?? 0
  const items = arr.map((row: Record<string, unknown>) => {
    if (isJobLike(row)) {
      jobs.push(asJobLike(row))
      const t = asJobLike(row)
      return { label: t.title || t.company || "—", sub: t.company ? ` @ ${t.company}` : undefined }
    }
    if (row.domain != null) return { label: String(row.domain), sub: undefined }
    if (row.experience_level != null) return { label: String(row.experience_level), sub: undefined }
    const title = row.title != null ? String(row.title) : "—"
    const company = row.company != null ? ` @ ${row.company}` : ""
    return { label: title, sub: company || undefined }
  })
  return { count, items, jobs, raw: event }
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
      <span>Thinking...</span>
    </div>
  )
}

function ToolCallChip({ tool, input }: { tool: string; input?: Record<string, unknown> }) {
  const label = tool.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 font-mono text-xs text-muted-foreground">
      <span className="text-foreground">{label}</span>
      {input && Object.keys(input).length > 0 && (
        <span className="truncate max-w-[180px]">
          {Object.entries(input)
            .slice(0, 2)
            .map(([k, v]) => {
              const val = typeof v === "object" ? JSON.stringify(v).slice(0, 15) : String(v).slice(0, 20)
              return `${k}: ${val}`
            })
            .join(", ")}
        </span>
      )}
    </div>
  )
}

function ExpandableToolResult({
  event,
  index,
  defaultExpanded = false,
}: {
  event: AgentEvent | unknown[]
  index: number
  defaultExpanded?: boolean
}) {
  const normalized = normalizeToolResult(event as AgentEvent)
  const [expanded, setExpanded] = useState(defaultExpanded)
  const { count, items } = normalized
  const hasItems = items.length > 0
  const visibleCount = expanded ? Math.min(items.length, MAX_VISIBLE) : Math.min(items.length, INITIAL_VISIBLE)
  const canExpand = items.length > INITIAL_VISIBLE
  const showExpandButton = canExpand && !expanded && items.length > visibleCount
  const showCollapseButton = expanded && items.length > INITIAL_VISIBLE

  if (count === 0 && !hasItems) {
    return (
      <div className="rounded-xl border border-border/80 bg-card/50 px-4 py-3">
        <p className="text-sm text-muted-foreground">No results</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card/80 overflow-hidden transition-all duration-200">
      {canExpand ? (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-inset rounded-t-xl"
          aria-expanded={expanded}
        >
          <span className="font-mono text-sm font-medium text-primary">
            {count} result{count !== 1 ? "s" : ""}
          </span>
          <span className="text-xs text-muted-foreground">
            {expanded ? "Collapse" : `Show ${Math.min(items.length - INITIAL_VISIBLE, MAX_VISIBLE - INITIAL_VISIBLE)} more`}
          </span>
        </button>
      ) : (
        <div className="flex w-full items-center justify-between gap-2 px-4 py-3 rounded-t-xl">
          <span className="font-mono text-sm font-medium text-primary">
            {count} result{count !== 1 ? "s" : ""}
          </span>
        </div>
      )}
      <div className="border-t border-border/80 px-4 py-2">
        <ul className="space-y-1.5">
          {items.slice(0, visibleCount).map((item, i) => (
            <li key={i} className="text-sm text-foreground">
              {item.label}
              {item.sub && <span className="text-muted-foreground">{item.sub}</span>}
            </li>
          ))}
        </ul>
        {showExpandButton && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-2 text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
          >
            Expand to see all {items.length} →
          </button>
        )}
        {showCollapseButton && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground focus:outline-none rounded"
          >
            Collapse
          </button>
        )}
      </div>
    </div>
  )
}

function AssistantBlock({ events, status }: { events: AgentEvent[]; status: Turn["status"] }) {
  const hasThinking = events.some((e) => e.type === "thinking")
  const toolCalls = events.filter((e) => e.type === "tool_call")
  const toolResults = events.filter((e) => {
    if (Array.isArray(e)) return true
    const t = (e as AgentEvent).type
    return !t || !["thinking", "tool_call", "message", "error"].includes(t)
  })
  const messageEvent = events.find((e) => e.type === "message")
  const errorEvent = events.find((e) => e.type === "error")
  const assistantContent = messageEvent?.content ?? ""
  const errorMessage = errorEvent?.message ?? errorEvent?.error
  const hasDetails = hasThinking || toolCalls.length > 0 || toolResults.length > 0
  const showDetails = hasDetails && (status === "streaming" || toolResults.length > 0 || assistantContent)

  return (
    <div className="flex flex-col gap-4">
      {/* Tool calls + results as collapsible "details" above main response */}
      {showDetails && (
        <div className="rounded-xl border border-border/80 bg-secondary/20 p-3 space-y-3">
          {hasThinking && status === "streaming" && <ThinkingIndicator />}
          {toolCalls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {toolCalls.map((e, i) => (
                <ToolCallChip key={i} tool={(e as AgentEvent).tool ?? "tool"} input={(e as AgentEvent).input} />
              ))}
            </div>
          )}
          {toolResults.length > 0 && (
            <div className="flex flex-col gap-2">
              {toolResults.map((e, i) => (
                <ExpandableToolResult key={i} event={e as AgentEvent} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <p className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      {/* Main response — emphasized as the primary answer */}
      {assistantContent && (
        <div className="rounded-2xl border border-primary/20 bg-card px-5 py-4 shadow-sm ring-1 ring-primary/5">
          <p className="text-xs font-mono uppercase tracking-wider text-primary mb-2">Answer</p>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {assistantContent}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ChatUI() {
  const [input, setInput] = useState("")
  const [turns, setTurns] = useState<Turn[]>([])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [turns])

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setLoading(true)

    const newTurn: Turn = { userMessage, events: [], status: "streaming" }
    setTurns((prev) => [...prev, newTurn])

    const turnIndex = turns.length

    try {
      await backendStream<AgentEvent | unknown[]>(
        "/api/chat",
        { message: userMessage },
        (event) => {
          setTurns((prev) => {
            const next = [...prev]
            const t = next[turnIndex]
            if (t) {
              next[turnIndex] = { ...t, events: [...t.events, event as AgentEvent], status: "streaming" }
            }
            return next
          })
        }
      )
      setTurns((prev) => {
        const next = [...prev]
        const t = next[turnIndex]
        if (t) next[turnIndex] = { ...t, status: "done" }
        return next
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      setTurns((prev) => {
        const next = [...prev]
        const t = next[turnIndex]
        if (t) {
          next[turnIndex] = {
            ...t,
            events: [...t.events, { type: "error", message }],
            status: "error",
          }
        }
        return next
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden py-6">
        {turns.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <p className="max-w-sm text-lg text-muted-foreground">
              Describe the role you want. WorkWay AI will search, filter, and structure results in real time.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Software jobs at SpaceX", "Remote React roles", "Fintech in NYC", "Entry-level ML"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setInput(s)}
                  className="chip rounded-full px-4 py-2 text-sm transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-8">
          {turns.map((turn, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl border border-border bg-primary/10 px-4 py-3 text-sm text-foreground">
                  {turn.userMessage}
                </div>
              </div>

              <div className="flex justify-start">
                <div className="w-full max-w-[90%]">
                  <AssistantBlock events={turn.events} status={turn.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-border bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Find software jobs at SpaceX..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            disabled={loading}
            aria-label="Chat message"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </div>
    </div>
  )
}
