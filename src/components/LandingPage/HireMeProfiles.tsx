"use client";
import { Sparkles, User, Code, Briefcase, Settings } from "lucide-react";

const HireMeProfiles = () => {
  const profileItems = [
    { icon: Code, label: "skills" },
    { icon: Briefcase, label: "projects" },
    { icon: User, label: "experience" },
    { icon: Settings, label: "preferences" },
  ];

  return (
    <section className="py-24 md:py-32 bg-card/30 border-y border-border overflow-hidden">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <p className="text-primary font-mono text-sm uppercase tracking-wider mb-4">
                Hire Me Profiles
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Your resume, but online{" "}
                <span className="text-muted-foreground">and not ugly.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Every user gets a Hire Me page. Recruiter opens it → understands
                you in 30 seconds.
              </p>

              {/* Profile items */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {profileItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background/50"
                  >
                    <item.icon className="w-4 h-4 text-primary" />
                    <span className="font-mono text-sm">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI helps you polish it.
                </p>
                <p>You still stay in control.</p>
                <p className="font-semibold text-foreground">
                  No LinkedIn influencer energy.
                </p>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-3xl blur-3xl" />
              <div className="relative p-8 rounded-2xl border border-border bg-card">
                {/* Mock profile card */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Alex Chen</h4>
                    <p className="text-muted-foreground text-sm">
                      Full-Stack Engineer
                    </p>
                  </div>
                </div>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"].map(
                    (skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/20"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-2xl font-bold text-primary">5+</p>
                    <p className="text-xs text-muted-foreground">Years Exp</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-2xl font-bold text-primary">Open</p>
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HireMeProfiles;
