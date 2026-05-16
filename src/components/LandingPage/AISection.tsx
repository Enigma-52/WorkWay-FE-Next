"use client";
import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";

const AISection = () => {
  const doItems = [
    "match candidates better",
    "improve job descriptions",
    "power semantic search",
    "help recruiters find talent faster",
  ];

  const dontItems = [
    "hallucinate jobs",
    "write motivational quotes",
    "replace humans",
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      className="py-28 md:py-36 border-y border-white/[0.04] relative"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/[0.02] rounded-full blur-[100px]" />

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/[0.05] mb-8">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono text-primary tracking-wider">AI Inside</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Yes, there&apos;s AI.{" "}
              <span className="text-white/40">No, it&apos;s not cringe.</span>
            </h2>
          </motion.div>

          {/* Do / Don't Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-primary/15 bg-primary/[0.03]"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-primary/70 mb-6">
                We use AI to:
              </h3>
              <div className="space-y-3.5">
                {doItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-white/60 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-red-500/10 bg-red-500/[0.02]"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-red-400/60 mb-6">
                We don&apos;t use AI to:
              </h3>
              <div className="space-y-3.5">
                {dontItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3 text-red-400/60" />
                    </div>
                    <span className="text-white/60 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-14 text-lg font-medium text-white/70"
          >
            Assist {">"} automate.{" "}
            <span className="text-primary">Always.</span>
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
};

export default AISection;
