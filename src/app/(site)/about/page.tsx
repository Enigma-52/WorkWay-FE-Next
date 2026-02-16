import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About WorkWay",
  description:
    "WorkWay is a hiring intelligence platform that helps you discover companies and find roles faster.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">About WorkWay</h1>
          <p className="text-lg text-muted-foreground">
            WorkWay is a hiring intelligence platform that helps you discover
            companies, understand how they are hiring, and find the right roles
            faster — using data, not noise.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-3 text-2xl font-semibold">What is WorkWay?</h2>
          <p className="leading-relaxed text-muted-foreground">
            Most job platforms show you a list of jobs. WorkWay shows you how
            companies actually hire.
            <br />
            <br />
            We organize job postings into structured company pages where you can
            see:
          </p>
          <ul className="ml-6 mt-4 list-disc space-y-2 text-muted-foreground">
            <li>Which teams are hiring</li>
            <li>Which locations are growing</li>
            <li>What tech stack companies are using</li>
            <li>Whether a company is scaling engineering, sales, or product</li>
            <li>What kind of roles and seniority they prefer</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-3 text-2xl font-semibold">Why WorkWay Exists</h2>
          <p className="leading-relaxed text-muted-foreground">
            Job searching today is noisy, repetitive, and inefficient.
            <br />
            <br />
            Candidates apply blindly. Companies repost the same roles. Nobody
            tells you:
          </p>
          <ul className="ml-6 mt-4 list-disc space-y-2 text-muted-foreground">
            <li>Is this company actually growing?</li>
            <li>Which team is getting budget?</li>
            <li>Are they hiring juniors or seniors?</li>
            <li>Is this a product-heavy or sales-heavy company?</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            WorkWay answers these questions using hiring data.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-3 text-2xl font-semibold">How It Works</h2>
          <p className="leading-relaxed text-muted-foreground">
            We continuously collect and structure job postings and derive
            signals from them:
          </p>
          <ul className="ml-6 mt-4 list-disc space-y-2 text-muted-foreground">
            <li>Team structure from job titles</li>
            <li>Tech stack from job descriptions</li>
            <li>Growth areas from hiring patterns</li>
            <li>Geographic expansion from locations</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            This turns raw job listings into company intelligence.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-3 text-2xl font-semibold">Our Vision</h2>
          <p className="leading-relaxed text-muted-foreground">
            We believe hiring data is one of the most honest signals about a
            company.
            <br />
            <br />
            WorkWay aims to become the default place where:
          </p>
          <ul className="ml-6 mt-4 list-disc space-y-2 text-muted-foreground">
            <li>Candidates research companies before applying</li>
            <li>Founders benchmark hiring against competitors</li>
            <li>Engineers discover fast-growing teams early</li>
          </ul>
        </section>

        <div className="flex items-center justify-between border-t pt-8">
          <p className="text-muted-foreground">
            Start exploring companies and roles on WorkWay.
          </p>
          <Link
            href="/jobs"
            className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"
          >
            Explore Jobs
          </Link>
        </div>
      </div>
    </main>
  );
}
