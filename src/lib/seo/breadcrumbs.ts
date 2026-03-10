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

