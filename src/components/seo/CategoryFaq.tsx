import JsonLd from "@/components/seo/JsonLd";
import { buildFaqJsonLd } from "@/lib/seo/jsonld";
import type { JobListing } from "@/types/jobs";

function topUnique(values: string[], limit: number): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const v of values) {
    const key = v.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(key);
    if (result.length >= limit) break;
  }
  return result;
}

type Props = {
  // Full noun phrase already ending in "jobs", e.g. "Backend jobs" or
  // "Software Engineer jobs in Bangalore" — used as-is, nothing appended.
  topic: string;
  total: number;
  jobs: JobListing[];
};

// Grounded in real data only (job counts / actual companies & locations
// present in this page's results) — never fabricate stats, since that's
// exactly the kind of thin/templated content Google devalues on category
// pages competing for head terms like "python jobs".
export default function CategoryFaq({ topic, total, jobs }: Props) {
  const topCompanies = topUnique(jobs.map((j) => j.company), 5);
  const topLocations = topUnique(jobs.map((j) => j.location), 5);

  const faqs = [
    {
      question: `How many ${topic} are available right now?`,
      answer: `There are currently ${total.toLocaleString()} open ${topic} listed on WorkWay, sourced directly from company career pages and updated daily.`,
    },
    ...(topCompanies.length > 0
      ? [
          {
            question: `Which companies are hiring for ${topic}?`,
            answer: `Companies currently hiring for ${topic} on WorkWay include ${topCompanies.join(", ")}, among others.`,
          },
        ]
      : []),
    ...(topLocations.length > 0
      ? [
          {
            question: `Where are ${topic} located?`,
            answer: `${topic} on WorkWay span locations including ${topLocations.join(", ")}.`,
          },
        ]
      : []),
    {
      question: `How often are ${topic} listings updated?`,
      answer: `WorkWay pulls job listings directly from company career pages daily, so ${topic} stay current.`,
    },
  ];

  return (
    <>
      <JsonLd data={buildFaqJsonLd(faqs)} />
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="mb-6 font-display text-2xl font-semibold">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="mb-1.5 font-medium text-foreground">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
