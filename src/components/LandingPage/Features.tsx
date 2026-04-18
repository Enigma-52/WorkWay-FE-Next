"use client";
import { motion } from "framer-motion";
import {
  Search,
  Layers,
  BarChart3,
  Building,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "One feed, every source",
    desc: "Greenhouse, Lever, YC, in-house — aggregated. No more 12 tabs.",
    accent: "from-emerald-400/80 to-teal-400/80",
  },
  {
    icon: Search,
    title: "Search that actually works",
    desc: "Semantic + filters + chat. Find the role, not 400 irrelevant listings.",
    accent: "from-blue-400/80 to-cyan-400/80",
  },
  {
    icon: BarChart3,
    title: "Track everything",
    desc: "Applied, ghosted, interviewing — one dashboard. No spreadsheet needed.",
    accent: "from-violet-400/80 to-purple-400/80",
  },
  {
    icon: Building,
    title: "Company context",
    desc: "Funded? Actually hiring? Growing or dying? We show you before you apply.",
    accent: "from-amber-400/80 to-orange-400/80",
  },
  {
    icon: ArrowUpRight,
    title: "Apply without friction",
    desc: "External ATS or in-house — one click, short message, done.",
    accent: "from-rose-400/80 to-pink-400/80",
  },
  {
    icon: Sparkles,
    title: "AI that assists, not replaces",
    desc: "Better matches, smarter search, polished profiles. No hallucinated jobs.",
    accent: "from-primary/80 to-emerald-400/80",
  },
];

const Features = () => (
  <section className="py-28 md:py-36 relative">
    {/* ambient */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-primary/[0.025] blur-[140px] pointer-events-none" />

    <div className="relative z-10 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-primary/60 mb-5">
          How it works
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-tight">
          A job platform{" "}
          <span className="text-gradient">with a brain.</span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            viewport={{ once: true }}
            className="group relative p-6 rounded-2xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.035] transition-all duration-500"
          >
            {/* top accent line */}
            <div
              className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${f.accent} opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
            />

            <div
              className={`w-9 h-9 rounded-lg bg-gradient-to-br ${f.accent} p-px mb-5`}
            >
              <div className="w-full h-full rounded-[7px] bg-background flex items-center justify-center">
                <f.icon className="w-4 h-4 text-white/60" />
              </div>
            </div>

            <h3 className="text-[15px] font-semibold text-white/85 mb-2">
              {f.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-white/30 group-hover:text-white/45 transition-colors duration-300">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
