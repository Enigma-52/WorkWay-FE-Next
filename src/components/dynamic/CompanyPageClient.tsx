import { CompanyHeader } from "@/components/CompanyPage/CompanyHeader";
import { JobsSection } from "@/components/CompanyPage/JobsSection";
import { RecentlyPostedSection } from "@/components/CompanyPage/RecentlyPostedSection";
import { TeamBreakdown } from "@/components/CompanyPage/TeamBreakdown";
import { YCFoundersSection } from "@/components/CompanyPage/YCFoundersSection";
import { YCSidebar } from "@/components/CompanyPage/YCSidebar";
import type { CompanyDetails } from "@/types/jobs";

type Props = {
  company: CompanyDetails;
};

export default function CompanyPageClient({ company }: Props) {
  const isYC = company.platform === "ycombinator";
  const hasJobs = (company.jobListings?.length || 0) > 0;

  return (
    <div className="min-h-screen bg-background">
      <CompanyHeader company={company} />

      <main className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="animate-fade-in lg:col-span-2 space-y-8">
            {isYC && company.metadata?.founders && company.metadata.founders.length > 0 && (
              <YCFoundersSection founders={company.metadata.founders} />
            )}
            {hasJobs && (
              <>
                <RecentlyPostedSection jobs={company.recentlyPostedJobs as any} />
                <JobsSection jobs={company.jobListings as any} />
              </>
            )}
            {!hasJobs && !isYC && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No open positions at the moment.</p>
                <p className="text-sm mt-2">Check back later for new opportunities.</p>
              </div>
            )}
            {!hasJobs && isYC && !company.metadata?.founders?.length && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No open positions at the moment.</p>
                <p className="text-sm mt-2">Check back later for new opportunities.</p>
              </div>
            )}
          </div>
          <aside className="animate-fade-in lg:col-span-1" style={{ animationDelay: "0.1s" }}>
            <div className="sticky top-6 space-y-6">
              {isYC ? (
                <YCSidebar company={company} />
              ) : (
                hasJobs && <TeamBreakdown jobs={company.jobListings as any} />
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
