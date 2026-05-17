"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserCircle,
  MapPin,
  Clock,
  Banknote,
  Languages,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Pencil,
  Plus,
  Calendar,
  CheckCircle2,
  XCircle,
  EyeOff,
  FileText,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Profile = {
  username: string;
  title: string;
  category: string;
  experience: string;
  yearsOfExperience: string;
  about: string;
  status: string;
  employmentTypes: string[];
  noticePeriod: string;
  availableFrom: string;
  country: string;
  timezone: string;
  hourlyRate: string;
  yearlySalary: string;
  languages: string[];
  skills: string[];
  email: string;
  website: string;
  github: string;
  twitter: string;
  linkedin: string;
  employments: {
    yearStart: string;
    yearEnd: string;
    title: string;
    company: string;
    website: string;
    responsibilities: string;
  }[];
  educations: {
    yearStart: string;
    yearEnd: string;
    degree: string;
    institution: string;
    website: string;
  }[];
  avatarUrl?: string;
};

function StatusBadge({ status }: { status: string }) {
  if (status === "available")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">
        <CheckCircle2 className="w-3 h-3" /> Available
      </span>
    );
  if (status === "unavailable")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
        <XCircle className="w-3 h-3" /> Unavailable
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border">
      <EyeOff className="w-3 h-3" /> Hidden
    </span>
  );
}

export default function HireMeProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hireme/profile")
      .then((r) => {
        if (!r.ok) throw new Error("no profile");
        return r.json();
      })
      .then((d) => setProfile(d.profile ?? d))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl">
        <div className="mb-8">
          <div className="h-8 w-48 bg-secondary/50 rounded animate-pulse mb-2" />
          <div className="h-4 w-72 bg-secondary/30 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <div className="h-96 bg-card border border-border rounded-xl animate-pulse" />
          <div className="h-96 bg-card border border-border rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Hire Me Profile</h1>
          <p className="text-muted-foreground text-sm">
            Let companies discover and contact you directly.
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No profile yet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Create your Hire Me profile to showcase your skills, experience, and
            availability. Companies can discover you and reach out directly.
          </p>
          <Link href="/dashboard/seeker/hireme/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasContact = profile.email || profile.website || profile.github || profile.twitter || profile.linkedin;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Hire Me Profile</h1>
          <p className="text-muted-foreground text-sm">
            Preview how your profile appears to companies.
          </p>
        </div>
        <Link href="/dashboard/seeker/hireme/create">
          <Button variant="outline" size="sm" className="gap-2">
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left column — Identity */}
        <div className="space-y-4">
          {/* Card: Avatar + name */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-20 h-20 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4 overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              {profile.title && (
                <h2 className="text-lg font-semibold mb-1">{profile.title}</h2>
              )}
              {profile.category && (
                <p className="text-xs text-primary font-medium mb-2">{profile.category}</p>
              )}
              <StatusBadge status={profile.status} />
              {profile.username && (
                <p className="text-xs text-muted-foreground mt-3">
                  workway.works/@{profile.username}
                </p>
              )}
            </div>

            {/* Quick info */}
            <div className="space-y-3 pt-4 border-t border-border">
              {profile.experience && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Level:</span>
                  <span className="font-medium ml-auto">{profile.experience}</span>
                </div>
              )}
              {profile.yearsOfExperience && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-medium ml-auto">{profile.yearsOfExperience} years</span>
                </div>
              )}
              {profile.country && (
                <div className="flex items-center gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium ml-auto">{profile.country}</span>
                </div>
              )}
              {profile.timezone && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Timezone:</span>
                  <span className="font-medium ml-auto text-xs">{profile.timezone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card: Compensation */}
          {(profile.hourlyRate || profile.yearlySalary) && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-muted-foreground" />
                Compensation
              </h3>
              <div className="space-y-2">
                {profile.hourlyRate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hourly (min)</span>
                    <span className="font-medium">${profile.hourlyRate}/hr</span>
                  </div>
                )}
                {profile.yearlySalary && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Yearly (min)</span>
                    <span className="font-medium">${Number(profile.yearlySalary).toLocaleString()}/yr</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Card: Availability */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Availability
            </h3>
            <div className="space-y-2">
              {profile.employmentTypes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {profile.employmentTypes.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-[11px] bg-secondary text-muted-foreground border border-border">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {profile.availableFrom && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available from</span>
                  <span className="font-medium">
                    {new Date(profile.availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              )}
              {profile.noticePeriod && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Notice period</span>
                  <span className="font-medium">{profile.noticePeriod} days</span>
                </div>
              )}
            </div>
          </div>

          {/* Card: Languages */}
          {profile.languages.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Languages className="w-4 h-4 text-muted-foreground" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.languages.map((l) => (
                  <span key={l} className="px-2.5 py-1 rounded-lg text-xs bg-secondary text-foreground border border-border">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Card: Contact */}
          {hasContact && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Contact
              </h3>
              <div className="space-y-2.5">
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{profile.website.replace(/^https?:\/\//, "")}</span>
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Github className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{profile.github.replace(/^https?:\/\/(www\.)?github\.com\//, "@")}</span>
                  </a>
                )}
                {profile.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{profile.twitter.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//, "@")}</span>
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column — Content */}
        <div className="space-y-6">
          {/* About */}
          {profile.about && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-sm font-semibold mb-4">About</h3>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {profile.about}
              </div>
            </div>
          )}

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-muted-foreground" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Employment History */}
          {profile.employments.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-sm font-semibold mb-5 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                Employment History
              </h3>
              <div className="space-y-0">
                {profile.employments.map((emp, i) => (
                  <div key={i} className="relative pl-6 pb-6 last:pb-0">
                    {/* Timeline line */}
                    {i < profile.employments.length - 1 && (
                      <div className="absolute left-[7px] top-3 bottom-0 w-px bg-border" />
                    )}
                    {/* Dot */}
                    <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 ${
                      !emp.yearEnd ? "border-primary bg-primary/20" : "border-border bg-card"
                    }`} />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{emp.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm text-primary">{emp.company}</span>
                          {emp.website && (
                            <a href={emp.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                        {emp.yearStart}{emp.yearEnd ? ` – ${emp.yearEnd}` : " – Present"}
                      </span>
                    </div>
                    {emp.responsibilities && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed whitespace-pre-wrap">
                        {emp.responsibilities}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.educations.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-sm font-semibold mb-5 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                Education
              </h3>
              <div className="space-y-0">
                {profile.educations.map((edu, i) => (
                  <div key={i} className="relative pl-6 pb-6 last:pb-0">
                    {i < profile.educations.length - 1 && (
                      <div className="absolute left-[7px] top-3 bottom-0 w-px bg-border" />
                    )}
                    <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-border bg-card" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{edu.degree}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm text-primary">{edu.institution}</span>
                          {edu.website && (
                            <a href={edu.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                        {edu.yearStart}{edu.yearEnd ? ` – ${edu.yearEnd}` : " – Present"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state for right column if nothing filled */}
          {!profile.about && profile.skills.length === 0 && profile.employments.length === 0 && profile.educations.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Your profile looks a bit empty. Add more details to stand out.
              </p>
              <Link href="/dashboard/seeker/hireme/create">
                <Button variant="outline" size="sm" className="gap-2">
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
