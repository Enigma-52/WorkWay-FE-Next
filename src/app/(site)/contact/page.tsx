import type { Metadata } from "next";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildContactBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact WorkWay",
  description:
    "Get in touch with the WorkWay team. We'd love to hear from you about job listings, partnerships, or general feedback.",
  path: "/contact",
});

export default function ContactPage() {
  const breadcrumbs = buildContactBreadcrumb();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Have a question, suggestion, or just want to say hi? We&apos;re
            here to help.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-3 text-2xl font-semibold">Get in Touch</h2>
          <p className="leading-relaxed text-muted-foreground">
            WorkWay is built and maintained by a small team passionate about
            making job searching better. Whether you&apos;re a job seeker, a
            company, or just curious — reach out and we&apos;ll get back to you
            as soon as possible.
          </p>
        </section>

        <section className="mb-12 space-y-6">
          <div className="rounded-xl border border-border bg-card/60 p-6">
            <h3 className="mb-2 text-lg font-semibold">Email</h3>
            <p className="text-sm text-muted-foreground">
              For general inquiries, partnerships, or support:
            </p>
            <a
              href="mailto:hello@workway.dev"
              className="mt-2 inline-block text-primary underline underline-offset-2 hover:opacity-80"
            >
              hello@workway.dev
            </a>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-6">
            <h3 className="mb-2 text-lg font-semibold">Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Have a suggestion or found a bug? Use our dedicated feedback form
              — it helps us prioritise what to build next.
            </p>
            <a
              href="/feedback"
              className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Submit Feedback
            </a>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-6">
            <h3 className="mb-2 text-lg font-semibold">Social</h3>
            <p className="text-sm text-muted-foreground">
              Follow the creator on LinkedIn or GitHub for updates on WorkWay
              and what&apos;s being built next.
            </p>
            <div className="mt-3 flex gap-4 text-sm">
              <a
                href="https://www.linkedin.com/in/rohitsingh52/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/Enigma-52"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>

        <p className="text-sm text-muted-foreground">
          We typically respond within 1–2 business days.
        </p>
      </div>
    </main>
  );
}
