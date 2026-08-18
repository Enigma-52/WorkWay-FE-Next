import type { Metadata } from "next";
import { Zap, HelpCircle } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import AtsFinderClient from "@/components/tools/AtsFinderClient";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildAtsFinderBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildPageMetadata({
  title: "ATS Finder — Find Any Company's Real Careers Page | WorkWay",
  description:
    "Search any company and see which applicant tracking system they hire through — Greenhouse, Lever, Ashby, or Workable — with a direct link to their live careers page. Free tool, no signup.",
  path: "/tools/ats-finder",
  keywords: [
    "ats finder",
    "what ats does a company use",
    "find company careers page",
    "greenhouse job board lookup",
    "lever careers lookup",
    "ashby job board finder",
    "applicant tracking system lookup",
  ],
});

const FAQ = [
  {
    question: "What is an ATS?",
    answer:
      "An applicant tracking system (ATS) is the software a company uses to post job openings and manage applications. Greenhouse, Lever, Ashby, and Workable are among the most common ones used by tech companies — each hosts that company's live job listings on its own platform, separate from general job boards.",
  },
  {
    question: "Why does it matter which ATS a company uses?",
    answer:
      "Knowing the ATS tells you exactly where to find a company's real, current openings instead of a re-posted or stale copy on a third-party board. It also tells you what the actual application form will look like, since each ATS has its own layout and required fields.",
  },
  {
    question: "Is this tool free?",
    answer:
      "Yes. ATS Finder is free to use and doesn't require an account. It's built on the same company data WorkWay uses to aggregate job listings across thousands of employers.",
  },
];

export default function AtsFinderPage() {
  const breadcrumbs = buildAtsFinderBreadcrumb();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildFaqJsonLd(FAQ)} />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-14">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-primary tracking-wide uppercase">
              Free Tool
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            ATS Finder
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            Search any company to see which applicant tracking system they
            hire through — Greenhouse, Lever, Ashby, or Workable — and jump
            straight to their real, current openings instead of guessing
            which career-page URL to try.
          </p>

          <AtsFinderClient />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Almost every mid-size or larger company runs its hiring through one
          of a handful of applicant tracking systems rather than building its
          own careers page from scratch, and the specific one they use
          determines both where their real, current listings live and what
          the application form actually looks like once you get there.
          Greenhouse and Lever are the two most common choices among funded
          startups and growth-stage tech companies, Ashby has become the
          default for a newer wave of companies that started hiring in the
          last few years, and Workable tends to show up more often outside
          pure tech. The problem is that none of this is obvious from the
          outside — a company&apos;s own website rarely says which system it
          uses, and searching for &quot;[company] careers&quot; on Google
          often surfaces an outdated cached page, a LinkedIn re-post, or a
          third-party aggregator with listings that closed months ago rather
          than the company&apos;s actual, live job board.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          WorkWay already tracks which ATS platform each of the thousands of
          companies in its database hires through, because that mapping is
          exactly what makes it possible to pull every open role from a
          company&apos;s real career feed and keep it current every day
          instead of relying on whatever happens to be indexed by a search
          engine. This tool exposes that same lookup directly: search a
          company name, and you&apos;ll see the ATS it uses along with a
          direct link to its live openings on WorkWay, plus its own website
          if you want to go straight to the source. It&apos;s useful whether
          you&apos;re a candidate trying to find where a specific company
          actually posts its roles, or a recruiter or sourcer trying to map
          out how a set of companies handle hiring without opening each one
          individually.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-4 h-4 text-primary" />
          <p className="section-heading">Frequently asked questions</p>
        </div>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.question} className="rounded-xl border border-border bg-card p-6">
              <p className="font-semibold mb-3">{item.question}</p>
              <p className="text-muted-foreground leading-relaxed text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
