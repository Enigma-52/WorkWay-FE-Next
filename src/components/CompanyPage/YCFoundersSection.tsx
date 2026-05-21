"use client";
import { Linkedin, Twitter } from "lucide-react";
import type { CompanyFounder } from "@/types/jobs";

interface Props {
  founders: CompanyFounder[];
}

export function YCFoundersSection({ founders }: Props) {
  return (
    <section>
      <h3 className="text-xl font-semibold text-foreground mb-6">Founders</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {founders.map((founder) => (
          <div
            key={founder.name}
            className="gradient-card border border-border rounded-xl p-5 border-glow hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              {founder.image ? (
                <img
                  src={founder.image}
                  alt={founder.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center border-2 border-border">
                  <span className="text-lg font-bold text-muted-foreground">
                    {founder.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground">{founder.name}</h4>
                {founder.title && (
                  <p className="text-sm text-primary font-medium">{founder.title}</p>
                )}
                {founder.bio && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {founder.bio}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-3">
                  {founder.social?.linkedin && (
                    <a
                      href={founder.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title={`${founder.name} on LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {founder.social?.twitter && (
                    <a
                      href={founder.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title={`${founder.name} on X`}
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
