import type { Metadata } from "next";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildPrivacyPolicyBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy — WorkWay",
  description:
    "Learn how WorkWay collects, uses, and protects your personal information when you use our job discovery platform.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  const breadcrumbs = buildPrivacyPolicyBreadcrumb();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: March 2025
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Your privacy matters to us. This policy explains what data WorkWay
            collects, why, and how it is used.
          </p>
        </header>

        <div className="space-y-10">
          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              1. Information We Collect
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              WorkWay is a read-only job discovery platform. We do not require
              account registration. The information we may collect includes:
            </p>
            <ul className="ml-6 mt-4 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Usage data</strong> — pages
                visited, job listings viewed, search queries, and general
                navigation patterns collected anonymously via analytics.
              </li>
              <li>
                <strong className="text-foreground">Device &amp; browser data</strong> — browser
                type, operating system, screen resolution, and approximate
                geographic location (country/city level) derived from your IP
                address.
              </li>
              <li>
                <strong className="text-foreground">Feedback submissions</strong> — any text
                you voluntarily submit through our feedback form.
              </li>
              <li>
                <strong className="text-foreground">Cookies</strong> — small
                files stored on your device to improve site performance and
                remember preferences.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              2. How We Use Your Information
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We use the data collected to:
            </p>
            <ul className="ml-6 mt-4 list-disc space-y-2 text-muted-foreground">
              <li>Operate and improve the WorkWay platform</li>
              <li>Understand which jobs and companies are most relevant to users</li>
              <li>Display the live job view activity feed on job pages</li>
              <li>Analyse usage trends to prioritise new features</li>
              <li>
                Serve relevant advertisements through Google AdSense (see
                section 5)
              </li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              We do not sell, rent, or share your personal data with third
              parties for their own marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">3. Data Storage</h2>
            <p className="leading-relaxed text-muted-foreground">
              WorkWay does not maintain user accounts or store personally
              identifiable information beyond what is strictly necessary for
              operating the platform. Anonymised analytics data may be retained
              for up to 12 months. Feedback submissions are stored securely and
              used solely for product improvement.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              4. Cookies &amp; Tracking
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We use cookies to:
            </p>
            <ul className="ml-6 mt-4 list-disc space-y-2 text-muted-foreground">
              <li>Store your recently viewed jobs (locally in your browser)</li>
              <li>Collect anonymised analytics via Vercel Web Analytics</li>
              <li>
                Enable advertising functionality via Google AdSense, which may
                use its own cookies to serve personalised ads
              </li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              You can disable cookies in your browser settings at any time.
              Some features of the site may not function correctly without
              cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              5. Google AdSense &amp; Advertising
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              WorkWay uses Google AdSense to display advertisements. Google may
              use cookies and similar technologies to serve ads based on your
              prior visits to this and other websites. You can opt out of
              personalised advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                Google&apos;s Ads Settings
              </a>
              . For more information on how Google uses data, visit their{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              6. Third-Party Links
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              WorkWay links to external job postings and company websites. We
              are not responsible for the privacy practices of those third-party
              sites. We encourage you to read their privacy policies before
              submitting any personal information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              7. Your Rights
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Depending on your location, you may have the right to access,
              correct, or request deletion of any personal data we hold about
              you. Since WorkWay does not maintain user accounts, most data we
              collect is anonymised. To make a data request, contact us at{" "}
              <a
                href="mailto:hello@workway.dev"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                hello@workway.dev
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">
              8. Changes to This Policy
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We may update this privacy policy from time to time. Changes will
              be reflected by updating the &quot;Last updated&quot; date at the
              top of this page. Continued use of WorkWay after any changes
              constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">9. Contact</h2>
            <p className="leading-relaxed text-muted-foreground">
              If you have any questions about this privacy policy, please
              contact us at{" "}
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
