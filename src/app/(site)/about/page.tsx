import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildAboutBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = buildPageMetadata({
  title: "About WorkWay",
  description:
    "WorkWay aggregates jobs from the applicant tracking systems companies actually hire through, turns those postings into company hiring intelligence, and gives every candidate a public Talent Profile.",
  path: "/about",
});

export default function AboutPage() {
  const breadcrumbs = buildAboutBreadcrumb();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <header className="mb-14">
          <h1 className="mb-5 text-4xl font-bold">About WorkWay</h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            WorkWay is a job search platform built on a simple observation: the
            roles worth applying to are rarely the ones being advertised to you.
            They sit on a company&apos;s own applicant tracking system, visible
            only to people who already know that company exists. We find those
            postings, organize them, and make them searchable in one place.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">The problem</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            When a company decides to hire, the posting almost always goes up on
            its own careers page first, powered by whichever applicant tracking
            system the team runs. That page is the source of truth. It is also,
            for most candidates, effectively invisible. Nobody links to it, it
            does not rank for the searches you would think to run, and the only
            reliable way to see it is to already have the company on a list you
            check by hand.
          </p>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            The result is a search process that rewards patience over judgement.
            You end up keeping a folder of bookmarked boards, refreshing them
            every few days, and still hearing about the role you actually wanted
            three weeks after it was posted, usually from someone else. The
            large job sites do not solve this, because a posting only reaches
            them if a company chooses to syndicate it there, and plenty of
            companies never bother.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            This is not a motivation problem or a grind you are supposed to push
            through. It is a discovery problem, and discovery problems are
            solved with software.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">What we do</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            WorkWay continuously reads the applicant tracking systems that
            companies genuinely hire through. Today that means Greenhouse, which
            most funded startups and mid-size technology companies post to
            first; Lever, common across Series A to Series C companies; Ashby,
            the newer default for fast-moving startups hiring engineers; and Y
            Combinator&apos;s Work at a Startup, which covers portfolio
            companies including batches still making their first hires. We also
            track in-house career pages for companies that run their own board
            rather than buying one. More platforms are being added as we go.
          </p>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Everything we collect lands in a single feed of more than 450,000
            roles across roughly 5,000 companies. Duplicates are collapsed, the
            data is refreshed continuously, and every listing keeps its original
            apply link, so you always end up submitting through the company
            system rather than through an intermediary that slows the process
            down or quietly drops your application.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            On top of that feed you get search that behaves the way you would
            expect. You can filter conventionally by role, location, seniority,
            and employment type, search semantically when you know the kind of
            work you want but not the job title it hides behind, or simply
            describe what you are after in conversation and let the assistant
            narrow it down.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">
            Postings as hiring intelligence
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            A single job posting tells you very little. A company&apos;s
            complete posting history tells you a great deal, and it is one of
            the few signals a company cannot easily dress up, because every
            opening represents budget that has already been approved.
          </p>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            We organize postings into structured company pages that show which
            teams are hiring, which locations are being staffed up, what the
            technology stack looks like based on what the descriptions actually
            ask for, and which seniority levels a company tends to bring in. Put
            together, this answers the questions that matter before you spend an
            evening on an application. Is this company growing or backfilling?
            Is engineering expanding or is the hiring concentrated in sales? Are
            they building a senior team or hiring people early in their careers?
          </p>
          <p className="leading-relaxed text-muted-foreground">
            The same structure powers our domain and skill pages, which let you
            approach the search from the direction of the work itself rather
            than from a company name you happen to already know.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Talent Profiles</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Discovery runs in both directions, so every WorkWay user gets a
            public Talent Profile at a shareable URL. It is designed to be read
            by a recruiter in about thirty seconds: clearly labeled sections for
            experience, education, certifications, skills, and languages, with
            your availability, notice period, and compensation expectations
            visible only if you choose to make them public. Your resume previews
            inside the page itself, so nobody has to download a file to find out
            what you have worked on.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            The profile is yours to send anywhere. Put it in a bio, paste it
            into an application, or drop it into a message. It stays current
            because you edit it in one place instead of maintaining several
            versions of a document.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">
            How we think about AI
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            We use AI where it genuinely helps: matching you to roles you would
            not have found by keyword, making search understand intent, and
            tightening the writing on your profile. We do not use it to generate
            listings, invent companies, or send applications on your behalf.
            Every job on WorkWay traces back to a real posting on a real
            company&apos;s system, and nothing on your profile publishes until
            you have approved it.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-semibold">Where this is going</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            The long-term goal is for WorkWay to be the place people check
            first: candidates researching a company before applying, engineers
            spotting fast-growing teams early, and founders benchmarking their
            own hiring against the companies they compete with for people.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Getting there means widening coverage until any company serious
            about hiring is represented, and keeping the product honest about
            what the data does and does not show. Browsing requires no account
            and no signup wall, because a platform that hides jobs behind a
            registration form is reintroducing the exact problem it claims to
            solve.
          </p>
        </section>

        <div className="flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            Start exploring companies and roles on WorkWay.
          </p>
          <Link
            href="/jobs"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"
          >
            Explore Jobs
          </Link>
        </div>
      </div>
    </main>
  );
}
