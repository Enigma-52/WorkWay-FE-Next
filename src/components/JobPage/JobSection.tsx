"use client";
import Link from "next/link";
import { type ReactNode } from "react";

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

/**
 * Extract markdown links [text](url) and bare URLs, returning an array of
 * string segments and <a> elements.
 */
function linkify(text: string): ReactNode[] {
  // Match markdown links [text](url) or bare https?:// URLs
  const linkPattern =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)<>]+)/g;
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = linkPattern.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      // markdown link
      parts.push(
        <a
          key={`link-${m.index}`}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          {m[1]}
        </a>,
      );
    } else if (m[3]) {
      // bare URL
      parts.push(
        <a
          key={`link-${m.index}`}
          href={m[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          {m[3]}
        </a>,
      );
    }
    last = linkPattern.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function highlightSkills(text: string, skills: Skill[]): ReactNode {
  // First pass: extract links so they don't get mangled by skill matching
  const linkedParts = linkify(text);

  if (!skills || skills.length === 0) {
    return linkedParts.length > 1 ? linkedParts : text;
  }

  // Build regex matching whole words only, longest first to avoid partial matches
  const sorted = [...skills].sort((a, b) => b.name.length - a.name.length);
  const escaped = sorted.map((s) =>
    s.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  // Second pass: highlight skills only in string segments (skip link elements)
  const result: ReactNode[] = [];
  for (const part of linkedParts) {
    if (typeof part !== "string") {
      result.push(part);
      continue;
    }

    let lastIndex = 0;
    let m: RegExpExecArray | null;
    pattern.lastIndex = 0;
    while ((m = pattern.exec(part)) !== null) {
      if (m.index > lastIndex) {
        result.push(part.slice(lastIndex, m.index));
      }
      const matched = m[0];
      const skill = skills.find(
        (s) => s.name.toLowerCase() === matched.toLowerCase(),
      );
      if (skill) {
        result.push(
          <Link
            key={`skill-${result.length}`}
            href={`/skill/${skill.slug}`}
            className="rounded py-0.5 font-medium text-primary"
          >
            {matched}
          </Link>,
        );
      } else {
        result.push(matched);
      }
      lastIndex = pattern.lastIndex;
    }
    if (lastIndex < part.length) {
      result.push(part.slice(lastIndex));
    }
  }

  return result.length > 1 ? result : text;
}

const JobSection = ({
  heading,
  content,
  skills = [],
}: JobSectionProps) => {
  return (
    <section className="job-card">
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
            <span className="break-words [overflow-wrap:anywhere]">
              {highlightSkills(item, skills)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default JobSection;
