import type { Metadata } from "next";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildRefundPolicyBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildPageMetadata({
  title: "Refund & Cancellation Policy — WorkWay",
  description:
    "How billing, cancellation, and refunds work for WorkWay Pro subscriptions.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  const breadcrumbs = buildRefundPolicyBreadcrumb();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">Refund &amp; Cancellation Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: August 2026</p>
          <p className="mt-4 text-lg text-muted-foreground">
            This policy covers paid WorkWay Pro subscriptions. It doesn&apos;t
            apply to the free plan, which has no charges to refund.
          </p>
        </header>

        <div className="space-y-10">
          <section>
            <h2 className="mb-3 text-2xl font-semibold">1. Billing</h2>
            <p className="leading-relaxed text-muted-foreground">
              Pro is a recurring monthly subscription, billed in advance at the
              start of each billing cycle. Payments are processed by our
              payment processor, Dodo Payments — WorkWay does not store your
              card details. Your subscription renews automatically each month
              until you cancel.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">2. Cancellation</h2>
            <p className="leading-relaxed text-muted-foreground">
              You can cancel anytime by emailing{" "}
              <a
                href="mailto:hello@workway.dev"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                hello@workway.dev
              </a>{" "}
              from the email address on your account. Cancelling stops future
              renewals — you keep Pro access for the rest of the billing
              period you&apos;ve already paid for, and won&apos;t be charged
              again after it ends.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">3. Refunds</h2>
            <p className="leading-relaxed text-muted-foreground">
              Charges are generally non-refundable once a billing period has
              started, including for partial months or unused time after
              cancellation. We review refund requests on a case-by-case basis
              for genuine billing errors — for example, being charged after
              cancelling, or a duplicate charge for the same period. Contact{" "}
              <a
                href="mailto:hello@workway.dev"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                hello@workway.dev
              </a>{" "}
              and we&apos;ll look into it.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">4. Failed or disputed payments</h2>
            <p className="leading-relaxed text-muted-foreground">
              If a renewal payment fails, we may retry it or place your
              subscription on hold until it&apos;s resolved; Pro features may
              be paused until payment succeeds. If you dispute a charge
              directly with your bank or card issuer instead of contacting us
              first, we reserve the right to suspend Pro access while the
              dispute is resolved.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">5. Price changes</h2>
            <p className="leading-relaxed text-muted-foreground">
              If we change Pro&apos;s price, we&apos;ll give existing
              subscribers notice before it applies to their next renewal.
              Continuing your subscription after that point means you accept
              the new price.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold">6. Contact</h2>
            <p className="leading-relaxed text-muted-foreground">
              Questions about a charge, cancellation, or this policy: email{" "}
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
