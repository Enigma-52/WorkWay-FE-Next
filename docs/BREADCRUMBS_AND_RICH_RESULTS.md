## Breadcrumbs & Rich Results Plan (WorkWay)

### 1. Goals

- **Improve UX navigation** with subtle, consistent breadcrumbs on all public, client-facing pages.
- **Enable Google Breadcrumb rich results** using `BreadcrumbList` structured data as per Google’s guidelines (`BreadcrumbList` + `ListItem` with `name`, `item`, `position`). See Google docs: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`.
- **Reinforce internal linking strategy** by making breadcrumbs part of the crawlable link graph, aligned with `INTERNAL_LINKING_STRATEGY.md`.

Primary templates in scope:

- `/` (homepage)
- `/jobs`
- `/job/[jobSlug]`
- `/companies`
- `/company/[companySlug]`
- `/domains`
- `/domain/[domainSlug]`
- `/skills`
- `/skill/[skillSlug]`
- `/about`
- `/hireme` (once content is SEO-ready)
- `/chat` (only if retained as an indexable SEO target)

---

### 2. Breadcrumb Information Architecture

#### 2.1 Canonical breadcrumb trails

- `/`  
  - `Home`

- `/jobs`  
  - `Home › Jobs`

- `/job/[jobSlug]`  
  - `Home › Jobs › [Job Title]`  
  - Example: `Home › Jobs › Senior Frontend Engineer`

- `/companies`  
  - `Home › Companies`

- `/company/[companySlug]`  
  - `Home › Companies › [Company Name]`

- `/domains`  
  - `Home › Domains`

- `/domain/[domainSlug]`  
  - `Home › Domains › [Domain Name]`

- `/skills`  
  - `Home › Skills`

- `/skill/[skillSlug]`  
  - `Home › Skills › [Skill Name]`

- `/about`  
  - `Home › About`

- `/hireme`  
  - `Home › Hire Me` (enable only when page becomes indexable)

- `/chat`  
  - `Home › Chat` (only if page is indexable; otherwise breadcrumbs can be UI-only or omitted)

Notes:

- Names are **human-readable**, not raw slugs (`Senior Frontend Engineer`, not `senior-frontend-engineer`).
- For dynamic routes, the last breadcrumb uses the runtime entity name from the API (job title, company name, domain label, skill label).
- We will start with **one canonical trail per page**; multiple alternative trails are not needed initially.

---

### 3. Shared Breadcrumb Model

#### 3.1 Types

- `BreadcrumbItem`:
  - `name: string` — label shown to users and in JSON-LD.
  - `href?: string` — path for all items except the current page; omitted or undefined for the last item.

#### 3.2 Utility: central breadcrumb builder

Add a server-safe utility (e.g. `src/lib/seo/breadcrumbs.ts`) that:

- Exposes helper functions such as:
  - `buildHomeBreadcrumb(): BreadcrumbItem[]`
  - `buildJobsBreadcrumb(): BreadcrumbItem[]`
  - `buildJobDetailBreadcrumb(jobTitle: string): BreadcrumbItem[]`
  - `buildCompaniesBreadcrumb(): BreadcrumbItem[]`
  - `buildCompanyDetailBreadcrumb(companyName: string): BreadcrumbItem[]`
  - `buildDomainsBreadcrumb(): BreadcrumbItem[]`
  - `buildDomainDetailBreadcrumb(domainName: string): BreadcrumbItem[]`
  - `buildSkillsBreadcrumb(): BreadcrumbItem[]`
  - `buildSkillDetailBreadcrumb(skillName: string): BreadcrumbItem[]`
  - `buildAboutBreadcrumb(): BreadcrumbItem[]`
  - `buildHireMeBreadcrumb(): BreadcrumbItem[]`
  - `buildChatBreadcrumb(): BreadcrumbItem[]` (if needed)
- Returns `BreadcrumbItem[]` arrays shaped as in section 2.

Rationale:

- Keeps breadcrumbs **DRY** and aligned across UI and JSON-LD.
- Makes it trivial to adjust naming/hierarchy later (e.g. if we decide `Jobs › Engineering › [Job]` for some categories).

---

### 4. Visual Breadcrumb Component

#### 4.1 Component design

Create `src/components/layout/Breadcrumbs.tsx`:

- Props: `items: BreadcrumbItem[]`.
- Renders:
  - `<nav aria-label="Breadcrumb">`
  - `<ol>` with `<li>` items in order.
  - Each non-final item:
    - `<Link href={href}>name</Link>`
    - Followed by a subtle separator (e.g. `›`).
  - Final item:
    - `<span aria-current="page">name</span>`.
- Styling:
  - Subtle, small text (e.g. `text-xs sm:text-sm text-muted-foreground`).
  - Lightweight separators, no heavy backgrounds or borders.
  - Place **below the navbar** and above the main page heading/content.

Guidelines:

- Use `next/link` for internal links.
- Ensure breadcrumbs are **SSR-visible** (no client-only rendering) so they contribute to internal linking and are crawlable.

---

### 5. Breadcrumb JSON-LD Generation

#### 5.1 JSON-LD builder

Extend `src/lib/seo/jsonld.ts` with:

- `buildBreadcrumbJsonLd(items: BreadcrumbItem[], siteUrl: string)`:
  - Returns:
    - `@context: "https://schema.org"`
    - `@type: "BreadcrumbList"`
    - `itemListElement`: array of `ListItem` objects:
      - `@type: "ListItem"`
      - `position`: 1-based index.
      - `name`: from `BreadcrumbItem.name`.
      - `item`: absolute URL:
        - For all items with `href`, use `${siteUrl}${href}`.
        - For the last item, we **omit `item`** so Google uses the page URL (per docs), or we may include it if we later prefer full explicitness; pick one convention and keep it consistent.

Example structure (for `/job/[jobSlug]`):

- `Home › Jobs › Senior Frontend Engineer` becomes:
  - `position 1`, `name: "Home"`, `item: "https://www.workway.dev/"`
  - `position 2`, `name: "Jobs"`, `item: "https://www.workway.dev/jobs"`
  - `position 3`, `name: "Senior Frontend Engineer"`, `item` omitted or set explicitly to the job URL.

#### 5.2 Rendering JSON-LD

- Reuse `src/components/seo/JsonLd.tsx`:
  - Pass the built `BreadcrumbList` data to `<JsonLd data={...} />` inside the corresponding page or layout.
- Ensure we reuse the same environment-aware `siteUrl` source used for other JSON-LD/metadata (see `SEO_UPGRADE.md` item 7) so URLs are correct across environments.

---

### 6. Integration by Route

#### 6.1 Homepage (`/`)

- UI:
  - Optionally **no breadcrumb** or a minimal single-item `Home` breadcrumb; breadcrumbs on homepage are not critical.
- JSON-LD:
  - Not required for homepage; rich results typically start one level down.
- Additional structured data:
  - Coordinate with `SEO_UPGRADE.md` to add `WebSite` + `SearchAction` here.

#### 6.2 `/jobs`

- UI:
  - Render `Breadcrumbs` with `buildJobsBreadcrumb()` under the navbar and above the main jobs heading.
- JSON-LD:
  - Build `BreadcrumbList` from the same items and inject via `<JsonLd />`.
- Behavior with filters/pagination:
  - Breadcrumb trail remains `Home › Jobs` even when query params are present.
  - Align canonical/robots logic with `SEO_UPGRADE.md` for `/jobs` filters.

#### 6.3 `/job/[jobSlug]`

- UI:
  - Use `buildJobDetailBreadcrumb(job.title)` after fetching job data.
  - Place breadcrumbs above the job title/H1.
- JSON-LD:
  - Build `BreadcrumbList` from breadcrumb items and inject JSON-LD.
  - Coexist with `JobPosting` structured data on the same page.

#### 6.4 `/companies` and `/company/[companySlug]`

- `/companies`:
  - `Home › Companies` UI + JSON-LD.
- `/company/[companySlug]`:
  - Use company name from API:
    - `Home › Companies › [Company Name]`.
  - Render breadcrumbs above the company heading.
  - Inject JSON-LD from same items.

#### 6.5 `/domains` and `/domain/[domainSlug]`

- `/domains`:
  - `Home › Domains` UI + JSON-LD.
- `/domain/[domainSlug]`:
  - Use domain name from API:
    - `Home › Domains › [Domain Name]`.
  - Integrate with existing domain-page SEO logic (canonical and ItemList).

#### 6.6 `/skills` and `/skill/[skillSlug]`

- `/skills`:
  - `Home › Skills` UI + JSON-LD.
- `/skill/[skillSlug]`:
  - `Home › Skills › [Skill Name]` once skill detail pages are stable and indexable.
  - Ensure internal links pointing to `/skills/*` are not broken (see `SEO_UPGRADE.md`).

#### 6.7 `/about`, `/hireme`, `/chat`

- `/about`:
  - `Home › About` UI + JSON-LD (about pages are often good SEO-supporting content).
- `/hireme`:
  - Only enable breadcrumb JSON-LD once the page is **indexable and conversion-ready**.
  - Until then, breadcrumbs can be UI-only or fully omitted; robots should remain `noindex,follow` per SEO guidance.
- `/chat`:
  - If we keep `noindex`, either omit JSON-LD or keep UI-only breadcrumbs.

---

### 7. Technical Implementation Notes

- Breadcrumb UI components must be **server components** or server-rendered where possible to ensure:
  - HTML links are visible to crawlers without JS execution.
  - Structured data is present in initial HTML.
- Use **absolute URLs** in JSON-LD `item` fields, based on environment-aware `siteUrl`.
- Keep breadcrumb names in sync with:
  - Page `<title>` and H1 where appropriate.
  - Entity names from the backend.
- Avoid keyword-stuffing:
  - Breadcrumb names should be short, descriptive labels, not long SEO texts.

---

### 8. Rollout Plan

1. **Infrastructure**
   - Add `BreadcrumbItem` type and `build*Breadcrumb` helpers in `src/lib/seo/breadcrumbs.ts`.
   - Add `buildBreadcrumbJsonLd` to `src/lib/seo/jsonld.ts`.
   - Implement `Breadcrumbs` UI component in `src/components/layout/Breadcrumbs.tsx`.
2. **Template Integration (Phase 1)**
   - Add breadcrumbs (UI + JSON-LD) to:
     - `/jobs`
     - `/job/[jobSlug]`
     - `/company/[companySlug]`
     - `/domain/[domainSlug]`
3. **Template Integration (Phase 2)**
   - Extend to:
     - `/companies`
     - `/domains`
     - `/skills`
     - `/skill/[skillSlug]`
     - `/about`
4. **Utility Pages**
   - Decide final SEO policy for `/chat` and `/hireme`:
     - If indexable: add breadcrumbs + JSON-LD.
     - If non-indexable: UI-only breadcrumbs or none.
5. **Validation**
   - Use Google Rich Results Test on representative URLs for each template.
   - Monitor the Breadcrumb report in Google Search Console:
     - Confirm an increasing number of valid items.
     - Fix any invalid or warning states quickly.
6. **Iteration**
   - Adjust breadcrumb names/hierarchy based on:
     - User behavior.
     - Search performance.
     - Future sections (e.g. guides/reports) that might warrant deeper breadcrumb paths.

---

### 9. QA Checklist for Breadcrumbs

- Each indexed template has:
  - Visible, subtle breadcrumb UI above primary content.
  - Matching `BreadcrumbList` JSON-LD using the same items.
- All `item` URLs in JSON-LD:
  - Are absolute URLs with the correct domain (`https://www.workway.dev` in production).
  - Match canonical URLs for those pages.
- Dynamic breadcrumb names (job, company, domain, skill) are:
  - Populated from real data.
  - Not empty or placeholder values.
- Breadcrumbs on filtered/listing states:
  - Continue to represent the canonical path (e.g. `Home › Jobs` despite filters).
- No breadcrumbs with:
  - Broken links.
  - Orphaned single-item trails where a two-item trail is expected (e.g. `/jobs` always has `Home › Jobs`).
