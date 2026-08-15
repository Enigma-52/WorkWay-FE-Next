import { ArrowUpRight } from "lucide-react";

type Testimonial = {
  result: string;
  quote: string;
  name: string;
  role: string;
};

// Placeholder copy — swap these for real user testimonials when available.
// Structure (result badge + quote + attribution) is what the layout depends on.
const TESTIMONIALS: Testimonial[] = [
  {
    result: "Hired in 18 days",
    quote: "I stopped checking twelve career pages a day. One feed, real filters, and I actually found roles that matched what I do.",
    name: "Priya Nair",
    role: "Backend Engineer",
  },
  {
    result: "47 relevant matches, week one",
    quote: "The search finally understood “full-stack, not frontend-only.” Every other job board kept showing me the same noise.",
    name: "Daniel Cho",
    role: "Full-Stack Engineer",
  },
  {
    result: "3 offers, picked the best",
    quote: "Company context was the unlock — funding stage, headcount trend, whether they were actually hiring. Saved me from two dead-end applications.",
    name: "Ade Okafor",
    role: "Product Manager",
  },
  {
    result: "First interview in 4 days",
    quote: "My Talent Profile did the work a resume PDF never could. A recruiter messaged me off it before I'd even finished setting up alerts.",
    name: "Marta Lukas",
    role: "Data Scientist",
  },
  {
    result: "Remote offer, India to US team",
    quote: "Filtered to remote-only roles that were genuinely open to hiring outside the US. That list does not exist anywhere else I looked.",
    name: "Karan Mehta",
    role: "DevOps Engineer",
  },
  {
    result: "Skipped 200+ irrelevant listings",
    quote: "Pro alerts meant I heard about new postings the morning they went live, not the week after every recruiter already had a stack of applicants.",
    name: "Sofia Alvarez",
    role: "UI/UX Designer",
  },
];

const Testimonials = ({ variant = "full" }: { variant?: "full" | "compact" }) => {
  const items = variant === "compact" ? TESTIMONIALS.slice(0, 3) : TESTIMONIALS;

  return (
    <section className={variant === "full" ? "relative py-32" : "relative py-20"}>
      <div className={variant === "full" ? "relative mx-auto max-w-7xl px-6" : "relative mx-auto max-w-6xl px-6"}>
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
            Real results
          </p>
          <h2 className={variant === "full" ? "font-display text-5xl sm:text-6xl text-gradient leading-[1.05]" : "font-display text-3xl sm:text-4xl text-gradient leading-[1.05]"}>
            People who stopped{" "}
            <span className="italic text-brand-gradient">searching and started applying.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden border border-border">
          {items.map((t) => (
            <div
              key={t.name}
              className="group relative bg-surface/60 backdrop-blur p-8 hover:bg-surface-elevated/80 transition-colors flex flex-col"
            >
              <span className="inline-flex w-fit items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-brand/15 text-brand border border-brand/20">
                <ArrowUpRight className="w-3 h-3" />
                {t.result}
              </span>

              <p className="mt-5 font-display text-xl sm:text-2xl italic leading-snug text-foreground/90 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-brand-glow grid place-items-center font-display text-sm text-brand-foreground shrink-0">
                  {t.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
