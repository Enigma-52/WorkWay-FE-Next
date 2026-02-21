export type CompanyListItem = {
  id: string | number;
  slug: string;
  name: string;
  description?: string;
  logo_url?: string | null;
  is_actively_hiring?: boolean;
  jobs_open_count?: number;
};

export type CompanyOverview = {
  stats: {
    total_companies: number;
    total_jobs: number;
  };
  trending: CompanyListItem[];
  recently_added: CompanyListItem[];
  actively_hiring: CompanyListItem[];
};

export type CompanyListResponse = {
  companies: CompanyListItem[];
  meta: { total: number; page: number; limit: number };
};

export type DomainListItem = {
  domain: string;
  slug: string;
  job_count: number;
};

export type DomainJobsResponse = {
  domain: { name: string; slug: string };
  jobs: Array<Record<string, unknown>>;
  meta: { page: number; limit: number; total: number; total_pages: number };
};

export type JobDetailsResponse = Record<string, unknown>;
export type CompanyDetailsResponse = Record<string, unknown>;

export type JobListQuery = {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
  domain?: string;
  employment_type?: string;
  experience_level?: string;
  location?: string;
  company_slug?: string;
};
