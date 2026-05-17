"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  User,
  Clock,
  MapPin,
  Languages,
  Wrench,
  Mail,
  Briefcase,
  GraduationCap,
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  X,
  Upload,
  Github,
  Linkedin,
  Globe,
  Twitter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ─── constants ─── */

const STEPS = [
  { id: "photo", label: "Photo", icon: Camera },
  { id: "general", label: "General", icon: User },
  { id: "availability", label: "Availability", icon: Clock },
  { id: "location", label: "Location & Pay", icon: MapPin },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "contact", label: "Contact & Links", icon: Mail },
  { id: "employment", label: "Work History", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "cv", label: "CV / Resume", icon: FileText },
] as const;

const CATEGORIES = [
  "AI-native Engineer", "Android Developer", "Back-end Engineer", "Blockchain Developer",
  "Cloud Engineer", "Cross-Platform Mobile Developer", "Cybersecurity Engineer",
  "Data Analyst", "Data Engineer", "Data Scientist", "DevOps Engineer",
  "Front-end Engineer", "Full-Stack Engineer", "Game Developer",
  "Infrastructure Engineer", "iOS Developer", "Machine Learning Engineer",
  "Platform Engineer", "QA Engineer", "Site Reliability Engineer",
  "Software Architect", "Software Engineer", "Solutions Engineer",
  "Systems Engineer", "Technical Lead", "Web Developer", "Other",
];

const EXPERIENCE_LEVELS = ["Junior", "Mid-level", "Senior", "Staff", "Principal", "Lead"];

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];

const COMMON_LANGUAGES = [
  "English", "Spanish", "French", "German", "Portuguese", "Chinese (Mandarin)",
  "Japanese", "Korean", "Hindi", "Arabic", "Russian", "Italian", "Dutch",
  "Turkish", "Polish", "Swedish", "Danish", "Norwegian", "Finnish",
  "Indonesian", "Thai", "Vietnamese", "Bengali", "Urdu", "Tamil",
];

const COMMON_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#", "Ruby",
  "PHP", "Swift", "Kotlin", "React.js", "Next.js", "Vue.js", "Angular.js",
  "Node.js", "Express.js", "Django", "Flask", "FastAPI", "Spring Boot",
  "Ruby on Rails", "Laravel", "PostgreSQL", "MySQL", "MongoDB", "Redis",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "Git",
  "GraphQL", "REST", "gRPC", "Tailwind CSS", "HTML", "CSS",
  "React Native", "Flutter", "Electron", "TensorFlow", "PyTorch",
  "Machine Learning", "CI/CD", "Linux", "Firebase", "Supabase",
  "Prisma", "Figma", "Storybook", "Jest", "Playwright", "Vercel",
];

type Employment = {
  id: string;
  yearStart: string;
  yearEnd: string;
  title: string;
  company: string;
  website: string;
  responsibilities: string;
};

type Education = {
  id: string;
  yearStart: string;
  yearEnd: string;
  degree: string;
  institution: string;
  website: string;
};

/* ─── component ─── */

export default function CreateHireMeProfile() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // form state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState("");
  const [yearsOfExp, setYearsOfExp] = useState("");
  const [about, setAbout] = useState("");

  const [status, setStatus] = useState("available");
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [noticePeriod, setNoticePeriod] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");

  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [yearlySalary, setYearlySalary] = useState("");

  const [languages, setLanguages] = useState<string[]>([]);
  const [langSearch, setLangSearch] = useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");

  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [employments, setEmployments] = useState<Employment[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvName, setCvName] = useState("");

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  function next() {
    if (!isLast) setStep(step + 1);
  }
  function prev() {
    if (!isFirst) setStep(step - 1);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function toggleEmploymentType(t: string) {
    setEmploymentTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  function toggleTag(tag: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(tag) ? list.filter((x) => x !== tag) : [...list, tag]);
  }

  function addEmployment() {
    setEmployments((prev) => [
      ...prev,
      { id: crypto.randomUUID(), yearStart: "", yearEnd: "", title: "", company: "", website: "", responsibilities: "" },
    ]);
  }

  function updateEmployment(id: string, field: keyof Employment, value: string) {
    setEmployments((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function removeEmployment(id: string) {
    setEmployments((prev) => prev.filter((e) => e.id !== id));
  }

  function addEducation() {
    setEducations((prev) => [
      ...prev,
      { id: crypto.randomUUID(), yearStart: "", yearEnd: "", degree: "", institution: "", website: "" },
    ]);
  }

  function updateEducation(id: string, field: keyof Education, value: string) {
    setEducations((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function removeEducation(id: string) {
    setEducations((prev) => prev.filter((e) => e.id !== id));
  }

  function handleCvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFile(file);
    setCvName(file.name);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        username, title, category, experience, yearsOfExperience: yearsOfExp, about,
        status, employmentTypes, noticePeriod, availableFrom,
        country, timezone, hourlyRate, yearlySalary,
        languages, skills,
        email, website, github, twitter, linkedin,
        employments: employments.map(({ id, ...rest }) => rest),
        educations: educations.map(({ id, ...rest }) => rest),
      };
      await fetch("/api/hireme/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      router.push("/dashboard/seeker/hireme");
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  }

  const filteredLangs = COMMON_LANGUAGES.filter(
    (l) => l.toLowerCase().includes(langSearch.toLowerCase()) && !languages.includes(l)
  );

  const filteredSkills = COMMON_SKILLS.filter(
    (s) => s.toLowerCase().includes(skillSearch.toLowerCase()) && !skills.includes(s)
  );

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Create Your Hire Me Profile</h1>
        <p className="text-muted-foreground text-sm">
          Complete each section to build your professional profile. You can always come back and edit.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center gap-1 mb-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isDone = i < step;
            const isCurrent = i === step;
            return (
              <button
                key={s.id}
                onClick={() => setStep(i)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : isDone
                      ? "bg-primary/5 text-primary/70 hover:bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {isDone ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
                <span className="hidden lg:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Step {step + 1} of {STEPS.length} — {current.label}
        </p>
      </div>

      {/* Step content */}
      <div className="bg-card border border-border rounded-xl p-6 lg:p-8 min-h-[340px]">
        {/* Photo */}
        {current.id === "photo" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Profile Photo</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Upload a professional photo. PNG, JPG, or WebP, max 5MB.
            </p>
            <div className="flex items-center gap-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-2xl bg-secondary border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Photo
                </Button>
                {avatarFile && (
                  <p className="text-xs text-muted-foreground mt-2">{avatarFile.name}</p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
        )}

        {/* General */}
        {current.id === "general" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">General Information</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tell us about yourself and what you do.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Username</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Your profile link: workway.works/@{username || "you"}
                </p>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                  placeholder="johndoe"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <p className="text-xs text-muted-foreground mb-2">
                  How you describe yourself professionally.
                </p>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Senior Full-Stack Engineer"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Experience Level</label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Years of Experience</label>
                <Input
                  type="number"
                  min={0}
                  value={yearsOfExp}
                  onChange={(e) => setYearsOfExp(e.target.value)}
                  placeholder="5"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">
                  About You
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Tell your story — experience, achievements, what you're looking for. Min 50 characters.
                </p>
                <Textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="I've been building web applications for 5 years, specializing in..."
                  rows={5}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  {about.length} / 50 min characters
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Availability */}
        {current.id === "availability" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Availability</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Let employers know when and how you're available.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Status</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Available profiles are shown first in the directory.
                </p>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Available From</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Use today's date if you can start immediately.
                </p>
                <Input
                  type="date"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Notice Period (days)</label>
                <Input
                  type="number"
                  min={0}
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  placeholder="30"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-3 block">Employment Types</label>
                <div className="flex flex-wrap gap-2">
                  {EMPLOYMENT_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleEmploymentType(t)}
                      className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        employmentTypes.includes(t)
                          ? "bg-primary/15 text-primary border-primary/30"
                          : "bg-secondary text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {employmentTypes.includes(t) && <Check className="w-3 h-3 inline mr-1.5" />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location & Pay */}
        {current.id === "location" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Location & Compensation</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Where you're based and your compensation expectations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Country</label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="India"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Timezone</label>
                <Input
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="Asia/Kolkata (GMT+5:30)"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Hourly Rate (min)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    type="number"
                    min={0}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="50"
                    className="pl-7"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Yearly Salary (min)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    type="number"
                    min={0}
                    value={yearlySalary}
                    onChange={(e) => setYearlySalary(e.target.value)}
                    placeholder="100000"
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Languages */}
        {current.id === "languages" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Languages</h2>
            <p className="text-sm text-muted-foreground mb-6">
              What languages do you speak?
            </p>
            {languages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {languages.map((l) => (
                  <span
                    key={l}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-primary/15 text-primary border border-primary/30"
                  >
                    {l}
                    <button onClick={() => toggleTag(l, languages, setLanguages)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <Input
              value={langSearch}
              onChange={(e) => setLangSearch(e.target.value)}
              placeholder="Search languages..."
              className="mb-3"
            />
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {filteredLangs.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => { toggleTag(l, languages, setLanguages); setLangSearch(""); }}
                  className="px-3 py-1.5 rounded-lg text-sm bg-secondary text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground transition-all"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {current.id === "skills" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Skills</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Programming languages, frameworks, and tools you know.
            </p>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-primary/15 text-primary border border-primary/30"
                  >
                    {s}
                    <button onClick={() => toggleTag(s, skills, setSkills)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <Input
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              placeholder="Search skills..."
              className="mb-3"
            />
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {filteredSkills.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { toggleTag(s, skills, setSkills); setSkillSearch(""); }}
                  className="px-3 py-1.5 rounded-lg text-sm bg-secondary text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contact & Links */}
        {current.id === "contact" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Contact & Social Links</h2>
            <p className="text-sm text-muted-foreground mb-6">
              How companies can reach you and find your work.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Public Email</label>
                <p className="text-xs text-muted-foreground mb-2">Visible on your profile.</p>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Website
                </label>
                <Input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yoursite.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" /> GitHub
                </label>
                <Input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5" /> X (Twitter)
                </label>
                <Input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://x.com/username"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </label>
                <Input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>
        )}

        {/* Employment History */}
        {current.id === "employment" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Employment History</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your work experience. Leave End Year blank for current positions.
            </p>
            <div className="space-y-4 mb-4">
              {employments.map((emp) => (
                <div key={emp.id} className="p-5 rounded-lg border border-border bg-secondary/20 space-y-4">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {emp.title || emp.company || "New Position"}
                    </p>
                    <button
                      onClick={() => removeEmployment(emp.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Input
                      type="number"
                      placeholder="Start Year"
                      value={emp.yearStart}
                      onChange={(e) => updateEmployment(emp.id, "yearStart", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="End Year"
                      value={emp.yearEnd}
                      onChange={(e) => updateEmployment(emp.id, "yearEnd", e.target.value)}
                    />
                    <Input
                      placeholder="Job Title"
                      value={emp.title}
                      onChange={(e) => updateEmployment(emp.id, "title", e.target.value)}
                    />
                    <Input
                      placeholder="Company"
                      value={emp.company}
                      onChange={(e) => updateEmployment(emp.id, "company", e.target.value)}
                    />
                  </div>
                  <Input
                    placeholder="Company Website (optional)"
                    value={emp.website}
                    onChange={(e) => updateEmployment(emp.id, "website", e.target.value)}
                  />
                  <Textarea
                    placeholder="Key responsibilities and achievements..."
                    value={emp.responsibilities}
                    onChange={(e) => updateEmployment(emp.id, "responsibilities", e.target.value)}
                    rows={3}
                  />
                </div>
              ))}
            </div>
            {employments.length === 0 && (
              <p className="text-sm text-muted-foreground mb-4">No work history added yet.</p>
            )}
            <Button variant="outline" size="sm" onClick={addEmployment}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add Position
            </Button>
          </div>
        )}

        {/* Education */}
        {current.id === "education" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Education</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your degrees, certifications, and courses. Leave End Year blank if still enrolled.
            </p>
            <div className="space-y-4 mb-4">
              {educations.map((edu) => (
                <div key={edu.id} className="p-5 rounded-lg border border-border bg-secondary/20 space-y-4">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {edu.degree || edu.institution || "New Education"}
                    </p>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Input
                      type="number"
                      placeholder="Start Year"
                      value={edu.yearStart}
                      onChange={(e) => updateEducation(edu.id, "yearStart", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="End Year"
                      value={edu.yearEnd}
                      onChange={(e) => updateEducation(edu.id, "yearEnd", e.target.value)}
                    />
                    <Input
                      placeholder="Degree / Program"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    />
                    <Input
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                    />
                  </div>
                  <Input
                    placeholder="Institution Website (optional)"
                    value={edu.website}
                    onChange={(e) => updateEducation(edu.id, "website", e.target.value)}
                  />
                </div>
              ))}
            </div>
            {educations.length === 0 && (
              <p className="text-sm text-muted-foreground mb-4">No education added yet.</p>
            )}
            <Button variant="outline" size="sm" onClick={addEducation}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add Education
            </Button>
          </div>
        )}

        {/* CV */}
        {current.id === "cv" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">CV / Resume</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Upload your resume. PDF, DOC, or DOCX, max 2MB.
            </p>
            <div
              onClick={() => cvInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              {cvName ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-10 h-10 text-primary" />
                  <p className="text-sm font-medium">{cvName}</p>
                  <p className="text-xs text-muted-foreground">Click to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-10 h-10 text-muted-foreground" />
                  <p className="text-sm font-medium">Drop your CV here or click to browse</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX — Max 2MB</p>
                </div>
              )}
            </div>
            <input
              ref={cvInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleCvChange}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={prev}
          disabled={isFirst}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          {isLast ? (
            <Button onClick={handleSave} disabled={saving} className="gap-2 px-8">
              {saving ? "Saving..." : "Save Profile"}
              <Check className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={next} className="gap-2">
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
