export interface Company {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  website?: string | null;
  logo_url?: string | null;
  location?: Record<string, unknown>;
  created_at?: string;
  platform?: string;
  namespace?: string;
  is_actively_hiring?: boolean;
  jobs_open_count?: number;
}
