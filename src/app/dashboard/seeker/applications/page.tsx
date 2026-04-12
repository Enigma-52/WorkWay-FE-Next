const MOCK_APPLICATIONS = [
  { company: "Razorpay", role: "Frontend Engineer", status: "Interview", date: "Apr 8, 2026" },
  { company: "Zepto", role: "Product Designer", status: "Applied", date: "Apr 5, 2026" },
  { company: "Groww", role: "Software Engineer II", status: "Applied", date: "Apr 3, 2026" },
  { company: "CRED", role: "Backend Engineer", status: "Rejected", date: "Mar 29, 2026" },
  { company: "Meesho", role: "Full Stack Developer", status: "Interview", date: "Mar 25, 2026" },
  { company: "PhonePe", role: "Android Engineer", status: "Applied", date: "Mar 20, 2026" },
];

const statusStyles: Record<string, string> = {
  Applied: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Interview: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function ApplicationsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Applications</h1>
        <p className="text-muted-foreground text-sm">Track every job you've applied to.</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Applied</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_APPLICATIONS.map((app, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-4 font-medium">{app.company}</td>
                <td className="px-5 py-4 text-muted-foreground">{app.role}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[app.status]}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{app.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
