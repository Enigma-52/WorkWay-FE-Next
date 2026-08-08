import Link from "next/link";
import Image from "next/image";
import { MapPin, User } from "lucide-react";
import type { TalentProfile } from "@/types/talent";

function formatAmount(value?: string | null): string {
  if (!value) return "";
  const match = value.match(/^([^\d]*)([\d.]+)$/);
  if (!match) return value;
  const [, symbol, digits] = match;
  const grouped = Number(digits);
  return Number.isNaN(grouped) ? value : `${symbol}${grouped.toLocaleString("en-US")}`;
}

function availabilityConfig(status?: string | null) {
  switch (status) {
    case "available":
      return {
        label: "Available",
        chip: "bg-green-500/10 text-green-500 border-green-500/25",
      };
    case "open":
      return {
        label: "Open to work",
        chip: "bg-yellow-500/10 text-yellow-600 border-yellow-500/25",
      };
    default:
      return null;
  }
}

export function TalentCard({ profile }: { profile: TalentProfile }) {
  const availability = availabilityConfig(profile.availability_status);
  const compensationPublic = profile.compensation_visibility === "public";
  const skills = profile.skills ?? [];

  return (
    <Link
      href={`/p/${profile.username}`}
      className="group relative flex flex-col gap-4 rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:glow-subtle"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name ?? profile.username}
              width={56}
              height={56}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <User className="h-7 w-7 text-muted-foreground" />
          )}
        </div>
        {availability && (
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${availability.chip}`}
          >
            {availability.label}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="truncate font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {profile.professional_title || profile.display_name}
        </h3>
        {profile.display_name && profile.professional_title && (
          <p className="truncate text-sm text-muted-foreground">{profile.display_name}</p>
        )}
        {profile.country && (
          <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {profile.country}
          </span>
        )}
      </div>

      {profile.about && (
        <p className="line-clamp-3 text-sm text-muted-foreground">{profile.about}</p>
      )}

      {(profile.years_of_experience || (compensationPublic && (profile.hourly_rate || profile.annual_salary))) && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-3 text-xs">
          {profile.years_of_experience && (
            <div>
              <div className="text-muted-foreground">Experience</div>
              <div className="font-mono font-medium text-foreground">
                {profile.years_of_experience}+ years
              </div>
            </div>
          )}
          {compensationPublic && profile.hourly_rate && (
            <div>
              <div className="text-muted-foreground">Rate</div>
              <div className="font-mono font-medium text-foreground">
                {formatAmount(profile.hourly_rate)}/hr
              </div>
            </div>
          )}
          {compensationPublic && profile.annual_salary && (
            <div>
              <div className="text-muted-foreground">Salary</div>
              <div className="font-mono font-medium text-foreground">
                {formatAmount(profile.annual_salary)}/yr
              </div>
            </div>
          )}
        </div>
      )}

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground"
            >
              {skill}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="py-0.5 text-xs text-muted-foreground">+{skills.length - 5}</span>
          )}
        </div>
      )}
    </Link>
  );
}
