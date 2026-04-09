// workway-next/src/data/locationSeoData.ts

export type SeoRole = { name: string; slug: string };
export type SeoLocation = { name: string; slug: string };

// Top-traffic roles first (first 10 = pre-built at build time)
export const ALL_ROLES: SeoRole[] = [
  { name: "Software Engineer", slug: "software-engineer" },
  { name: "Frontend Engineer", slug: "frontend-engineer" },
  { name: "Backend Engineer", slug: "backend-engineer" },
  { name: "Full Stack Engineer", slug: "full-stack-engineer" },
  { name: "Product Manager", slug: "product-manager" },
  { name: "Data Scientist", slug: "data-scientist" },
  { name: "DevOps Engineer", slug: "devops-engineer" },
  { name: "Machine Learning Engineer", slug: "machine-learning-engineer" },
  { name: "UI/UX Designer", slug: "ui-ux-designer" },
  { name: "Data Analyst", slug: "data-analyst" },
  // On-demand (not pre-built at build time)
  { name: "iOS Engineer", slug: "ios-engineer" },
  { name: "Android Engineer", slug: "android-engineer" },
  { name: "QA Engineer", slug: "qa-engineer" },
  { name: "Site Reliability Engineer", slug: "site-reliability-engineer" },
  { name: "Engineering Manager", slug: "engineering-manager" },
  { name: "Product Designer", slug: "product-designer" },
  { name: "Business Analyst", slug: "business-analyst" },
  { name: "Marketing Manager", slug: "marketing-manager" },
  { name: "Customer Success Manager", slug: "customer-success-manager" },
  { name: "Technical Writer", slug: "technical-writer" },
  { name: "HR Manager", slug: "hr-manager" },
  { name: "Finance Analyst", slug: "finance-analyst" },
  { name: "Operations Manager", slug: "operations-manager" },
  { name: "Legal Counsel", slug: "legal-counsel" },
  { name: "Sales Engineer", slug: "sales-engineer" },
  { name: "AI Engineer", slug: "ai-engineer" },
  { name: "Account Executive", slug: "account-executive" },
  { name: "Data Engineer", slug: "data-engineer" },
];

// Top-traffic locations first (first 10 = pre-built at build time)
export const ALL_LOCATIONS: SeoLocation[] = [
  { name: "Bangalore", slug: "bangalore" },
  { name: "Bengaluru", slug: "bengaluru" },
  { name: "Remote", slug: "remote" },
  { name: "San Francisco", slug: "san-francisco" },
  { name: "New York", slug: "new-york" },
  { name: "London", slug: "london" },
  { name: "Hyderabad", slug: "hyderabad" },
  { name: "Mumbai", slug: "mumbai" },
  { name: "Delhi", slug: "delhi" },
  { name: "Seattle", slug: "seattle" },
  { name: "Austin", slug: "austin" },
  // On-demand
  { name: "Singapore", slug: "singapore" },
  { name: "Berlin", slug: "berlin" },
  { name: "Toronto", slug: "toronto" },
  { name: "Dubai", slug: "dubai" },
  { name: "Pune", slug: "pune" },
  { name: "Chennai", slug: "chennai" },
  { name: "Boston", slug: "boston" },
  { name: "Los Angeles", slug: "los-angeles" },
  { name: "Chicago", slug: "chicago" },
  { name: "Amsterdam", slug: "amsterdam" },
  { name: "Paris", slug: "paris" },
  { name: "Sydney", slug: "sydney" },
  { name: "Tokyo", slug: "tokyo" },
  { name: "Dublin", slug: "dublin" },
  { name: "Washington DC", slug: "washington-dc" },
{ name: "San Jose", slug: "san-jose" },
{ name: "Denver", slug: "denver" },
{ name: "Atlanta", slug: "atlanta" },
{ name: "Dallas", slug: "dallas" },
{ name: "Phoenix", slug: "phoenix" },
{ name: "Vancouver", slug: "vancouver" },
{ name: "Barcelona", slug: "barcelona" },
{ name: "Madrid", slug: "madrid" },
{ name: "Seoul", slug: "seoul" },
{ name: "Hong Kong", slug: "hong-kong" },
{ name: "Tel Aviv", slug: "tel-aviv" },
{ name: "San Diego", slug: "san-diego" },
{ name: "Houston", slug: "houston" },
{ name: "Philadelphia", slug: "philadelphia" },
{ name: "Raleigh", slug: "raleigh" },
{ name: "Charlotte", slug: "charlotte" },
{ name: "Pittsburgh", slug: "pittsburgh" },
{ name: "Salt Lake City", slug: "salt-lake-city" },

{ name: "Gurgaon", slug: "gurgaon" },
{ name: "Noida", slug: "noida" },

{ name: "Stockholm", slug: "stockholm" },
{ name: "Warsaw", slug: "warsaw" },
{ name: "Lisbon", slug: "lisbon" },
{ name: "Copenhagen", slug: "copenhagen" },

{ name: "Bangkok", slug: "bangkok" },
{ name: "Taipei", slug: "taipei" },
{ name: "Manila", slug: "manila" },

{ name: "Cape Town", slug: "cape-town" },

{ name: "United States", slug: "united-states" },
{ name: "United Kingdom", slug: "united-kingdom" },
{ name: "Canada", slug: "canada" },
{ name: "Germany", slug: "germany" },
{ name: "Brazil", slug: "brazil" },
{ name: "Mexico", slug: "mexico" },

{ name: "Remote US", slug: "remote-us" },
{ name: "Remote India", slug: "remote-india" },
{ name: "Remote Europe", slug: "remote-europe" },
];

// Pre-compute all valid slug combinations — O(1) lookup at request time
export const VALID_SEO_SLUGS: Set<string> = new Set(
  ALL_ROLES.flatMap((r) => ALL_LOCATIONS.map((l) => `${r.slug}-jobs-in-${l.slug}`))
);

export function composeLocationSeoSlug(roleSlug: string, locationSlug: string): string {
  return `${roleSlug}-jobs-in-${locationSlug}`;
}

/**
 * Parses a URL slug like "software-engineer-jobs-in-bangalore" into
 * the matching role and location objects from the curated lists.
 * Returns null if either part is not found — validates against lists, not just format.
 * NOTE: Role and location slugs must not contain "-jobs-in-" (delimiter).
 */
export function parseLocationSeoSlug(
  slug: string
): { role: SeoRole; location: SeoLocation } | null {
  const delimiter = "-jobs-in-";
  const idx = slug.indexOf(delimiter);
  if (idx === -1) return null;

  const roleSlug = slug.slice(0, idx);
  const locationSlug = slug.slice(idx + delimiter.length);

  const role = ALL_ROLES.find((r) => r.slug === roleSlug) ?? null;
  const location = ALL_LOCATIONS.find((l) => l.slug === locationSlug) ?? null;

  if (!role || !location) return null;
  return { role, location };
}

// ─── Location-only SEO slugs ─────────────────────────────────────────────────

export const LOCATION_ONLY_PREFIX = "jobs-in-";

export function composeLocationOnlySlug(locationSlug: string): string {
  return `${LOCATION_ONLY_PREFIX}${locationSlug}`;
}

/**
 * Parses a slug like "jobs-in-bangalore" into the matching SeoLocation.
 * Returns null if the location is not in ALL_LOCATIONS.
 */
export function parseLocationOnlySlug(slug: string): SeoLocation | null {
  if (!slug.startsWith(LOCATION_ONLY_PREFIX)) return null;
  const locationSlug = slug.slice(LOCATION_ONLY_PREFIX.length);
  return ALL_LOCATIONS.find((l) => l.slug === locationSlug) ?? null;
}

// Pre-computed set for O(1) lookup
export const VALID_LOCATION_ONLY_SLUGS: Set<string> = new Set(
  ALL_LOCATIONS.map((l) => composeLocationOnlySlug(l.slug))
);
