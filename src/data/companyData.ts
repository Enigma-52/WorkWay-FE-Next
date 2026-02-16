export interface JobListing {
  id: string;
  company_id: string;
  company: string;
  slug: string;
  platform: string;
  title: string;
  url: string;
  experience_level: string;
  employment_type: string;
  location: string;
  domain: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  website: string | null;
  logo_url: string | null;
  location: Record<string, unknown>;
  created_at: string;
  platform: string;
  namespace: string;
  jobListings: JobListing[];
  is_actively_hiring: boolean;
  jobs_open_count: number;
}

export function getUniqueLocations(jobs: JobListing[]): string[] {
  return [...new Set(jobs.map(job => job.location))];
}

export function getUniqueExperienceLevels(jobs: JobListing[]): string[] {
  return [...new Set(jobs.map(job => job.experience_level))];
}

export function getUniqueDomains(jobs: JobListing[]): string[] {
  return [...new Set(jobs.map(job => job.domain))];
}

export function getJobsByDomain(jobs: JobListing[]): Record<string, JobListing[]> {
  return jobs.reduce((acc, job) => {
    const domain = job.domain;
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(job);
    return acc;
  }, {} as Record<string, JobListing[]>);
}

export function getDomainStats(jobs: JobListing[]): { domain: string; count: number }[] {
  const byDomain = getJobsByDomain(jobs);
  return Object.entries(byDomain)
    .map(([domain, domainJobs]) => ({ domain, count: domainJobs.length }))
    .sort((a, b) => b.count - a.count);
}
