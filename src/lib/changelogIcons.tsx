import { Rocket, Briefcase, Eye, Search, MessageSquare, type LucideIcon } from "lucide-react";

const CHANGELOG_ICONS: Record<string, LucideIcon> = {
  rocket: Rocket,
  briefcase: Briefcase,
  eye: Eye,
  search: Search,
  feedback: MessageSquare,
};

export function getChangelogIcon(key?: string): LucideIcon {
  return (key && CHANGELOG_ICONS[key]) || Rocket;
}
