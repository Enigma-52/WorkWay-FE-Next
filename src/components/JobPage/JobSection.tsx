"use client";
import { motion } from "framer-motion";

interface JobSectionProps {
  heading: string;
  content: string[];
  index: number;
}

const JobSection = ({ heading, content, index }: JobSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="job-card"
    >
      <h3 className="section-heading">{heading}</h3>
      <ul className="space-y-3">
        {content.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-muted-foreground leading-relaxed"
          >
            {content.length > 1 && (
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            )}
            <span className={content.length === 1 ? "" : ""}>{item}</span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
};

export default JobSection;
