export type ComparisonRow = {
  feature: string;
  workway: string;
  manual: string;
};

export type GuideComparison = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  ats: "greenhouse" | "lever" | "ashby" | "multiple" | "general";
  manualLabel: string;
  painPoints: string[];
  workwayPoints: string[];
  comparisonRows: ComparisonRow[];
  verdict: string;
};

export const GUIDES: GuideComparison[] = [
  {
    slug: "workway-vs-greenhouse-job-boards",
    title: "WorkWay vs Browsing Greenhouse Job Boards Manually",
    h1: "WorkWay vs Greenhouse job boards",
    description:
      "Stop opening dozens of Greenhouse career pages one by one. WorkWay automatically pulls every job from Greenhouse-powered companies into a single feed — searchable, filterable, trackable.",
    keywords: [
      "greenhouse job board",
      "greenhouse ats jobs",
      "find greenhouse jobs",
      "greenhouse career pages",
      "workway vs greenhouse",
    ],
    ats: "greenhouse",
    manualLabel: "Browsing Greenhouse manually",
    painPoints: [
      "You visit boards.greenhouse.io/{company} for each company separately",
      "No way to search across all Greenhouse boards at once",
      "You lose track of which companies you've already checked",
      "New jobs appear silently — you miss them unless you check back",
      "No application tracking — you end up with a messy spreadsheet",
    ],
    workwayPoints: [
      "WorkWay pulls jobs from every Greenhouse-powered company automatically",
      "Search and filter across all Greenhouse companies in one place",
      "New jobs surface in your feed as soon as they're posted",
      "One-click to mark applied, track interview stages, log rejections",
      "Never re-check the same career page twice",
    ],
    comparisonRows: [
      {
        feature: "See all Greenhouse jobs in one place",
        workway: "Yes — aggregated automatically",
        manual: "No — visit each board separately",
      },
      {
        feature: "Search across all companies",
        workway: "Full-text search + filters",
        manual: "Not possible",
      },
      {
        feature: "Get notified when new jobs appear",
        workway: "Jobs surface in your feed",
        manual: "Only if you check back manually",
      },
      {
        feature: "Track application status",
        workway: "Built-in: applied / interview / rejected",
        manual: "Spreadsheet or memory",
      },
      {
        feature: "Time to check 50 companies",
        workway: "Under 2 minutes",
        manual: "30–60 minutes",
      },
    ],
    verdict:
      "If your target companies use Greenhouse, WorkWay saves you hours every week by replacing 50 browser tabs with one clean feed.",
  },
  {
    slug: "workway-vs-lever-career-pages",
    title: "WorkWay vs Applying Through Lever Career Pages One by One",
    h1: "WorkWay vs Lever career pages",
    description:
      "Lever-powered career pages are scattered across hundreds of companies. WorkWay aggregates every job from jobs.lever.co into one searchable feed so you never miss a role.",
    keywords: [
      "lever career page",
      "lever ats jobs",
      "jobs lever co",
      "find lever jobs",
      "workway vs lever",
    ],
    ats: "lever",
    manualLabel: "Checking Lever pages manually",
    painPoints: [
      "Each company has its own jobs.lever.co/{company} URL to visit",
      "No central search across Lever-powered companies",
      "You bookmark 20 URLs and forget to check half of them",
      "Roles expire and you don't notice until you apply",
      "Impossible to compare roles across companies side by side",
    ],
    workwayPoints: [
      "WorkWay automatically ingests jobs from every Lever company",
      "Filter by role, location, or company from one interface",
      "Stale or closed jobs are removed so you only see live postings",
      "Compare roles across multiple companies at once",
      "Track every application without leaving the platform",
    ],
    comparisonRows: [
      {
        feature: "Jobs from all Lever companies",
        workway: "Aggregated automatically",
        manual: "Visit each URL one by one",
      },
      {
        feature: "Cross-company search",
        workway: "Yes — title, location, company",
        manual: "Not possible",
      },
      {
        feature: "Expired job detection",
        workway: "Stale jobs removed automatically",
        manual: "Only found out after clicking apply",
      },
      {
        feature: "Application tracking",
        workway: "Built-in CRM",
        manual: "Manual spreadsheet",
      },
      {
        feature: "Daily check effort",
        workway: "2 minutes",
        manual: "45+ minutes",
      },
    ],
    verdict:
      "WorkWay replaces the ritual of visiting dozens of Lever career pages every morning with one feed that does the checking for you.",
  },
  {
    slug: "workway-vs-ashby-job-tracking",
    title: "WorkWay vs Tracking Ashby Jobs in a Spreadsheet",
    h1: "WorkWay vs Ashby job tracking in spreadsheets",
    description:
      "Tracking Ashby jobs in a spreadsheet is slow and brittle. WorkWay pulls every job from Ashby-powered companies and lets you track applications without a single formula.",
    keywords: [
      "ashby ats jobs",
      "ashby job board",
      "jobs ashbyhq com",
      "ashby career pages",
      "workway vs ashby",
    ],
    ats: "ashby",
    manualLabel: "Spreadsheet + manual Ashby checks",
    painPoints: [
      "Checking jobs.ashbyhq.com/{company} for each company is tedious",
      "Copy-pasting job links into a spreadsheet is error-prone",
      "Spreadsheets go stale — you don't know if a job is still open",
      "No way to filter by role or seniority across Ashby companies",
      "You forget to update the spreadsheet and lose track of applications",
    ],
    workwayPoints: [
      "WorkWay pulls jobs from all Ashby-powered companies automatically",
      "No spreadsheets — track applied, interviewed, rejected in-app",
      "Jobs are always current — stale listings removed on each sync",
      "Filter Ashby jobs by role, location, or company in seconds",
      "Your full application history in one place, searchable",
    ],
    comparisonRows: [
      {
        feature: "Ashby jobs in one view",
        workway: "Yes — auto-aggregated",
        manual: "Manually copied to spreadsheet",
      },
      {
        feature: "Job freshness",
        workway: "Updated every few hours",
        manual: "Only as fresh as your last check",
      },
      {
        feature: "Application status tracking",
        workway: "In-app: applied / interview / rejected",
        manual: "Manual spreadsheet columns",
      },
      {
        feature: "Filter by role / location",
        workway: "Built-in filters",
        manual: "Spreadsheet formulas",
      },
      {
        feature: "Setup time",
        workway: "Zero — start browsing immediately",
        manual: "Build and maintain spreadsheet",
      },
    ],
    verdict:
      "A spreadsheet of Ashby jobs is always one update behind. WorkWay keeps it current automatically and adds tracking on top.",
  },
  {
    slug: "workway-vs-multiple-ats-tabs",
    title: "WorkWay vs Opening Multiple ATS Job Tabs Daily",
    h1: "WorkWay vs opening multiple ATS tabs every day",
    description:
      "Stop opening 30+ browser tabs across Greenhouse, Lever, and Ashby every morning. WorkWay aggregates all three into one feed you can scan in under 2 minutes.",
    keywords: [
      "multiple ats job boards",
      "greenhouse lever ashby jobs",
      "job search browser tabs",
      "ats job aggregator",
      "workway vs multiple tabs",
    ],
    ats: "multiple",
    manualLabel: "30+ daily browser tabs",
    painPoints: [
      "Every morning: open tabs for each company career page",
      "Mix of Greenhouse, Lever, and Ashby — each has a different layout",
      "Browser crashes, tabs get lost, bookmarks pile up",
      "You check the same companies even when nothing has changed",
      "No way to know which companies have new posts without visiting each",
    ],
    workwayPoints: [
      "One tab replaces 30+ — all ATS jobs in a single feed",
      "Greenhouse, Lever, and Ashby normalized into one consistent layout",
      "Only new and active jobs surface — no wasted clicks",
      "Smart filtering so you see only what's relevant to you",
      "Your daily job check drops from an hour to two minutes",
    ],
    comparisonRows: [
      {
        feature: "Daily tabs opened",
        workway: "1",
        manual: "30–80+",
      },
      {
        feature: "ATS coverage",
        workway: "Greenhouse + Lever + Ashby",
        manual: "Whatever you remember to check",
      },
      {
        feature: "Consistent layout",
        workway: "All jobs normalized",
        manual: "Different UI per company",
      },
      {
        feature: "New job detection",
        workway: "Automatic — feed updates",
        manual: "Only by revisiting each page",
      },
      {
        feature: "Time per day",
        workway: "~2 minutes",
        manual: "45–90 minutes",
      },
    ],
    verdict:
      "The tab chaos ends here. WorkWay checks every career page so you don't have to — and surfaces only what's new.",
  },
  {
    slug: "workway-vs-greenhouse-lever-ashby-separately",
    title: "WorkWay vs Checking Greenhouse, Lever, and Ashby Separately",
    h1: "WorkWay vs checking Greenhouse, Lever, and Ashby separately",
    description:
      "Checking three different ATS platforms separately is the most common — and most wasteful — part of job searching. WorkWay unifies all three into one place.",
    keywords: [
      "greenhouse lever ashby",
      "multiple ats platforms",
      "job search ats aggregator",
      "greenhouse lever ashby jobs",
      "workway vs ats platforms",
    ],
    ats: "multiple",
    manualLabel: "Checking all three ATS separately",
    painPoints: [
      "Greenhouse, Lever, and Ashby each have their own URLs and layouts",
      "You maintain three separate mental lists of companies to check",
      "No way to see the full job market picture at once",
      "Some companies use multiple ATS — you might visit them twice",
      "Switching between platforms breaks your focus and flow",
    ],
    workwayPoints: [
      "WorkWay pulls from Greenhouse, Lever, and Ashby in one sync",
      "All jobs normalized into a single schema — same layout everywhere",
      "See the full picture: what's hiring across all three platforms today",
      "Deduplication removes cross-platform reposts automatically",
      "One search, one filter, one place for your entire job market",
    ],
    comparisonRows: [
      {
        feature: "Platforms covered",
        workway: "Greenhouse + Lever + Ashby",
        manual: "One at a time",
      },
      {
        feature: "Unified search",
        workway: "Across all three",
        manual: "Platform-by-platform",
      },
      {
        feature: "Deduplication",
        workway: "Handled automatically",
        manual: "Manual — easy to miss",
      },
      {
        feature: "Normalized layout",
        workway: "Consistent card format",
        manual: "Different per platform",
      },
      {
        feature: "Mental overhead",
        workway: "Zero — one interface",
        manual: "Three separate workflows",
      },
    ],
    verdict:
      "WorkWay doesn't pick one ATS — it covers all three so your job search isn't limited by which platform a company happens to use.",
  },
  {
    slug: "workway-vs-multiple-ats-platforms",
    title: "WorkWay vs Managing Jobs Across Multiple ATS Platforms Manually",
    h1: "WorkWay vs managing multiple ATS platforms manually",
    description:
      "Managing your job search across multiple ATS platforms manually creates gaps, duplicates, and missed opportunities. WorkWay closes those gaps automatically.",
    keywords: [
      "manage multiple ats",
      "ats job search management",
      "greenhouse lever ashby management",
      "job search workflow ats",
      "workway vs ats management",
    ],
    ats: "multiple",
    manualLabel: "Manual multi-ATS management",
    painPoints: [
      "Each ATS platform has its own job format and navigation",
      "Easy to miss jobs when you forget to check one platform",
      "No status tracking across platforms — applied jobs get mixed up",
      "Companies switch ATS providers and you lose track of where to look",
      "Time spent managing process > time spent on actual applications",
    ],
    workwayPoints: [
      "WorkWay monitors Greenhouse, Lever, and Ashby so you don't have to",
      "Missed jobs become impossible — everything is in one feed",
      "Application tracking works across all platforms uniformly",
      "When companies change ATS, WorkWay adapts — you notice nothing",
      "Spend your energy on applications, not platform management",
    ],
    comparisonRows: [
      {
        feature: "Platform monitoring",
        workway: "Automated across all three",
        manual: "Manual — platform by platform",
      },
      {
        feature: "Missed job risk",
        workway: "Near zero",
        manual: "High — one missed check = missed roles",
      },
      {
        feature: "Cross-platform tracking",
        workway: "Unified in one dashboard",
        manual: "Fragmented across platforms",
      },
      {
        feature: "ATS change resilience",
        workway: "Handled server-side",
        manual: "You have to discover and adapt",
      },
      {
        feature: "Weekly overhead",
        workway: "~10 minutes",
        manual: "3–5 hours",
      },
    ],
    verdict:
      "Managing multiple ATS platforms manually is a part-time job. WorkWay automates it so you can focus on getting hired.",
  },
  {
    slug: "workway-vs-spreadsheet-job-tracking",
    title: "WorkWay vs Spreadsheet for Tracking Greenhouse and Lever Applications",
    h1: "WorkWay vs a spreadsheet for ATS job tracking",
    description:
      "A spreadsheet can't tell you when a job closes, pull new listings automatically, or remind you to follow up. WorkWay does all three — without a single formula.",
    keywords: [
      "job tracking spreadsheet",
      "greenhouse lever tracking",
      "job application tracker",
      "spreadsheet vs job tracker",
      "workway vs spreadsheet",
    ],
    ats: "general",
    manualLabel: "Spreadsheet job tracker",
    painPoints: [
      "Copy-paste job links and details into rows manually",
      "Spreadsheet doesn't know when a job closes",
      "No automatic discovery — you populate it yourself",
      "Formatting is inconsistent — different people track differently",
      "Shared spreadsheets get messy fast with multiple collaborators",
    ],
    workwayPoints: [
      "Jobs are pulled automatically — nothing to copy-paste",
      "Closed and expired jobs are removed from your view",
      "Built-in status: applied, interviewing, offer, rejected",
      "Consistent format across every job, every company, every ATS",
      "One-click to move a job between stages",
    ],
    comparisonRows: [
      {
        feature: "Job discovery",
        workway: "Automatic — pulled from ATS",
        manual: "Manual copy-paste",
      },
      {
        feature: "Closed job handling",
        workway: "Removed automatically",
        manual: "You won't know until you click",
      },
      {
        feature: "Status tracking",
        workway: "Built-in stages",
        manual: "Custom columns per person",
      },
      {
        feature: "Data freshness",
        workway: "Updated every few hours",
        manual: "As fresh as your last edit",
      },
      {
        feature: "Setup time",
        workway: "None",
        manual: "Hours to build, ongoing to maintain",
      },
    ],
    verdict:
      "Spreadsheets are where job search data goes to get stale. WorkWay keeps everything live and organized without the upkeep.",
  },
  {
    slug: "workway-vs-manual-job-search",
    title: "WorkWay vs Manual Job Search Across ATS Platforms",
    h1: "WorkWay vs manual job search",
    description:
      "Manual job searching across Greenhouse, Lever, and Ashby wastes hours that should go into preparing for interviews. WorkWay automates the search so you can focus on the applications.",
    keywords: [
      "manual job search",
      "job search automation",
      "ats job search",
      "job search time saver",
      "workway vs manual search",
    ],
    ats: "general",
    manualLabel: "Manual job search",
    painPoints: [
      "Hours per week spent opening career pages and refreshing listings",
      "No way to search multiple company career pages simultaneously",
      "You miss roles posted while you were busy with something else",
      "Different companies use different ATS — separate workflows for each",
      "Energy spent on search is energy not spent on interview prep",
    ],
    workwayPoints: [
      "WorkWay runs the search for you — 24/7 across all major ATS",
      "Unified search bar covers all companies and all platforms",
      "New jobs appear in your feed within hours of being posted",
      "One consistent workflow regardless of which ATS a company uses",
      "Free up 5–10 hours per week for applications and prep",
    ],
    comparisonRows: [
      {
        feature: "Search automation",
        workway: "Continuous — always running",
        manual: "Only when you're actively searching",
      },
      {
        feature: "ATS coverage",
        workway: "Greenhouse, Lever, Ashby",
        manual: "Whatever you remember",
      },
      {
        feature: "New job latency",
        workway: "Hours after posting",
        manual: "Days — only when you check",
      },
      {
        feature: "Workflow consistency",
        workway: "Identical for every company",
        manual: "Adapts per ATS platform",
      },
      {
        feature: "Time per week",
        workway: "~10 minutes",
        manual: "5–10+ hours",
      },
    ],
    verdict:
      "The best job searches are ones where you spend more time preparing for interviews than hunting for listings. WorkWay handles the hunting.",
  },
  {
    slug: "workway-vs-bookmarking-job-links",
    title: "WorkWay vs Bookmarking Job Links from Greenhouse and Ashby",
    h1: "WorkWay vs bookmarking job links",
    description:
      "Bookmarking job links from Greenhouse and Ashby is a losing strategy — links expire, folders get bloated, and you lose track of what you've applied to. WorkWay replaces the bookmark folder.",
    keywords: [
      "bookmark job links",
      "save job links",
      "greenhouse ashby bookmarks",
      "job link organizer",
      "workway vs bookmarks",
    ],
    ats: "general",
    manualLabel: "Bookmark folder",
    painPoints: [
      "Bookmarks pile up with no indication of which jobs are still open",
      "Links expire when companies close or remove postings",
      "No status tracking — you don't know what you've applied to",
      "Browser-based — you can't access your list from another device easily",
      "Folders get disorganized and you lose track of priorities",
    ],
    workwayPoints: [
      "Save a job in WorkWay — it stays live until it closes",
      "Closed postings are flagged automatically so you know not to apply",
      "Built-in status tracking: saved, applied, interviewing, rejected",
      "Accessible from any device — your job list follows you",
      "Organized by company, role, or status — never a cluttered folder",
    ],
    comparisonRows: [
      {
        feature: "Job link freshness",
        workway: "Updated — stale jobs flagged",
        manual: "Static — links rot silently",
      },
      {
        feature: "Closed posting detection",
        workway: "Automatic",
        manual: "Only when you click a dead link",
      },
      {
        feature: "Application tracking",
        workway: "Built-in stages",
        manual: "Not possible in bookmarks",
      },
      {
        feature: "Cross-device access",
        workway: "Account-based — everywhere",
        manual: "Browser-local (sync varies)",
      },
      {
        feature: "Organization",
        workway: "Filters by company, status, role",
        manual: "Manual folders",
      },
    ],
    verdict:
      "Bookmarks are static snapshots of a dynamic job market. WorkWay keeps your saved jobs live, organized, and tracked.",
  },
];

export function getGuideBySlug(slug: string): GuideComparison | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export const ALL_GUIDE_SLUGS = GUIDES.map((g) => g.slug);
