import type { ComponentType, SVGProps } from "react";
import {
  Briefcase,
  Code,
  Database,
  Layers,
  Cpu,
  Settings,
  LineChart,
  Palette,
  Megaphone,
  Headphones,
  Users,
  Wallet,
  Wrench,
  Scale,
  TestTube,
  UserCog,
  FileSearch,
} from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const DOMAIN_ICON_MAP: Record<string, IconComponent> = {
  "Software Engineering": Code,
  Backend: Database,
  Frontend: Layers,
  "Full-stack": Layers,
  Android: Cpu,
  DevOps: Settings,
  "AI / Data Science": LineChart,
  "Design / Creative": Palette,
  "Product / Project": Briefcase,
  "Customer Acquisition": Megaphone,
  "Support / Customer Success": Headphones,
  "Talent / HR": Users,
  "Accounts / Finance": Wallet,
  Operations: Wrench,
  Legal: Scale,
  "QA / Testing": TestTube,
  Admin: UserCog,
  "Admin / Office": UserCog,
  Research: FileSearch,
  Analyst: LineChart,
  Other: Briefcase,
};

export function getDomainIcon(domainName: string) {
  return DOMAIN_ICON_MAP[domainName] || Briefcase;
}
