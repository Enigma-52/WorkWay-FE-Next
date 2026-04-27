"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const OnboardingModal = dynamic(() => import("./OnboardingModal"), { ssr: false });

const refused = [
  "Social feeds",
  "Engagement farming",
  '"Career guru" content',
  "Fake urgency banners",
];

const FinalCTA = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <section className="py-36 md:py-44 relative overflow-hidden">
      {/* layered glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-primary/[0.07] blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* "things we refused" strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-14"
        >
          {refused.map((t, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-red-400/[0.08] bg-red-400/[0.02] text-[11px] font-mono text-white/25"
            >
              <X className="w-3 h-3 text-red-400/30" />
              {t}
            </span>
          ))}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold leading-[0.95] tracking-[-0.03em]"
        >
          Stop fighting
          <br />
          <span className="text-gradient">job platforms.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-5 text-base text-white/30"
        >
          Use one that&apos;s on your side.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <Button
            variant="hero"
            size="xl"
            className="group animate-pulse-glow"
            onClick={() => {
              redirect("/jobs");
            }}
          >
            Start using WorkWay
            <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <span className="text-[11px] text-white/15 font-mono">
            takes less time than opening LinkedIn
          </span>
        </motion.div>
      </div>

      <OnboardingModal open={showOnboarding} onOpenChange={setShowOnboarding} />
    </section>
  );
};

export default FinalCTA;
