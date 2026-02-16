"use client";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Search,
  Sparkles,
  MapPin,
  Building2,
  Users,
  Zap,
  Check,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type UserRole = "candidate" | "employer" | null;

const OnboardingModal = ({ open, onOpenChange }: OnboardingModalProps) => {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<UserRole>(null);
  const [candidateData, setCandidateData] = useState({
    name: "",
    email: "",
    currentRole: "",
    dreamRole: "",
    location: "",
    openTo: [] as string[],
    superpower: "",
  });
  const [employerData, setEmployerData] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "",
    hiringFor: "",
    urgency: "",
  });

  const totalSteps = role === "candidate" ? 5 : role === "employer" ? 4 : 1;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    if (step === 1) setRole(null);
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(1);
  };

  const toggleOpenTo = (option: string) => {
    setCandidateData((prev) => ({
      ...prev,
      openTo: prev.openTo.includes(option)
        ? prev.openTo.filter((o) => o !== option)
        : [...prev.openTo, option],
    }));
  };

  const renderStep = () => {
    // Step 0: Role Selection
    if (step === 0) {
      return (
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm">
              <Sparkles className="w-4 h-4" />
              Let's get you set up
            </div>
            <h2 className="text-3xl font-bold">What brings you here?</h2>
            <p className="text-muted-foreground">
              Pick your path. No wrong answers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => handleRoleSelect("candidate")}
              className="group relative p-6 rounded-2xl border-2 border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left"
            >
              <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-3 pr-12">
                <h3 className="text-xl font-bold">I'm looking for work</h3>
                <p className="text-sm text-muted-foreground">
                  Find jobs, track applications, get hired. No more spreadsheet
                  chaos.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Let's go <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("employer")}
              className="group relative p-6 rounded-2xl border-2 border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left"
            >
              <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-3 pr-12">
                <h3 className="text-xl font-bold">I'm hiring</h3>
                <p className="text-sm text-muted-foreground">
                  Post jobs, find talent, skip the circus. Real candidates, real
                  fast.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Let's go <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      );
    }

    // Candidate Flow
    if (role === "candidate") {
      if (step === 1) {
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">First, the basics.</h2>
              <p className="text-muted-foreground">
                We promise not to spam you. Ever.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  What should we call you?
                </label>
                <Input
                  placeholder="Your name"
                  value={candidateData.name}
                  onChange={(e) =>
                    setCandidateData({ ...candidateData, name: e.target.value })
                  }
                  className="h-12 bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Where can we reach you?
                </label>
                <Input
                  type="email"
                  placeholder="you@email.com"
                  value={candidateData.email}
                  onChange={(e) =>
                    setCandidateData({
                      ...candidateData,
                      email: e.target.value,
                    })
                  }
                  className="h-12 bg-background/50"
                />
              </div>
            </div>
          </div>
        );
      }

      if (step === 2) {
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                What's your current situation?
              </h2>
              <p className="text-muted-foreground">
                No judgment. We've all been there.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Current role (or last one)
                </label>
                <Input
                  placeholder="e.g. Frontend Developer, Product Designer..."
                  value={candidateData.currentRole}
                  onChange={(e) =>
                    setCandidateData({
                      ...candidateData,
                      currentRole: e.target.value,
                    })
                  }
                  className="h-12 bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Where are you based?
                </label>
                <Input
                  placeholder="City, Country or 'Remote'"
                  value={candidateData.location}
                  onChange={(e) =>
                    setCandidateData({
                      ...candidateData,
                      location: e.target.value,
                    })
                  }
                  className="h-12 bg-background/50"
                />
              </div>
            </div>
          </div>
        );
      }

      if (step === 3) {
        const openToOptions = [
          "Full-time",
          "Part-time",
          "Contract",
          "Freelance",
          "Remote",
          "Hybrid",
          "On-site",
        ];
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">What are you open to?</h2>
              <p className="text-muted-foreground">
                Select all that apply. Be honest.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {openToOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleOpenTo(option)}
                  className={cn(
                    "px-4 py-2 rounded-full border-2 text-sm font-medium transition-all",
                    candidateData.openTo.includes(option)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 hover:border-muted-foreground/50"
                  )}
                >
                  {candidateData.openTo.includes(option) && (
                    <Check className="w-3 h-3 inline mr-1" />
                  )}
                  {option}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Dream role (be specific)
              </label>
              <Input
                placeholder="e.g. Senior Engineer at a climate tech startup"
                value={candidateData.dreamRole}
                onChange={(e) =>
                  setCandidateData({
                    ...candidateData,
                    dreamRole: e.target.value,
                  })
                }
                className="h-12 bg-background/50"
              />
            </div>
          </div>
        );
      }

      if (step === 4) {
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">One last thing.</h2>
              <p className="text-muted-foreground">
                This helps us match you better. Optional but powerful.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                What's your superpower?
              </label>
              <Textarea
                placeholder="e.g. I can debug CSS faster than anyone. I turn stakeholder chaos into clear PRDs. I make backend magic happen..."
                value={candidateData.superpower}
                onChange={(e) =>
                  setCandidateData({
                    ...candidateData,
                    superpower: e.target.value,
                  })
                }
                className="min-h-[120px] bg-background/50 resize-none"
              />
            </div>
          </div>
        );
      }

      if (step === 5) {
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <Rocket className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">
                You're all set, {candidateData.name.split(" ")[0] || "friend"}!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your WorkWay profile is ready. Time to find that dream role.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-left space-y-2">
              <p className="text-sm font-medium text-primary">
                What happens next:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• We'll curate jobs based on your preferences</li>
                <li>• Your Hire Me page is live (you can edit anytime)</li>
                <li>• Start applying with one click</li>
              </ul>
            </div>
          </div>
        );
      }
    }

    // Employer Flow
    if (role === "employer") {
      if (step === 1) {
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                Let's set up your hiring HQ.
              </h2>
              <p className="text-muted-foreground">
                Quick intro so we can help you hire faster.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your name</label>
                <Input
                  placeholder="What should we call you?"
                  value={employerData.name}
                  onChange={(e) =>
                    setEmployerData({ ...employerData, name: e.target.value })
                  }
                  className="h-12 bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Work email</label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={employerData.email}
                  onChange={(e) =>
                    setEmployerData({ ...employerData, email: e.target.value })
                  }
                  className="h-12 bg-background/50"
                />
              </div>
            </div>
          </div>
        );
      }

      if (step === 2) {
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                Tell us about your company.
              </h2>
              <p className="text-muted-foreground">
                This helps candidates understand who you are.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Company name
                </label>
                <Input
                  placeholder="Acme Inc."
                  value={employerData.company}
                  onChange={(e) =>
                    setEmployerData({
                      ...employerData,
                      company: e.target.value,
                    })
                  }
                  className="h-12 bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Team size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["1-10", "11-50", "51-200", "200+"].map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setEmployerData({ ...employerData, teamSize: size })
                      }
                      className={cn(
                        "py-3 rounded-xl border-2 text-sm font-medium transition-all",
                        employerData.teamSize === size
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 hover:border-muted-foreground/50"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (step === 3) {
        const urgencyOptions = [
          { value: "asap", label: "ASAP", desc: "Yesterday, actually" },
          { value: "soon", label: "This month", desc: "Moving fast" },
          { value: "exploring", label: "Exploring", desc: "Building pipeline" },
        ];
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">What are you hiring for?</h2>
              <p className="text-muted-foreground">
                Help us surface the right candidates.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Role(s) you're filling
                </label>
                <Input
                  placeholder="e.g. Senior Backend Engineer, Product Designer"
                  value={employerData.hiringFor}
                  onChange={(e) =>
                    setEmployerData({
                      ...employerData,
                      hiringFor: e.target.value,
                    })
                  }
                  className="h-12 bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">How urgent?</label>
                <div className="grid gap-2">
                  {urgencyOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setEmployerData({ ...employerData, urgency: opt.value })
                      }
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between",
                        employerData.urgency === opt.value
                          ? "border-primary bg-primary/10"
                          : "border-border/50 hover:border-muted-foreground/50"
                      )}
                    >
                      <div>
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {opt.desc}
                        </p>
                      </div>
                      {employerData.urgency === opt.value && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (step === 4) {
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">
                Welcome aboard, {employerData.name.split(" ")[0] || "friend"}!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {employerData.company || "Your company"} is ready to hire
                smarter.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-left space-y-2">
              <p className="text-sm font-medium text-primary">
                What happens next:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Post your first job in under 2 minutes</li>
                <li>• Access our candidate database</li>
                <li>• Track applicants in one clean pipeline</li>
              </ul>
            </div>
          </div>
        );
      }
    }
  };

  const isLastStep = step === totalSteps;
  const canProceed = () => {
    if (step === 0) return false;
    if (role === "candidate") {
      if (step === 1) return candidateData.name && candidateData.email;
      if (step === 2) return candidateData.currentRole;
      if (step === 3) return candidateData.openTo.length > 0;
      return true;
    }
    if (role === "employer") {
      if (step === 1) return employerData.name && employerData.email;
      if (step === 2) return employerData.company && employerData.teamSize;
      if (step === 3) return employerData.hiringFor && employerData.urgency;
      return true;
    }
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 bg-background border-border/50 overflow-hidden">
        {/* Progress bar */}
        {step > 0 && (
          <div className="h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}

        <div className="p-6 sm:p-8">{renderStep()}</div>

        {/* Footer */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex items-center justify-between">
          {step > 0 ? (
            <Button variant="ghost" onClick={handleBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step > 0 && (
            <Button
              onClick={isLastStep ? () => onOpenChange(false) : handleNext}
              disabled={!canProceed()}
              className="gap-2"
            >
              {isLastStep ? "Let's go!" : "Continue"}
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
