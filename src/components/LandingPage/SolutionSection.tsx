"use client";
import { motion } from "framer-motion";
import { Database, Target, Building, TrendingUp, Filter, Zap } from "lucide-react";

const SolutionSection = () => {
  const features = [
    { icon: Database, text: "Aggregates jobs from Greenhouse, Lever, YC Jobs", color: "from-emerald-400 to-teal-400" },
    { icon: Target, text: "Lets you apply + track everything in one place", color: "from-blue-400 to-cyan-400" },
    { icon: Building, text: "Handles in-house startup jobs directly", color: "from-violet-400 to-purple-400" },
    { icon: TrendingUp, text: "Shows company context (funded? hiring? relevant?)", color: "from-orange-400 to-amber-400" },
    { icon: Filter, text: "Gives recruiters actual signal, not resume spam", color: "from-rose-400 to-pink-400" },
  ];

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/[0.03] rounded-full blur-[120px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="container px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/[0.05] mb-8">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono text-primary tracking-wider">The Solution</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              So we built a platform
              <br />
              <span className="text-gradient">that isn&apos;t dumb.</span>
            </h2>
          </motion.div>

          {/* Features */}
          <div className="grid gap-3 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group relative p-5 sm:p-6 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500 overflow-hidden"
              >
                {/* Gradient accent on hover */}
                <div className={`absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="flex items-center gap-5 relative z-10">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} p-[1px] flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full rounded-xl bg-background/90 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white/70" />
                    </div>
                  </div>
                  <span className="text-base sm:text-lg font-medium text-white/60 group-hover:text-white/90 transition-colors duration-300">
                    {feature.text}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-block p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-xl md:text-2xl text-white/30">
                It&apos;s a job platform.
              </p>
              <p className="text-xl md:text-2xl font-bold mt-2 text-white">
                But with a <span className="text-gradient">brain.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
