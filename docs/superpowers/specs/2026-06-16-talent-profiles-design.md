# Talent Profiles for Job Seekers — Design Spec

## Overview

New feature allowing authenticated users to create a professional public profile at `/profile/:username`. Profiles are visible publicly without auth. One profile per user. Replaces the unreleased "Hire Me" feature (to be removed).

## Key Decisions

- **Public URL**: `/profile/[username]` (not `/@username`) — avoids routing complexity
- **Username**: Auto-suggested from displayName, editable, 3-30 chars, letters/numbers/underscores, case-insensitive unique
- **Profile goes public immediately on creation** (status = published)
- **Uploads**: Reuse existing R2 infrastructure (`cdn.workway.dev`)
- **Scope**: Full spec — all sections in one implementation
- **Old Hire Me feature**: Remove entirely (never released)
- **SQL**: Provided to user for manual execution (no auto-migrations)

---

## Database Schema

### `talent_profiles`

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| user_id | INT | UNIQUE, FK → users(id) |
| username | VARCHAR(30) | UNIQUE, lowercase enforced |
| previous_usernames | JSONB | Array of old usernames for redirect support |
| status | VARCHAR(20) | draft / published / offline / suspended |
| display_name | VARCHAR(100) | |
| professional_title | VARCHAR(200) | Free text with dropdown suggestions |
| category | VARCHAR(100) | e.g. "Frontend Engineering" |
| experience_level | VARCHAR(30) | Entry-level / Mid-level / Senior / Staff / Principal |
| years_of_experience | VARCHAR(10) | e.g. "5+" |
| about | TEXT | Markdown (CommonMark), min 50 chars |
| country | VARCHAR(100) | |
| timezone | VARCHAR(50) | e.g. "Asia/Kolkata" |
| availability_status | VARCHAR(30) | available / open / not_available |
| employment_types | JSONB | e.g. ["Full-time", "Contract"] |
| notice_period_days | INT | Nullable |
| available_from | DATE | Nullable |
| hourly_rate | VARCHAR(20) | e.g. "$50" |
| annual_salary | VARCHAR(20) | e.g. "$100,000" |
| compensation_visibility | VARCHAR(20) | public / recruiters / hidden |
| skills | JSONB | Array of {name, slug} |
| languages | JSONB | Array of {language, proficiency} |
| social_links | JSONB | {email, website, github, linkedin, twitter} |
| avatar_url | VARCHAR(500) | R2 CDN URL |
| resume_url | VARCHAR(500) | R2 CDN URL |
| resume_filename | VARCHAR(255) | Original filename for display |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

**Indexes:**
- UNIQUE on `user_id`
- UNIQUE on `username` (case-insensitive via LOWER)
- Index on `status` for filtering published profiles
- GIN index on `skills` for search

### `talent_experiences`

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| profile_id | INT | FK → talent_profiles(id) ON DELETE CASCADE |
| company | VARCHAR(200) | |
| role | VARCHAR(200) | |
| employment_type | VARCHAR(50) | |
| start_date | VARCHAR(7) | YYYY-MM format |
| end_date | VARCHAR(7) | Nullable (null = current) |
| is_current | BOOLEAN | DEFAULT false |
| location | VARCHAR(200) | Optional |
| description | TEXT | Markdown supported |
| sort_order | INT | For manual ordering |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### `talent_education`

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| profile_id | INT | FK → talent_profiles(id) ON DELETE CASCADE |
| institution | VARCHAR(200) | |
| degree | VARCHAR(200) | |
| field_of_study | VARCHAR(200) | |
| start_year | INT | |
| end_year | INT | Nullable |
| is_current | BOOLEAN | DEFAULT false |
| description | TEXT | Optional |
| gpa | VARCHAR(10) | Optional |
| sort_order | INT | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### `talent_certifications`

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| profile_id | INT | FK → talent_profiles(id) ON DELETE CASCADE |
| name | VARCHAR(200) | |
| organization | VARCHAR(200) | |
| issue_date | DATE | |
| expiration_date | DATE | Nullable |
| credential_id | VARCHAR(100) | Optional |
| credential_url | VARCHAR(500) | Optional |
| sort_order | INT | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### Reserved Usernames

Block at application level: `admin`, `api`, `jobs`, `support`, `login`, `signup`, `dashboard`, `settings`, `profile`, `search`, `about`, `contact`, `help`, `terms`, `privacy`, `blog`, `null`, `undefined`.

---

## API Routes

### Backend (Express)

All routes under `/api/talent-profiles`. Authenticated routes receive `user_id` as query param from frontend proxy.

**Public:**

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/:username` | Get published profile with all nested data |
| GET | `/search` | Search/filter profiles (query params below) |
| GET | `/categories` | List available categories |

**Search query params:** `q` (keyword), `category`, `skills` (comma-separated), `experience_level`, `employment_type`, `country`, `availability`, `min_rate`, `max_rate`, `sort` (recent/new/experience/compensation/featured), `page`, `limit`.

**Authenticated:**

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/me` | Get own profile |
| POST | `/` | Create profile |
| PATCH | `/` | Update profile fields |
| PATCH | `/visibility` | Toggle status (published/offline/draft) |
| GET | `/check-username/:username` | Check availability |
| POST | `/avatar` | Upload avatar image |
| POST | `/resume` | Upload resume file |
| DELETE | `/resume` | Remove resume |
| POST | `/experiences` | Add experience entry |
| PATCH | `/experiences/:id` | Update experience |
| DELETE | `/experiences/:id` | Delete experience |
| POST | `/education` | Add education entry |
| PATCH | `/education/:id` | Update education |
| DELETE | `/education/:id` | Delete education |
| POST | `/certifications` | Add certification |
| PATCH | `/certifications/:id` | Update certification |
| DELETE | `/certifications/:id` | Delete certification |

### Frontend API Proxy (Next.js)

Routes at `app/api/talent-profiles/` mirror backend routes. Each adds `user_id` from `session.user.dbId` before forwarding to backend.

---

## Frontend Pages

### Dashboard: `/dashboard/seeker/talent-profile/`

Multi-step form for creating/editing a profile. 10 steps:

1. **Basics** — Username (auto-suggested from displayName), display name, professional title (dropdown + free text), category (dropdown), experience level (dropdown), years of experience
2. **About** — Markdown editor with character counter, 50-char minimum
3. **Availability** — Status (radio), employment types (multi-select checkboxes), notice period (number input), available from (date picker)
4. **Compensation** — Hourly rate, annual salary, visibility toggle (radio)
5. **Skills & Languages** — Skills: tag input with autocomplete. Languages: add rows with language name + proficiency dropdown
6. **Location** — Country (dropdown/searchable), timezone (dropdown)
7. **Social Links** — Email, website, GitHub URL, LinkedIn URL, X URL. Validated formats.
8. **Photo & Resume** — Avatar upload (PNG/JPG/WebP, max 5MB). Resume upload (PDF/DOC/DOCX, max 2MB).
9. **Experience** — Add/edit/remove entries. Each: company, role, type, dates, current toggle, location, description.
10. **Education & Certifications** — Two sub-sections. Education: institution, degree, field, years, current, description, GPA. Certifications: name, org, dates, credential ID/URL.

**Dashboard view** (when profile exists): Edit profile, preview public page, copy profile URL, toggle visibility, resume management, last updated timestamp.

### Public Profile: `/profile/[username]/page.tsx`

Server-rendered page. Sections:

**Hero:**
- Avatar (or fallback icon)
- Display name, professional title
- Country + timezone with dynamically calculated local time
- Availability badge (color-coded)
- Compensation (if visibility allows)
- Member since date, last active
- Action buttons: Share, Download Resume, Copy URL

**About:** Rendered markdown (sanitized).

**Skills:** Tag chips. **Languages:** Name + proficiency badge.

**Experience:** Vertical timeline, most recent first. Markdown descriptions rendered.

**Education:** Timeline layout similar to experience.

**Certifications:** Card grid with credential links.

**Resume:** "View Resume" button → modal with PDF preview + download option.

**SEO:**
- Title: `{displayName} - {professionalTitle} | Workway`
- Meta description: Truncated about text
- Open Graph: title, description, avatar image
- JSON-LD: Person schema

---

## File Uploads

Reuse existing R2 infrastructure (`imgUploadToR2Buffer()`).

**Avatar:** Stored at `talent-profiles/avatars/{user_id}-{timestamp}.{ext}`. Validated: PNG/JPG/WebP, max 5MB.

**Resume:** Stored at `talent-profiles/resumes/{user_id}-{timestamp}.{ext}`. Validated: PDF/DOC/DOCX, max 2MB, MIME type check.

---

## Cleanup: Remove Old Hire Me Feature

Delete all files under `app/dashboard/seeker/hireme/` and any related components, API routes, or imports. The feature was never released to main branch.

---

## Validation Rules

| Field | Rule |
|-------|------|
| username | 3-30 chars, `^[a-zA-Z0-9_]+$`, unique (case-insensitive), not reserved |
| about | Min 50 characters |
| avatar | PNG/JPG/WebP, max 5MB |
| resume | PDF/DOC/DOCX, max 2MB |
| social links | Valid URL format for github/linkedin/website/twitter |
| email | Valid email format |
| hourly_rate / annual_salary | Optional, free text with $ prefix |

---

## Out of Scope (Future)

- Profile analytics / view counts
- Endorsements
- Featured candidates (admin)
- Application tracking from profile
- Autosave drafts (keep simple — save on explicit action)
- Previous username redirects (store `previous_usernames` but don't implement redirect middleware yet)
- Offline profiles accessible via direct link (treat offline same as draft for now — not publicly visible)
