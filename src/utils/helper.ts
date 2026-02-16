import { JOB_DOMAINS } from "@/utils/constants";

export function getDomainSlug(name: string): string {
  const domain = JOB_DOMAINS.find((d) => d.name === name);
  return domain ? domain.slug : "other";
}

