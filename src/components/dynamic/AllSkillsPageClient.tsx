"use client";

import { useState, useMemo } from "react";
import SkillCard from "@/components/SkillPage/SkillCard";
import CategoryFilter from "@/components/SkillPage/CategoryFilter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Briefcase, Layers, TrendingUp } from "lucide-react";
import { type SkillsPageResponse } from "@/lib/api/contracts";

type Props = {
  data: SkillsPageResponse;
};

const INITIAL_VISIBLE_CATEGORIES = 10;

export default function AllSkillsPageClient({ data }: Props) {
  const allSkills = data.skills;
  const totalJobs = data.stats.total_jobs;

  const allCategories = data.categories.map((c) => c.category);

  const skillCounts = Object.fromEntries(
    data.categories.map((c) => [c.category, c.skill_count])
  );

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleCategories = showAllCategories
    ? allCategories
    : allCategories.slice(0, INITIAL_VISIBLE_CATEGORIES);

  const filtered = useMemo(() => {
    let result = allSkills;

    if (activeCategory !== "All") {
      result = result.filter((s) => s.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) =>
        s.skill.toLowerCase().includes(q)
      );
    }

    return result;
  }, [search, activeCategory, allSkills]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    for (const skill of filtered) {
      if (!map[skill.category]) map[skill.category] = [];
      map[skill.category].push(skill);
    }
    return map;
  }, [filtered]);

  const stats = [
    {
      icon: Layers,
      label: "Skills",
      value: data.stats.total_skills.toString(),
    },
    {
      icon: Briefcase,
      label: "Open Roles",
      value: totalJobs.toLocaleString(),
    },
    {
      icon: TrendingUp,
      label: "Categories",
      value: data.stats.total_categories.toString(),
    },
  ];

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <div className="bg-noise pointer-events-none fixed inset-0 z-0" />

      <div className="relative z-10">
        {/* HERO */}
        <section className="border-b border-border px-8 pt-5 pb-14 md:px-12 lg:pt-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Browse Jobs by{" "}
                <span className="text-gradient-primary">Skill</span>
              </h1>

              <p className="mb-10 max-w-2xl text-lg text-muted-foreground">
                {data.stats.total_skills}+ skills,{" "}
                {totalJobs.toLocaleString()} open roles.
              </p>
            </motion.div>

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-12 flex flex-wrap gap-8"
            >
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <s.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {s.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* SEARCH */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search skills..."
                className="w-full rounded-xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition"
              />
            </div>
          </div>
        </section>

        {/* FILTER + GRID */}
        <section className="px-4 py-14 md:px-8">
          <div className="mx-auto max-w-7xl">
            {/* CATEGORY FILTER */}
            <div className="space-y-4 mb-12">
              <CategoryFilter
                categories={visibleCategories}
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
                skillCounts={skillCounts}
              />

              {allCategories.length > INITIAL_VISIBLE_CATEGORIES && (
                <button
                  onClick={() =>
                    setShowAllCategories((v) => !v)
                  }
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {showAllCategories
                    ? "Show fewer categories"
                    : `View all ${allCategories.length} categories`}
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + search}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {filtered.length === 0 ? (
                  <div className="py-24 text-center text-muted-foreground">
                    No skills found
                  </div>
                ) : activeCategory === "All" && !search ? (
                  <div className="space-y-16">
                    {allCategories.map((cat) => {
                      const skills = grouped[cat];
                      if (!skills?.length) return null;

                      return (
                        <div
                          key={cat}
                          className="pb-10 border-b border-border/40 last:border-none"
                        >
                          <div className="mb-6 flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-foreground">
                              {cat}
                            </h2>
                            <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-medium text-muted-foreground">
                              {skills.length}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                            {skills.map((skill, i) => (
                              <SkillCard
                                key={skill.slug}
                                skill={skill.skill}
                                slug={skill.slug}
                                jobCount={skill.job_count}
                                index={i}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {filtered.map((skill, i) => (
                      <SkillCard
                        key={skill.slug}
                        skill={skill.skill}
                        slug={skill.slug}
                        jobCount={skill.job_count}
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}