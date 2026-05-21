"use client";
import { ExternalLink, Github, Linkedin, Twitter } from "lucide-react";
import type { CompanyDetails } from "@/types/jobs";

interface Props {
  company: CompanyDetails;
}

export function YCSidebar({ company }: Props) {
  const metadata = company.metadata;
  if (!metadata) return null;

  const social = metadata.social;
  const partner = metadata.ycPartner;

  const socialLinks = [
    { url: social?.linkedin, label: "LinkedIn", icon: Linkedin },
    { url: social?.twitter, label: "X (Twitter)", icon: Twitter },
    { url: social?.github, label: "GitHub", icon: Github },
  ].filter((link) => link.url);

  return (
    <div className="space-y-6">
      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div className="gradient-card border border-border rounded-xl p-5 border-glow">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            Social
          </h4>
          <div className="space-y-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* YC Partner */}
      {partner && (
        <div className="gradient-card border border-border rounded-xl p-5 border-glow">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            YC Partner
          </h4>
          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            {partner.avatar_thumb_url ? (
              <img
                src={partner.avatar_thumb_url}
                alt={partner.full_name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border-2 border-border group-hover:border-primary/50 transition-colors"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border-2 border-border">
                <span className="text-sm font-bold text-muted-foreground">
                  {partner.full_name.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {partner.full_name}
              </p>
              <p className="text-xs text-muted-foreground">Group Partner</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      )}

      {/* Website CTA */}
      {company.website && (
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          Visit Website
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
}
