import Link from "next/link";
import {
  ArrowRight,
  Check,
  Download,
  Eye,
  FileText,
  Link2,
  Mail,
} from "lucide-react";

const features = [
  {
    title: "One public URL",
    desc: "workway.dev/p/your-name. Send it in a DM, put it in a bio, paste it in an application.",
  },
  {
    title: "Labeled, not a wall of text",
    desc: "Experience, education, certifications, languages, availability — each with its own heading.",
  },
  {
    title: "Resume readable in place",
    desc: "Your PDF previews inside the page. A recruiter never has to download anything.",
  },
  {
    title: "Availability and rate up front",
    desc: "Notice period, employment types, salary expectation — shown only if you make them public.",
  },
  {
    title: "AI polish, your final word",
    desc: "AI tightens the writing. Nothing publishes until you approve it.",
  },
];

const glance = [
  { k: "Category", v: "Engineering" },
  { k: "Seniority", v: "Mid-level" },
  { k: "Experience", v: "5 yrs" },
  { k: "Available", v: "30-day notice" },
  { k: "Annual", v: "₹15,00,000" },
];

const HireMeProfiles = () => {
  return (
    <section className="relative py-32 noise">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] gap-16 lg:gap-20 items-start">
          {/* Copy */}
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
              Talent Profiles
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-gradient leading-[1.05]">
              Your resume, but online{" "}
              <span className="italic text-brand-gradient">and not ugly.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Every user gets a public Talent Profile. A recruiter opens it and
              understands you in 30 seconds — no PDF download, no scrolling
              past a header image to find your last job.
            </p>

            <ul className="mt-8 space-y-5">
              {features.map((f) => (
                <li key={f.title} className="flex gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-brand/15 grid place-items-center shrink-0">
                    <Check className="w-3 h-3 text-brand" />
                  </span>
                  <div>
                    <div className="text-sm font-medium">{f.title}</div>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard/seeker/talent-profile"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-brand text-brand-foreground hover:bg-brand-glow transition-all px-6 py-3 font-medium shadow-glow"
            >
              Build your profile
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Profile preview — mirrors the real /p/[username] layout */}
          <div className="relative" aria-hidden>
            <div className="absolute -inset-8 bg-brand/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-elevated shadow-elevated overflow-hidden">
              {/* URL bar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-surface-elevated/60">
                <Link2 className="w-3.5 h-3.5 text-brand shrink-0" />
                <span className="text-xs font-mono text-muted-foreground truncate">
                  workway.dev/p/<span className="text-foreground">alex-chen</span>
                </span>
              </div>

              <div className="p-6 sm:p-7">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-brand-glow grid place-items-center font-display text-2xl text-brand-foreground shrink-0">
                    AC
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-2xl">Alex Chen</span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-success" />
                        Open to work
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Full-Stack Engineer
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono text-muted-foreground">
                      {["Engineering", "Mid-level", "5 yrs", "India", "Full-time"].map(
                        (f, i) => (
                          <span key={f} className="flex items-center gap-2">
                            {i > 0 && <span className="text-border">/</span>}
                            {f}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid lg:grid-cols-[minmax(0,1fr)_11rem] gap-6">
                  {/* Main column */}
                  <div className="space-y-6 min-w-0">
                    <div>
                      <div className="font-display text-base mb-2">Skills</div>
                      <div className="flex flex-wrap gap-1.5">
                        {["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"].map(
                          (s) => (
                            <span
                              key={s}
                              className="text-xs font-mono px-2.5 py-1 rounded-md bg-secondary border border-border/60 text-foreground/80"
                            >
                              {s}
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="font-display text-base mb-3">Experience</div>
                      <ol className="relative ml-[7px] border-l border-border">
                        {[
                          {
                            role: "Backend Engineer",
                            org: "Acme Corp",
                            when: "Mar 2023 — Present",
                            current: true,
                          },
                          {
                            role: "Software Engineer",
                            org: "Northwind",
                            when: "Jul 2021 — Feb 2023",
                            current: false,
                          },
                        ].map((e) => (
                          <li key={e.role} className="relative pb-5 pl-6 last:pb-0">
                            <span
                              className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 ${
                                e.current
                                  ? "border-brand bg-brand"
                                  : "border-border bg-surface"
                              }`}
                            />
                            <div className="text-sm font-medium leading-tight">
                              {e.role}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {e.org}
                            </div>
                            <div className="mt-0.5 text-[11px] font-mono text-muted-foreground">
                              {e.when}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Resume card */}
                    <div>
                      <div className="font-display text-base mb-2">Resume</div>
                      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-3.5 py-3">
                        <FileText className="w-4 h-4 text-brand shrink-0" />
                        <span className="text-xs font-mono text-muted-foreground truncate flex-1">
                          alex-chen-resume.pdf
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md bg-brand/15 text-brand border border-brand/20">
                          <Eye className="w-3 h-3" />
                          Preview
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md border border-border text-muted-foreground">
                          <Download className="w-3 h-3" />
                          Download
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rail */}
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border bg-surface/60 p-3.5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand mb-2">
                        At a glance
                      </div>
                      <dl>
                        {glance.map((g) => (
                          <div
                            key={g.k}
                            className="flex items-baseline justify-between gap-2 border-b border-border/60 py-1.5 last:border-b-0"
                          >
                            <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground shrink-0">
                              {g.k}
                            </dt>
                            <dd className="text-[11px] text-right truncate">
                              {g.v}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className="rounded-xl border border-border bg-surface/60 p-3.5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand mb-2">
                        Contact
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Mail className="w-3 h-3 text-brand shrink-0" />
                        <span className="truncate">alex@chen.dev</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HireMeProfiles;
