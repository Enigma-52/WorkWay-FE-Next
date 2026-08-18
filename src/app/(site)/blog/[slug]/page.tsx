import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBlogPostBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildBlogPostingJsonLd } from "@/lib/seo/jsonld";
import { BLOG_POSTS, getBlogPostBySlug, ALL_BLOG_SLUGS } from "@/data/blogData";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ALL_BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return buildPageMetadata({
    title: `${post.title} | WorkWay Blog`,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const breadcrumbs = buildBlogPostBreadcrumb(post.title);
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildBlogPostingJsonLd(post)} />
      {post.faq.length > 0 && <JsonLd data={buildFaqJsonLd(post.faq)} />}

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-14">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            {post.intro}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            {post.author} · Updated {new Date(post.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-14">
        {post.sections.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <p className="section-heading mb-4">{section.heading}</p>
            )}
            <div className="space-y-4">
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}

        {post.relatedLinks.length > 0 && (
          <section>
            <p className="section-heading mb-4">Keep exploring</p>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {post.relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-6 py-4 hover:bg-background/50 transition-colors group"
                >
                  <span className="text-sm font-medium">{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {post.faq.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-4 h-4 text-primary" />
              <p className="section-heading">Frequently asked questions</p>
            </div>
            <div className="space-y-4">
              {post.faq.map((item, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6">
                  <p className="font-semibold mb-3">{item.question}</p>
                  <p className="text-muted-foreground leading-relaxed text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedPosts.length > 0 && (
          <section>
            <p className="section-heading mb-6">More from the blog</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:glow-subtle transition-all duration-200"
                >
                  <p className="text-sm font-semibold mb-2 group-hover:text-primary transition-colors leading-snug">
                    {related.title}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-primary">
                    Read
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-semibold text-lg mb-1">Ready to see what's actually open?</p>
              <p className="text-muted-foreground text-sm">
                Browse live roles pulled directly from company career pages.
              </p>
            </div>
            <Link
              href="/jobs"
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Explore Jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
