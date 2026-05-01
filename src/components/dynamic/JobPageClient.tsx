"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Clock,
  Building2,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Banknote,
} from "lucide-react";
import { useEffect } from "react";
import JobBadge from "@/components/JobPage/JobBadge";
import JobSection from "@/components/JobPage/JobSection";
import JobCard from "@/components/JobPage/JobCard";
import { Button } from "@/components/ui/button";
import { getDomainSlug, truncateLocation } from "@/utils/helper";
import type { JobDetails, SkillJobGroup } from "@/types/jobs";
import JobViewFeed from "@/components/JobViewFeed/JobViewFeed";

type Props = {
  job: JobDetails;
};

function getTimeAgo(updatedAt: string): string {
  const diffMs = Date.now() - new Date(updatedAt).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just Now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minutes ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} hours ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Yesterday";
  return `${diffD} days ago`;
}

export default function JobPageClient({ job }: Props) {
  const postedAgo = job.created_at ? getTimeAgo(job.created_at) : null;

  useEffect(() => {
    if (!job?.slug) return;

    let cancelled = false;

    async function trackView() {
      try {
        let country: string | null = null;
        let city: string | null = null;

        try {
          const geoRes = await fetch("https://ipapi.co/json/");
          if (geoRes.ok) {
            const geo = (await geoRes.json()) as {
              country_name?: string;
              city?: string;
            };
            country = geo.country_name ?? null;
            city = geo.city ?? null;
          }
        } catch {
          // ignore geo failures
        }

        if (cancelled) return;

        await fetch("/api/job/view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobSlug: job.slug,
            viewer_country: country,
            viewer_city: city,
            source_page: "job",
          }),
        }).catch(() => {
          // ignore tracking failures
        });
      } catch {
        // swallow errors
      }
    }

    trackView();

    return () => {
      cancelled = true;
    };
  }, [job?.slug]);

  const domainJobs = job.similarJobsByDomain || [];
  const companyJobs = job.otherJobsByCompany || [];
  const jobsBySkill: SkillJobGroup[] = job.jobsBySkill || [];
  const remainingSkills = job.remainingSkills || [];
  const locationJobs = job.similarLocationJobs || [];

  return (
    <div className="flex min-h-screen justify-center bg-background">
      <div className="w-full max-w-7xl">
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-24">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                href="/jobs"
                className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </Link>
            </motion.div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mb-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl">
                      {job.company_logo_url ? (
                        <img
                          src={job.company_logo_url}
                          alt={`${job.company} logo`}
                          className="max-h-14 max-w-full"
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <Link
                        href={`/company/${job.company_slug}`}
                        className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {job.company}
                      </Link>
                      {job.company_url && (
                        <a
                          href={job.company_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={job.company_url
                            .replace(/^https?:\/\//, "")
                            .replace(/\/$/, "")}
                          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          Visit {job.company} website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl"
                >
                  {job.title}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex flex-wrap gap-3"
                >
                  <JobBadge variant="primary" title={job.location}>
                    <MapPin className="mr-1.5 h-3 w-3 shrink-0" />
                    {truncateLocation(job.location)}
                  </JobBadge>
                  <JobBadge>
                    <Briefcase className="mr-1.5 h-3 w-3" />
                    {job.employment_type}
                  </JobBadge>
                  <JobBadge>
                    <Clock className="mr-1.5 h-3 w-3" />
                    {job.experience_level}
                  </JobBadge>
                  <JobBadge variant="muted">{job.domain}</JobBadge>
                  {job?.metadata?.compensation && (
                    <JobBadge variant="primary">
                      <Banknote className="mr-2 h-4 w-4" />
                      {job.metadata.compensation.split("•")[0]?.trim()}
                    </JobBadge>
                  )}
                  {job?.metadata?.compensation
                    ?.toLowerCase()
                    .includes("equity") && (
                    <JobBadge
                      variant="default"
                      className="border-green-500/30 text-green-600 dark:text-green-400"
                    >
                      Offers Equity
                    </JobBadge>
                  )}
                  {job?.metadata?.compensation
                    ?.toLowerCase()
                    .includes("bonus") && (
                    <JobBadge
                      variant="default"
                      className="border-amber-500/30 text-amber-600 dark:text-amber-400"
                    >
                      Offers Bonus
                    </JobBadge>
                  )}
                  {postedAgo && (
                    <JobBadge variant="muted">
                      <Clock className="mr-1.5 h-3 w-3" />
                      Posted {postedAgo}
                    </JobBadge>
                  )}
                </motion.div>

                {job.skills?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="mt-6"
                  >
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                      Skills
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      {job.skills.map((skill) => (
                        <Link key={skill.slug} href={`/skill/${skill.slug}`}>
                          <JobBadge
                            variant="default"
                            className="cursor-pointer hover:bg-primary/10 transition-colors"
                          >
                            {skill.name}
                          </JobBadge>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex flex-col gap-3 sm:max-w-sm"
              >
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  <Button size="xl" className="w-full cursor-pointer lg:w-auto">
                    Apply Now
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <p className="text-center text-xs text-muted-foreground lg:text-left">
                  You will be redirected to the company career page
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-5 lg:grid-cols-[1fr_380px] lg:gap-6">
              <div className="space-y-6">
                {(Array.isArray(job.description) ? job.description : []).map(
                  (section: any, index: number) => (
                    <JobSection
                      key={index}
                      heading={section.heading}
                      content={section.content}
                      index={index}
                      skills={job.skills}
                    />
                  ),
                )}
              </div>

              <div className="lg:sticky lg:top-24 lg:h-fit space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="job-card"
                >
                  <h3 className="mb-6 text-lg font-semibold text-foreground">
                    Job Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <span className="text-sm text-muted-foreground">
                        Company
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {job.company}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <span className="text-sm text-muted-foreground shrink-0">
                        Location
                      </span>
                      <span
                        className="text-sm font-medium text-foreground text-right max-w-[220px]"
                        title={job.location}
                      >
                        {truncateLocation(job.location, 2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <span className="text-sm text-muted-foreground">
                        Type
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {job.employment_type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <span className="text-sm text-muted-foreground">
                        Level
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {job.experience_level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <span className="text-sm text-muted-foreground">
                        Domain
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {job.domain}
                      </span>
                    </div>
                    {postedAgo && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Posted
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {postedAgo}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full cursor-pointer">
                        Apply for this role
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                >
                  <JobViewFeed title="Live views on WorkWay" limit={5} />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/50 py-12 md:py-16 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-7 flex items-center justify-between md:mb-8"
            >
              <h2 className="text-2xl font-bold text-foreground">
                Similar roles you might like
              </h2>
              <Link
                href={`/domain/${getDomainSlug(domainJobs[0]?.domain || "")}`}
                className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
              >
                View all {domainJobs[0]?.domain} roles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {domainJobs.map((dJob: any, index: number) => (
                <motion.div
                  key={dJob.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <JobCard {...dJob} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-12 md:py-16 lg:py-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-7 flex items-center justify-between md:mb-8"
            >
              <h2 className="text-2xl font-bold text-foreground">
                More roles at {job.company}
              </h2>
              <Link
                href={`/company/${companyJobs[0]?.company_slug || ""}`}
                className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
              >
                View company profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {companyJobs.map((cJob: any, index: number) => (
                <motion.div
                  key={cJob.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <JobCard {...cJob} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {locationJobs.length > 0 && (
          <section className="border-t border-border/50 py-16 md:py-24">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mb-8 flex items-center justify-between"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Jobs near {job.location?.split(",")[0]?.trim()}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Recent openings in a similar location
                  </p>
                </div>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {locationJobs.map((lJob: any, index: number) => (
                  <motion.div
                    key={lJob.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <JobCard {...lJob} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {jobsBySkill.length > 0 && (
          <section className="border-t border-dashed border-border/60 py-16 md:py-24">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mb-10"
              >
                <h2 className="text-2xl font-bold text-foreground">
                  Explore jobs by skill
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Recent openings matching the skills in this role
                </p>
              </motion.div>

              <div className="space-y-10">
                {jobsBySkill.map((group, gIdx) => (
                  <motion.div
                    key={group.skill_slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: gIdx * 0.08 }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <Link
                        href={`/skill/${group.skill_slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-primary/10"
                      >
                        {group.skill_name}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {group.jobs.map((sJob: any, sIdx: number) => (
                        <motion.div
                          key={sJob.id}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: sIdx * 0.06 }}
                        >
                          <JobCard {...sJob} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {remainingSkills.length > 0 && (
                <div className="mt-10 rounded-lg border border-border/50 bg-card p-6">
                  <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                    More skills in this role
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {remainingSkills.map((skill) => (
                      <Link
                        key={skill.slug}
                        href={`/skill/${skill.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      >
                        {skill.name}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
