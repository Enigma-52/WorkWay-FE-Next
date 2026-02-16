export type JobListing = {
  id: string | number;
  slug: string;
  title: string;
  company: string;
  company_slug?: string;
  company_logo_url?: string;
  company_url?: string;
  location: string;
  experience_level: string;
  employment_type: string;
  domain: string;
  description?: string | Array<{ heading: string; content: string[] }>;
  updated_at?: string;
  created_at?: string;
  url: string;
};

export type CompanyDetails = {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  website?: string | null;
  logo_url?: string | null;
  jobListings: JobListing[];
};

export type DomainJobsPayload = {
  domain: { name: string; slug: string };
  jobs: JobListing[];
  meta: { page: number; total: number; total_pages: number };
};

export type JobDetails = JobListing & {
  similarJobsByDomain?: JobListing[];
  otherJobsByCompany?: JobListing[];
};

