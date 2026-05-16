import { JOB_DOMAINS } from "@/utils/constants";

export function getDomainSlug(name: string): string {
  const domain = JOB_DOMAINS.find((d) => d.name === name);
  return domain ? domain.slug : "other";
}

/**
 * Truncate a long location string to show at most `maxCities` cities.
 * e.g. "Austin, TX; Chicago, IL; Denver, CO; ..." → "Austin, TX; Chicago, IL +4 more"
 * Also handles comma-separated multi-city lists.
 */
export function truncateLocation(location: string, maxCities = 2): string {
  if (!location) return "";
  // Split on semicolons or " USA; " style, or detect repeated "City, State, USA" pattern
  const parts = location.split(/;\s*/);
  if (parts.length > maxCities) {
    return parts.slice(0, maxCities).join("; ") + ` +${parts.length - maxCities} more`;
  }
  // If no semicolons, check if it's just very long (>60 chars)
  if (location.length > 60) {
    return location.slice(0, 55).trim() + "…";
  }
  return location;
}

