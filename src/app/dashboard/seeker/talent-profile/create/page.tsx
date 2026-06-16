"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Loader2,
  X,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Upload,
  User,
  ChevronDown,
  ChevronUp,
  Pencil,
  GripVertical,
} from "lucide-react";
import {
  CATEGORIES,
  EXPERIENCE_LEVELS,
  EMPLOYMENT_TYPES,
  AVAILABILITY_STATUSES,
  LANGUAGE_PROFICIENCIES,
  COMMON_SKILLS,
  COMMON_LANGUAGES,
  RESERVED_USERNAMES,
} from "../constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type UsernameStatus = "idle" | "too_short" | "invalid" | "reserved" | "checking" | "available" | "taken";
type LanguageEntry = { name: string; proficiency: string };

type ExperienceEntry = {
  _key: string;
  id?: number;
  company: string;
  role: string;
  employment_type: string;
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
  is_current: boolean;
  location: string;
  description: string;
};

type EducationEntry = {
  _key: string;
  id?: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_year: string;
  end_year: string;
  is_current: boolean;
  description: string;
  gpa: string;
};

type CertificationEntry = {
  _key: string;
  id?: number;
  name: string;
  organization: string;
  issue_date: string;
  expiration_date: string;
  credential_id: string;
  credential_url: string;
};

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "INR", symbol: "₹", label: "INR (₹)" },
  { code: "CAD", symbol: "C$", label: "CAD (C$)" },
  { code: "AUD", symbol: "A$", label: "AUD (A$)" },
  { code: "JPY", symbol: "¥", label: "JPY (¥)" },
  { code: "CNY", symbol: "¥", label: "CNY (¥)" },
  { code: "SGD", symbol: "S$", label: "SGD (S$)" },
  { code: "CHF", symbol: "Fr", label: "CHF (Fr)" },
  { code: "AED", symbol: "د.إ", label: "AED (د.إ)" },
  { code: "BRL", symbol: "R$", label: "BRL (R$)" },
  { code: "SEK", symbol: "kr", label: "SEK (kr)" },
  { code: "PLN", symbol: "zł", label: "PLN (zł)" },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const PROFESSIONAL_TITLE_SUGGESTIONS = [
  "Software Engineer", "Senior Software Engineer", "Staff Software Engineer",
  "Frontend Developer", "Backend Developer", "Full-Stack Developer",
  "DevOps Engineer", "Data Scientist", "Machine Learning Engineer",
  "Product Manager", "UX Designer", "UI Designer", "Mobile Developer",
  "iOS Developer", "Android Developer", "Cloud Architect",
  "Solutions Architect", "QA Engineer", "Security Engineer", "Technical Writer",
];

let _keyCounter = 0;
function nextKey() { return `k_${++_keyCounter}_${Date.now()}`; }

function emptyExperience(): ExperienceEntry {
  return { _key: nextKey(), company: "", role: "", employment_type: "Full-time", start_month: "", start_year: "", end_month: "", end_year: "", is_current: false, location: "", description: "" };
}
function emptyEducation(): EducationEntry {
  return { _key: nextKey(), institution: "", degree: "", field_of_study: "", start_year: "", end_year: "", is_current: false, description: "", gpa: "" };
}
function emptyCertification(): CertificationEntry {
  return { _key: nextKey(), name: "", organization: "", issue_date: "", expiration_date: "", credential_id: "", credential_url: "" };
}

// ---------------------------------------------------------------------------
// Reorder helper
// ---------------------------------------------------------------------------
function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TalentProfileCreatePage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const [isEditMode, setIsEditMode] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Basics
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [displayName, setDisplayName] = useState("");
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [category, setCategory] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");

  // About
  const [bio, setBio] = useState("");

  // Availability
  const [availabilityStatus, setAvailabilityStatus] = useState("available");
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<string[]>([]);
  const [noticePeriod, setNoticePeriod] = useState("");

  // Compensation
  const [currency, setCurrency] = useState("USD");
  const [hourlyRate, setHourlyRate] = useState("");
  const [annualSalary, setAnnualSalary] = useState("");
  const [compensationVisibility, setCompensationVisibility] = useState("public");

  // Skills & Languages
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [languages, setLanguages] = useState<LanguageEntry[]>([]);
  const skillInputRef = useRef<HTMLInputElement>(null);

  // Location
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const timezones = useMemo(() => {
    try { return Intl.supportedValuesOf("timeZone"); } catch { return []; }
  }, []);

  // Social Links
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");

  // Photo & Resume
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);
  const [existingResumeFilename, setExistingResumeFilename] = useState<string | null>(null);

  // Experience, Education, Certifications
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);
  const [editingExpKey, setEditingExpKey] = useState<string | null>(null);
  const [educations, setEducations] = useState<EducationEntry[]>([]);
  const [editingEduKey, setEditingEduKey] = useState<string | null>(null);
  const [certifications, setCertifications] = useState<CertificationEntry[]>([]);
  const [editingCertKey, setEditingCertKey] = useState<string | null>(null);

  const [originalUsername, setOriginalUsername] = useState("");

  // -------------------------------------------------------------------------
  // Load existing profile
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    (async () => {
      try {
        const res = await fetch("/api/talent-profiles");
        if (res.ok) {
          const data = await res.json();
          if (data && !data.error && data.username) {
            prefillFromProfile(data);
            setIsEditMode(true);
          }
        }
      } catch { /* no profile */ } finally { setInitialLoading(false); }
    })();
  }, [sessionStatus]);

  function prefillFromProfile(p: Record<string, unknown>) {
    setUsername((p.username as string) ?? "");
    setOriginalUsername((p.username as string) ?? "");
    setDisplayName((p.display_name as string) ?? "");
    setProfessionalTitle((p.professional_title as string) ?? "");
    setCategory((p.category as string) ?? "");
    setExperienceLevel((p.experience_level as string) ?? "");
    setYearsOfExperience(p.years_of_experience != null ? String(p.years_of_experience) : "");
    setBio((p.about as string) ?? (p.bio as string) ?? "");
    setAvailabilityStatus((p.availability_status as string) ?? "available");
    setSelectedEmploymentTypes(Array.isArray(p.employment_types) ? (p.employment_types as string[]) : []);
    setNoticePeriod(p.notice_period_days != null ? String(p.notice_period_days) : "");
    setCurrency((p.currency as string) ?? "USD");
    setHourlyRate(p.hourly_rate != null ? String(p.hourly_rate) : "");
    setAnnualSalary(p.annual_salary != null ? String(p.annual_salary) : "");
    setCompensationVisibility((p.compensation_visibility as string) ?? "public");
    setSkills(Array.isArray(p.skills) ? (p.skills as string[]) : []);
    setLanguages(Array.isArray(p.languages) ? (p.languages as LanguageEntry[]) : []);
    setCountry((p.country as string) ?? "");
    setTimezone((p.timezone as string) ?? "");
    const social = (p.social_links ?? {}) as Record<string, string>;
    setEmail(social.email ?? (p.email as string) ?? "");
    setWebsite(social.website ?? (p.website as string) ?? "");
    setGithub(social.github ?? (p.github as string) ?? "");
    setLinkedin(social.linkedin ?? (p.linkedin as string) ?? "");
    setTwitter(social.twitter ?? (p.twitter as string) ?? "");
    setExistingAvatarUrl((p.avatar_url as string) ?? null);
    setExistingResumeFilename((p.resume_filename as string) ?? null);

    if (Array.isArray(p.experiences)) {
      setExperiences((p.experiences as Record<string, unknown>[]).map((exp) => ({
        _key: nextKey(), id: exp.id as number | undefined, company: (exp.company as string) ?? "", role: (exp.role as string) ?? "",
        employment_type: (exp.employment_type as string) ?? "Full-time", start_month: (exp.start_month as string) ?? "",
        start_year: exp.start_year != null ? String(exp.start_year) : "", end_month: (exp.end_month as string) ?? "",
        end_year: exp.end_year != null ? String(exp.end_year) : "", is_current: (exp.is_current as boolean) ?? false,
        location: (exp.location as string) ?? "", description: (exp.description as string) ?? "",
      })));
    }
    if (Array.isArray(p.education)) {
      setEducations((p.education as Record<string, unknown>[]).map((edu) => ({
        _key: nextKey(), id: edu.id as number | undefined, institution: (edu.institution as string) ?? "", degree: (edu.degree as string) ?? "",
        field_of_study: (edu.field_of_study as string) ?? "", start_year: edu.start_year != null ? String(edu.start_year) : "",
        end_year: edu.end_year != null ? String(edu.end_year) : "", is_current: (edu.is_current as boolean) ?? false,
        description: (edu.description as string) ?? "", gpa: edu.gpa != null ? String(edu.gpa) : "",
      })));
    }
    if (Array.isArray(p.certifications)) {
      setCertifications((p.certifications as Record<string, unknown>[]).map((cert) => ({
        _key: nextKey(), id: cert.id as number | undefined, name: (cert.name as string) ?? "", organization: (cert.organization as string) ?? "",
        issue_date: (cert.issue_date as string) ?? "", expiration_date: (cert.expiration_date as string) ?? "",
        credential_id: (cert.credential_id as string) ?? "", credential_url: (cert.credential_url as string) ?? "",
      })));
    }
  }

  // Username auto-suggest
  useEffect(() => {
    if (!username && session?.user?.displayName && !isEditMode) {
      const suggested = session.user.displayName.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").slice(0, 30);
      setUsername(suggested);
    }
  }, [session, isEditMode]);

  // Username validation with debounce
  useEffect(() => {
    if (username === originalUsername && isEditMode) { setUsernameStatus("available"); return; }
    if (username.length < 3) { setUsernameStatus("too_short"); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) { setUsernameStatus("invalid"); return; }
    if (RESERVED_USERNAMES.has(username.toLowerCase())) { setUsernameStatus("reserved"); return; }
    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/talent-profiles/check-username/${username}`);
        const data = await res.json();
        setUsernameStatus(data.available ? "available" : "taken");
      } catch { setUsernameStatus("idle"); }
    }, 500);
    return () => clearTimeout(timer);
  }, [username, originalUsername, isEditMode]);

  // Skill autocomplete
  const filteredSkillSuggestions = useMemo(() => {
    if (!skillInput.trim()) return [];
    const lower = skillInput.toLowerCase();
    return COMMON_SKILLS.filter((s) => s.toLowerCase().includes(lower) && !skills.includes(s)).slice(0, 8);
  }, [skillInput, skills]);

  const addSkill = useCallback((skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills((prev) => [...prev, trimmed]);
    setSkillInput(""); setShowSkillSuggestions(false); skillInputRef.current?.focus();
  }, [skills]);
  const removeSkill = useCallback((skill: string) => { setSkills((prev) => prev.filter((s) => s !== skill)); }, []);

  // Helpers
  function addLanguage() { setLanguages((prev) => [...prev, { name: "", proficiency: "Professional" }]); }
  function updateLanguage(idx: number, field: keyof LanguageEntry, value: string) { setLanguages((prev) => prev.map((lang, i) => (i === idx ? { ...lang, [field]: value } : lang))); }
  function removeLanguage(idx: number) { setLanguages((prev) => prev.filter((_, i) => i !== idx)); }
  function toggleEmploymentType(type: string) { setSelectedEmploymentTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]); }

  // Experience
  function addExperience() {
    const entry = emptyExperience();
    setExperiences((prev) => [...prev, entry]);
    setEditingExpKey(entry._key);
  }
  function updateExperience(key: string, field: keyof ExperienceEntry, value: string | boolean) {
    setExperiences((prev) => prev.map((e) => (e._key === key ? { ...e, [field]: value } : e)));
  }
  function removeExperience(key: string) { setExperiences((prev) => prev.filter((e) => e._key !== key)); if (editingExpKey === key) setEditingExpKey(null); }

  // Education
  function addEducation() {
    const entry = emptyEducation();
    setEducations((prev) => [...prev, entry]);
    setEditingEduKey(entry._key);
  }
  function updateEducation(key: string, field: keyof EducationEntry, value: string | boolean) {
    setEducations((prev) => prev.map((e) => (e._key === key ? { ...e, [field]: value } : e)));
  }
  function removeEducation(key: string) { setEducations((prev) => prev.filter((e) => e._key !== key)); if (editingEduKey === key) setEditingEduKey(null); }

  // Certifications
  function addCertification() {
    const entry = emptyCertification();
    setCertifications((prev) => [...prev, entry]);
    setEditingCertKey(entry._key);
  }
  function updateCertification(key: string, field: keyof CertificationEntry, value: string) {
    setCertifications((prev) => prev.map((e) => (e._key === key ? { ...e, [field]: value } : e)));
  }
  function removeCertification(key: string) { setCertifications((prev) => prev.filter((e) => e._key !== key)); if (editingCertKey === key) setEditingCertKey(null); }

  // File handlers
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Avatar must be under 5MB"); e.target.value = ""; return; }
    setAvatarFile(file); const reader = new FileReader(); reader.onload = () => setAvatarPreview(reader.result as string); reader.readAsDataURL(file);
  }
  function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Resume must be under 2MB"); e.target.value = ""; return; }
    setResumeFile(file);
  }

  // Submit
  async function handlePublish() {
    if (!username || usernameStatus === "taken" || usernameStatus === "reserved") {
      toast.error("Please fix the username before saving"); return;
    }
    setSubmitting(true);
    try {
      const currSymbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "$";
      const profileBody = {
        username, display_name: displayName, professional_title: professionalTitle, category,
        experience_level: experienceLevel, years_of_experience: yearsOfExperience || null,
        about: bio, availability_status: availabilityStatus, employment_types: selectedEmploymentTypes,
        notice_period_days: noticePeriod ? Number(noticePeriod) : null,
        hourly_rate: hourlyRate ? `${currSymbol}${hourlyRate}` : null,
        annual_salary: annualSalary ? `${currSymbol}${annualSalary}` : null,
        compensation_visibility: compensationVisibility, skills, languages, country, timezone,
        social_links: { email, website, github, linkedin, twitter },
      };
      const profileRes = await fetch("/api/talent-profiles", { method: isEditMode ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profileBody) });
      if (!profileRes.ok) { const err = await profileRes.json().catch(() => ({})); throw new Error((err as { error?: string }).error ?? "Failed to save profile"); }

      if (avatarFile) {
        const f = new FormData(); f.append("avatar", avatarFile);
        const r = await fetch("/api/talent-profiles/avatar", { method: "POST", body: f });
        if (!r.ok) toast.error("Profile saved but avatar upload failed");
      }
      if (resumeFile) {
        const f = new FormData(); f.append("resume", resumeFile);
        const r = await fetch("/api/talent-profiles/resume", { method: "POST", body: f });
        if (!r.ok) toast.error("Profile saved but resume upload failed");
      }
      for (const exp of experiences) {
        if (!exp.company && !exp.role) continue;
        await fetch("/api/talent-profiles/experiences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company: exp.company, role: exp.role, employment_type: exp.employment_type, start_date: exp.start_month && exp.start_year ? `${exp.start_year}-${String(MONTHS.indexOf(exp.start_month) + 1).padStart(2, "0")}` : null, end_date: exp.is_current ? null : (exp.end_month && exp.end_year ? `${exp.end_year}-${String(MONTHS.indexOf(exp.end_month) + 1).padStart(2, "0")}` : null), is_current: exp.is_current, location: exp.location, description: exp.description }) });
      }
      for (const edu of educations) {
        if (!edu.institution && !edu.degree) continue;
        await fetch("/api/talent-profiles/education", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ institution: edu.institution, degree: edu.degree, field_of_study: edu.field_of_study, start_year: edu.start_year ? Number(edu.start_year) : null, end_year: edu.is_current ? null : (edu.end_year ? Number(edu.end_year) : null), is_current: edu.is_current, description: edu.description, gpa: edu.gpa || null }) });
      }
      for (const cert of certifications) {
        if (!cert.name && !cert.organization) continue;
        await fetch("/api/talent-profiles/certifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: cert.name, organization: cert.organization, issue_date: cert.issue_date || null, expiration_date: cert.expiration_date || null, credential_id: cert.credential_id || null, credential_url: cert.credential_url || null }) });
      }
      toast.success(isEditMode ? "Profile updated!" : "Profile published!");
      router.push("/dashboard/seeker/talent-profile");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally { setSubmitting(false); }
  }

  // Username status UI
  function usernameStatusEl() {
    switch (usernameStatus) {
      case "too_short": return <span className="text-xs text-muted-foreground">Minimum 3 characters</span>;
      case "invalid": return <span className="text-xs text-destructive">Only letters, numbers, and underscores</span>;
      case "reserved": return <span className="text-xs text-destructive">This username is reserved</span>;
      case "checking": return <span className="text-xs text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Checking...</span>;
      case "available": return <span className="text-xs text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> Available</span>;
      case "taken": return <span className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Already taken</span>;
      default: return null;
    }
  }

  if (sessionStatus === "loading" || initialLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }
  if (!session) {
    return <div className="text-center py-20"><p className="text-muted-foreground">Please sign in to create your talent profile.</p></div>;
  }

  const currencyObj = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">
          {isEditMode ? "Edit Talent Profile" : "Create Talent Profile"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isEditMode ? "Update your profile information." : "Set up your profile to showcase your skills and availability."}
        </p>
      </div>

      <div className="space-y-6">
        {/* ── Basics ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold mb-5">Basic Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Username</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 30))} placeholder="your_username" maxLength={30} />
                <div className="mt-1">{usernameStatusEl()}</div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Display Name</label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="John Doe" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Professional Title</label>
              <Input value={professionalTitle} onChange={(e) => setProfessionalTitle(e.target.value)} placeholder="Senior Software Engineer" list="title-suggestions" />
              <datalist id="title-suggestions">{PROFESSIONAL_TITLE_SUGGESTIONS.map((t) => <option key={t} value={t} />)}</datalist>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Experience Level</label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{EXPERIENCE_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Years of Experience</label>
                <Input type="number" min="0" max="50" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} placeholder="5" />
              </div>
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold mb-1">About</h2>
          <p className="text-xs text-muted-foreground mb-4">Markdown supported</p>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell employers about yourself, your expertise, and what you're looking for..." rows={6} maxLength={2000} />
          <div className="flex justify-between mt-1.5">
            <span className={`text-xs ${bio.length < 50 ? "text-amber-500" : "text-muted-foreground"}`}>
              {bio.length < 50 ? `${50 - bio.length} more characters recommended` : ""}
            </span>
            <span className="text-xs text-muted-foreground">{bio.length}/2000</span>
          </div>
        </section>

        {/* ── Photo & Resume ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold mb-5">Photo & Resume</h2>
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-1">
              <label className="text-sm font-medium mb-3 block">Profile Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                  {avatarPreview ? <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    : existingAvatarUrl ? <img src={existingAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    : <User className="w-7 h-7 text-muted-foreground" />}
                </div>
                <div>
                  <label className="cursor-pointer">
                    <Input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatarChange} />
                    <Button variant="outline" size="sm" asChild><span><Upload className="w-4 h-4 mr-1.5" />{avatarPreview || existingAvatarUrl ? "Change" : "Upload"}</span></Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP. Max 5MB.</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-3 block">Resume</label>
              {resumeFile ? (
                <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
                  <span className="text-sm truncate">{resumeFile.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setResumeFile(null)}><X className="w-4 h-4" /></Button>
                </div>
              ) : existingResumeFilename ? (
                <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-3 mb-2"><span className="text-sm truncate">{existingResumeFilename}</span></div>
              ) : null}
              {!resumeFile && (
                <label className="cursor-pointer">
                  <Input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeChange} />
                  <Button variant="outline" size="sm" asChild><span><Upload className="w-4 h-4 mr-1.5" />{existingResumeFilename ? "Replace" : "Upload Resume"}</span></Button>
                </label>
              )}
              <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX. Max 2MB.</p>
            </div>
          </div>
        </section>

        {/* ── Availability & Compensation ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold mb-5">Availability & Compensation</h2>
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Status</label>
                <div className="space-y-2">
                  {AVAILABILITY_STATUSES.map((s) => (
                    <label key={s.value} className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${availabilityStatus === s.value ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50"}`}>
                      <input type="radio" name="availability" value={s.value} checked={availabilityStatus === s.value} onChange={(e) => setAvailabilityStatus(e.target.value)} className="accent-primary" />
                      <span className="text-sm">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-3 block">Employment Types</label>
                <div className="flex flex-wrap gap-2">
                  {EMPLOYMENT_TYPES.map((type) => (
                    <button key={type} type="button" onClick={() => toggleEmploymentType(type)} className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${selectedEmploymentTypes.includes(type) ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-muted-foreground/50"}`}>{type}</button>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium mb-1.5 block">Notice Period (days)</label>
                  <Input type="number" min="0" value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)} placeholder="14" className="max-w-[160px]" />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <div className="flex items-center gap-3 mb-4">
                <label className="text-sm font-medium">Currency</label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Hourly Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{currencyObj.symbol}</span>
                    <Input type="number" min="0" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="75" className="pl-8" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Annual Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{currencyObj.symbol}</span>
                    <Input type="number" min="0" value={annualSalary} onChange={(e) => setAnnualSalary(e.target.value)} placeholder="120000" className="pl-8" />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium mb-2 block">Visibility</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "public", label: "Public" },
                    { value: "recruiters", label: "Recruiters Only" },
                    { value: "hidden", label: "Hidden" },
                  ].map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setCompensationVisibility(opt.value)} className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${compensationVisibility === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-muted-foreground/50"}`}>{opt.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Skills & Languages ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold mb-5">Skills & Languages</h2>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Skills</label>
              <div className="relative">
                <Input ref={skillInputRef} value={skillInput} onChange={(e) => { setSkillInput(e.target.value); setShowSkillSuggestions(true); }} onFocus={() => setShowSkillSuggestions(true)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (filteredSkillSuggestions.length > 0) addSkill(filteredSkillSuggestions[0]); else if (skillInput.trim()) addSkill(skillInput); } }}
                  placeholder="Type a skill and press Enter..." />
                {showSkillSuggestions && filteredSkillSuggestions.length > 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredSkillSuggestions.map((s) => (
                      <button key={s} type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors" onMouseDown={(e) => { e.preventDefault(); addSkill(s); }}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive transition-colors"><X className="w-3 h-3" /></button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Languages</label>
                <Button type="button" variant="outline" size="sm" onClick={addLanguage}><Plus className="w-3 h-3 mr-1" /> Add</Button>
              </div>
              {languages.length === 0 && <p className="text-sm text-muted-foreground">No languages added yet.</p>}
              <div className="space-y-2">
                {languages.map((lang, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Input value={lang.name} onChange={(e) => updateLanguage(idx, "name", e.target.value)} placeholder="Language" list="language-suggestions" className="flex-1" />
                    <Select value={lang.proficiency} onValueChange={(v) => updateLanguage(idx, "proficiency", v)}>
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>{LANGUAGE_PROFICIENCIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeLanguage(idx)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
              <datalist id="language-suggestions">{COMMON_LANGUAGES.map((l) => <option key={l} value={l} />)}</datalist>
            </div>
          </div>
        </section>

        {/* ── Location & Links ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold mb-5">Location & Links</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1.5 block">Country</label><Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="United States" /></div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Timezone</label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger>
                  <SelectContent>{timezones.map((tz) => <SelectItem key={tz} value={tz}>{tz.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1.5 block">Contact Email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
              <div><label className="text-sm font-medium mb-1.5 block">Website</label><Input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yoursite.com" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="text-sm font-medium mb-1.5 block">GitHub</label><Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com/user" /></div>
              <div><label className="text-sm font-medium mb-1.5 block">LinkedIn</label><Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/user" /></div>
              <div><label className="text-sm font-medium mb-1.5 block">Twitter / X</label><Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="x.com/user" /></div>
            </div>
          </div>
        </section>

        {/* ── Experience ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold">Work Experience</h2>
            <Button type="button" variant="outline" size="sm" onClick={addExperience} disabled={editingExpKey !== null}><Plus className="w-3 h-3 mr-1" /> Add</Button>
          </div>
          {experiences.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No experience added yet.</p>}
          <div className="space-y-3">
            {experiences.map((exp, idx) => {
              const isEditing = editingExpKey === exp._key;
              return (
                <div key={exp._key} className={`border rounded-lg transition-colors ${isEditing ? "border-primary/50 bg-primary/[0.02]" : "border-border"}`}>
                  {/* Collapsed view */}
                  <div className="flex items-center gap-3 p-3">
                    <div className="flex flex-col gap-0.5">
                      <button type="button" onClick={() => idx > 0 && setExperiences((prev) => moveItem(prev, idx, idx - 1))} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-20"><ChevronUp className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => idx < experiences.length - 1 && setExperiences((prev) => moveItem(prev, idx, idx + 1))} disabled={idx === experiences.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-20"><ChevronDown className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setEditingExpKey(isEditing ? null : exp._key)}>
                      <p className="text-sm font-medium truncate">{exp.role || exp.company || "New Experience"}</p>
                      <p className="text-xs text-muted-foreground truncate">{[exp.company, exp.employment_type, exp.start_year && `${exp.start_month ? exp.start_month.slice(0, 3) + " " : ""}${exp.start_year}`].filter(Boolean).join(" · ") || "Click to edit"}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingExpKey(isEditing ? null : exp._key)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeExperience(exp._key)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                  {/* Expanded edit form */}
                  {isEditing && (
                    <div className="px-3 pb-4 pt-1 space-y-4 border-t border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div><label className="text-sm font-medium mb-1.5 block">Company</label><Input value={exp.company} onChange={(e) => updateExperience(exp._key, "company", e.target.value)} placeholder="Company name" /></div>
                        <div><label className="text-sm font-medium mb-1.5 block">Role</label><Input value={exp.role} onChange={(e) => updateExperience(exp._key, "role", e.target.value)} placeholder="Software Engineer" /></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Type</label>
                          <Select value={exp.employment_type} onValueChange={(v) => updateExperience(exp._key, "employment_type", v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{EMPLOYMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div><label className="text-sm font-medium mb-1.5 block">Location</label><Input value={exp.location} onChange={(e) => updateExperience(exp._key, "location", e.target.value)} placeholder="San Francisco, CA" /></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Start Date</label>
                          <div className="flex gap-2">
                            <Select value={exp.start_month} onValueChange={(v) => updateExperience(exp._key, "start_month", v)}>
                              <SelectTrigger className="flex-1"><SelectValue placeholder="Month" /></SelectTrigger>
                              <SelectContent>{MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                            </Select>
                            <Input type="number" min="1950" max="2030" value={exp.start_year} onChange={(e) => updateExperience(exp._key, "start_year", e.target.value)} placeholder="Year" className="w-24" />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">End Date</label>
                          {exp.is_current ? <p className="text-sm text-muted-foreground h-10 flex items-center">Present</p> : (
                            <div className="flex gap-2">
                              <Select value={exp.end_month} onValueChange={(v) => updateExperience(exp._key, "end_month", v)}>
                                <SelectTrigger className="flex-1"><SelectValue placeholder="Month" /></SelectTrigger>
                                <SelectContent>{MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                              </Select>
                              <Input type="number" min="1950" max="2030" value={exp.end_year} onChange={(e) => updateExperience(exp._key, "end_year", e.target.value)} placeholder="Year" className="w-24" />
                            </div>
                          )}
                          <label className="flex items-center gap-2 mt-2 cursor-pointer"><input type="checkbox" checked={exp.is_current} onChange={(e) => updateExperience(exp._key, "is_current", e.target.checked)} className="accent-primary" /><span className="text-sm">I currently work here</span></label>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description <span className="text-xs text-muted-foreground font-normal">Markdown supported</span></label>
                        <Textarea value={exp.description} onChange={(e) => updateExperience(exp._key, "description", e.target.value)} placeholder="Describe your responsibilities and achievements..." rows={3} />
                      </div>
                      <div className="flex justify-end">
                        <Button type="button" variant="secondary" size="sm" onClick={() => setEditingExpKey(null)}>Done</Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Education ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold">Education</h2>
            <Button type="button" variant="outline" size="sm" onClick={addEducation} disabled={editingEduKey !== null}><Plus className="w-3 h-3 mr-1" /> Add</Button>
          </div>
          {educations.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No education added yet.</p>}
          <div className="space-y-3">
            {educations.map((edu, idx) => {
              const isEditing = editingEduKey === edu._key;
              return (
                <div key={edu._key} className={`border rounded-lg transition-colors ${isEditing ? "border-primary/50 bg-primary/[0.02]" : "border-border"}`}>
                  <div className="flex items-center gap-3 p-3">
                    <div className="flex flex-col gap-0.5">
                      <button type="button" onClick={() => idx > 0 && setEducations((prev) => moveItem(prev, idx, idx - 1))} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-20"><ChevronUp className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => idx < educations.length - 1 && setEducations((prev) => moveItem(prev, idx, idx + 1))} disabled={idx === educations.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-20"><ChevronDown className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setEditingEduKey(isEditing ? null : edu._key)}>
                      <p className="text-sm font-medium truncate">{edu.degree || edu.institution || "New Education"}</p>
                      <p className="text-xs text-muted-foreground truncate">{[edu.institution, edu.field_of_study, edu.start_year].filter(Boolean).join(" · ") || "Click to edit"}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingEduKey(isEditing ? null : edu._key)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeEducation(edu._key)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="px-3 pb-4 pt-1 space-y-4 border-t border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div><label className="text-sm font-medium mb-1.5 block">Institution</label><Input value={edu.institution} onChange={(e) => updateEducation(edu._key, "institution", e.target.value)} placeholder="University name" /></div>
                        <div><label className="text-sm font-medium mb-1.5 block">Degree</label><Input value={edu.degree} onChange={(e) => updateEducation(edu._key, "degree", e.target.value)} placeholder="Bachelor of Science" /></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium mb-1.5 block">Field of Study</label><Input value={edu.field_of_study} onChange={(e) => updateEducation(edu._key, "field_of_study", e.target.value)} placeholder="Computer Science" /></div>
                        <div><label className="text-sm font-medium mb-1.5 block">GPA</label><Input value={edu.gpa} onChange={(e) => updateEducation(edu._key, "gpa", e.target.value)} placeholder="3.8" /></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium mb-1.5 block">Start Year</label><Input type="number" min="1950" max="2030" value={edu.start_year} onChange={(e) => updateEducation(edu._key, "start_year", e.target.value)} placeholder="2018" /></div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">End Year</label>
                          {edu.is_current ? <p className="text-sm text-muted-foreground h-10 flex items-center">Present</p> : <Input type="number" min="1950" max="2030" value={edu.end_year} onChange={(e) => updateEducation(edu._key, "end_year", e.target.value)} placeholder="2022" />}
                          <label className="flex items-center gap-2 mt-2 cursor-pointer"><input type="checkbox" checked={edu.is_current} onChange={(e) => updateEducation(edu._key, "is_current", e.target.checked)} className="accent-primary" /><span className="text-sm">Currently studying</span></label>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description <span className="text-xs text-muted-foreground font-normal">Markdown supported</span></label>
                        <Textarea value={edu.description} onChange={(e) => updateEducation(edu._key, "description", e.target.value)} placeholder="Notable achievements, activities..." rows={2} />
                      </div>
                      <div className="flex justify-end"><Button type="button" variant="secondary" size="sm" onClick={() => setEditingEduKey(null)}>Done</Button></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Certifications ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold">Certifications</h2>
            <Button type="button" variant="outline" size="sm" onClick={addCertification} disabled={editingCertKey !== null}><Plus className="w-3 h-3 mr-1" /> Add</Button>
          </div>
          {certifications.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No certifications added yet.</p>}
          <div className="space-y-3">
            {certifications.map((cert, idx) => {
              const isEditing = editingCertKey === cert._key;
              return (
                <div key={cert._key} className={`border rounded-lg transition-colors ${isEditing ? "border-primary/50 bg-primary/[0.02]" : "border-border"}`}>
                  <div className="flex items-center gap-3 p-3">
                    <div className="flex flex-col gap-0.5">
                      <button type="button" onClick={() => idx > 0 && setCertifications((prev) => moveItem(prev, idx, idx - 1))} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-20"><ChevronUp className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => idx < certifications.length - 1 && setCertifications((prev) => moveItem(prev, idx, idx + 1))} disabled={idx === certifications.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-20"><ChevronDown className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setEditingCertKey(isEditing ? null : cert._key)}>
                      <p className="text-sm font-medium truncate">{cert.name || "New Certification"}</p>
                      <p className="text-xs text-muted-foreground truncate">{cert.organization || "Click to edit"}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingCertKey(isEditing ? null : cert._key)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeCertification(cert._key)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="px-3 pb-4 pt-1 space-y-4 border-t border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div><label className="text-sm font-medium mb-1.5 block">Name</label><Input value={cert.name} onChange={(e) => updateCertification(cert._key, "name", e.target.value)} placeholder="AWS Solutions Architect" /></div>
                        <div><label className="text-sm font-medium mb-1.5 block">Organization</label><Input value={cert.organization} onChange={(e) => updateCertification(cert._key, "organization", e.target.value)} placeholder="Amazon Web Services" /></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium mb-1.5 block">Issue Date</label><Input type="date" value={cert.issue_date} onChange={(e) => updateCertification(cert._key, "issue_date", e.target.value)} /></div>
                        <div><label className="text-sm font-medium mb-1.5 block">Expiration Date</label><Input type="date" value={cert.expiration_date} onChange={(e) => updateCertification(cert._key, "expiration_date", e.target.value)} /></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium mb-1.5 block">Credential ID</label><Input value={cert.credential_id} onChange={(e) => updateCertification(cert._key, "credential_id", e.target.value)} placeholder="ABC123XYZ" /></div>
                        <div><label className="text-sm font-medium mb-1.5 block">Credential URL</label><Input type="url" value={cert.credential_url} onChange={(e) => updateCertification(cert._key, "credential_url", e.target.value)} placeholder="https://verify.example.com/..." /></div>
                      </div>
                      <div className="flex justify-end"><Button type="button" variant="secondary" size="sm" onClick={() => setEditingCertKey(null)}>Done</Button></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Save button ── */}
        <div className="flex justify-end pt-2">
          <Button onClick={handlePublish} disabled={submitting} size="lg" className="min-w-[200px]">
            {submitting ? (
              <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />{isEditMode ? "Saving..." : "Publishing..."}</>
            ) : isEditMode ? "Save Changes" : "Publish Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}
