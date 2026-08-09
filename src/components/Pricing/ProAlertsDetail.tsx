import { Bell, Building2, Mail, Crown } from "lucide-react";

const steps = [
  {
    icon: Building2,
    title: "1. Follow a company",
    desc: "One click on any company page. Free plan or Pro — following is always free.",
  },
  {
    icon: Bell,
    title: "2. They post a role",
    desc: "WorkWay checks for new postings from companies you follow every few minutes, around the clock.",
  },
  {
    icon: Mail,
    title: "3. You get emailed instantly",
    desc: "Pro sends the alert the moment it's detected — with a direct link to apply, before the role gets buried under applicants.",
  },
];

const faqs = [
  {
    q: "Why not just check the company's careers page myself?",
    a: "Companies post across Greenhouse, Ashby, Lever, YC, and more — each with its own site to check. WorkWay already tracks all of them in one feed, so instant alerts work no matter which platform a company uses. Nowhere else gives you that in one place.",
  },
  {
    q: "How is this different from just following a company on the free plan?",
    a: "Following is free for everyone and always shows recent postings on your dashboard's Companies page. Pro adds the instant email — so you don't have to remember to check back.",
  },
  {
    q: "If I follow five companies and they all post at once, do I get five emails?",
    a: "No — one email, grouped by company. Instant alerts are designed to be useful, not to fill your inbox.",
  },
  {
    q: "Can I see my alert history anywhere besides email?",
    a: "Yes — the Alerts tab in your dashboard shows every alert sent today, each linking straight to the job.",
  },
];

const ProAlertsDetail = () => {
  return (
    <div className="mx-auto mt-20 max-w-4xl">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary">
          <Crown className="h-3.5 w-3.5" />
          Pro feature, in detail
        </p>
        <h2 className="mb-3 text-3xl font-bold tracking-tight">
          Instant company alerts
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          The single most requested reason people upgrade: knowing about a role
          the minute it exists, not the day after someone shares it on LinkedIn.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        {steps.map((s) => (
          <div key={s.title} className="rounded-xl border border-border bg-card/60 p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="mb-1.5 text-sm font-semibold">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-xl border border-border bg-card/40 p-5">
            <h3 className="mb-1.5 text-sm font-medium">{f.q}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProAlertsDetail;
