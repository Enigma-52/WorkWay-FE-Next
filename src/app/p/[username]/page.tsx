import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  MapPin,
  Clock,
  Calendar,
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import JsonLd from "@/components/seo/JsonLd";
import { backendGet } from "@/lib/api/server-client";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { LocalTime } from "./LocalTime";
import { ShareButton } from "./ShareButton";
import { ProfileAbout } from "./ProfileAbout";
import { getSiteUrl } from "@/lib/seo/metadata";

/* ---------- types ---------- */

interface Skill {
  name: string;
  slug?: string;
}

interface Language {
  language: string;
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
  start_year?: string;
  end_year?: string | null;
  gpa?: string | null;
  description?: string;
}

interface Certification {
  id?: number;
  name: string;
  organization?: string;
  issue_date?: string;
  expiry_date?: string | null;
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

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatFullDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function availabilityConfig(status?: string) {
  switch (status) {
    case "available":
      return { label: "Available", color: "bg-green-500/15 text-green-600 border-green-500/30" };
    case "open":
      return { label: "Open to Opportunities", color: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30" };
    case "not_available":
      return { label: "Not Available", color: "bg-zinc-500/15 text-zinc-500 border-zinc-500/30" };
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
    profile.about?.slice(0, 160) ||
    `${profile.display_name} on Workway`;

  return buildPageMetadata({
    title,
    description,
    path: `/profile/${username}`,
    image: profile.avatar_url || "/logo.png",
    keywords: [
      profile.display_name,
      profile.professional_title,
      profile.category,
      ...(profile.skills?.slice(0, 5).map((s) => s.name) ?? []),
    ].filter(Boolean) as string[],
  });
}

/* ---------- page ---------- */

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = await fetchProfile(username);
  const siteUrl = getSiteUrl();
  const profileUrl = `${siteUrl}/profile/${username}`;

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <div className="text-center">
          <User className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
          <h1 className="text-2xl font-bold text-foreground">
            Profile Not Found
          </h1>
          <p className="mt-2 text-muted-foreground">
            The profile you are looking for does not exist or has been removed.
          </p>
          <Link href="/">
            <Button variant="outline" className="mt-6">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const availability = availabilityConfig(profile.availability_status);
  const showCompensation =
    profile.compensation_visibility === "public" &&
    (profile.hourly_rate || profile.annual_salary);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.display_name,
    jobTitle: profile.professional_title,
    url: profileUrl,
    ...(profile.avatar_url ? { image: profile.avatar_url } : {}),
    ...(profile.country
      ? {
          address: {
            "@type": "PostalAddress",
            addressCountry: profile.country,
          },
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="flex justify-center bg-background">
        <div className="w-full max-w-4xl px-4 py-8">
          {/* ── Hero ── */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Accent band */}
            <div className="h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

            <div className="flex flex-col items-start gap-6 sm:flex-row p-6">
              {/* Avatar */}
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-muted ring-4 ring-primary/5">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {profile.display_name}
                  </h1>
                  {profile.professional_title && (
                    <p className="text-lg text-muted-foreground">
                      {profile.professional_title}
                    </p>
                  )}
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2">
                  {profile.category && (
                    <Badge variant="secondary">{profile.category}</Badge>
                  )}
                  {profile.experience_level && (
                    <Badge variant="outline">{profile.experience_level}</Badge>
                  )}
                  {profile.years_of_experience && (
                    <Badge variant="outline">
                      {profile.years_of_experience} years
                    </Badge>
                  )}
                  {availability && (
                    <Badge className={availability.color}>
                      {availability.label}
                    </Badge>
                  )}
                </div>

                {/* Location & time */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {profile.country && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {profile.country}
                    </span>
                  )}
                  {profile.timezone && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {profile.timezone}
                      {" ("}
                      <LocalTime timezone={profile.timezone} />
                      {")"}
                    </span>
                  )}
                </div>

                {/* Compensation */}
                {showCompensation && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {profile.hourly_rate && (
                      <span>Hourly: {profile.hourly_rate}</span>
                    )}
                    {profile.annual_salary && (
                      <span>Annual: {profile.annual_salary}</span>
                    )}
                  </div>
                )}

                {/* Employment types & availability */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {profile.employment_types &&
                    profile.employment_types.length > 0 && (
                      <span>
                        {profile.employment_types.join(" / ")}
                      </span>
                    )}
                  {profile.available_from && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Available from {formatDate(profile.available_from)}
                    </span>
                  )}
                  {profile.notice_period_days != null &&
                    profile.notice_period_days > 0 && (
                      <span>
                        {profile.notice_period_days}-day notice
                      </span>
                    )}
                </div>

                {/* Member since */}
                {profile.created_at && (
                  <p className="text-xs text-muted-foreground">
                    Member since {formatFullDate(profile.created_at)}
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <ShareButton url={profileUrl} />
                  {profile.resume_url && (
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <FileText className="mr-1.5 h-4 w-4" />
                        Download Resume
                      </Button>
                    </a>
                  )}
                </div>

                {/* Social links */}
                {profile.social_links && (
                  <div className="flex items-center gap-3 pt-1">
                    {profile.social_links.github && (
                      <a
                        href={profile.social_links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="GitHub"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links.linkedin && (
                      <a
                        href={profile.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links.twitter && (
                      <a
                        href={profile.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links.website && (
                      <a
                        href={profile.social_links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Website"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                    {profile.social_links.email && (
                      <a
                        href={`mailto:${profile.social_links.email}`}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Email"
                      >
                        <Mail className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── About ── */}
          {profile.about && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                About
              </h2>
              <div className="rounded-xl border border-border bg-card p-6">
                <ProfileAbout content={profile.about} />
              </div>
            </section>
          )}

          {/* ── Skills ── */}
          {profile.skills && profile.skills.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) =>
                  skill.slug ? (
                    <Link key={skill.slug} href={`/skill/${skill.slug}`}>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer transition-colors hover:bg-secondary/60"
                      >
                        {skill.name}
                      </Badge>
                    </Link>
                  ) : (
                    <Badge key={skill.name} variant="secondary">
                      {skill.name}
                    </Badge>
                  ),
                )}
              </div>
            </section>
          )}

          {/* ── Languages ── */}
          {profile.languages && profile.languages.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Languages
              </h2>
              <div className="flex flex-wrap gap-3">
                {profile.languages.map((lang) => (
                  <div
                    key={lang.language}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm"
                  >
                    <span className="font-medium text-foreground">
                      {lang.language}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {lang.proficiency}
                    </Badge>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Experience ── */}
          {profile.experiences && profile.experiences.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Briefcase className="h-5 w-5" />
                Experience
              </h2>
              <div className="relative space-y-0 pl-6">
                {/* vertical line */}
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />

                {profile.experiences.map((exp, idx) => (
                  <div key={exp.id ?? idx} className="relative pb-8 last:pb-0">
                    {/* dot */}
                    <div
                      className={`absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 ring-2 ${
                        exp.is_current || !exp.end_date
                          ? "border-green-500 bg-green-500 ring-green-500/20"
                          : "border-border bg-card ring-border/20"
                      }`}
                    />

                    <div className="rounded-xl border border-border bg-card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-foreground">
                            {exp.role}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {exp.company}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {exp.employment_type && (
                            <Badge variant="outline" className="text-xs">
                              {exp.employment_type}
                            </Badge>
                          )}
                          {(exp.is_current || !exp.end_date) && (
                            <Badge className="bg-green-500/15 text-green-600 border-green-500/30 text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>
                          {formatDate(exp.start_date)} &ndash;{" "}
                          {exp.end_date ? formatDate(exp.end_date) : "Present"}
                        </span>
                        {exp.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </span>
                        )}
                      </div>

                      {exp.description && (
                        <div className="mt-3">
                          <ProfileAbout content={exp.description} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Education ── */}
          {profile.education && profile.education.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <GraduationCap className="h-5 w-5" />
                Education
              </h2>
              <div className="relative space-y-0 pl-6">
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />

                {profile.education.map((edu, idx) => (
                  <div key={edu.id ?? idx} className="relative pb-8 last:pb-0">
                    <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-border bg-card ring-2 ring-border/20" />

                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-bold text-foreground">
                        {edu.institution}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {edu.degree}
                        {edu.field_of_study ? ` in ${edu.field_of_study}` : ""}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {(edu.start_year || edu.end_year) && (
                          <span>
                            {edu.start_year ?? ""}
                            {edu.start_year && edu.end_year ? " – " : ""}
                            {edu.end_year ?? ""}
                          </span>
                        )}
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      </div>

                      {edu.description && (
                        <div className="mt-3">
                          <ProfileAbout content={edu.description} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Certifications ── */}
          {profile.certifications && profile.certifications.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Award className="h-5 w-5" />
                Certifications
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {profile.certifications.map((cert, idx) => (
                  <div
                    key={cert.id ?? idx}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <h3 className="font-bold text-foreground">{cert.name}</h3>
                    {cert.organization && (
                      <p className="text-sm text-muted-foreground">
                        {cert.organization}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {cert.issue_date && (
                        <span>Issued {formatDate(cert.issue_date)}</span>
                      )}
                      {cert.expiry_date && (
                        <span>Expires {formatDate(cert.expiry_date)}</span>
                      )}
                    </div>

                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Credential
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Resume ── */}
          {profile.resume_url && (
            <section className="mt-12">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Resume
              </h2>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {profile.resume_filename || "Resume"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF Document
                    </p>
                  </div>
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-1.5 h-4 w-4" />
                      View Resume
                    </Button>
                  </a>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
