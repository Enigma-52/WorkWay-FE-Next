// Single source of truth for the /mcp marketing + docs pages. Tool metadata
// here mirrors the registered tool schemas in WorkWay--BE/mcp/tools/*.js —
// update both together when a tool's arguments change.

export const MCP_ENDPOINT = "https://api.workway.dev/mcp";
export const API_KEYS_PATH = "/dashboard/seeker/api-keys";

export type McpToolParam = {
  name: string;
  type: string;
  required?: boolean;
  description: string;
};

export type McpTool = {
  slug: string;
  name: string;
  kind: "read" | "write";
  summary: string;
  description: string;
  params: McpToolParam[];
  example: string;
  sampleResponse: string;
  note?: string;
};

export const MCP_TOOLS: McpTool[] = [
  {
    slug: "search-jobs",
    name: "search_jobs",
    kind: "read",
    summary: "Search live openings across every indexed company.",
    description:
      "The core tool. Searches active job listings pulled straight from company ATS boards, with filters for text, domain, location, country, company, employment type, experience level, ATS source, and recency. Results are paginated and every job carries both its original apply link and its WorkWay page.",
    params: [
      { name: "query", type: "string", description: "Free text matched against job title and company name." },
      { name: "domain", type: "string", description: "Domain slug from list_domains, e.g. software-engineering." },
      { name: "location", type: "string", description: "Location substring, e.g. Remote or Berlin." },
      { name: "country", type: "string", description: "ISO alpha-3 country code, e.g. USA, IND, DEU." },
      { name: "company", type: "string", description: "Company slug to restrict results to one employer." },
      { name: "employment_type", type: "Full-Time | Part-Time | Contract", description: "Contract shape of the role." },
      { name: "experience_level", type: "Intern … Director", description: "Seniority band. One of Intern, Junior, Mid-level, Senior, Staff, Lead, Manager, Director." },
      { name: "platform", type: "greenhouse | ashby | ycombinator", description: "Restrict to a single ATS source." },
      { name: "posted", type: "today | 3d | 7d | 30d", description: "Only roles posted within this window." },
      { name: "page", type: "integer", description: "1-based page number. Defaults to 1." },
      { name: "limit", type: "integer", description: "Results per page, 1–50. Defaults to 20." },
    ],
    example: `Find senior backend roles posted this week at YC companies, remote only.`,
    sampleResponse: `{
  "total": 128,
  "page": 1,
  "total_pages": 7,
  "jobs": [
    {
      "title": "Staff Software Engineer",
      "company": "Ping Identity",
      "location": "USA - Remote",
      "domain": "Software Engineering",
      "employment_type": "Full-Time",
      "experience_level": "Staff",
      "source": "greenhouse",
      "apply_url": "https://job-boards.greenhouse.io/pingidentity/jobs/8676157002",
      "workway_url": "https://workway.dev/job/ping-identity-staff-software-engineer-8676157002",
      "slug": "ping-identity-staff-software-engineer-8676157002"
    }
  ],
  "cta": "Browse more roles and save searches at https://workway.dev/jobs"
}`,
  },
  {
    slug: "get-company-overview",
    name: "get_company_overview",
    kind: "read",
    summary: "Everything WorkWay knows about one company.",
    description:
      "Looks up a single company by slug and returns what it does, how many roles are currently open, the breakdown of those roles by domain, and its most recently posted jobs. Useful before following a company or when someone asks what a specific employer is hiring for.",
    params: [
      { name: "company", type: "string", required: true, description: "Company slug, lowercase and hyphenated, e.g. stripe or y-combinator." },
    ],
    example: `What is Stripe hiring for right now?`,
    sampleResponse: `{
  "name": "Stripe",
  "slug": "stripe",
  "description": "Stripe is a technology company that builds an infrastructure for online payments.",
  "website": "https://stripe.com",
  "total_open_roles": 1626,
  "roles_by_domain": [
    { "domain": "Software Engineering", "count": 239 },
    { "domain": "Accounts / Finance", "count": 253 }
  ],
  "recent_jobs": [ /* … */ ],
  "workway_url": "https://workway.dev/company/stripe"
}`,
  },
  {
    slug: "list-domains",
    name: "list_domains",
    kind: "read",
    summary: "Every job domain with its live open-role count.",
    description:
      "Returns the full domain taxonomy with current counts. Call this to discover valid domain slugs before filtering search_jobs, or to answer questions about which fields have the most openings.",
    params: [],
    example: `Which fields have the most open roles on WorkWay?`,
    sampleResponse: `{
  "domains": [
    { "name": "Software Engineering", "slug": "software-engineering", "job_count": 104540 },
    { "name": "AI / Data Science", "slug": "ai-data-science", "job_count": 21877 }
  ],
  "cta": "Browse by domain at https://workway.dev/domains"
}`,
  },
  {
    slug: "get-workway-info",
    name: "get_workway_info",
    kind: "read",
    summary: "Background on WorkWay, live coverage, and valid filter values.",
    description:
      "Reference tool for the agent itself. Explains what WorkWay is and how its data is sourced, reports live job/company/domain counts, lists every accepted filter value, documents the underlying REST API, and describes how the free and Pro plans differ.",
    params: [
      {
        name: "topic",
        type: "overview | coverage | filters | api | plans",
        description:
          "Which section to return. Defaults to overview. Use filters to look up every valid filter value before calling search_jobs.",
      },
    ],
    example: `What filter values does WorkWay accept?`,
    sampleResponse: `{
  "platform": ["greenhouse", "ashby", "ycombinator"],
  "employment_type": ["Full-Time", "Part-Time", "Contract"],
  "experience_level": ["Director", "Lead", "Manager", "Staff", "Senior", "Mid-level", "Junior", "Intern"],
  "posted": ["today", "3d", "7d", "30d"],
  "country": "ISO alpha-3 code, e.g. USA, IND, DEU"
}`,
  },
  {
    slug: "save-job",
    name: "save_job",
    kind: "write",
    summary: "Save a role to your WorkWay dashboard.",
    description:
      "Saves a job to the account that owns the API key. The job is resolved by slug first, so the saved record always carries the real title, company, and apply link rather than anything supplied by the caller.",
    params: [
      { name: "job_slug", type: "string", required: true, description: "Job slug exactly as returned by search_jobs." },
    ],
    example: `Save that Staff Engineer role at Ping Identity for me.`,
    sampleResponse: `Saved "Staff Software Engineer" at Ping Identity. See all your saved jobs at https://workway.dev/dashboard/seeker/saved-jobs`,
  },
  {
    slug: "list-saved-jobs",
    name: "list_saved_jobs",
    kind: "read",
    summary: "Everything you've saved, with apply links intact.",
    description:
      "Lists every job saved to the account that owns the API key, newest first, each with its original apply link and WorkWay page.",
    params: [],
    example: `What jobs have I saved so far?`,
    sampleResponse: `{
  "count": 7,
  "saved_jobs": [
    {
      "title": "Staff Software Engineer",
      "company": "Ping Identity",
      "saved_at": "2026-08-22T18:07:01.892Z",
      "apply_url": "https://job-boards.greenhouse.io/pingidentity/jobs/8676157002",
      "workway_url": "https://workway.dev/job/ping-identity-staff-software-engineer-8676157002"
    }
  ],
  "dashboard_url": "https://workway.dev/dashboard/seeker/saved-jobs"
}`,
  },
  {
    slug: "follow-company",
    name: "follow_company",
    kind: "write",
    summary: "Track a company so new roles reach you first.",
    description:
      "Follows a company on the account that owns the API key. Following works on every plan — free accounts can follow as many companies as they like. On Pro, following also turns on instant email alerts: you get an email the moment that company posts a new role, rather than a daily digest.",
    params: [
      { name: "company", type: "string", required: true, description: "Company slug, e.g. stripe." },
    ],
    example: `Follow Figma so I hear about new roles there.`,
    sampleResponse: `Now following Figma — it's saved to your follows at https://workway.dev/dashboard/seeker/alerts. Instant email alerts the moment they post a new role are a Pro feature.`,
    note: "Never plan-gated. The follow itself always succeeds; only the instant email delivery requires Pro.",
  },
  {
    slug: "list-alerts",
    name: "list_alerts",
    kind: "read",
    summary: "Companies you follow, and whether alerts are live.",
    description:
      "Lists every company the account follows. The response includes email_alerts_active so it is always clear whether new-role emails will actually be delivered on the current plan.",
    params: [],
    example: `Which companies am I following?`,
    sampleResponse: `{
  "count": 7,
  "email_alerts_active": false,
  "following": [
    { "company": "Figma", "slug": "figma", "workway_url": "https://workway.dev/company/figma" }
  ],
  "dashboard_url": "https://workway.dev/dashboard/seeker/alerts"
}`,
  },
  {
    slug: "get-talent-profile",
    name: "get_talent_profile",
    kind: "read",
    summary: "Read your public talent profile.",
    description:
      "Returns the talent profile attached to the account, including experience, education, and certifications. If no profile exists yet, the response explains how to create one.",
    params: [],
    example: `Show me my WorkWay talent profile.`,
    sampleResponse: `{
  "profile": {
    "username": "rohit",
    "professional_title": "Staff Backend Engineer",
    "category": "Engineering",
    "skills": ["Node.js", "Postgres"],
    "experiences": [ /* … */ ]
  },
  "profile_url": "https://workway.dev/p/rohit"
}`,
  },
  {
    slug: "update-talent-profile",
    name: "update_talent_profile",
    kind: "write",
    summary: "Build or edit your profile from the chat.",
    description:
      "Creates the talent profile if none exists, otherwise patches only the fields supplied — everything else is left untouched. Creating a profile for the first time requires a username.",
    params: [
      { name: "username", type: "string", description: "Public handle, 3–30 characters. Required when creating." },
      { name: "display_name", type: "string", description: "Name shown on the public profile." },
      { name: "professional_title", type: "string", description: "Headline, e.g. Senior Backend Engineer." },
      { name: "about", type: "string", description: "Bio or summary paragraph." },
      { name: "category", type: "string", description: "e.g. Engineering, Design, Product." },
      { name: "experience_level", type: "string", description: "e.g. Senior, Mid-level." },
      { name: "years_of_experience", type: "string", description: "Free-text years of experience." },
      { name: "country", type: "string", description: "Country you're based in." },
      { name: "timezone", type: "string", description: "Your working timezone." },
      { name: "availability_status", type: "string", description: "e.g. open_to_work, not_looking." },
      { name: "employment_types", type: "string[]", description: "Contract shapes you'll consider." },
      { name: "notice_period_days", type: "integer", description: "Notice period in days." },
      { name: "skills", type: "string[]", description: "Skills to list on the profile." },
      { name: "languages", type: "string[]", description: "Languages you speak." },
      { name: "social_links", type: "object", description: "Map of platform to URL, e.g. { github: \"https://github.com/me\" }." },
    ],
    example: `Set my WorkWay headline to "Staff Backend Engineer" and add Postgres to my skills.`,
    sampleResponse: `Updated professional_title, skills. Your profile: https://workway.dev/p/rohit`,
  },
];

export const MCP_FAQS = [
  {
    question: "What is the WorkWay MCP server?",
    answer:
      "It is a Model Context Protocol server that exposes WorkWay's job search and account features as tools an AI assistant can call directly. Once connected, you can search openings, save roles, follow companies, and manage your talent profile from inside a conversation instead of switching to a browser tab.",
  },
  {
    question: "Which AI clients can connect to it?",
    answer:
      "Any MCP-compatible client. That includes Claude Desktop, Claude Code, and claude.ai, plus other assistants and agent frameworks that speak MCP. The server uses the Streamable HTTP transport, so it is added as a remote server URL rather than something installed locally.",
  },
  {
    question: "Do I need a paid plan to use it?",
    answer:
      "No. A free WorkWay account can generate an API key and use every tool, including saving jobs, following companies, and editing a talent profile. Pro only changes whether you receive an instant email when a company you follow posts a new role.",
  },
  {
    question: "How is my API key kept secure?",
    answer:
      "Keys are shown once at creation and only a SHA-256 hash is stored, so a database leak never yields a usable credential. Each key can carry an optional expiry, records its own usage count and last-used time, and can be revoked instantly from your dashboard.",
  },
  {
    question: "Does WorkWay handle my job application?",
    answer:
      "No, and that is deliberate. Every job result includes the untouched apply link to the company's own ATS posting. WorkWay never proxies an application or inserts its own form between you and the employer.",
  },
  {
    question: "Where does the job data come from?",
    answer:
      "Directly from the applicant tracking systems companies hire through — Greenhouse, Ashby, and Y Combinator's job board. Listings are refreshed daily, so results reflect what is actually live rather than a stale re-post from another aggregator.",
  },
];
