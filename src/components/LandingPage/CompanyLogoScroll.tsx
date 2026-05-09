import Image from "next/image";
import Link from "next/link";

type Company = { name: string; slug: string; logo: string };

const row1: Company[] = [
  {
    name: "OpenAI",
    slug: "openai",
    logo: "https://cdn.workway.dev/logos/openai.webp",
  },
  {
    name: "Anthropic",
    slug: "anthropic",
    logo: "https://cdn.workway.dev/logos/anthropic.webp",
  },
  {
    name: "Jane Street",
    slug: "jane-street",
    logo: "https://cdn.workway.dev/logos/janestreet.webp",
  },
  {
    name: "Stripe",
    slug: "stripe",
    logo: "https://cdn.workway.dev/logos/stripe.webp",
  },
  {
    name: "Waymo",
    slug: "waymo",
    logo: "https://cdn.workway.dev/logos/waymo.webp",
  },
  {
    name: "Pinterest",
    slug: "pinterest",
    logo: "https://cdn.workway.dev/logos/pinterest.webp",
  },
  {
    name: "Airbnb",
    slug: "airbnb",
    logo: "https://cdn.workway.dev/logos/airbnb.webp",
  },
  {
    name: "Reddit",
    slug: "reddit",
    logo: "https://cdn.workway.dev/logos/reddit.webp",
  },
  {
    name: "Figma",
    slug: "figma",
    logo: "https://cdn.workway.dev/logos/figma.webp",
  },
  {
    name: "SpaceX",
    slug: "spacex",
    logo: "https://cdn.workway.dev/logos/spacex.webp",
  },
];

const row2: Company[] = [
  {
    name: "Clickhouse",
    slug: "clickhouse",
    logo: "https://cdn.workway.dev/logos/clickhouse.webp",
  },
  {
    name: "Postman",
    slug: "postman",
    logo: "https://cdn.workway.dev/logos/postman.webp",
  },
  {
    name: "Linear",
    slug: "linear",
    logo: "https://cdn.workway.dev/logos/linear.webp",
  },
  {
    name: "Notion",
    slug: "notion",
    logo: "https://cdn.workway.dev/logos/notion.webp",
  },
  {
    name: "Datadog",
    slug: "datadog",
    logo: "https://cdn.workway.dev/logos/datadog.webp",
  },
  {
    name: "Cloudflare",
    slug: "cloudflare",
    logo: "https://cdn.workway.dev/logos/cloudflare.webp",
  },
  {
    name: "Twilio",
    slug: "twilio",
    logo: "https://cdn.workway.dev/logos/twilio.webp",
  },
  { name: "n8n", slug: "n8n", logo: "https://cdn.workway.dev/logos/n8n.webp" },
  {
    name: "New Relic",
    slug: "new-relic",
    logo: "https://cdn.workway.dev/logos/newrelic.webp",
  },
  {
    name: "Ramp",
    slug: "ramp",
    logo: "https://cdn.workway.dev/logos/ramp.webp",
  },
];
const row3: Company[] = [
  {
    name: "Rubrik",
    slug: "rubrik-job-board",
    logo: "https://cdn.workway.dev/logos/rubrik.webp",
  },
  {
    name: "Asana",
    slug: "asana",
    logo: "https://cdn.workway.dev/logos/asana.webp",
  },
  {
    name: "Dropbox",
    slug: "dropbox",
    logo: "https://cdn.workway.dev/logos/dropbox.webp",
  },
  {
    name: "Rockstar Games",
    slug: "rockstar-games",
    logo: "https://cdn.workway.dev/logos/rockstargames.webp",
  },
  {
    name: "Duolingo",
    slug: "duolingo",
    logo: "https://cdn.workway.dev/logos/duolingo.webp",
  },
  {
    name: "Snowflake",
    slug: "snowflake",
    logo: "https://cdn.workway.dev/logos/snowflake.webp",
  },
  {
    name: "MongoDB",
    slug: "mongodb",
    logo: "https://cdn.workway.dev/logos/mongodb.webp",
  },
  {
    name: "Databricks",
    slug: "databricks",
    logo: "https://cdn.workway.dev/logos/databricks.webp",
  },
  {
    name: "Hudson River Trading",
    slug: "hudson-river-trading",
    logo: "https://cdn.workway.dev/logos/wehrtyou.webp",
  },
  {
    name: "Discord",
    slug: "discord",
    logo: "https://cdn.workway.dev/logos/discord.webp",
  },
];

const Pill = ({ name, slug, logo }: Company) => (
  <Link
    href={`/company/${slug}`}
    className="group flex items-center justify-center shrink-0 mx-3"
  >
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-surface/40 backdrop-blur px-6 py-4 hover:bg-surface-elevated hover:border-brand/30 transition-all duration-300">
      <Image
        src={logo}
        alt={name}
        width={32}
        height={32}
        className="rounded-lg object-contain"
        unoptimized
      />
      <span className="font-display text-2xl tracking-tight whitespace-nowrap text-foreground/85 group-hover:text-foreground transition-colors">
        {name}
      </span>
    </div>
  </Link>
);

function Row({ items, reverse }: { items: Company[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="flex"
      style={{
        animation: `marquee ${reverse ? 55 : 45}s linear infinite`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      {doubled.map((c, i) => (
        <Pill key={`${c.slug}-${i}`} {...c} />
      ))}
    </div>
  );
}

const CompanyLogoScroll = () => (
  <section className="relative py-24 border-y border-border/60 bg-surface/30">
    <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-50" />
    <div className="relative mx-auto max-w-7xl px-6 mb-12 text-center">
      <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
        <span className="h-px w-8 bg-border" />
        Companies hiring on WorkWay
        <span className="h-px w-8 bg-border" />
      </div>
      <h2 className="mt-4 font-display text-4xl sm:text-5xl text-gradient">
        5,000+ teams.{" "}
        <span className="italic text-brand-gradient">One feed.</span>
      </h2>
    </div>

    <div className="relative space-y-5 marquee-mask">
      <Row items={row1} />
      <Row items={row2} reverse />
      <Row items={row3} />
    </div>
  </section>
);

export default CompanyLogoScroll;
