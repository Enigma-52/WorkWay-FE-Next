"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";

interface Skill {
  name: string;
  slug: string;
}

interface JobSectionProps {
  heading: string;
  content: string[];
  index: number;
  skills?: Skill[];
}

const LONG_TEXT_THRESHOLD = 200;

function highlightSkills(text: string, skills: Skill[]): ReactNode {
  if (!skills || skills.length === 0) return text;

  // Build regex matching all skill names, longest first to avoid partial matches
  const sorted = [...skills].sort((a, b) => b.name.length - a.name.length);
  const escaped = sorted.map((s) =>
    s.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");

  const parts = text.split(pattern);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    const match = skills.find(
      (s) => s.name.toLowerCase() === part.toLowerCase(),
    );
    if (match) {
      return (
        <Link
          key={i}
          href={`/skill/${match.slug}`}
          className="rounded bg-primary/10 px-1 py-0.5 font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          {part}
        </Link>
      );
    }
    return part;
  });
}

function LongTextItem({ text, skills }: { text: string; skills: Skill[] }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > LONG_TEXT_THRESHOLD;

  if (!isLong) {
    return (
      <span className="break-words [overflow-wrap:anywhere]">
        {highlightSkills(text, skills)}
      </span>
    );
  }

  const truncated = text.slice(0, LONG_TEXT_THRESHOLD).trim();

  return (
    <span className="break-words [overflow-wrap:anywhere]">
      {expanded
        ? highlightSkills(text, skills)
        : highlightSkills(truncated + "…", skills)}
      <button
        onClick={() => setExpanded(!expanded)}
        className="ml-1 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </span>
  );
}

const JobSection = ({
  heading,
  content,
  index,
  skills = [],
}: JobSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="job-card"
    >
      <h3
        className="section-heading"
        title={heading.length > 80 ? heading : undefined}
      >
        {heading.length > 80 ? heading.slice(0, 80).trim() + "…" : heading}
      </h3>
      <ul className="space-y-3">
        {content.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-muted-foreground leading-relaxed"
          >
            {content.length > 1 && (
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            )}
            <LongTextItem text={item} skills={skills} />
          </li>
        ))}
      </ul>
    </motion.section>
  );
};

export default JobSection;
