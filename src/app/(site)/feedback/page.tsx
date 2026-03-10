import type { Metadata } from "next";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { FeedbackForm } from "@/components/Feedback/FeedbackForm";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildFeedbackBreadcrumb } from "@/lib/seo/breadcrumbs";

export const metadata: Metadata = buildPageMetadata({
  title: "Feedback — Help Improve WorkWay",
  description:
    "Share your feedback, ideas, and bug reports to help us make WorkWay better for job seekers and hiring teams.",
  path: "/feedback",
});

export default function FeedbackPage() {
  const breadcrumbs = buildFeedbackBreadcrumb();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <header className="mb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-mono uppercase tracking-wide text-primary">
            <span>We read everything</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Feedback
          </h1>
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
            Tell us what&apos;s working well, what&apos;s confusing, or what
            you&apos;d like to see next. Your feedback shapes what we build.
          </p>
        </header>

        <FeedbackForm />
      </div>
    </main>
  );
}

