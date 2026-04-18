"use client";
import { motion } from "framer-motion";

const ProblemSection = () => {
  const left = [
    "LinkedIn",
    "Naukri",
    "YC Jobs",
    "4 ATS tabs",
    "final_final_v7.xlsx",
  ];

  const right = [
    "apply to the same job twice",
    "forget where you applied",
    "rewrite the same intro",
    "question your life choices",
  ];

  return (
    <section className="py-28 md:py-36">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-center mb-20 leading-tight"
        >
          Be honest.{" "}
          <span className="text-white/30">This is your setup.</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-14">
          {/* platforms */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/20 mb-5">
              Every morning you open
            </p>
            <div className="space-y-1.5">
              {left.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.04] bg-white/[0.015] text-sm font-mono text-white/45"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400/40 flex-shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* problems */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/20 mb-5">
              And then you
            </p>
            <div className="space-y-1.5">
              {right.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-red-400/[0.08] bg-red-400/[0.02] text-sm font-mono text-white/45"
                >
                  <span className="text-red-400/40 text-xs">✕</span>
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center text-lg text-white/25"
        >
          This isn&apos;t &ldquo;the grind.&rdquo;{" "}
          <span className="text-white font-semibold">It&apos;s bad software.</span>
        </motion.p>
      </div>
    </section>
  );
};

export default ProblemSection;
