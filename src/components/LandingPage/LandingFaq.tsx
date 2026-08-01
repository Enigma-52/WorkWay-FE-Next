import JsonLd from "@/components/seo/JsonLd";
import { buildFaqJsonLd } from "@/lib/seo/jsonld";

// Facts here must match public/llms.txt — both are public claims about the
// product, keep them in sync if either changes.
const FAQS = [
  {
    question: "What is WorkWay?",
    answer:
      "WorkWay is a free job search platform that aggregates listings from Greenhouse, Ashby, Lever, YC, and in-house company career pages into one place — no signup wall required to browse.",
  },
  {
    question: "How many jobs and companies are on WorkWay?",
    answer:
      "WorkWay indexes 300,000+ jobs across 5,000+ companies, refreshed multiple times a day directly from source ATS platforms.",
  },
  {
    question: "Is WorkWay free to use?",
    answer:
      "Yes. Browsing, searching, and applying to jobs on WorkWay is completely free, with no signup wall.",
  },
  {
    question: "Does WorkWay show salary information?",
    answer:
      "Yes — WorkWay provides aggregated salary insights across indexed roles wherever compensation data is available from the source listing.",
  },
  {
    question: "Can recruiters find me on WorkWay?",
    answer:
      "Yes. WorkWay's free Hire Me profiles let job seekers create a public profile that recruiters can discover directly.",
  },
  {
    question: "How often are job listings updated?",
    answer:
      "Job listings are refreshed multiple times a day via automated ingestion from company career pages and ATS platforms, so postings stay current.",
  },
];

export default function LandingFaq() {
  return (
    <>
      <JsonLd data={buildFaqJsonLd(FAQS)} />
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h2 className="mb-8 text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6">
          {FAQS.map((faq) => (
            <div key={faq.question} className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 font-medium text-foreground">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
