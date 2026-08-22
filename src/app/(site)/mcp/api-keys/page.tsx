import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, KeyRound, ShieldCheck, Clock, Activity, Ban } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/jsonld";
import { buildMcpSubpageBreadcrumb } from "@/lib/seo/breadcrumbs";
import { MCP_ENDPOINT, API_KEYS_PATH } from "@/lib/mcp/content";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import CodeBlock from "@/components/mcp/CodeBlock";

export const metadata: Metadata = buildPageMetadata({
  title: "WorkWay API Keys — Create, Scope and Revoke",
  description:
    "How WorkWay API keys work: generate a key for the MCP server, set an optional expiry, track usage, and revoke instantly. Keys are stored as SHA-256 hashes and shown only once.",
  path: "/mcp/api-keys",
  keywords: ["WorkWay API key", "MCP authentication", "job search API key", "revoke API key"],
});

const KEY_FAQS = [
  {
    question: "Where do I create a WorkWay API key?",
    answer:
      "Sign in to WorkWay and open API Keys in your dashboard. Give the key a name, choose an optional expiry, and create it. The full key is displayed once at that moment — copy it before closing the dialog, because it cannot be retrieved later.",
  },
  {
    question: "What happens if I lose my API key?",
    answer:
      "You cannot recover it, by design. Only a SHA-256 hash of the key is stored, so there is nothing to display back to you. Revoke the lost key and generate a replacement — it takes a few seconds.",
  },
  {
    question: "Can I have more than one key?",
    answer:
      "Yes. Separate keys per client or machine are a good idea, since revoking one does not disturb the others. Key creation is limited to 20 per hour per account.",
  },
  {
    question: "Does an API key give access to my whole account?",
    answer:
      "A key authenticates as you for the MCP tools: searching, saving jobs, following companies, and editing your talent profile. It cannot be used to change your email, password, or billing, and it can never act on another user's account.",
  },
  {
    question: "Do keys expire automatically?",
    answer:
      "Only if you choose an expiry when creating one. You can issue a key that lasts 30 days, 90 days, a year, or never expires. An expired key is rejected with a clear message telling you to generate a new one.",
  },
];

const PROPERTIES = [
  {
    icon: ShieldCheck,
    title: "Hashed at rest",
    body: "The raw key is shown once and never stored. Only its SHA-256 hash lives in the database, so a leak of that table yields nothing an attacker could use.",
  },
  {
    icon: Clock,
    title: "Optional expiry",
    body: "Pick 30 days, 90 days, a year, or no expiry at all. Expired keys stop working immediately and say why.",
  },
  {
    icon: Activity,
    title: "Usage tracking",
    body: "Each key records how many calls it has served and when it was last used, so activity you don't recognise stands out.",
  },
  {
    icon: Ban,
    title: "Instant revocation",
    body: "Revoking a key takes effect on the very next request. Other keys on your account keep working.",
  },
];

const CURL_SNIPPET = `curl -X POST ${MCP_ENDPOINT} \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -H "Authorization: Bearer wk_live_your_key_here" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`;

export default function McpApiKeysPage() {
  const breadcrumbs = buildMcpSubpageBreadcrumb("API Keys");

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildFaqJsonLd(KEY_FAQS)} />

      <div className="mx-auto w-full max-w-4xl px-6 pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <main className="mx-auto w-full max-w-4xl px-6 py-10 md:py-14 space-y-14">
        <header className="max-w-3xl">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <KeyRound className="h-5 w-5 text-primary" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl">
            API keys
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A WorkWay API key is how the MCP server knows which account it is acting
            for. One key, generated from your dashboard, connects any MCP client to
            your saved jobs, followed companies and talent profile.
          </p>
          <Link
            href={API_KEYS_PATH}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <KeyRound className="h-4 w-4" />
            Manage your keys
          </Link>
        </header>

        <section>
          <h2 className="font-display text-2xl font-semibold">How they work</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PROPERTIES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </span>
                <h3 className="mt-4 text-base font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold">Using a key</h2>
          <p className="mt-3 text-muted-foreground">
            Send it as a bearer token. Most MCP clients take this as a{" "}
            <code className="font-mono text-sm text-foreground">headers</code> block in
            their config; you can also call the endpoint directly to check a key works.
          </p>
          <div className="mt-5">
            <CodeBlock code={CURL_SNIPPET} label="Verify a key" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            A valid key returns the tool list. A missing, expired or revoked key returns
            401 with a message explaining which of those it was.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold">Good practice</h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
              <span>
                <span className="text-foreground">Use one key per client.</span> A key for
                your laptop and another for a server means you can revoke either without
                breaking the other.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
              <span>
                <span className="text-foreground">Set an expiry for anything temporary.</span>{" "}
                Testing something, or sharing a machine? A 30-day key limits the blast
                radius if you forget about it.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
              <span>
                <span className="text-foreground">Never commit a key.</span> Keep it in your
                MCP client config or an environment variable, not in a repository.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
              <span>
                <span className="text-foreground">Check usage occasionally.</span> The last-used
                time and call count on each key make unexpected activity easy to spot.
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold">Frequently asked</h2>
          <dl className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
            {KEY_FAQS.map(({ question, answer }) => (
              <div key={question} className="p-5">
                <dt className="text-base font-medium">{question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
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
              href="/mcp/tools"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary/60 transition-colors"
            >
              Tool reference
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary/60 transition-colors"
            >
              Pricing
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
