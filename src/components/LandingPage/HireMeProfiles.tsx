"use client";
import { motion } from "framer-motion";
import { User } from "lucide-react";

const HireMeProfiles = () => (
  <section className="py-28 md:py-36 border-y border-white/[0.04] relative overflow-hidden">
    <div className="absolute -right-40 top-0 bottom-0 w-[500px] bg-primary/[0.015] blur-[140px] rounded-full pointer-events-none" />

    <div className="relative z-10 max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-[1fr,0.9fr] gap-16 items-center">
        {/* copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-primary/60 mb-5">
            Hire Me Profiles
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-tight mb-5">
            Your resume, but online{" "}
            <span className="text-white/30">and not ugly.</span>
          </h2>
          <p className="text-[15px] text-white/30 leading-relaxed mb-8 max-w-md">
            Every user gets a public Hire Me page. Recruiter opens it,
            understands you in 30 seconds. AI helps polish it — you stay in
            control.
          </p>

          <div className="flex flex-wrap gap-2">
            {["Skills", "Projects", "Experience", "Preferences"].map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-lg border border-white/[0.05] bg-white/[0.02] text-[11px] font-mono text-white/35"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            {/* header */}
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/[0.05]">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary/50" />
              </div>
              <div>
                <h4 className="font-semibold text-white/85">Alex Chen</h4>
                <p className="text-xs text-white/30">Full-Stack Engineer</p>
              </div>
            </div>

            {/* skills */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"].map(
                (s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-primary/[0.06] text-primary/60 border border-primary/10"
                  >
                    {s}
                  </span>
                )
              )}
            </div>

            {/* stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { v: "5+", l: "Years" },
                { v: "12", l: "Projects" },
                { v: "Open", l: "Status" },
              ].map((s, i) => (
                <div key={i} className="py-3 rounded-xl bg-white/[0.025]">
                  <p className="text-lg font-bold text-gradient">{s.v}</p>
                  <p className="text-[9px] mt-0.5 text-white/20 uppercase tracking-wider">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HireMeProfiles;
