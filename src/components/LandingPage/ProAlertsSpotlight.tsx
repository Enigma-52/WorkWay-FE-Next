import Link from "next/link";
import { ArrowRight, Bell, Crown, Check } from "lucide-react";
import { env } from "@/lib/config/env";
import { formatLivePrice, type LivePrice } from "@/lib/plans";

const benefits = [
  {
    title: "One system, every ATS",
    desc: "Companies post to Greenhouse, Ashby, Lever, YC, and more — WorkWay already tracks them all, so this is the only place you can get instant alerts no matter which platform a company uses.",
  },
  {
    title: "Real-time, not a daily digest",
    desc: "The moment a company you follow posts, you get an email — not a batch job that runs once a day.",
  },
  {
    title: "One email, not a flood",
    desc: "Several companies posting at once still means one grouped, readable digest — never spam.",
  },
  {
    title: "Straight to the listing",
    desc: "Every alert links directly to the job on WorkWay. No re-searching to find the exact posting.",
  },
];

const inbox = [
  { subject: "ElevenLabs & Edia posted new roles", time: "Just now", unread: true },
  { subject: "Featherless AI just posted a new role", time: "2m ago", unread: true },
  { subject: "Your weekly summary is ready", time: "Yesterday", unread: false },
];

// Same live-price source as the pricing page (GET /api/billing/plans,
// backed by Dodo) — fetched server-side here since this is a server
// component, with the same 5-minute cache window the backend itself uses.
// Falls back to the static "$5/mo" if Dodo has a hiccup or the plan has no
// product configured, so the CTA never renders blank.
async function getProCtaLabel(): Promise<string> {
  const fallback = "Get instant alerts — $3.99/mo";
  try {
    const res = await fetch(new URL("/api/billing/plans", env.BACKEND_API_URL), {
      next: { revalidate: 300 },
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    const pro = data.plans?.find((p: { key: string }) => p.key === "pro");
    if (!pro?.price) return fallback;
    const { price, period } = formatLivePrice(pro.price as LivePrice);
    return `Get instant alerts — ${price}${period ? `/${period}` : ""}`;
  } catch {
    return fallback;
  }
}

const ProAlertsSpotlight = async () => {
  const ctaLabel = await getProCtaLabel();

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand/10 blur-[140px] pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-brand mb-4">
              <Crown className="w-3.5 h-3.5" />
              Pro
            </p>
            <h2 className="font-display text-5xl sm:text-6xl text-gradient leading-[1.05]">
              Be first,{" "}
              <span className="italic text-brand-gradient">not fastest.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Follow any company on WorkWay. The instant they post a new role,
              Pro emails you — so you&apos;re applying in minutes, while
              everyone else is still refreshing the careers page.
            </p>

            <ul className="mt-8 space-y-4">
              {benefits.map((b) => (
                <li key={b.title} className="flex gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-brand/15 grid place-items-center shrink-0">
                    <Check className="w-3 h-3 text-brand" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{b.title}</div>
                    <div className="text-sm text-muted-foreground">{b.desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row items-start gap-3">
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-2 rounded-full bg-brand text-brand-foreground hover:bg-brand-glow transition-all px-6 py-3 font-medium shadow-glow"
              >
                {ctaLabel}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Mockup: a simulated instant-alert inbox */}
          <div className="relative" aria-hidden>
            <div className="absolute inset-x-8 -inset-y-4 bg-brand/10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-elevated shadow-elevated overflow-hidden p-6">
              <div className="flex items-center gap-2 mb-5 text-xs font-mono text-muted-foreground">
                <Bell className="w-3.5 h-3.5 text-brand" />
                Inbox
              </div>
              {inbox.map((mail) => (
                <div
                  key={mail.subject}
                  className={`flex items-start gap-3 py-3 border-b border-border last:border-0 ${mail.unread ? "" : "opacity-50"}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-glow grid place-items-center shrink-0 mt-0.5">
                    <Bell className="w-3.5 h-3.5 text-brand-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">WorkWay</span>
                      <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                        {mail.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{mail.subject}</p>
                  </div>
                  {mail.unread && <span className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProAlertsSpotlight;
