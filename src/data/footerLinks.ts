import { ALL_LOCATIONS, ALL_ROLES, composeLocationSeoSlug } from "./locationSeoData";

export type FooterLink = { name: string; slug: string };

// Curated global hub cities — order matters for display
const FOOTER_LOCATION_SLUGS = [
  "bangalore",
  "remote",
  "san-francisco",
  "new-york",
  "london",
  "tokyo",
  "singapore",
  "berlin",
  "toronto",
  "dubai",
  "mumbai",
  "sydney",
];

export const FOOTER_LOCATIONS: FooterLink[] = FOOTER_LOCATION_SLUGS.map((slug) => {
  const location = ALL_LOCATIONS.find((l) => l.slug === slug);
  if (!location) throw new Error(`Footer location slug "${slug}" not found in ALL_LOCATIONS`);
  return location;
});

// Top roles by traffic, linked to their "remote" combo page.
// "UI/UX Designer" swapped for "Product Designer" — the former has 0 matching
// remote jobs on the backend search (q=<role>&location=Remote), the latter has 200+.
const FOOTER_ROLE_SLUGS = [
  "software-engineer",
  "frontend-engineer",
  "backend-engineer",
  "full-stack-engineer",
  "product-manager",
  "data-scientist",
  "devops-engineer",
  "machine-learning-engineer",
  "product-designer",
  "data-analyst",
  "ios-engineer",
  "android-engineer",
];

export const FOOTER_ROLES: FooterLink[] = FOOTER_ROLE_SLUGS.map((slug) => {
  const role = ALL_ROLES.find((r) => r.slug === slug);
  if (!role) throw new Error(`Footer role slug "${slug}" not found in ALL_ROLES`);
  return role;
});

export function footerRoleHref(roleSlug: string): string {
  return `/${composeLocationSeoSlug(roleSlug, "remote")}`;
}

// Curated by job volume from /api/filter/domain/all
export const FOOTER_DOMAINS: FooterLink[] = [
  { name: "Software Engineering", slug: "software-engineering" },
  { name: "AI / Data Science", slug: "ai-data-science" },
  { name: "Backend", slug: "backend" },
  { name: "Frontend", slug: "frontend" },
  { name: "DevOps", slug: "devops" },
  { name: "Full-stack", slug: "full-stack" },
  { name: "Product / Project", slug: "product-project" },
  { name: "Design / Creative", slug: "design-creative" },
  { name: "Analyst", slug: "analyst" },
  { name: "Operations", slug: "operations" },
  { name: "Android", slug: "android" },
  { name: "iOS", slug: "ios" },
];

// Curated technical skills by job volume from /api/filter/skills/all
export const FOOTER_SKILLS: FooterLink[] = [
  { name: "Python", slug: "python" },
  { name: "AWS", slug: "aws" },
  { name: "SQL", slug: "sql" },
  { name: "Kubernetes", slug: "kubernetes" },
  { name: "Docker", slug: "docker" },
  { name: "JavaScript", slug: "javascript" },
  { name: "React", slug: "react" },
  { name: "Java", slug: "java" },
  { name: "GCP", slug: "gcp" },
  { name: "Azure", slug: "azure" },
  { name: "Machine Learning", slug: "machine-learning" },
  { name: "LLM", slug: "llm" },
];
