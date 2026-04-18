"use client";
import { motion } from "framer-motion";

const stats = [
  { value: "10,000+", label: "Jobs aggregated" },
  { value: "500+", label: "Companies" },
  { value: "50+", label: "Domains covered" },
];

const SocialProof = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-100px" }}
      className="py-20 border-y border-white/[0.06]"
    >
      <div className="container px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-mono text-white/30 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default SocialProof;
