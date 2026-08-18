export type BlogFaq = { question: string; answer: string };

export type BlogSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogRelatedLink = { label: string; href: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string; // ISO date
  updatedAt: string; // ISO date
  author: string;
  intro: string;
  sections: BlogSection[];
  relatedLinks: BlogRelatedLink[];
  faq: BlogFaq[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-ats-systems-actually-work",
    title: "How ATS Systems Actually Work (And Why Your Application Disappears)",
    description:
      "A plain explanation of how applicant tracking systems like Greenhouse, Lever, and Ashby handle your application, and why it can feel like it vanishes into a black hole.",
    keywords: [
      "how ats systems work",
      "applicant tracking system explained",
      "why job applications disappear",
      "greenhouse lever ashby explained",
      "ats resume screening",
    ],
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-19",
    author: "WorkWay Team",
    intro:
      "You apply to a role, the confirmation page loads, and then nothing happens for weeks. No rejection, no interview request, not even an automated \"we received your application\" beyond the first one. This isn't usually a company ignoring you on purpose — it's what actually happens on the other side of an applicant tracking system, and understanding the mechanics changes how you should think about applying in the first place.",
    sections: [
      {
        heading: "The ATS is a database, not a decision-maker",
        paragraphs: [
          "An applicant tracking system like Greenhouse, Lever, Ashby, or Workable is, at its core, a database with a form attached to the front of it. When you submit an application, it doesn't get read by a person in real time — it gets stored as a row in a table alongside your resume file, your answers to any screening questions, and metadata like the exact time you applied and which job posting URL you came from. A recruiter or hiring manager logs into that same system later, usually once every few days for an active role, and reviews whichever applications the system has queued up for them. The silence you experience in the meantime isn't a signal about your candidacy one way or another — it's just the normal gap between when data gets stored and when a human next opens the dashboard.",
          "This is also why applying earlier in a posting's life tends to matter more than people expect. Recruiters often start reviewing applications before a role formally closes, and many work roughly in the order applications arrived, especially for high-volume roles where the difference between candidate 40 and candidate 400 in the queue is real. Applying on day one of a posting going live doesn't guarantee anything, but it does mean your application sits nearer the top of a list a person will actually scroll through, rather than buried under a few hundred more that arrived after you.",
        ],
      },
      {
        heading: "Where automated screening actually happens",
        paragraphs: [
          "Some rejection does happen without a human ever looking at your resume, but it's narrower than the popular idea of an all-powerful \"resume-scanning AI\" that filters out anyone who didn't use the right keywords. Most ATS platforms support simple rule-based screening questions — a yes/no gate on work authorization, a minimum years-of-experience field, or a required certification — and an automatic rejection usually comes from failing one of those explicit, visible gates, not from an opaque scoring algorithm reading your resume text. If you filled out every screening question honestly and still got an instant rejection, it's worth reading the question list again; the gate that filtered you out is usually sitting right there in the application form you already submitted.",
          "Where keyword matching does play a role is in how a recruiter searches the ATS's internal database once they're triaging a large applicant pool — not before you're stored, but after, when they're the ones typing search terms to shortlist candidates. This is a reasonable argument for making sure your resume actually contains the specific skill names and job titles relevant to the role in plain text, not because a bot is silently judging you on submission, but because a real person may later search for exactly those terms.",
        ],
      },
      {
        heading: "Why the direct apply link matters more than it seems",
        paragraphs: [
          "One detail that matters more than it looks like it should: applying through the company's own ATS-hosted posting, rather than through a re-post on a third-party job board, means your application lands in the same system the hiring team is actually using, tagged with that company's own internal metadata for the role. A re-posted listing that routes through a generic \"apply now\" redirect can sometimes land your application in a different or delayed pipeline, or simply point at a stale version of the posting that's already been filled. This is the specific reason WorkWay always links straight through to a company's own Greenhouse, Lever, or Ashby posting instead of hosting a copy of the application itself — the goal is to get you into the same queue the recruiter is actually working from, not a parallel one.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Find any company's ATS with the ATS Finder tool", href: "/tools/ats-finder" },
      { label: "Browse open roles by domain", href: "/domains" },
      { label: "WorkWay vs manually checking Greenhouse job boards", href: "/guides/workway-vs-greenhouse-job-boards" },
    ],
    faq: [
      {
        question: "Does every company use the same ATS?",
        answer:
          "No. Greenhouse, Lever, Ashby, and Workable are the most common systems among tech companies, but the specific one varies by company, and each has a different application form layout. You can look up which one a specific company uses with the ATS Finder tool.",
      },
      {
        question: "Should I apply again if I don't hear back?",
        answer:
          "Generally no, for the same role — most systems flag duplicate applications, and re-applying doesn't move you up the queue. It's more useful to apply to a different open role at the same company if one exists, or follow the company on WorkWay so you see their next posting the moment it goes live.",
      },
    ],
  },
  {
    slug: "complete-guide-backend-engineering-jobs",
    title: "The Complete Guide to Landing a Backend Engineering Job",
    description:
      "What backend engineering roles actually ask for, how to read a job posting's real requirements versus its wish list, and how to find current openings across companies hiring right now.",
    keywords: [
      "backend engineering jobs",
      "backend developer job search",
      "how to get a backend engineering job",
      "backend engineer interview",
      "backend jobs 2026",
    ],
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-19",
    author: "WorkWay Team",
    intro:
      "Backend engineering postings tend to list a long, intimidating stack of technologies — a specific language, a specific framework, two or three cloud services, a message queue, sometimes a specific database engine by name — and it's easy to read that list as a strict checklist you need to fully match before applying. In practice, most of that list is a description of the team's current stack, not a hard requirement that you've personally shipped production code in every item on it, and knowing which parts are actually load-bearing changes how you should approach both your application and your prep.",
    sections: [
      {
        heading: "Reading a backend posting for what actually matters",
        paragraphs: [
          "The core, genuinely load-bearing skill in almost every backend role is the same regardless of which specific language or framework the team happens to use: can you design a service that handles data correctly under concurrent load, reason about what happens when a downstream dependency fails, and write code that someone else on the team can read and modify safely. A posting that lists Go, Python, and Java as \"nice to have\" alongside a required \"3+ years backend experience\" is usually really asking whether you've done that kind of work in any one of those languages, not all three. The language-specific requirements matter far more for teams hiring for a very small, specialized stack — for example, a company built entirely on Elixir or Rust genuinely does need people who've worked in that ecosystem, because the ramp-up cost of picking up an unfamiliar systems language on the job is real. For the far more common case of a team running a mainstream stack like Node.js, Python/Django, or Java/Spring, prior experience in a similar-enough language is usually treated as close enough to apply.",
          "Where backend roles do differentiate hard is around data: how comfortable you are designing a schema, writing queries that scale past a toy dataset, and understanding the tradeoffs between a relational database and something like a key-value store or a document store for a specific access pattern. This shows up constantly in interviews as a system-design question, and it's worth practicing regardless of which specific database technology a target company uses, because the underlying reasoning — normalization, indexing, when to denormalize for read performance — transfers across almost every relational engine.",
        ],
      },
      {
        heading: "What companies are actually evaluating in interviews",
        paragraphs: [
          "Most backend interview loops at growth-stage and larger companies converge on a similar shape: a coding round testing whether you can implement something correct and reasonably efficient under time pressure, a system-design round testing whether you can reason about a larger service at a whiteboard level, and a set of behavioral rounds checking how you've handled ambiguity, disagreement, and ownership on past projects. The system-design round is the one candidates most often under-prepare for relative to how much weight it carries, because it's the round that most directly tests whether you can operate at the level the role actually requires day to day — writing a function correctly is necessary but far from sufficient for a backend role that also expects you to make defensible architectural calls.",
        ],
      },
      {
        heading: "Where to actually find current backend openings",
        paragraphs: [
          "The practical bottleneck for most backend job searches isn't skill — it's visibility into which companies have an open, currently-live backend role right now, since postings get taken down the moment a role fills and general search results often surface listings that closed weeks ago. WorkWay tracks backend roles directly from company career pages across Greenhouse, Lever, and Ashby, updated daily, so the listings on the backend jobs page reflect what's actually open today rather than a stale index.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Browse open backend engineering roles", href: "/domain/backend" },
      { label: "See senior-level backend and other roles", href: "/senior-jobs" },
      { label: "Backend internships currently open", href: "/internships" },
    ],
    faq: [
      {
        question: "Do I need to know every technology listed in a backend job posting?",
        answer:
          "No. Most postings list the team's current stack as context, not a strict checklist. The core transferable skills — data modeling, handling concurrency correctly, and reasoning about failure modes — matter more than having shipped production code in every specific tool named.",
      },
      {
        question: "How do I find backend roles that are actually still open?",
        answer:
          "Search a live, company-sourced feed rather than a general search engine result, since postings come down as soon as they're filled. The backend domain page on WorkWay pulls directly from company career pages and updates daily.",
      },
    ],
  },
  {
    slug: "what-are-ghost-jobs",
    title: "What Ghost Jobs Are and How to Avoid Wasting Time on Them",
    description:
      "Ghost jobs are postings left live long after a role has been filled or was never really open. Here's what causes them, how to spot the warning signs, and how to spend less time applying to roles that don't exist.",
    keywords: [
      "ghost jobs",
      "fake job postings",
      "job posting still open",
      "why do job postings stay up",
      "avoid ghost job listings",
    ],
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-19",
    author: "WorkWay Team",
    intro:
      "A \"ghost job\" is a posting that stays live on a company's careers page well after the role has already been filled, put on hold, or in some cases was never seriously intended to be filled at all. It's become a common enough complaint that it's worth understanding why it happens, because the reasons change how you should read a posting's age and treat radio silence after applying.",
    sections: [
      {
        heading: "Why companies leave old postings up",
        paragraphs: [
          "The most common cause isn't malicious — it's operational neglect. Taking a job posting down is a manual step that a hiring manager or recruiter has to remember to do once a role is filled, and in a busy hiring cycle across many open roles, it's an easy step to forget, especially for a role that took months to fill and was posted so long ago that it's no longer top of mind. A second common cause is pipeline-building: some companies, particularly for consistently high-volume roles like sales or support, keep a posting open continuously to build a pool of candidates for the next time a seat opens, even when there's no specific active opening right now. A third, less common but real cause is using an open posting as a signal of growth to investors, customers, or the market, without a strong intent to hire against it on any particular timeline.",
          "None of these are things you can distinguish from the outside just by reading the posting text, which is exactly the frustration — a genuinely open, urgent role and a forgotten or aspirational one look identical on the page.",
        ],
      },
      {
        heading: "Signals worth checking before you invest time",
        paragraphs: [
          "The single most useful signal is how long a posting has been live relative to how quickly that type of role typically fills — a senior, narrowly-scoped role sitting open for four months is a much weaker signal of neglect than a generic entry-level posting sitting open for the same length of time, since senior searches genuinely take longer. A second useful signal is whether the same role has been re-posted multiple times with the same or a near-identical description; a role that's been effectively continuously posted for the better part of a year, under a fresh-looking date each time, is more likely a pipeline-building or aspirational listing than an urgent, specific opening. A third signal, when it's available, is whether the posting is tracked as consistently present across multiple recent snapshots of the same company's career page versus a listing that recently appeared for the first time.",
          "None of this means you shouldn't apply to an older posting — it might still be genuinely open — but it's reasonable to weight your time toward more recently posted roles when you're deciding where to focus a limited number of applications, and to not read a lack of response to an old posting as a reflection of your candidacy.",
        ],
      },
      {
        heading: "How WorkWay's freshness tracking fits in",
        paragraphs: [
          "Because WorkWay pulls job data directly from company career pages on a daily cycle rather than indexing a snapshot once and leaving it, listings on WorkWay reflect what's actually currently present on the company's own page, and postings that get taken down there stop showing up here too. This doesn't eliminate the pipeline-building or aspirational-posting cases described above, since those stay genuinely live on the company's own site, but it does remove the more common failure mode of a third-party board surfacing a listing the company itself already deleted weeks or months ago.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Browse currently live roles by domain", href: "/domains" },
      { label: "How ATS systems handle your application", href: "/blog/how-ats-systems-actually-work" },
      { label: "Find a company's real careers page", href: "/tools/ats-finder" },
    ],
    faq: [
      {
        question: "Are ghost jobs illegal?",
        answer:
          "No, leaving a posting live isn't illegal on its own — it's an operational and transparency problem, not a legal one, though it does waste candidates' time.",
      },
      {
        question: "How can I tell if a specific posting is a ghost job?",
        answer:
          "There's no single certain signal, but a posting that's unusually old for its seniority level, has been re-posted repeatedly with identical wording, or comes from a company with a pattern of long-standing generic openings is more likely to be one. When in doubt, applying costs little beyond time, so it's a matter of prioritization rather than avoidance.",
      },
    ],
  },
  {
    slug: "finding-remote-software-engineering-jobs",
    title: "Finding Remote Software Engineering Jobs That Are Actually Open",
    description:
      "Remote listings go stale faster than on-site ones and get flooded with applicants the moment they're posted. Here's how to actually find current, open remote engineering roles instead of a wall of dead links.",
    keywords: [
      "remote software engineering jobs",
      "remote developer jobs",
      "find remote tech jobs",
      "remote engineering roles",
      "work from home software jobs",
    ],
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-19",
    author: "WorkWay Team",
    intro:
      "Remote roles behave differently from on-site roles in ways that matter for how you search for them. A remote posting is visible and applicable from anywhere in the world, which means it draws a larger applicant pool relative to an equivalent on-site role in a single city, and it also tends to get filled and taken down faster once a strong candidate pool has come in. Both of those facts push in the same direction: the cost of applying to a stale remote listing is higher than for an on-site one, because you're competing against a global pool for a role that may already be closed.",
    sections: [
      {
        heading: "Why remote listings go stale faster",
        paragraphs: [
          "An on-site role posted for a specific office has a naturally bounded applicant pool — people who live in or are willing to relocate to that city — which slows down how quickly a hiring manager accumulates enough strong applicants to close the search. A remote role has no such geographic bound, so the same posting can accumulate a comparable applicant pool in a fraction of the time. This is part of why remote postings that circulate for months on general job boards are disproportionately likely to be either genuinely difficult, narrowly-scoped searches or postings the company simply forgot to take down — the ordinary case of a well-defined mid-level remote role usually doesn't stay open nearly that long.",
          "The practical takeaway is that recency matters more for remote roles than for on-site ones when you're deciding where to spend your limited application time. A remote posting that went up in the last few days is a meaningfully stronger signal of \"this is actually still being actively worked\" than the same posting age would be for an on-site role in a smaller market.",
        ],
      },
      {
        heading: "The specific problem with remote listings on general job boards",
        paragraphs: [
          "General job boards typically re-index listings on their own schedule rather than pulling live from the company's own career page, which means the gap between a remote role actually closing and that closure showing up on a third-party board can run into weeks. Because remote roles close faster than on-site ones on average, this indexing lag disproportionately hurts remote job seekers specifically — you're more likely to click through to a remote listing that's already gone than an equivalent on-site one, purely because of how much faster the underlying posting turned over in the time since the board last refreshed it.",
          "WorkWay pulls job data directly from Greenhouse, Lever, and Ashby on a daily cycle, which narrows that gap considerably for remote roles specifically, since a listing that comes down on the company's own career page also disappears from WorkWay within the same refresh cycle rather than lingering for weeks on a stale index.",
        ],
      },
      {
        heading: "What to actually filter for",
        paragraphs: [
          "\"Remote\" as a label covers a wide range of actual arrangements — fully distributed teams with no location restriction at all, teams that require you to be within a specific country for tax and legal reasons, and teams that are only remote-friendly within commuting distance of a hub city for occasional in-person meetings. Reading the actual location field on a posting rather than just the word \"remote\" in the title avoids the common frustration of applying to a role that turns out to require, for example, US work authorization or residency in a specific country you don't live in. Filtering by domain in addition to remote status also matters more here than for on-site search, since a broad \"remote jobs\" search returns a mix of engineering, sales, support, and design roles that a location-only search for a single city wouldn't.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Browse remote-friendly software engineer roles", href: "/software-engineer-jobs-in-remote" },
      { label: "Browse backend engineering jobs", href: "/domain/backend" },
      { label: "How ATS systems handle your application", href: "/blog/how-ats-systems-actually-work" },
    ],
    faq: [
      {
        question: "Are all remote job postings actually fully remote?",
        answer:
          "No — \"remote\" can mean fully distributed, remote within a specific country, or remote within commuting distance of a hub office. Always check the actual location requirement on the posting itself, not just the word in the title.",
      },
      {
        question: "Should I apply to older remote postings?",
        answer:
          "It's not disqualifying, but recency matters more for remote roles than on-site ones, since remote postings tend to accumulate a large applicant pool and close faster. Prioritize your time toward recently posted remote roles when you have to choose.",
      },
    ],
  },
  {
    slug: "contract-vs-full-time-tech-roles",
    title: "Contract vs Full-Time Tech Roles: What Actually Changes",
    description:
      "Contract and full-time postings for the same kind of engineering work can look nearly identical on the surface. Here's what actually differs in scope, pace, and what companies are looking for in each.",
    keywords: [
      "contract vs full time jobs",
      "contract engineering roles",
      "should i take a contract job",
      "freelance vs full time developer",
      "contract to hire tech jobs",
    ],
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-19",
    author: "WorkWay Team",
    intro:
      "A contract engineering posting and a full-time posting for the same kind of role often use nearly identical language for the actual day-to-day work — same tech stack, same seniority level, sometimes even the same team. What differs isn't usually the work itself, but the scope of what a company is hiring for and how quickly they need someone productive, and understanding that difference changes both how you should read a contract posting and how you should present yourself if you apply to one.",
    sections: [
      {
        heading: "Why companies open a contract role instead of a full-time one",
        paragraphs: [
          "A contract opening most often signals one of three things: a fixed-scope project with a known end date that doesn't justify a permanent headcount, a hiring freeze on full-time seats that still leaves room for contractor budget, or a \"contract-to-hire\" arrangement where the company wants to evaluate fit before committing to a permanent offer. Each of these has a different implication for you as a candidate — a fixed-scope project wants someone who can ramp up fast and deliver against a specific, often narrower task list; a hiring-freeze contract role often does the same work as a full-time seat but without the same job security; and a contract-to-hire role is worth treating as an extended interview, since performance during the contract period usually determines whether a full-time offer follows.",
          "This is worth reading directly from the posting or asking about directly in a screening call, because the three cases call for different things from you as a candidate. A fixed-scope contract rewards someone who can be productive from day one with minimal ramp-up, which is worth emphasizing if you have direct, closely-matching experience with the exact stack or problem domain named in the posting. A contract-to-hire role rewards the same signals a full-time application would, since it's effectively a full-time search with an extra evaluation step in front of it.",
        ],
      },
      {
        heading: "What genuinely changes about the day-to-day work",
        paragraphs: [
          "Contract engineers are more often brought in against a specific, scoped deliverable rather than an open-ended set of team responsibilities, which in practice means less time spent in the kind of cross-team coordination and long-range planning that full-time engineers on the same team are doing, and more time spent heads-down on the specific thing the contract was opened for. This isn't universal — a contract-to-hire role especially tends to blur back toward normal full-time responsibilities fairly quickly — but it's a real and common enough pattern that it's worth asking directly what the actual scope of work looks like day to day before accepting a contract offer, since the answer varies more between individual roles than the posting title alone tells you.",
        ],
      },
      {
        heading: "Finding contract roles that are actually current",
        paragraphs: [
          "Contract postings are tagged by employment type directly on the ATS a company uses — Greenhouse, Lever, or Ashby — the same way full-time and part-time roles are, and WorkWay's contract jobs page pulls specifically from that tag rather than trying to infer contract status from posting text, which avoids the false positives that come from a full-time posting merely mentioning contract work is negotiable somewhere in its description.",
        ],
      },
    ],
    relatedLinks: [
      { label: "Browse open contract roles", href: "/contract-jobs" },
      { label: "Browse senior-level roles", href: "/senior-jobs" },
      { label: "How ATS systems handle your application", href: "/blog/how-ats-systems-actually-work" },
    ],
    faq: [
      {
        question: "Is a contract-to-hire role worth taking over a full-time offer?",
        answer:
          "It depends on what other offers are available, but a contract-to-hire role is worth treating as a real hiring process with an extended evaluation window, not a lesser opportunity — performance during the contract period is usually the deciding factor for a full-time offer afterward.",
      },
      {
        question: "Do contract roles pay differently than full-time roles for the same work?",
        answer:
          "Compensation structures for contract work commonly differ from full-time salary and benefits packages, and the specifics vary by company and contract type — it's worth clarifying the full compensation structure, including any benefits gap, directly with the recruiter before accepting.",
      },
    ],
  },
];

export const ALL_BLOG_SLUGS: string[] = BLOG_POSTS.map((p) => p.slug);

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
