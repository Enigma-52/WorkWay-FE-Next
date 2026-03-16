import type { Metadata } from "next";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildTermsBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service — WorkWay",
  description:
    "Read the terms and conditions governing your use of the WorkWay job discovery platform.",
  path: "/terms",
});

export default function TermsPage() {
  const breadcrumbs = buildTermsBreadcrumb();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: March 2025
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            By using WorkWay, you agree to the following terms. Please read
            them carefully.
          </p>
        </header>

        <div className="space-y-10">
          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              By accessing or using WorkWay (&quot;the platform&quot;, &quot;we&quot;,
              &quot;us&quot;), you agree to be bound by these Terms of Service. If you
              do not agree, please discontinue use of the platform immediately.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              2. Description of Service
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              WorkWay is a job discovery and hiring intelligence platform that
              aggregates publicly available job listings and presents them in a
              structured, searchable format. We do not post jobs directly and
              are not a party to any employment relationship between job seekers
              and employers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">3. Use of the Platform</h2>
            <p className="leading-relaxed text-muted-foreground">
              You agree to use WorkWay only for lawful purposes. You must not:
            </p>
            <ul className="ml-6 mt-4 list-disc space-y-2 text-muted-foreground">
              <li>
                Scrape, crawl, or extract data from WorkWay using automated
                tools without prior written consent
              </li>
              <li>
                Attempt to interfere with or disrupt the platform&apos;s
                infrastructure or servers
              </li>
              <li>
                Use the platform in any way that violates applicable local,
                national, or international laws
              </li>
              <li>
                Reproduce, distribute, or resell any content from WorkWay
                without permission
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              4. Accuracy of Information
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              WorkWay aggregates job listings from publicly available sources.
              While we strive to keep information accurate and up to date, we
              do not guarantee the accuracy, completeness, or currency of any
              job listing or company information. Always verify details directly
              with the employer before applying.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              5. Intellectual Property
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              All design, code, and original content on WorkWay — including but
              not limited to the platform&apos;s structure, features, and visual
              presentation — are the intellectual property of WorkWay. Job
              listing content is sourced from third parties and remains the
              property of their respective owners.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              6. Third-Party Links
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              WorkWay links to external job postings and employer websites. We
              are not responsible for the content, accuracy, or practices of
              third-party websites. Visiting those links is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              7. Disclaimer of Warranties
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              WorkWay is provided &quot;as is&quot; without warranties of any kind,
              either express or implied. We do not warrant that the platform
              will be error-free, uninterrupted, or free of viruses or other
              harmful components. Use of the platform is at your sole risk.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              8. Limitation of Liability
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              To the fullest extent permitted by law, WorkWay and its operators
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising out of your use of, or inability to
              use, the platform — including but not limited to loss of
              employment opportunity or reliance on inaccurate job information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              9. Modifications to Terms
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We reserve the right to update these terms at any time. Changes
              will be reflected by updating the &quot;Last updated&quot; date. Continued
              use of WorkWay after changes are posted constitutes your
              acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">10. Contact</h2>
            <p className="leading-relaxed text-muted-foreground">
              For any questions regarding these terms, contact us at{" "}
              <a
                href="mailto:hello@workway.dev"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                hello@workway.dev
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
