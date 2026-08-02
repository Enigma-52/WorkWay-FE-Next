import Link from "next/link";
import { ArrowRight } from "lucide-react";

const sources = [
  {
    name: "Greenhouse",
    domain: "job-boards.greenhouse.io",
    note: "Where most funded startups and mid-size tech companies post first.",
  },
  {
    name: "Lever",
    domain: "jobs.lever.co",
    note: "Common at Series A–C companies. Roles often never leave this board.",
  },
  {
    name: "Ashby",
    domain: "jobs.ashbyhq.com",
    note: "The newer default for fast-moving startups hiring engineers.",
  },
  {
    name: "Y Combinator",
    domain: "workatastartup.com",
    note: "YC portfolio roles, including batches still hiring their first hires.",
  },
];

const SourcesSection = () => {
  return (
    <section className="relative py-32 noise">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
            What we track
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-gradient leading-[1.05]">
            We read the boards{" "}
            <span className="italic text-brand-gradient">so you don&apos;t.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            WorkWay crawls the applicant tracking systems companies actually
            hire through, then puts every role in one searchable feed — with the
            original apply link intact.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-surface/60 backdrop-blur shadow-elevated overflow-hidden">
          {sources.map((s) => (
            <div
              key={s.name}
              className="group grid sm:grid-cols-[minmax(0,15rem)_1fr] gap-1 sm:gap-6 px-6 sm:px-8 py-6 border-b border-border last:border-b-0 hover:bg-surface-elevated/60 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-success shrink-0"
                    aria-hidden
                  />
                  <span className="font-display text-2xl">{s.name}</span>
                </div>
                <div className="mt-1 pl-4 text-xs font-mono text-muted-foreground truncate">
                  {s.domain}
                </div>
              </div>
              <p className="pl-4 sm:pl-0 text-sm text-muted-foreground leading-relaxed self-center">
                {s.note}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Plus in-house career pages for companies that run their own board.
            More ATS platforms are being added.
          </p>
          <Link
            href="/companies"
            className="group inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-glow transition-colors shrink-0"
          >
            Browse companies we track
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SourcesSection;
