"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Resume/PDF text extraction often leaves each line indented with spaces
 * and using a literal "•" character instead of markdown list syntax
 * (e.g. "    • Led product strategy..."). CommonMark treats 4+ leading
 * spaces as an indented code block (collapsing the whole list into one
 * unwrapping <pre> that overflows its container), and a bare "•" prefix
 * doesn't produce a real list at all — both render as run-on text. Strip
 * the indentation and rewrite "•" bullets as "-" so they parse as a
 * proper markdown list.
 */
function normalize(content: string): string {
  return content
    .split("\n")
    .map((line) => line.replace(/^[ \t]+/, "").replace(/^[•·]\s*/, "- "))
    .join("\n");
}

/**
 * Renders user-written markdown (about text, role and course descriptions).
 * Styling is applied directly rather than via `prose`, because the
 * @tailwindcss/typography plugin isn't part of this project — without these
 * rules, bullet lists render as unindented run-on lines.
 */
export function ProfileAbout({ content }: { content: string }) {
  return (
    <div
      className="
        text-sm leading-relaxed text-muted-foreground
        [&_p]:mb-3 [&_p:last-child]:mb-0
        [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul:last-child]:mb-0
        [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol:last-child]:mb-0
        [&_li]:pl-1.5 [&_li]:marker:text-primary/70 [&_li]:break-words
        [&_strong]:font-semibold [&_strong]:text-foreground
        [&_em]:italic
        [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
        [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:break-words
        [&_pre]:mb-3 [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:rounded-lg [&_pre]:bg-secondary [&_pre]:p-3
        [&_h1]:mb-2 [&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-foreground
        [&_h2]:mb-2 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-foreground
        [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground
        [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic
        [&_hr]:my-4 [&_hr]:border-border
        break-words
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{normalize(content)}</ReactMarkdown>
    </div>
  );
}
