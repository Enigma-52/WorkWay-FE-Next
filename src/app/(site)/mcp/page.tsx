import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Plug,
  KeyRound,
  Terminal,
  ShieldCheck,
  Zap,
  Search,
  Bookmark,
  Bell,
  UserRound,
  Link2,
} from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/jsonld";
import { buildMcpBreadcrumb } from "@/lib/seo/breadcrumbs";
import { MCP_TOOLS, MCP_FAQS, MCP_ENDPOINT, API_KEYS_PATH } from "@/lib/mcp/content";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import CodeBlock from "@/components/mcp/CodeBlock";
import ExploreMoreLinks from "@/components/seo/ExploreMoreLinks";

export const metadata: Metadata = buildPageMetadata({
  title: "WorkWay MCP Server — Search Jobs From Inside Claude",
  description:
    "Connect WorkWay to Claude and any MCP client. Search 490,000+ live job openings pulled straight from Greenhouse, Ashby and Y Combinator, save roles, follow companies and manage your talent profile without leaving the chat.",
  path: "/mcp",
  keywords: [
    "WorkWay MCP server",
    "job search MCP",
    "Model Context Protocol jobs",
    "Claude job search",
    "MCP server for recruiting",
    "AI job search tool",
  ],
});

const CONFIG_SNIPPET = `{
  "mcpServers": {
    "workway": {
      "url": "${MCP_ENDPOINT}",
      "headers": {
        "Authorization": "Bearer wk_live_your_key_here"
      }
    }
  }
}`;

const CAPABILITIES = [
  {
    icon: Search,
    title: "Search the real feed",
    body: "Every open role indexed from company ATS boards, filterable by domain, seniority, location, country, source and recency — the same index the site searches.",
  },
  {
    icon: Link2,
    title: "Direct apply links, always",
    body: "Results carry the untouched link to the company's own posting. WorkWay never proxies an application or puts a form between you and the employer.",
  },
  {
    icon: Bookmark,
    title: "Save roles as you go",
    body: "Ask to save anything interesting and it lands in your dashboard, ready to pick up later in the browser.",
  },
  {
    icon: Bell,
    title: "Follow companies",
    body: "Track employers you care about. On Pro you get an email the moment they post something new, instead of finding out a week later.",
  },
  {
    icon: UserRound,
    title: "Build your talent profile",
    body: "Create and edit your public profile conversationally — headline, skills, availability — so companies browsing the talent directory can find you.",
  },
  {
    icon: Zap,
    title: "Grounded in live data",
    body: "A built-in info tool reports current coverage and every valid filter value, so the assistant works from real numbers rather than guesses.",
  },
];

const STEPS = [
  {
    title: "Create an API key",
    body: "Sign in to WorkWay and generate a key from your dashboard. It's shown once, so copy it straight away.",
    href: API_KEYS_PATH,
    linkLabel: "Generate a key",
  },
  {
    title: "Add the server to your client",
    body: "Paste the endpoint and your key into your MCP client's config. It's a remote server, so there's nothing to install.",
  },
  {
    title: "Ask for what you want",
    body: 'Try "find remote senior backend roles posted this week" and follow up naturally — save the good ones, follow the companies.',
  },
];

export default function McpPage() {
  const breadcrumbs = buildMcpBreadcrumb();
  const readTools = MCP_TOOLS.filter((t) => t.kind === "read");
  const writeTools = MCP_TOOLS.filter((t) => t.kind === "write");

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildFaqJsonLd(MCP_FAQS)} />

      <div className="mx-auto w-full max-w-5xl px-6 pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-xs text-muted-foreground">
              <Plug className="h-3.5 w-3.5 text-primary" />
              Model Context Protocol
            </span>

            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Job search, <span className="text-primary">inside your chat</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              The WorkWay MCP server puts every job we index — straight from
              Greenhouse, Ashby and Y Combinator — into Claude and any other
              MCP client. Search, save, follow and apply without opening a tab.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={API_KEYS_PATH}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <KeyRound className="h-4 w-4" />
                Get your API key
              </Link>
              <Link
                href="/mcp/tools"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary/60 transition-colors"
              >
                <Terminal className="h-4 w-4" />
                Browse the tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl px-6 py-14 space-y-16">
        {/* What it does */}
        <section>
          <h2 className="font-display text-2xl font-semibold md:text-3xl">
            What you can do with it
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Ten tools, covering the whole loop from finding a role to tracking
            the company that posted it.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </span>
                <h3 className="mt-4 text-base font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Setup */}
        <section>
          <h2 className="font-display text-2xl font-semibold md:text-3xl">
            Connect it in three steps
          </h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <ol className="space-y-5">
              {STEPS.map(({ title, body, href, linkLabel }, i) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-xs text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-medium">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                    {href && (
                      <Link
                        href={href}
                        className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                      >
                        {linkLabel}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className="space-y-3">
              <CodeBlock code={CONFIG_SNIPPET} label="MCP client config" />
              <p className="text-xs text-muted-foreground">
                Endpoint:{" "}
                <code className="font-mono text-foreground">{MCP_ENDPOINT}</code>
                {" · "}
                Transport: Streamable HTTP
              </p>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold md:text-3xl">The tools</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Read tools answer questions. Write tools change something on your
                account — and only ever your own.
              </p>
            </div>
            <Link
              href="/mcp/tools"
              className="inline-flex items-center gap-1 font-mono text-sm text-primary hover:underline"
            >
              Full reference
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-8 space-y-8">
            {[
              { label: "Read", tools: readTools },
              { label: "Write", tools: writeTools },
            ].map(({ label, tools }) => (
              <div key={label}>
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {label}
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/mcp/tools#${tool.slug}`}
                      className="group rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
                    >
                      <code className="font-mono text-sm text-primary">{tool.name}</code>
                      <p className="mt-1.5 text-sm text-muted-foreground">{tool.summary}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold">
            How your key is protected
          </h2>
          <div className="mt-4 grid gap-x-8 gap-y-3 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
            <p>
              <span className="text-foreground">Hashed, never stored raw.</span> Your key
              is shown once at creation; only a SHA-256 hash is kept, so a database
              leak yields nothing usable.
            </p>
            <p>
              <span className="text-foreground">Optional expiry.</span> Issue a key that
              expires in 30 days, 90 days, a year, or never — your call.
            </p>
            <p>
              <span className="text-foreground">Revoke instantly.</span> One click kills a
              key. The next request with it is rejected immediately.
            </p>
            <p>
              <span className="text-foreground">Visible usage.</span> Every key tracks its
              own call count and last-used time, so unexpected activity is obvious.
            </p>
          </div>
          <Link
            href="/mcp/api-keys"
            className="mt-5 inline-flex items-center gap-1 font-mono text-sm text-primary hover:underline"
          >
            More on API keys
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-display text-2xl font-semibold md:text-3xl">
            Frequently asked
          </h2>
          <dl className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
            {MCP_FAQS.map(({ question, answer }) => (
              <div key={question} className="p-5">
                <dt className="text-base font-medium">{question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Internal links */}
        <section>
          <h2 className="font-display text-xl font-semibold">Explore more of WorkWay</h2>
          <div className="mt-5">
            <ExploreMoreLinks />
          </div>
        </section>
      </main>
    </>
  );
}
