"use client";
import { motion } from "framer-motion";
import { Clock, UserCheck, LayoutGrid, Sparkles } from "lucide-react";

const items = [
  { icon: Clock, text: "Post in under 5 minutes" },
  { icon: UserCheck, text: "Get candidates who actually fit" },
  { icon: LayoutGrid, text: "Clean pipeline, no spreadsheet chaos" },
];

const ForEmployers = () => (
  <section className="py-28 md:py-36 relative">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/[0.02] rounded-full blur-[130px] pointer-events-none" />

    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-primary/60 mb-5 inline-flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          For Employers
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-tight">
          Hiring without the circus.
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        viewport={{ once: true }}
        className="mt-14 grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto"
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="group p-6 rounded-2xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.035] transition-all duration-500"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <item.icon className="w-5 h-5 text-primary/70" />
            </div>
            <p className="text-[13px] font-medium text-white/50 group-hover:text-white/70 transition-colors">
              {item.text}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        viewport={{ once: true }}
        className="mt-10 flex flex-wrap justify-center gap-3"
      >
        {["No ATS bloat", "No enterprise pricing jumpscare"].map((t, i) => (
          <span
            key={i}
            className="px-4 py-2 rounded-full border border-red-400/[0.08] bg-red-400/[0.02] text-xs font-mono text-white/30"
          >
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ForEmployers;
