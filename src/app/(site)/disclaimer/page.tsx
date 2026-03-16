import type { Metadata } from "next";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildDisclaimerBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildPageMetadata({
  title: "Disclaimer — WorkWay",
  description:
    "Important disclaimers about the job listings, company information, and content published on WorkWay.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  const breadcrumbs = buildDisclaimerBreadcrumb();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">Disclaimer</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: March 2025
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Please read this disclaimer carefully before using WorkWay or
            relying on any information published on this platform.
          </p>
        </header>

        <div className="space-y-10">
          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              Job Listing Accuracy
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              WorkWay aggregates job listings from publicly available sources
              across the web. While we make reasonable efforts to keep listings
              accurate and current, we cannot guarantee that every job posting
              reflects the current hiring status of a company. Positions may
              have been filled, closed, or modified since they were originally
              published.
            </p>
            <p className="mt-4 text-muted-foreground">
              Always verify the status of a role directly with the employer
              before investing time in an application.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              Not an Employer or Recruiter
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              WorkWay is a job discovery and hiring intelligence platform. We
              are not an employer, staffing agency, or recruitment firm. We do
              not facilitate applications, conduct interviews, or make hiring
              decisions. Any employment relationship is strictly between you and
              the respective employer.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              Company Information
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Insights about companies — such as team structure, tech stack,
              hiring patterns, and growth signals — are derived from job listing
              data and are intended as general indicators only. They do not
              represent official statements from the companies concerned.
              WorkWay is not affiliated with any of the companies listed on the
              platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              No Professional Advice
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Nothing on WorkWay constitutes legal, financial, career, or
              professional advice. Any decisions you make based on information
              found on this platform — including decisions to apply for jobs,
              evaluate companies, or assess market trends — are made at your
              own risk.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              External Links
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              WorkWay contains links to third-party websites, including
              employer job pages and company sites. These links are provided for
              convenience only. We have no control over the content of those
              sites and accept no responsibility for them or for any loss or
              damage that may arise from your use of them.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">Advertising</h2>
            <p className="leading-relaxed text-muted-foreground">
              WorkWay displays advertisements served by Google AdSense. The
              presence of an advertisement on WorkWay does not constitute an
              endorsement of the advertised product or service. Advertising
              revenue helps support the platform and keep it free to use.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              Limitation of Liability
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              WorkWay and its operators shall not be held liable for any direct,
              indirect, incidental, or consequential damages resulting from your
              use of this platform or reliance on any information presented
              here, to the fullest extent permitted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">Contact</h2>
            <p className="leading-relaxed text-muted-foreground">
              If you have questions about this disclaimer, reach out at{" "}
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
