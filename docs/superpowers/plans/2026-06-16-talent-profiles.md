# Talent Profiles Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Full talent profile system — backend APIs, frontend dashboard form, public profile page, remove old Hire Me.

**Architecture:** New DAO + routes on Express backend. Next.js API proxy routes. Multi-step form at `/dashboard/seeker/talent-profile/`. SSR public page at `/profile/[username]/`.

**Tech Stack:** Express, PostgreSQL, Cloudflare R2, Next.js 16 App Router, NextAuth, shadcn/ui, Tailwind CSS 4.

---

### Task 1: SQL Schema (User runs manually)

**Output:** SQL statements for user to execute.

- [ ] **Step 1: Provide SQL**

```sql
-- Talent Profiles
CREATE TABLE talent_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(30) NOT NULL,
  previous_usernames JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'published',
  display_name VARCHAR(100),
  professional_title VARCHAR(200),
  category VARCHAR(100),
  experience_level VARCHAR(30),
  years_of_experience VARCHAR(10),
  about TEXT,
  country VARCHAR(100),
  timezone VARCHAR(50),
  availability_status VARCHAR(30) DEFAULT 'available',
  employment_types JSONB DEFAULT '[]'::jsonb,
  notice_period_days INT,
  available_from DATE,
  hourly_rate VARCHAR(20),
  annual_salary VARCHAR(20),
  compensation_visibility VARCHAR(20) DEFAULT 'public',
  skills JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '{}'::jsonb,
  avatar_url VARCHAR(500),
  resume_url VARCHAR(500),
  resume_filename VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_talent_profiles_username ON talent_profiles (LOWER(username));
CREATE INDEX idx_talent_profiles_status ON talent_profiles (status);
CREATE INDEX idx_talent_profiles_skills ON talent_profiles USING GIN (skills);

-- Experiences
CREATE TABLE talent_experiences (
  id SERIAL PRIMARY KEY,
  profile_id INT NOT NULL REFERENCES talent_profiles(id) ON DELETE CASCADE,
  company VARCHAR(200),
  role VARCHAR(200),
  employment_type VARCHAR(50),
  start_date VARCHAR(7),
  end_date VARCHAR(7),
  is_current BOOLEAN DEFAULT false,
  location VARCHAR(200),
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education
CREATE TABLE talent_education (
  id SERIAL PRIMARY KEY,
  profile_id INT NOT NULL REFERENCES talent_profiles(id) ON DELETE CASCADE,
  institution VARCHAR(200),
  degree VARCHAR(200),
  field_of_study VARCHAR(200),
  start_year INT,
  end_year INT,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  gpa VARCHAR(10),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certifications
CREATE TABLE talent_certifications (
  id SERIAL PRIMARY KEY,
  profile_id INT NOT NULL REFERENCES talent_profiles(id) ON DELETE CASCADE,
  name VARCHAR(200),
  organization VARCHAR(200),
  issue_date DATE,
  expiration_date DATE,
  credential_id VARCHAR(100),
  credential_url VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Task 2: Backend DAO

**Files:**
- Create: `WorkWay--BE/src/dao/talentProfilesDao.js`

- [ ] **Step 1: Create talentProfilesDao.js**

DAO with methods: `getByUserId`, `getByUsername`, `create`, `update`, `updateVisibility`, `checkUsername`, `search`, `getCategories`. Plus child CRUD: `addExperience`, `updateExperience`, `deleteExperience`, `getExperiences`, same for education and certifications.

---

### Task 3: Backend Routes

**Files:**
- Create: `WorkWay--BE/src/routes/talentProfiles.js`
- Modify: `WorkWay--BE/src/routes/index.js` (add `router.use('/talent-profiles', talentProfilesRoutes)`)

- [ ] **Step 1: Create routes file**

All routes from the spec: public GET `/:username`, GET `/search`, GET `/categories`. Auth: GET `/me`, POST `/`, PATCH `/`, PATCH `/visibility`, GET `/check-username/:username`. File uploads: POST `/avatar`, POST `/resume`, DELETE `/resume`. Nested CRUD for experiences, education, certifications.

- [ ] **Step 2: Register in index.js**

---

### Task 4: Backend R2 Upload for Avatar & Resume

**Files:**
- Modify: `WorkWay--BE/src/utils/helper.js` (add `uploadBufferToR2` for direct buffer uploads from multipart)

- [ ] **Step 1: Add uploadBufferToR2 function**

Similar to `imgUploadToR2Buffer` but accepts a Buffer + metadata directly (for multer file uploads) instead of fetching from URL.

---

### Task 5: Frontend API Proxy Routes

**Files:**
- Create: `workway-next/src/app/api/talent-profiles/route.ts` (GET me, POST create, PATCH update)
- Create: `workway-next/src/app/api/talent-profiles/visibility/route.ts`
- Create: `workway-next/src/app/api/talent-profiles/check-username/[username]/route.ts`
- Create: `workway-next/src/app/api/talent-profiles/avatar/route.ts`
- Create: `workway-next/src/app/api/talent-profiles/resume/route.ts`
- Create: `workway-next/src/app/api/talent-profiles/experiences/route.ts`
- Create: `workway-next/src/app/api/talent-profiles/experiences/[id]/route.ts`
- Create: `workway-next/src/app/api/talent-profiles/education/route.ts`
- Create: `workway-next/src/app/api/talent-profiles/education/[id]/route.ts`
- Create: `workway-next/src/app/api/talent-profiles/certifications/route.ts`
- Create: `workway-next/src/app/api/talent-profiles/certifications/[id]/route.ts`

- [ ] **Step 1: Create all proxy routes**

Follow existing pattern: `auth()` → check `session.user.dbId` → forward to backend with `user_id`.

---

### Task 6: Remove Old Hire Me Feature

**Files:**
- Delete: `workway-next/src/app/dashboard/seeker/hireme/` (entire directory)
- Delete: any `workway-next/src/app/api/hireme/` routes
- Modify: `workway-next/src/components/dashboard/Sidebar.tsx` (replace "Hire Me Profile" nav item with "Talent Profile")

- [ ] **Step 1: Delete hireme directory and API routes**
- [ ] **Step 2: Update sidebar nav**

---

### Task 7: Dashboard — Talent Profile Form

**Files:**
- Create: `workway-next/src/app/dashboard/seeker/talent-profile/page.tsx` (main page — shows form or existing profile)
- Create: `workway-next/src/app/dashboard/seeker/talent-profile/create/page.tsx` (multi-step form)
- Create: `workway-next/src/app/dashboard/seeker/talent-profile/constants.ts` (CATEGORIES, EXPERIENCE_LEVELS, etc.)

- [ ] **Step 1: Create constants file**
- [ ] **Step 2: Create multi-step form (10 steps)**
- [ ] **Step 3: Create profile view/manage page**

---

### Task 8: Public Profile Page

**Files:**
- Create: `workway-next/src/app/profile/[username]/page.tsx` (SSR public page with SEO)

- [ ] **Step 1: Create public profile page**

Server component that fetches profile from backend directly, renders hero + about + skills + experience + education + certifications + resume button. Includes metadata for SEO (title, description, OG, JSON-LD Person schema).

---

### Task 9: Integration & Polish

- [ ] **Step 1: Add "View Public Profile" link in dashboard when profile exists**
- [ ] **Step 2: Add talent profile link to seeker overview page**
- [ ] **Step 3: Commit all changes**
