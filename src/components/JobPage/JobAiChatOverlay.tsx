"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { JobDetails } from "@/types/jobs";

type Props = {
  job: JobDetails;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function JobAiChatOverlay({ job }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(
    () => [
      "Summarize this job in 5 bullet points",
      "What are the must-have skills?",
      "How should I tailor my resume for this role?",
      "Give me likely interview questions for this JD",
    ],
    []
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    setSessionId(null);
    setMessages([]);
    setErrorMessage("");
    setInput("");
    setOpen(false);
  }, [job.slug]);

  useEffect(() => {
    function openForThisJob(event: Event) {
      const custom = event as CustomEvent<{ jobSlug?: string }>;
      if (custom.detail?.jobSlug && custom.detail.jobSlug !== job.slug) return;
      setOpen(true);
    }

    window.addEventListener("workway-job-ai-open", openForThisJob as EventListener);
    return () => {
      window.removeEventListener("workway-job-ai-open", openForThisJob as EventListener);
    };
  }, [job.slug]);

  async function sendMessage(rawMessage?: string) {
    const text = (rawMessage ?? input).trim();
    if (!text || loading) return;

    setErrorMessage("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/job-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_slug: job.slug,
          session_id: sessionId,
          message: text,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          (payload && typeof payload.message === "string" && payload.message) ||
            `Request failed with status ${response.status}`
        );
      }

      const assistantText =
        payload && typeof payload.assistant_message === "string"
          ? payload.assistant_message
          : "No response generated.";

      const nextSessionId =
        payload && typeof payload.session_id === "number"
          ? payload.session_id
          : sessionId;

      setSessionId(nextSessionId ?? null);
      setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to send your message. Please try again.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-sky-400/70 bg-sky-500 text-white shadow-lg shadow-sky-500/30 transition hover:scale-105 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300/70"
        aria-label="Open AI chat for this job"
        title="Ask AI about this job"
      >
        <Sparkles className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/55 p-3 backdrop-blur-sm md:p-6">
          <div className="mx-auto flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border/70 bg-background shadow-2xl">
            <header className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-500">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">AI Job Copilot</p>
                  <p className="text-xs text-muted-foreground">
                    Context locked to: <span className="font-medium">{job.title}</span> at{" "}
                    <span className="font-medium">{job.company}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
              {messages.length === 0 && (
                <div className="rounded-xl border border-border/70 bg-card/60 p-4">
                  <p className="text-sm text-muted-foreground">
                    Ask questions only about this job description. Example prompts:
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => sendMessage(item)}
                        disabled={loading}
                        className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-foreground transition hover:border-sky-400/60 hover:bg-secondary/80 disabled:opacity-50"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-4">
                {messages.map((m, idx) => (
                  <div
                    key={`${m.role}-${idx}`}
                    className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm",
                        m.role === "user"
                          ? "bg-sky-500/15 text-foreground border border-sky-400/30"
                          : "bg-card border border-border text-foreground"
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {loading && (
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-sky-400" />
                  Thinking about this role...
                </div>
              )}

              {errorMessage && (
                <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {errorMessage}
                </p>
              )}
            </div>

            <footer className="border-t border-border/70 bg-background/95 px-4 py-3 md:px-6">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void sendMessage();
                    }
                  }}
                  rows={2}
                  disabled={loading}
                  placeholder="Ask anything about this job..."
                  className="min-h-[48px] flex-1 resize-none rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                />
                <Button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={loading || !input.trim()}
                  className="h-[48px] bg-sky-500 text-white hover:bg-sky-400"
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
