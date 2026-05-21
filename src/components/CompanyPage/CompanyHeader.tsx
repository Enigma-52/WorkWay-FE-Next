"use client";
import { useState } from "react";
import { Building2, Globe, MapPin, Briefcase, Users } from "lucide-react";
import type { CompanyDetails } from "@/types/jobs";

interface CompanyHeaderProps {
  company: CompanyDetails;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  const isYC = company.platform === "ycombinator";
  const metadata = company.metadata;
  const jobs = company.jobListings || [];
  const locations = [...new Set(jobs.map((j) => j.location))];
  const domains = [...new Set(jobs.map((j) => j.domain))];

  const companyLocation =
    (company.location as { location?: string })?.location || null;

  const stats = [
    {
      label: "Open Roles",
      value: company.jobListings?.length || 0,
      icon: Briefcase,
    },
    { label: "Locations", value: locations.length, icon: MapPin },
    { label: "Domains", value: domains.length, icon: Users },
  ];

  return (
    <header className="relative overflow-hidden border-b border-border">
      {/* Background glow effect */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Company Info */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              {company.logo_url ? (
                <div className="w-20 h-20">
                  <img
                    src={company.logo_url}
                    alt={`${company.name} logo`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl gradient-card border border-border flex items-center justify-center glow-subtle">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold tracking-tight gradient-text">
                    {company.name}
                  </h2>
                  {isYC && metadata?.ycBatch && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-md font-semibold bg-orange-500/10 text-orange-500 border border-orange-500/20">
                      <img
                        src="https://www.vectorlogo.zone/logos/ycombinator/ycombinator-icon.svg"
                        alt="Y Combinator"
                        className="w-5 h-5"
                      />
                      {metadata.ycBatch}
                    </span>
                  )}
                </div>
                {metadata?.tagline && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {metadata.tagline}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={company.website.replace("https://", "")}
                      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm font-mono"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </a>
                  )}
                  {companyLocation && (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground text-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      {companyLocation}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <ExpandableDescription text={company.description} />

            {/* Tags */}
            {metadata?.tags && metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="flex flex-wrap gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="gradient-card border border-border rounded-xl px-6 py-4 min-w-[120px] border-glow"
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className="w-4 h-4 text-primary" />
                  <span className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function ExpandableDescription({ text }: { text?: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  return (
    <div>
      <p
        className={`text-muted-foreground leading-relaxed ${expanded ? "" : "line-clamp-5"}`}
      >
        {text}
      </p>
      {text.length > 300 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-primary hover:text-primary/80 font-medium mt-1 transition-colors"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
