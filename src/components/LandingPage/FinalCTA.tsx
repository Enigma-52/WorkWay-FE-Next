import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-brand/10 blur-[140px] pointer-events-none" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-6xl sm:text-8xl leading-[0.95] tracking-tight">
          <span className="text-gradient">Stop fighting</span>
          <br />
          <span className="italic text-brand-gradient">job platforms.</span>
        </h2>
        <p className="mt-8 text-xl text-muted-foreground">
          Use one that&apos;s on your side.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/jobs"
            className="group inline-flex items-center gap-2 rounded-full bg-brand text-brand-foreground hover:bg-brand-glow transition-all px-8 py-4 text-lg font-medium shadow-glow"
          >
            Start using WorkWay
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground font-mono">
          takes less time than opening LinkedIn
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
