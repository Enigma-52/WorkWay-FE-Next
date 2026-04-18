"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const WhatWeAreNot = () => {
  const notItems = [
    "Social feeds",
    "Engagement farming",
    '"Career guru" content',
    "Resume roasting",
    "Fake urgency banners",
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
      className="py-28 md:py-36 border-y border-white/[0.04]"
    >
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-14"
          >
            Things we{" "}
            <span className="text-red-400/80">refused</span> to build.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-14"
          >
            {notItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.06 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-500/10 bg-red-500/[0.03] text-white/50"
              >
                <X className="w-3.5 h-3.5 text-red-400/50" />
                <span className="font-mono text-xs">{item}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-lg text-white/30"
          >
            Just tools that help you get hired.
            <br />
            <span className="text-white/70 font-semibold">Or hire faster.</span>
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
};

export default WhatWeAreNot;
