"use client";
import { motion } from "framer-motion";
import { Search, Zap, BarChart3 } from "lucide-react";

const ForCandidates = () => {
  const cards = [
    {
      icon: Search,
      title: "Find jobs without digging",
      description: "Search once. Filters actually work. Chat if you're lazy.",
    },
    {
      icon: Zap,
      title: "Apply without friction",
      description: "External ATS? Fine. In-house roles? Short message. Done.",
    },
    {
      icon: BarChart3,
      title: "Track everything",
      description: "Where you applied. What happened. What's hot. What's dead.",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      className="py-28 md:py-36"
    >
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-5">
              For Candidates
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              For people who are{" "}
              <span className="text-white/40">actually applying.</span>
            </h2>
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-6 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white/90">{card.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12 text-sm font-mono text-primary/70"
          >
            No more &ldquo;did I apply here?&rdquo;
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
};

export default ForCandidates;
