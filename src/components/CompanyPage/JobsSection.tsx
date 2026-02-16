"use client";
import { useState, useMemo } from "react";
import { Briefcase } from "lucide-react";
import {
  type JobListing,
  getUniqueLocations,
  getUniqueExperienceLevels,
  getJobsByDomain,
} from "@/data/companyData";
import { JobFilters } from "./JobFilters";
import { DomainAccordion } from "./DomainAccordion";

interface JobsSectionProps {
  jobs: JobListing[];
}

export function JobsSection({ jobs }: JobsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");

  const locations = useMemo(() => getUniqueLocations(jobs), [jobs]);
  const experienceLevels = useMemo(
    () => getUniqueExperienceLevels(jobs),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.domain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation =
        selectedLocation === "all" || job.location === selectedLocation;
      const matchesExperience =
        selectedExperience === "all" ||
        job.experience_level === selectedExperience;

      return matchesSearch && matchesLocation && matchesExperience;
    });
  }, [jobs, searchQuery, selectedLocation, selectedExperience]);

  const jobsByDomain = useMemo(
    () => getJobsByDomain(filteredJobs),
    [filteredJobs]
  );

  const handleReset = () => {
    setSearchQuery("");
    setSelectedLocation("all");
    setSelectedExperience("all");
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Open Positions</h2>
            <p className="text-sm text-muted-foreground">
              {filteredJobs.length} of {jobs.length} roles
            </p>
          </div>
        </div>
      </div>

      <JobFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        selectedExperience={selectedExperience}
        onExperienceChange={setSelectedExperience}
        locations={locations}
        experienceLevels={experienceLevels}
        onReset={handleReset}
      />

      <DomainAccordion jobsByDomain={jobsByDomain} />
    </section>
  );
}
