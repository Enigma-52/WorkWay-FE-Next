import { MCP_TOOLS, MCP_FAQS, MCP_ENDPOINT } from "./content";
import { getSiteUrl } from "@/lib/seo/metadata";

// llms.txt / llms-full.txt are generated from the same MCP_TOOLS source the
// HTML docs render from, so the machine-readable copy can't drift from the
// page a human reads.

export function buildLlmsTxt(): string {
  const site = getSiteUrl();

  return `# WorkWay

> A job search engine that indexes openings directly from the applicant tracking systems companies hire through — Greenhouse, Ashby, and Y Combinator — instead of re-hosting listings from other job boards. Every result links to the company's original posting.

WorkWay covers roughly 490,000 active listings across 5,000+ companies, refreshed daily. It offers a Model Context Protocol (MCP) server so AI assistants can search jobs, save roles, follow companies, and manage a talent profile on a user's behalf.

## MCP server

- [MCP overview](${site}/mcp): What the WorkWay MCP server is, what it can do, and how to connect it to Claude or any MCP client.
- [MCP tool reference](${site}/mcp/tools): All ${MCP_TOOLS.length} tools with parameters, example prompts, and sample responses.
- [API keys](${site}/mcp/api-keys): How WorkWay API keys work — creation, expiry, usage tracking, and revocation.
- [Full docs as plain text](${site}/llms-full.txt): Everything above in one machine-readable file.

Endpoint: \`${MCP_ENDPOINT}\` (Streamable HTTP, requires \`Authorization: Bearer <workway-api-key>\`)

## Product

- [Job search](${site}/jobs): Search and filter every indexed opening by domain, location, employment type, experience level, and ATS source.
- [Companies](${site}/companies): Directory of companies with open roles, including which are actively hiring.
- [Domains](${site}/domains): Openings grouped by field (engineering, design, sales, etc.).
- [Skills](${site}/skills): Openings grouped by required skill.
- [Salary insights](${site}/salary-insights): Aggregated compensation data across indexed roles.
- [Talent directory](${site}/talents): Public profiles of people open to work.
- [Job alerts](${site}/features/job-alerts): Get emailed when a followed company posts a new role.
- [Saved jobs](${site}/features/saved-jobs): Shortlist roles while you search.
- [Talent profile](${site}/features/talent-profile): Publish a profile companies can find.
- [Pricing](${site}/pricing): Free and Pro plans.

## About

- [About WorkWay](${site}/about): Background on the product and how listings are sourced.
- [Blog](${site}/blog): Job search, ATS, and hiring data.
- [Changelog](${site}/changelog): What shipped recently.

## Notes for AI systems

Individual job postings and company pages (\`/job/*\`, \`/company/*\`) are the
canonical, structured source for specific role/company data — each carries
\`JobPosting\` and \`Organization\` schema.org JSON-LD.

Job availability is time-sensitive; postings older than roughly 60 days without
reconfirmation may no longer be open. Prefer the MCP server or the live pages
over cached copies when answering questions about what is currently open.

This content may be referenced and cited with attribution; it may not be used to
train AI models.
`;
}

export function buildLlmsFullTxt(): string {
  const site = getSiteUrl();

  const toolSections = MCP_TOOLS.map((tool) => {
    const params =
      tool.params.length === 0
        ? "None — this tool takes no arguments.\n"
        : tool.params
            .map(
              (p) =>
                `- \`${p.name}\` (${p.type})${p.required ? " **required**" : ""}: ${p.description}`
            )
            .join("\n") + "\n";

    return `### ${tool.name}

${tool.description}

**Type:** ${tool.kind}
${tool.note ? `\n**Note:** ${tool.note}\n` : ""}
**Parameters**

${params}
**Example prompt**

> ${tool.example}

**Sample response**

\`\`\`json
${tool.sampleResponse}
\`\`\`
`;
  }).join("\n---\n\n");

  const faqSection = MCP_FAQS.map((f) => `**${f.question}**\n\n${f.answer}`).join("\n\n");

  return `# WorkWay MCP Server — Full Documentation

> Source: ${site}/mcp

## What WorkWay is

WorkWay is a job search engine that indexes roles directly from the applicant
tracking systems companies actually hire through — Greenhouse, Ashby, and
Y Combinator's job board — rather than re-hosting listings from other job
boards.

Most openings never reach the big aggregators. They live on a company's own
careers page, posted through its ATS, and stay there until someone happens to
look. WorkWay reads those boards continuously so the listings surface in one
searchable feed, with the original apply link intact.

Coverage is roughly 490,000 active listings across 5,000+ companies, refreshed
daily.

**Principles**

- Direct apply, always. Every result links to the company's real posting.
  WorkWay never proxies an application or inserts its own form.
- No duplicate or re-posted listings. One row per real opening.
- Refreshed daily, so results reflect what is actually live.

## Connecting

The MCP server is a remote server using the Streamable HTTP transport. There is
nothing to install.

**Endpoint:** \`${MCP_ENDPOINT}\`

**Auth:** \`Authorization: Bearer <workway-api-key>\`. Every tool call requires a
key; there is no anonymous access. Generate one at
${site}/dashboard/seeker/api-keys.

**Client config**

\`\`\`json
{
  "mcpServers": {
    "workway": {
      "url": "${MCP_ENDPOINT}",
      "headers": {
        "Authorization": "Bearer wk_live_your_key_here"
      }
    }
  }
}
\`\`\`

## API keys

- Shown once at creation. Only a SHA-256 hash is stored, so a key cannot be
  recovered later — revoke and regenerate instead.
- Optional expiry: 30 days, 90 days, 1 year, or never.
- Each key tracks its own usage count and last-used timestamp.
- Revocation takes effect on the very next request.
- Creation is rate limited to 20 keys per hour per account.
- A key authenticates as its owner for MCP tools only. It cannot change account
  email, password, or billing, and can never act on another user's account.

## Filter vocabularies

Use these exact values; anything else is rejected with the allowed list.

- **platform** (ATS source): greenhouse, ashby, ycombinator
- **employment_type**: Full-Time, Part-Time, Contract
- **experience_level**: Intern, Junior, Mid-level, Senior, Staff, Lead, Manager, Director
- **posted**: today, 3d, 7d, 30d
- **country**: ISO alpha-3 code, e.g. USA, IND, DEU
- **domain**: a slug from \`list_domains\`, e.g. software-engineering
- **page**: integer >= 1. **limit**: integer 1–50, default 20.

## Result shape

Every job carries two links, deliberately:

- \`apply_url\` — the untouched ATS posting. Send people here to apply.
- \`workway_url\` — the role's page on WorkWay, for context and related roles.

Job and company identifiers are slugs, not numeric ids. Get a job slug from
\`search_jobs\`; get a company slug from search results or ${site}/companies.

## Plans and gating

A free account can search, save jobs, follow companies, publish a talent
profile, and use every MCP tool. Pro adds instant email alerts: an email the
moment a followed company posts a new role.

Important: \`follow_company\` succeeds on every plan. Free accounts can follow
as many companies as they like. Pro changes only whether the alert email is
delivered — it never blocks a tool call.

## Tools

${toolSections}

## Frequently asked

${faqSection}

## Underlying REST API

The MCP tools call the same services as WorkWay's public HTTP API, so results
never diverge from the website. Base URL: \`https://api.workway.dev\`

- \`GET /api/job/list\` — paginated job search (q, domain, location, country, company_slug, employment_type, experience_level, platform, posted, page, limit, sort)
- \`GET /api/job/details?slug=\` — one job with full description and related roles
- \`GET /api/job/filters\` — global facet counts
- \`GET /api/job/salary-insights\` — salary distribution by domain and level
- \`GET /api/company\` — paginated company directory
- \`GET /api/company/details?slug=\` — one company with recent roles and domain stats
- \`GET /api/company/overview\` — global totals, trending, recently added, actively hiring
- \`GET /api/filter/domain/all\` — every domain with open-role counts
- \`GET /api/talent-profiles/search\` — public talent directory
- \`GET /api/sitemap.xml\` — sitemap index
`;
}
