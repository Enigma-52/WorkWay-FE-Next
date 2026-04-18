"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import OnboardingModal from "./OnboardingModal";

const stats = [
  { value: "200k+", label: "Jobs" },
  { value: "4k+", label: "Companies" },
  { value: "50+", label: "Domains" },
];

const Hero = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <section className="relative min-h-[10dvh] pt-10 pb-20 flex flex-col items-center justify-center overflow-hidden">
      {/* ── background layers ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(82_100%_55%/0.06),transparent)]" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* noise grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-10 w-full max-w-[52rem] mx-auto px-6 text-center">
        {/* pill */}
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.04] px-4 py-1.5 text-[11px] font-mono tracking-widest text-primary/80 uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Jobs that respect your time
          </span>
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.92] tracking-[-0.035em]"
        >
          Job hunting is <span className="text-gradient">cooked.</span>
          <br />
          <span className="text-white/40">So we fixed it.</span>
        </motion.h1>

        {/* sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-7 text-[1.05rem] leading-relaxed text-white/35 max-w-md mx-auto"
        >
          One platform. Real jobs. No noise.
          <br />
          Search, apply, track — done.
        </motion.p>

        {/* cta */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <Button variant="hero" size="xl" asChild className="group">
            <Link href="/jobs">
              Browse Jobs
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <span className="text-[11px] text-white/20 font-mono">
            no signup wall — just jobs
          </span>
        </motion.div>

        {/* stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 flex items-center justify-center gap-10 sm:gap-16"
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-[40px] sm:text-3xl font-bold tracking-tight text-gradient">
                {s.value}
              </p>
              <p className="mt-1 text-[15px] font-mono uppercase tracking-[0.2em] text-white/25">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <OnboardingModal open={showOnboarding} onOpenChange={setShowOnboarding} />
    </section>
  );
};

export default Hero;
