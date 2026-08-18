import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBlogBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { BLOG_POSTS } from "@/data/blogData";

export const metadata: Metadata = buildPageMetadata({
  title: "WorkWay Blog — Job Search, ATS & Hiring Data",
  description:
    "Long-form guides on how hiring actually works — how ATS systems screen applications, how to read job postings by domain, and what the data says about ghost jobs and hiring trends.",
  path: "/blog",
  keywords: [
    "workway blog",
    "job search blog",
    "how ats systems work",
    "hiring data",
    "job search advice",
  ],
});

export default function BlogIndexPage() {
  const breadcrumbs = buildBlogBreadcrumb();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/20 mb-6">
            <Newspaper className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-primary tracking-wide uppercase">
              Blog
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Job search, <span className="text-gradient">explained plainly</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            How applicant tracking systems actually work, what specific job
            domains actually look for, and what real hiring data says about
            things like ghost job postings — written to be useful, not to
            pad out a keyword.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:glow-subtle transition-all duration-200 flex flex-col"
            >
              <p className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {post.description}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-mono text-primary">
                Read post
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
