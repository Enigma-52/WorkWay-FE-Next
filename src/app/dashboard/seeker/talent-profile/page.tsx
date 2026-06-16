"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  User,
  Pencil,
  FileText,
  Loader2,
  Globe,
  MapPin,
  Briefcase,
} from "lucide-react";

type TalentProfile = {
  id: number;
  username: string;
  display_name: string;
  professional_title: string;
  category: string;
  experience_level: string;
  years_of_experience: number;
  bio: string;
  availability_status: string;
  employment_types: string[];
  notice_period_days: number | null;
  hourly_rate: string | null;
  annual_salary: string | null;
  compensation_visibility: string;
  skills: { name: string; slug: string }[];
  languages: { language: string; proficiency: string }[];
  country: string;
  timezone: string;
  social_links: Record<string, string>;
  avatar_url: string | null;
  resume_url: string | null;
  resume_filename: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  experiences?: any[];
  education?: any[];
  certifications?: any[];
};

const statusLabels: Record<string, string> = {
  available: "Available for hire",
  open: "Open to opportunities",
  not_available: "Not currently available",
};

const statusStyles: Record<string, string> = {
  available: "bg-green-500/10 text-green-400 border-green-500/20",
  open: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  not_available: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TalentProfilePage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    fetchProfile();
  }, [sessionStatus]);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/talent-profiles");
      if (res.status === 404) {
        setProfile(null);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      // Backend returns { profile: null } when no profile exists
      // or { profile: { ... } } when it does
      const p = data?.profile ?? data;
      if (!p || !p.username) {
        setProfile(null);
      } else {
        setProfile(p);
      }
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function toggleVisibility() {
    if (!profile) return;
    const newStatus = profile.status === "published" ? "offline" : "published";
    setToggling(true);
    try {
      const res = await fetch("/api/talent-profiles/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      setProfile({ ...profile, status: newStatus });
      toast.success(
        newStatus === "published"
          ? "Profile is now published"
          : "Profile is now offline"
      );
    } catch {
      toast.error("Failed to update visibility");
    } finally {
      setToggling(false);
    }
  }

  async function copyProfileUrl() {
    if (!profile) return;
    const url = `${window.location.origin}/profile/${profile.username}`;
    await navigator.clipboard.writeText(url);
    toast.success("Profile URL copied to clipboard");
  }

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Resume must be under 2MB");
      return;
    }

    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await fetch("/api/talent-profiles/resume", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              resume_url: data.resume_url ?? prev.resume_url,
              resume_filename: file.name,
            }
          : prev
      );
      toast.success("Resume uploaded successfully");
    } catch {
      toast.error("Failed to upload resume");
    } finally {
      setUploadingResume(false);
      e.target.value = "";
    }
  }

  async function deleteResume() {
    setDeletingResume(true);
    try {
      const res = await fetch("/api/talent-profiles/resume", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setProfile((prev) =>
        prev ? { ...prev, resume_url: null, resume_filename: null } : prev
      );
      toast.success("Resume deleted");
    } catch {
      toast.error("Failed to delete resume");
    } finally {
      setDeletingResume(false);
    }
  }

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">
          Please sign in to manage your talent profile.
        </p>
      </div>
    );
  }

  // No profile — show create prompt
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Talent Profile</h1>
          <p className="text-muted-foreground text-sm">
            Create your public talent profile and get discovered by employers.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <User className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-lg font-semibold mb-2">
            Create your Talent Profile
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Build a professional profile that showcases your skills, experience,
            and availability. Share it with a single link.
          </p>
          <Button asChild>
            <Link href="/dashboard/seeker/talent-profile/create">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isPublished = profile.status === "published";
  const skillsList = Array.isArray(profile.skills)
    ? profile.skills.map((s) => (typeof s === "string" ? s : s.name))
    : [];

  // Profile management view
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Talent Profile</h1>
        <p className="text-muted-foreground text-sm">
          Manage your public talent profile and visibility settings.
        </p>
      </div>

      {/* Profile hero card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <div className="px-6 lg:px-8 pb-6 -mt-10">
          <div className="flex items-end gap-5 mb-5">
            <div className="w-20 h-20 rounded-xl bg-card border-4 border-card flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-3 mb-0.5">
                <h2 className="text-xl font-bold truncate">
                  {profile.display_name}
                </h2>
                <Badge
                  variant={isPublished ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {isPublished ? "Published" : "Offline"}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {profile.professional_title}
              </p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground mb-4">
            <span>@{profile.username}</span>
            {profile.category && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {profile.category}
              </span>
            )}
            {profile.country && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profile.country}
              </span>
            )}
            {profile.experience_level && (
              <span>{profile.experience_level}</span>
            )}
          </div>

          {/* Availability badge */}
          {profile.availability_status && (
            <Badge
              variant="outline"
              className={statusStyles[profile.availability_status] ?? ""}
            >
              {statusLabels[profile.availability_status] ??
                profile.availability_status}
            </Badge>
          )}

          {/* Skills preview */}
          {skillsList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {skillsList.slice(0, 8).map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-md bg-secondary border border-border text-muted-foreground"
                >
                  {s}
                </span>
              ))}
              {skillsList.length > 8 && (
                <span className="text-xs px-2.5 py-1 text-muted-foreground">
                  +{skillsList.length - 8} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Link href="/dashboard/seeker/talent-profile/create">
          <Button variant="outline" className="w-full">
            <Pencil className="w-4 h-4 mr-1.5" />
            Edit Profile
          </Button>
        </Link>
        <a
          href={`/profile/${profile.username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="w-full">
            <ExternalLink className="w-4 h-4 mr-1.5" />
            Preview
          </Button>
        </a>
        <Button variant="outline" onClick={copyProfileUrl}>
          <Copy className="w-4 h-4 mr-1.5" />
          Copy URL
        </Button>
        <Button
          variant="outline"
          onClick={toggleVisibility}
          disabled={toggling}
        >
          {toggling ? (
            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
          ) : isPublished ? (
            <EyeOff className="w-4 h-4 mr-1.5" />
          ) : (
            <Eye className="w-4 h-4 mr-1.5" />
          )}
          {isPublished ? "Unpublish" : "Publish"}
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">
            {profile.experiences?.length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Experience</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">
            {profile.education?.length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Education</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{skillsList.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Skills</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">
            {profile.certifications?.length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Certifications</p>
        </div>
      </div>

      {/* Profile link + dates */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Public URL</span>
        </div>
        <div className="flex items-center gap-3">
          <code className="flex-1 text-xs bg-secondary rounded-lg px-3 py-2 text-muted-foreground truncate">
            {typeof window !== "undefined" ? window.location.origin : ""}/profile/{profile.username}
          </code>
          <Button variant="ghost" size="sm" onClick={copyProfileUrl}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
          <span>Created {formatDate(profile.created_at)}</span>
          <span>Updated {formatDate(profile.updated_at)}</span>
        </div>
      </div>

      {/* Resume section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Resume</h3>
          </div>
        </div>

        {profile.resume_url ? (
          <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile.resume_filename ?? "Resume"}
                </p>
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View resume
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <label className="cursor-pointer">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  disabled={uploadingResume}
                >
                  <span>
                    {uploadingResume ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </span>
                </Button>
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteResume}
                disabled={deletingResume}
              >
                {deletingResume ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 text-destructive" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-3">
              No resume uploaded yet.
            </p>
            <label className="cursor-pointer">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
              />
              <Button variant="outline" size="sm" asChild>
                <span>
                  {uploadingResume ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-1.5" />
                  )}
                  Upload Resume
                </span>
              </Button>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
