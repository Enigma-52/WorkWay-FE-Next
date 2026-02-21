import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo/metadata"
import ChatUI from "@/components/Chat/ChatUI"

export const metadata: Metadata = buildPageMetadata({
  title: "AI Job Assistant | WorkWay",
  description:
    "Search jobs conversationally using WorkWay AI. Ask for roles, companies, locations, and get structured results instantly.",
  path: "/chat",
})

export default async function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pb-20 pt-32">

        {/* Hero */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            AI Job <span className="text-primary">Assistant</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Describe the role you want. WorkWay AI will search, filter,
            and structure results in real time.
          </p>
        </div>

        {/* Chat interface */}
        <div className="mx-auto max-w-4xl">
          <ChatUI />
        </div>

        {/* Informational section (same style as other pages) */}
        <section className="mx-auto mt-24 max-w-4xl">
          <div className="rounded-xl border border-border bg-card/50 p-8 md:p-12">
            <h2 className="mb-6 text-2xl font-semibold text-foreground">
              How WorkWay AI Helps You Find Jobs Faster
            </h2>

            <div className="space-y-4 text-muted-foreground">
              <p>
                Instead of browsing endless listings, simply describe what
                you&apos;re looking for. The assistant searches across verified
                job data and returns structured results instantly.
              </p>

              <p>
                The AI can refine searches, filter roles, compare companies,
                and explain results — all conversationally.
              </p>

              <p>
                Every search uses real job data from WorkWay. No hallucinated
                listings. No duplicates. Just relevant opportunities.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Real job data",
                "Structured results",
                "Conversational search",
                "Smart filtering",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-secondary/50 px-4 py-1.5 font-mono text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}