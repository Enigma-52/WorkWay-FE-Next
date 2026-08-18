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
];

export const ALL_BLOG_SLUGS: string[] = BLOG_POSTS.map((p) => p.slug);

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
