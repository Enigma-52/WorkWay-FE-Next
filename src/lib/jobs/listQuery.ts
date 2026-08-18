// Shared query-param parsing for pages backed by /api/job/list — used by
// /jobs, /internships, and /senior-jobs, which differ only in which filter
// value is fixed as the default (experience_level, in the latter two).
export type ListSearchParams = Record<string, string | string[] | undefined>;

export function getSingleParam(
  value: string | string[] | undefined,
  fallback: string,
): string {
  if (!value) return fallback;
  return Array.isArray(value) ? value[0] || fallback : value;
}

export function buildJobListQuery(
  sp: ListSearchParams,
  defaults: { experience_level?: string; employment_type?: string } = {},
): Record<string, string | number> {
  const q = getSingleParam(sp.q, "");
  const page = getSingleParam(sp.page, "1");
  const limit = getSingleParam(sp.limit, "20");
  const domain = getSingleParam(sp.domain, "all");
  const employment_type = getSingleParam(
    sp.employment_type,
    defaults.employment_type ?? "all",
  );
  const experience_level = getSingleParam(
    sp.experience_level,
    defaults.experience_level ?? "all",
  );
  const location = getSingleParam(sp.location, "");
  const country = getSingleParam(sp.country, "");
  const company_slug = getSingleParam(sp.company_slug, "");
  const sort = getSingleParam(sp.sort, "recent");
  const posted = getSingleParam(sp.posted, "all");

  const query: Record<string, string | number> = {
    page: Number(page) || 1,
    limit: Math.min(50, Math.max(1, Number(limit) || 20)),
    sort,
    domain,
    employment_type,
    experience_level,
  };
  if (q) query.q = q;
  if (location) query.location = location;
  if (country) query.country = country;
  if (company_slug) query.company_slug = company_slug;
  if (posted && posted !== "all") query.posted = posted;
  return query;
}
