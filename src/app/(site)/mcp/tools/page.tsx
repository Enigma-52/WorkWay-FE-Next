import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, KeyRound } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMcpSubpageBreadcrumb } from "@/lib/seo/breadcrumbs";
import { MCP_TOOLS, API_KEYS_PATH } from "@/lib/mcp/content";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import CodeBlock from "@/components/mcp/CodeBlock";

export const metadata: Metadata = buildPageMetadata({
  title: "WorkWay MCP Tools — Full Reference",
  description:
    "Complete reference for every WorkWay MCP tool: search_jobs, get_company_overview, list_domains, save_job, follow_company, talent profile tools and more. Parameters, example prompts and sample responses for each.",
  path: "/mcp/tools",
  keywords: [
    "WorkWay MCP tools",
    "search_jobs MCP tool",
    "MCP job search API",
    "Model Context Protocol tool reference",
  ],
});

export default function McpToolsPage() {
  const breadcrumbs = buildMcpSubpageBreadcrumb("Tools");
  const readTools = MCP_TOOLS.filter((t) => t.kind === "read");
  const writeTools = MCP_TOOLS.filter((t) => t.kind === "write");

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />

      <div className="mx-auto w-full max-w-5xl px-6 pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <main className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
        <header className="max-w-3xl">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            MCP tool reference
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Every tool the WorkWay MCP server exposes, what it accepts, and what it
            returns. All of them require an API key — the write tools always act on
            the account that owns that key, never on anyone else&apos;s.
          </p>
          <Link
            href={API_KEYS_PATH}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <KeyRound className="h-4 w-4" />
            Generate an API key
          </Link>
        </header>

        {/* Jump nav */}
        <nav aria-label="Tools" className="mt-10 rounded-xl border border-border bg-card p-5">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            On this page
          </h2>
          <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {MCP_TOOLS.map((tool) => (
              <a
                key={tool.slug}
                href={`#${tool.slug}`}
                className="font-mono text-sm text-primary hover:underline"
              >
                {tool.name}
              </a>
            ))}
          </div>
        </nav>

        {[
          { label: "Read tools", blurb: "Answer questions. Nothing is changed.", tools: readTools },
          {
            label: "Write tools",
            blurb: "Change something on the account that owns the API key.",
            tools: writeTools,
          },
        ].map(({ label, blurb, tools }) => (
          <section key={label} className="mt-14">
            <h2 className="font-display text-2xl font-semibold">{label}</h2>
            <p className="mt-2 text-muted-foreground">{blurb}</p>

            <div className="mt-8 space-y-10">
              {tools.map((tool) => (
                <article
                  key={tool.slug}
                  id={tool.slug}
                  className="scroll-mt-24 rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-mono text-lg text-primary">{tool.name}</h3>
                    <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                      {tool.kind}
                    </span>
                  </div>

                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>

                  {tool.note && (
                    <div className="mt-4 flex gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3.5">
                      <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <p className="text-sm text-muted-foreground">{tool.note}</p>
                    </div>
                  )}

                  <h4 className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Parameters
                  </h4>
                  {tool.params.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      None — this tool takes no arguments.
                    </p>
                  ) : (
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full min-w-[560px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="pb-2 pr-4 font-medium">Name</th>
                            <th className="pb-2 pr-4 font-medium">Type</th>
                            <th className="pb-2 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {tool.params.map((p) => (
                            <tr key={p.name}>
                              <td className="py-2.5 pr-4 align-top">
                                <code className="font-mono text-xs">{p.name}</code>
                                {p.required && (
                                  <span className="ml-1.5 font-mono text-[10px] text-primary">
                                    required
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 pr-4 align-top">
                                <code className="font-mono text-xs text-muted-foreground">
                                  {p.type}
                                </code>
                              </td>
                              <td className="py-2.5 align-top text-muted-foreground">
                                {p.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <h4 className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Try asking
                  </h4>
                  <p className="mt-2 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm italic">
                    &ldquo;{tool.example}&rdquo;
                  </p>

                  <h4 className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Sample response
                  </h4>
                  <div className="mt-3">
                    <CodeBlock code={tool.sampleResponse} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-14 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Next</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/mcp"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary/60 transition-colors"
            >
              MCP overview
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/mcp/api-keys"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary/60 transition-colors"
            >
              API keys
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary/60 transition-colors"
            >
              Browse jobs
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
