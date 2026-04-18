"use client";
import { motion } from "framer-motion";
import { TrendingUp, Building, Briefcase } from "lucide-react";

const MarketSignals = () => {
  const signals = [
    { icon: TrendingUp, label: "Recently funded companies" },
    { icon: Building, label: "Active hiring signals" },
    { icon: Briefcase, label: "Open roles tied to real growth" },
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
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-5">
              Market Signals
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Know who&apos;s{" "}
              <span className="text-gradient">actually hiring.</span>
            </h2>
            <p className="text-base text-white/35 mb-14">
              We track what matters so you&apos;re not applying into the void.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-4">
            {signals.map((signal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:border-primary/15 hover:bg-white/[0.04] transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <signal.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-mono text-xs text-white/50 group-hover:text-white/70 transition-colors">
                  {signal.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MarketSignals;
