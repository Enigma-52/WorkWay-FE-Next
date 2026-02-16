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
} from "lucide-react";
import JobBadge from "@/components/JobPage/JobBadge";
import JobSection from "@/components/JobPage/JobSection";
import JobCard from "@/components/JobPage/JobCard";
import { Button } from "@/components/ui/button";
import { getDomainSlug } from "@/utils/helper";
import type { JobDetails } from "@/types/jobs";

type Props = {
  job: JobDetails;
};

export default function JobPageClient({ job }: Props) {
  const domainJobs = job.similarJobsByDomain || [];
  const companyJobs = job.otherJobsByCompany || [];

  return (
    <div className="flex min-h-screen justify-center bg-background">
      <div className="w-full max-w-7xl">
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
          </div>

          <div className="container relative py-16 md:py-24">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <Link
                href="/jobs"
                className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </Link>
            </motion.div>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mb-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                      {job.company_logo_url ? (
                        <img
                          src={job.company_logo_url}
                          alt={`${job.company} logo`}
                          className="max-h-10 max-w-full object-contain"
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
                          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          {job.company_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl"
                >
                  {job.title}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex flex-wrap gap-3"
                >
                  <JobBadge variant="primary">
                    <MapPin className="mr-1.5 h-3 w-3" />
                    {job.location}
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
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex flex-col gap-3"
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

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                {(Array.isArray(job.description) ? job.description : []).map((section: any, index: number) => (
                  <JobSection
                    key={index}
                    heading={section.heading}
                    content={section.content}
                    index={index}
                  />
                ))}
              </div>

              <div className="lg:sticky lg:top-24 lg:h-fit">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="job-card"
                >
                  <h3 className="mb-6 text-lg font-semibold text-foreground">Job Summary</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <span className="text-sm text-muted-foreground">Company</span>
                      <span className="text-sm font-medium text-foreground">{job.company}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <span className="text-sm text-muted-foreground">Location</span>
                      <span className="text-sm font-medium text-foreground">{job.location}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <span className="text-sm font-medium text-foreground">{job.employment_type}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <span className="text-sm text-muted-foreground">Level</span>
                      <span className="text-sm font-medium text-foreground">{job.experience_level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Domain</span>
                      <span className="text-sm font-medium text-foreground">{job.domain}</span>
                    </div>
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
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/50 py-16 md:py-24">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-8 flex items-center justify-between"
            >
              <h2 className="text-2xl font-bold text-foreground">Similar roles you might like</h2>
              <Link
                href={`/domain/${getDomainSlug(domainJobs[0]?.domain || "")}`}
                className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
              >
                View all {domainJobs[0]?.domain} roles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

        <section className="border-t py-16 md:py-24">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-8 flex items-center justify-between"
            >
              <h2 className="text-2xl font-bold text-foreground">More roles at {job.company}</h2>
              <Link
                href={`/company/${companyJobs[0]?.company_slug || ""}`}
                className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
              >
                View company profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </div>
  );
}

