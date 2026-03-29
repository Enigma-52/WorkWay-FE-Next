import { CompanyHeader } from "@/components/CompanyPage/CompanyHeader";
import { JobsSection } from "@/components/CompanyPage/JobsSection";
import { RecentlyPostedSection } from "@/components/CompanyPage/RecentlyPostedSection";
import { TeamBreakdown } from "@/components/CompanyPage/TeamBreakdown";
import type { CompanyDetails } from "@/types/jobs";

type Props = {
  company: CompanyDetails;
};

export default function CompanyPageClient({ company }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <CompanyHeader company={company as any} />

      <main className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="animate-fade-in lg:col-span-2 space-y-8">
            <RecentlyPostedSection jobs={company.recentlyPostedJobs as any} />
            <JobsSection jobs={company.jobListings as any} />
          </div>
          <aside className="animate-fade-in lg:col-span-1" style={{ animationDelay: "0.1s" }}>
            <div className="sticky top-6">
              <TeamBreakdown jobs={company.jobListings as any} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

