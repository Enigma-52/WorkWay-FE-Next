import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildChangelogBreadcrumb } from "@/lib/seo/breadcrumbs";
import changelogData from "@/content/changelog.json";

type ChangelogEntry = {
  id: string;
  date: string;
  title: string;
  tag?: string;
  icon?: string;
  highlights?: string[];
};

const entries: ChangelogEntry[] = changelogData.entries ?? [];

export const metadata: Metadata = buildPageMetadata({
  title: "Changelog — Product Updates | WorkWay",
  description:
    "See the latest product updates, improvements, and fixes shipped to WorkWay.",
  path: "/changelog",
});

function formatDate(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ChangelogPage() {
  const breadcrumbs = buildChangelogBreadcrumb();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />

        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-mono uppercase tracking-wide text-primary">
            <span>What&apos;s new</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Changelog
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            A running log of notable changes to WorkWay — features, fixes, and
            polish. 
          </p>
        </header>

        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/40 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No changelog entries yet. Add some in{" "}
              <code className="rounded border border-border bg-secondary px-1 py-0.5 text-xs">
                src/content/changelog.json
              </code>
              .
            </p>
          </div>
        ) : (
          <ol className="space-y-6">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="relative rounded-xl border border-border bg-card/80 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_40px_hsl(82_100%_55%/0.18)]"
              >
                <div className="flex items-start gap-4">
                  {entry.icon && (
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/60">
                      {/* SVG path from /public, e.g. /changelog/rocket.svg */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={entry.icon}
                        alt=""
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">{entry.title}</h2>
                      {entry.tag && (
                        <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-mono uppercase tracking-wide text-primary">
                          {entry.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                      {formatDate(entry.date)}
                    </p>

                    {entry.highlights && entry.highlights.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {entry.highlights.map((line, idx) => (
                          <li key={idx}>
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => <span>{children}</span>,
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-foreground">
                                    {children}
                                  </strong>
                                ),
                                code: ({ children }) => (
                                  <code className="rounded border border-border bg-secondary px-1 py-0.5 text-xs font-mono text-foreground">
                                    {children}
                                  </code>
                                ),
                              }}
                            >
                              {line}
                            </ReactMarkdown>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>
            Have feedback or want to request something?{" "}
            <Link
              href="/feedback"
              className="font-medium text-primary hover:underline"
            >
              Share your thoughts
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

