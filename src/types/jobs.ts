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
  skills : Skill[]
  metadata?: Record<string, any>;
  platform?: string;
};

export type Skill = {
  name: string;
  slug: string;
};

export type CompanyFounder = {
  bio: string;
  name: string;
  image: string;
  title: string;
  social: {
    twitter?: string;
    linkedin?: string;
  };
};

export type CompanyYcPartner = {
  id: number;
  url: string;
  full_name: string;
  avatar_thumb_url: string;
};

export type CompanyMetadata = {
  tags?: string[];
  social?: {
    github?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    crunchbase?: string;
  };
  status?: string;
  tagline?: string;
  ycBatch?: string;
  founders?: CompanyFounder[];
  teamSize?: number | null;
  ycPartner?: CompanyYcPartner;
  banner_logo?: string;
  foundedYear?: number;
};

export type CompanyDetails = {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  website?: string | null;
  logo_url?: string | null;
  location?: { location?: string } | Record<string, unknown>;
  platform?: string;
  namespace?: string;
  metadata?: CompanyMetadata;
  totalJobs: number;
  recentlyPostedJobs: JobListing[];
  domainStats: { domain: string; count: number }[];
};

export type DomainJobsPayload = {
  domain: { name: string; slug: string };
  jobs: JobListing[];
  meta: { page: number; total: number; total_pages: number };
};

export type SkillJobsPayload = {
  skill: { name: string; slug: string };
  jobs: JobListing[];
  meta: { page: number; total: number; total_pages: number };
};

export type SkillJobGroup = {
  skill_name: string;
  skill_slug: string;
  jobs: JobListing[];
};

export type JobDetails = JobListing & {
  similarJobsByDomain?: JobListing[];
  otherJobsByCompany?: JobListing[];
  jobsBySkill?: SkillJobGroup[];
  remainingSkills?: Skill[];
  similarLocationJobs?: JobListing[];
};

/** Response from GET /api/job/list */
export type JobListResponse = {
  jobs: JobListing[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  applied_filters: {
    q?: string;
    domain?: string;
    employment_type?: string;
    experience_level?: string;
    location?: string;
    company_slug?: string;
    sort?: string;
  };
  facets: {
    domains: { slug: string; name: string; count: number }[];
    employment_types: { value: string; count: number }[];
    experience_levels: { value: string; count: number }[];
  };
};

/** Response from GET /api/job/filters */
export type JobFiltersResponse = {
  facets: JobListResponse["facets"];
};

