"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
  {
    name: "n8n",
    slug: "n8n",
    logo: "https://cdn.workway.dev/logos/n8n.webp",
  },
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
    className="flex-shrink-0 mx-2.5 inline-flex items-center gap-3.5 px-6 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-primary/25 hover:bg-white/[0.06] transition-all duration-400 select-none group"
  >
    <Image
      src={logo}
      alt={name}
      width={35}
      height={35}
      className="rounded-[4px] mr-2 object-contain"
      unoptimized
    />
    <span className="text-[20px] font-medium tracking-wide text-white/70 group-hover:text-white transition-colors duration-400">
      {name}
    </span>
  </Link>
);

const CompanyLogoScroll = () => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="relative py-20 overflow-hidden"
  >
    {/* edge fades */}
    <div className="pointer-events-none absolute inset-y-0 left-0 w-48 z-10 bg-gradient-to-r from-background via-background/80 to-transparent" />
    <div className="pointer-events-none absolute inset-y-0 right-0 w-48 z-10 bg-gradient-to-l from-background via-background/80 to-transparent" />

    {/* top/bottom borders */}
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

    <p className="text-center text-[20px] font-mono uppercase tracking-[0.35em] text-white/70 mb-12">
      Companies hiring on WorkWay
    </p>

    <div className="space-y-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...row1, ...row1, ...row1].map((c, i) => (
          <Pill key={`a-${i}`} {...c} />
        ))}
      </div>
      <div className="flex animate-marquee-reverse whitespace-nowrap">
        {[...row2, ...row2, ...row2].map((c, i) => (
          <Pill key={`b-${i}`} {...c} />
        ))}
      </div>
      <div
        className="flex animate-marquee whitespace-nowrap"
        style={{ animationDuration: "38s" }}
      >
        {[...row3, ...row3, ...row3].map((c, i) => (
          <Pill key={`c-${i}`} {...c} />
        ))}
      </div>
    </div>
  </motion.section>
);

export default CompanyLogoScroll;
