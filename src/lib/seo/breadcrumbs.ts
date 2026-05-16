export type BreadcrumbItem = {
  name: string;
  href?: string;
};

export function buildHomeBreadcrumb(): BreadcrumbItem[] {
  return [
    {
      name: "Home",
      href: "/",
    },
  ];
}

export function buildJobsBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Jobs",
      href: "/jobs",
    },
  ];
}

export function buildJobDetailBreadcrumb(jobTitle: string): BreadcrumbItem[] {
  return [
    ...buildJobsBreadcrumb(),
    {
      name: jobTitle,
    },
  ];
}

export function buildCompaniesBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Companies",
      href: "/companies",
    },
  ];
}

export function buildCompanyDetailBreadcrumb(
  companyName: string,
): BreadcrumbItem[] {
  return [
    ...buildCompaniesBreadcrumb(),
    {
      name: companyName,
    },
  ];
}

export function buildDomainsBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Domains",
      href: "/domains",
    },
  ];
}

export function buildDomainDetailBreadcrumb(
  domainName: string,
): BreadcrumbItem[] {
  return [
    ...buildDomainsBreadcrumb(),
    {
      name: domainName,
    },
  ];
}

export function buildSkillsBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Skills",
      href: "/skills",
    },
  ];
}

export function buildSkillDetailBreadcrumb(skillName: string): BreadcrumbItem[] {
  return [
    ...buildSkillsBreadcrumb(),
    {
      name: skillName,
    },
  ];
}

export function buildAboutBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "About",
      href: "/about",
    },
  ];
}

export function buildHireMeBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Hire Me",
      href: "/hireme",
    },
  ];
}

export function buildChatBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Chat",
      href: "/chat",
    },
  ];
}

export function buildChangelogBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Changelog",
      href: "/changelog",
    },
  ];
}

export function buildFeedbackBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Feedback",
      href: "/feedback",
    },
  ];
}

export function buildContactBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Contact",
      href: "/contact",
    },
  ];
}

export function buildPrivacyPolicyBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Privacy Policy",
      href: "/privacy-policy",
    },
  ];
}

export function buildTermsBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Terms of Service",
      href: "/terms",
    },
  ];
}

export function buildDisclaimerBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Disclaimer",
      href: "/disclaimer",
    },
  ];
}

export function buildLocationJobsBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Location Jobs",
      href: "/location-jobs",
    },
  ];
}

export function buildGuidesBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Guides",
      href: "/guides",
    },
  ];
}

export function buildGuideDetailBreadcrumb(title: string): BreadcrumbItem[] {
  return [
    ...buildGuidesBreadcrumb(),
    {
      name: title,
    },
  ];
}

export function buildLocationSeoDetailBreadcrumb(
  roleName: string,
  locationName: string,
): BreadcrumbItem[] {
  return [
    ...buildLocationJobsBreadcrumb(),
    {
      name: `${roleName} Jobs in ${locationName}`,
    },
  ];
}

export function buildSalaryInsightsBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Salary Insights",
      href: "/salary-insights",
    },
  ];
}

export function buildJobsByLocationBreadcrumb(): BreadcrumbItem[] {
  return [
    ...buildHomeBreadcrumb(),
    {
      name: "Jobs by Location",
      href: "/jobs-by-location",
    },
  ];
}

export function buildLocationOnlyDetailBreadcrumb(
  locationName: string,
): BreadcrumbItem[] {
  return [
    ...buildJobsByLocationBreadcrumb(),
    {
      name: `Jobs in ${locationName}`,
    },
  ];
}
