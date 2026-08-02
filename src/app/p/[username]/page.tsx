import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  MapPin,
  Clock,
  Globe,
  Mail,
  Github,
  Linkedin,
  Twitter,
  FileText,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  BadgeCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import JsonLd from "@/components/seo/JsonLd";
import { backendGet } from "@/lib/api/server-client";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { LocalTime } from "./LocalTime";
import { ShareButton } from "./ShareButton";
import { ProfileAbout } from "./ProfileAbout";
import { ResumeViewer } from "./ResumeViewer";
import { getSiteUrl } from "@/lib/seo/metadata";

/* ---------- types ---------- */

// Skills are written by the create form as plain strings; older/enriched rows
// may carry { name, slug } objects. Accept both.
type Skill = string | { name: string; slug?: string };

interface Language {
  name?: string;
  language?: string;
  proficiency: string;
}

interface SocialLinks {
  email?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

interface Experience {
  id?: number;
  role: string;
  company: string;
  employment_type?: string;
  start_date: string;
  end_date?: string | null;
  is_current?: boolean;
  location?: string;
  description?: string;
}

interface Education {
  id?: number;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_year?: number | string;
  end_year?: number | string | null;
  is_current?: boolean;
  gpa?: string | null;
  description?: string;
}

interface Certification {
  id?: number;
  name: string;
  organization?: string;
  issue_date?: string;
  expiration_date?: string | null;
  credential_id?: string;
  credential_url?: string;
}

interface TalentProfile {
  id: number;
  username: string;
  display_name: string;
  professional_title?: string;
  category?: string;
  experience_level?: string;
  years_of_experience?: string;
  about?: string;
  country?: string;
  timezone?: string;
  availability_status?: string;
  employment_types?: string[];
  notice_period_days?: number;
  available_from?: string;
  hourly_rate?: string;
  annual_salary?: string;
  compensation_visibility?: string;
  skills?: Skill[];
  languages?: Language[];
  social_links?: SocialLinks;
  avatar_url?: string;
  resume_url?: string;
  resume_filename?: string;
  created_at?: string;
  updated_at?: string;
  experiences?: Experience[];
  education?: Education[];
  certifications?: Certification[];
}

/* ---------- helpers ---------- */

function formatMonthYear(dateStr?: string | null): string {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})/);
  if (match) {
    const date = new Date(Number(match[1]), Number(match[2]) - 1, 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime())
    ? dateStr
    : parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatFullDate(dateStr: string): string {
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime())
    ? dateStr
    : parsed.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Amounts are stored with their currency symbol prefixed ("₹1500000").
 * Keep the symbol, group the digits so six-figure numbers stay readable.
 */
function formatAmount(value?: string | null): string {
  if (!value) return "";
  const match = value.match(/^([^\d]*)([\d.]+)$/);
  if (!match) return value;
  const [, symbol, digits] = match;
  const grouped = Number(digits);
  return Number.isNaN(grouped)
    ? value
    : `${symbol}${grouped.toLocaleString("en-US")}`;
}

function skillParts(skill: Skill): { name: string; slug?: string } {
  return typeof skill === "string" ? { name: skill } : skill;
}

function languageName(lang: Language): string {
  return lang.name ?? lang.language ?? "";
}

function availabilityConfig(status?: string) {
  switch (status) {
    case "available":
      return {
        label: "Available for hire",
        dot: "bg-green-500",
        chip: "bg-green-500/10 text-green-500 border-green-500/25",
      };
    case "open":
      return {
        label: "Open to opportunities",
        dot: "bg-yellow-500",
        chip: "bg-yellow-500/10 text-yellow-600 border-yellow-500/25",
      };
    case "not_available":
      return {
        label: "Not looking right now",
        dot: "bg-zinc-500",
        chip: "bg-zinc-500/10 text-zinc-400 border-zinc-500/25",
      };
    default:
      return null;
  }
}

async function fetchProfile(username: string): Promise<TalentProfile | null> {
  try {
    const data = await backendGet<{ profile: TalentProfile }>(
      `/api/talent-profiles/${username}`,
      { revalidate: false },
    );
    return data.profile;
  } catch {
    return null;
  }
}

/* ---------- presentational primitives ---------- */

/**
 * One labelled row of the spec sheet. Optional fields still render, so a
 * recruiter can tell "not stated" apart from "never asked".
 */
function SpecRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
}) {
  const empty = value === null || value === undefined || value === "";

  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2.5 last:border-b-0">
      <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </dt>
      <dd
        className={`min-w-0 text-right text-sm ${
          empty ? "italic text-muted-foreground/50" : "text-foreground"
        } ${mono && !empty ? "font-mono" : ""}`}
      >
        {empty ? "Not specified" : value}
      </dd>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  count,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  count?: number;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {Icon && <Icon className="h-4 w-4 text-primary" />}
      <h2 className="font-display text-xl font-semibold text-foreground">
        {title}
      </h2>
      {count !== undefined && count > 0 && (
        <span className="font-mono text-xs text-muted-foreground">
          {String(count).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

function EmptySection({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

/* ---------- metadata ---------- */

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await fetchProfile(username);

  if (!profile) {
    return { title: "Profile Not Found | Workway" };
  }

  const title = `${profile.display_name} – ${profile.professional_title || "Professional"} | Workway`;
  const description =
    profile.about?.slice(0, 160) || `${profile.display_name} on Workway`;

  return buildPageMetadata({
    title,
    description,
    path: `/p/${username}`,
    image: profile.avatar_url || "/logo.png",
    keywords: [
      profile.display_name,
      profile.professional_title,
      profile.category,
      ...(profile.skills?.slice(0, 5).map((s) => skillParts(s).name) ?? []),
    ].filter(Boolean) as string[],
  });
}

/* ---------- page ---------- */

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = await fetchProfile(username);
  const siteUrl = getSiteUrl();
  const profileUrl = `${siteUrl}/p/${username}`;

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <div className="text-center">
          <User className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
          <h1 className="font-display text-2xl font-bold text-foreground">
            Profile not found
          </h1>
          <p className="mt-2 text-muted-foreground">
            No talent profile is published at this address.
          </p>
          <Link href="/">
            <Button variant="outline" className="mt-6">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const availability = availabilityConfig(profile.availability_status);
  const compensationPublic = profile.compensation_visibility === "public";
  const social = profile.social_links ?? {};
  const experiences = profile.experiences ?? [];
  const education = profile.education ?? [];
  const certifications = profile.certifications ?? [];
  const skills = profile.skills ?? [];
  const languages = profile.languages ?? [];

  const initials = profile.display_name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const headlineFacts = [
    profile.category,
    profile.experience_level,
    profile.years_of_experience ? `${profile.years_of_experience} yrs` : null,
    profile.country,
    profile.employment_types?.length ? profile.employment_types.join(" · ") : null,
  ].filter(Boolean) as string[];

  const contactLinks = [
    { key: "email", label: "Email", value: social.email, href: social.email ? `mailto:${social.email}` : undefined, icon: Mail },
    { key: "website", label: "Website", value: social.website, href: social.website, icon: Globe },
    { key: "github", label: "GitHub", value: social.github, href: social.github, icon: Github },
    { key: "linkedin", label: "LinkedIn", value: social.linkedin, href: social.linkedin, icon: Linkedin },
    { key: "twitter", label: "X / Twitter", value: social.twitter, href: social.twitter, icon: Twitter },
  ];

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.display_name,
    jobTitle: profile.professional_title,
    url: profileUrl,
    ...(profile.avatar_url ? { image: profile.avatar_url } : {}),
    ...(social.email ? { email: social.email } : {}),
    ...(profile.country
      ? {
          address: {
            "@type": "PostalAddress",
            addressCountry: profile.country,
          },
        }
      : {}),
    ...(skills.length
      ? { knowsAbout: skills.map((s) => skillParts(s).name) }
      : {}),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          {/* ── Identity ── */}
          <header className="relative overflow-hidden rounded-xl border border-border bg-card">
            {/* Ambient wash keyed to availability — green reads "hire me" at a glance */}
            <div
              className="pointer-events-none absolute -top-24 right-0 h-56 w-96 rounded-full bg-primary/10 blur-[100px]"
              aria-hidden
            />

            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.display_name}
                      fill
                      className="object-cover"
                      sizes="112px"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary">
                      <span className="font-display text-3xl font-bold text-muted-foreground">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
                    {profile.display_name}
                  </h1>

                  {profile.professional_title && (
                    <p className="mt-1.5 text-lg text-foreground/80">
                      {profile.professional_title}
                    </p>
                  )}

                  {/* The five facts that decide whether a recruiter reads on */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs text-muted-foreground">
                    {availability && (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${availability.chip}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${availability.dot}`} />
                        {availability.label}
                      </span>
                    )}
                    <span className="text-primary">@{profile.username}</span>
                    {headlineFacts.map((fact) => (
                      <span key={fact} className="flex items-center gap-3">
                        <span aria-hidden className="text-border">/</span>
                        {fact}
                      </span>
                    ))}
                  </div>

                  {/* Primary actions — a recruiter's next step is always contact */}
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {social.email && (
                      <a href={`mailto:${social.email}`}>
                        <Button size="sm">
                          <Mail className="mr-1.5 h-4 w-4" />
                          Email {profile.display_name.split(" ")[0]}
                        </Button>
                      </a>
                    )}
                    {profile.resume_url && (
                      <a href="#resume">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-1.5 h-4 w-4" />
                          Resume
                        </Button>
                      </a>
                    )}
                    <ShareButton url={profileUrl} />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* ── Body ── */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Main column */}
            <main className="min-w-0 space-y-10">
              {/* About */}
              <section>
                <SectionHeading title="About" />
                {profile.about ? (
                  <div className="rounded-xl border border-border bg-card p-6">
                    <ProfileAbout content={profile.about} />
                  </div>
                ) : (
                  <EmptySection message="This candidate hasn't written an introduction yet." />
                )}
              </section>

              {/* Skills */}
              <section>
                <SectionHeading title="Skills" count={skills.length} />
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => {
                      const { name, slug } = skillParts(skill);
                      return slug ? (
                        <Link key={slug} href={`/skill/${slug}`}>
                          <Badge
                            variant="secondary"
                            className="cursor-pointer px-3 py-1 text-sm transition-colors hover:bg-secondary/60"
                          >
                            {name}
                          </Badge>
                        </Link>
                      ) : (
                        <Badge key={name} variant="secondary" className="px-3 py-1 text-sm">
                          {name}
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <EmptySection message="No skills listed." />
                )}
              </section>

              {/* Experience */}
              <section>
                <SectionHeading icon={Briefcase} title="Experience" count={experiences.length} />
                {experiences.length > 0 ? (
                  <ol className="relative ml-[7px] border-l border-border">
                    {experiences.map((exp, idx) => {
                      const current = exp.is_current || !exp.end_date;
                      return (
                        <li key={exp.id ?? idx} className="relative pb-6 pl-7 last:pb-0">
                          <span
                            className={`absolute -left-[7px] top-5 h-3.5 w-3.5 rounded-full border-2 ${
                              current
                                ? "border-primary bg-primary"
                                : "border-border bg-card"
                            }`}
                            aria-hidden
                          />
                          <article className="rounded-xl border border-border bg-card p-5">
                            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                              <div className="min-w-0">
                                <h3 className="font-semibold text-foreground">{exp.role}</h3>
                                <p className="text-sm text-muted-foreground">{exp.company}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                {exp.employment_type && (
                                  <Badge variant="outline" className="text-xs">
                                    {exp.employment_type}
                                  </Badge>
                                )}
                                {current && (
                                  <Badge className="border-primary/25 bg-primary/10 text-xs text-primary">
                                    Current
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                              <span>
                                {formatMonthYear(exp.start_date) || "—"}
                                {" → "}
                                {exp.end_date ? formatMonthYear(exp.end_date) : "Present"}
                              </span>
                              {exp.location && (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {exp.location}
                                </span>
                              )}
                            </div>

                            {exp.description && (
                              <div className="mt-3 border-t border-border/60 pt-3">
                                <ProfileAbout content={exp.description} />
                              </div>
                            )}
                          </article>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <EmptySection message="No work experience added." />
                )}
              </section>

              {/* Education */}
              <section>
                <SectionHeading icon={GraduationCap} title="Education" count={education.length} />
                {education.length > 0 ? (
                  <ol className="relative ml-[7px] border-l border-border">
                    {education.map((edu, idx) => (
                      <li key={edu.id ?? idx} className="relative pb-6 pl-7 last:pb-0">
                        <span
                          className="absolute -left-[7px] top-5 h-3.5 w-3.5 rounded-full border-2 border-border bg-card"
                          aria-hidden
                        />
                        <article className="rounded-xl border border-border bg-card p-5">
                          <h3 className="font-semibold text-foreground">{edu.institution}</h3>
                          <p className="text-sm text-muted-foreground">
                            {edu.degree}
                            {edu.field_of_study ? ` · ${edu.field_of_study}` : ""}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                            {(edu.start_year || edu.end_year || edu.is_current) && (
                              <span>
                                {edu.start_year ?? "—"}
                                {" → "}
                                {edu.is_current ? "Present" : (edu.end_year ?? "—")}
                              </span>
                            )}
                            {edu.gpa && <span>GPA {edu.gpa}</span>}
                          </div>

                          {edu.description && (
                            <div className="mt-3 border-t border-border/60 pt-3">
                              <ProfileAbout content={edu.description} />
                            </div>
                          )}
                        </article>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <EmptySection message="No education added." />
                )}
              </section>

              {/* Certifications */}
              <section>
                <SectionHeading icon={Award} title="Certifications" count={certifications.length} />
                {certifications.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {certifications.map((cert, idx) => (
                      <article
                        key={cert.id ?? idx}
                        className="rounded-xl border border-border bg-card p-5"
                      >
                        <div className="flex items-start gap-2">
                          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground">{cert.name}</h3>
                            {cert.organization && (
                              <p className="text-sm text-muted-foreground">{cert.organization}</p>
                            )}
                          </div>
                        </div>

                        <dl className="mt-4">
                          <SpecRow label="Issued" value={formatMonthYear(cert.issue_date)} mono />
                          <SpecRow
                            label="Expires"
                            value={cert.expiration_date ? formatMonthYear(cert.expiration_date) : "No expiry"}
                            mono
                          />
                          <SpecRow label="Credential ID" value={cert.credential_id} mono />
                        </dl>

                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Verify credential
                          </a>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptySection message="No certifications added." />
                )}
              </section>

              {/* Resume */}
              <section id="resume" className="scroll-mt-20">
                <SectionHeading icon={FileText} title="Resume" />
                {profile.resume_url ? (
                  <ResumeViewer url={profile.resume_url} filename={profile.resume_filename} />
                ) : (
                  <EmptySection message="No resume uploaded." />
                )}
              </section>
            </main>

            {/* Sticky rail — the scannable spec sheet */}
            <aside className="lg:sticky lg:top-20 lg:h-fit lg:self-start">
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-5">
                  <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                    At a glance
                  </h2>
                  <dl>
                    <SpecRow label="Category" value={profile.category} />
                    <SpecRow label="Seniority" value={profile.experience_level} />
                    <SpecRow
                      label="Experience"
                      value={profile.years_of_experience ? `${profile.years_of_experience} yrs` : ""}
                      mono
                    />
                    <SpecRow
                      label="Open to"
                      value={
                        profile.employment_types?.length
                          ? profile.employment_types.join(", ")
                          : ""
                      }
                    />
                    <SpecRow
                      label="Notice"
                      value={
                        profile.notice_period_days != null
                          ? `${profile.notice_period_days} days`
                          : ""
                      }
                      mono
                    />
                    <SpecRow
                      label="Available from"
                      value={profile.available_from ? formatMonthYear(profile.available_from) : ""}
                      mono
                    />
                  </dl>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                    Location
                  </h2>
                  <dl>
                    <SpecRow
                      label="Country"
                      value={
                        profile.country ? (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            {profile.country}
                          </span>
                        ) : (
                          ""
                        )
                      }
                    />
                    <SpecRow label="Timezone" value={profile.timezone} mono />
                    <SpecRow
                      label="Local time"
                      value={
                        profile.timezone ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <LocalTime timezone={profile.timezone} />
                          </span>
                        ) : (
                          ""
                        )
                      }
                      mono
                    />
                  </dl>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                    Compensation
                  </h2>
                  {compensationPublic ? (
                    <dl>
                      <SpecRow
                        label="Per year"
                        value={formatAmount(profile.annual_salary)}
                        mono
                      />
                      <SpecRow
                        label="Per hour"
                        value={formatAmount(profile.hourly_rate)}
                        mono
                      />
                    </dl>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Shared privately on request.
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                    Contact
                  </h2>
                  <ul className="space-y-2.5">
                    {contactLinks.map(({ key, label, value, href, icon: Icon }) => (
                      <li key={key} className="flex items-center gap-2.5 text-sm">
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {value && href ? (
                          <a
                            href={href}
                            target={key === "email" ? undefined : "_blank"}
                            rel={key === "email" ? undefined : "noopener noreferrer"}
                            className="min-w-0 truncate text-foreground transition-colors hover:text-primary"
                            title={value}
                          >
                            {value.replace(/^https?:\/\//, "")}
                          </a>
                        ) : (
                          <span className="italic text-muted-foreground/50">
                            No {label.toLowerCase()}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {languages.length > 0 && (
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                      Languages
                    </h2>
                    <dl>
                      {languages.map((lang) => (
                        <SpecRow
                          key={languageName(lang)}
                          label={languageName(lang)}
                          value={lang.proficiency}
                        />
                      ))}
                    </dl>
                  </div>
                )}

                {profile.created_at && (
                  <p className="px-1 font-mono text-[11px] text-muted-foreground">
                    On Workway since {formatFullDate(profile.created_at)}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
