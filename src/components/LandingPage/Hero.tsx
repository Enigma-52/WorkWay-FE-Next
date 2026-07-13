import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-10 pb-24 sm:pt-10 sm:pb-32 noise">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand/10 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <div
          className="mb-6 flex justify-center animate-fade-up"
          style={{ animationDelay: "50ms" }}
        >
          <a
            href="https://startupfa.me/s/workway?utm_source=www.workway.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <span className="text-primary">&#9733;</span>
            Featured on <span className="text-foreground font-semibold">Startup Fame</span>
          </a>
        </div>

        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tight">
          <span className="text-gradient">Jobs that</span>
          <br />
          <span className="italic text-brand-gradient">respect your time.</span>
        </h1>

        <p
          className="mt-8 max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          Job hunting is cooked. So we fixed it. One platform. Real jobs. No
          noise. Search, apply, track — done.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          <Link
            href="/jobs"
            className="group inline-flex items-center gap-2 rounded-full bg-brand text-brand-foreground hover:bg-brand-glow transition-all px-6 py-3 font-medium shadow-glow"
          >
            Browse Jobs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 backdrop-blur px-6 py-3 font-medium hover:bg-surface-elevated transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            How it works
          </Link>
        </div>
        <p
          className="mt-4 text-xs text-muted-foreground font-mono animate-fade-up"
          style={{ animationDelay: "350ms" }}
        >
          no signup wall — just jobs
        </p>

        {/* Stats */}
        <div
          className="mt-20 grid grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-up"
          style={{ animationDelay: "550ms" }}
        >
          {[
            { n: "400k+", l: "Jobs" },
            { n: "5k+", l: "Companies" },
            { n: "50+", l: "Domains" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-4xl sm:text-5xl text-gradient">
                {s.n}
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground font-mono">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
