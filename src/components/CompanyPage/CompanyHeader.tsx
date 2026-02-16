"use client";
import { Building2, Globe, MapPin, Briefcase, Users } from "lucide-react";
import {
  type Company,
  getUniqueLocations,
  getUniqueDomains,
} from "@/data/companyData";

interface CompanyHeaderProps {
  company: Company;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  const locations = getUniqueLocations(company.jobListings);
  const domains = getUniqueDomains(company.jobListings);

  const stats = [
    { label: "Open Roles", value: company.jobListings.length, icon: Briefcase },
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
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl gradient-card border border-border flex items-center justify-center glow-subtle">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold tracking-tight gradient-text">
                  {company.name}
                </h1>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm font-mono"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {company.website.replace("https://", "")}
                  </a>
                )}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {company.description}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-3">
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
