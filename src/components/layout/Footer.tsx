import Image from "next/image";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="WorkWay" width={40} height={40} loading="lazy" />
                <span className="text-lg font-semibold">WorkWay</span>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              WorkWay helps you discover companies, understand how they hire,
              and find the right roles using real hiring data — not noise.
            </p>

            <p className="mt-6 text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} WorkWay. Built in public.
            </p>
          </div>

          {/* Links Column */}
          <div className="flex flex-col items-center md:items-center text-center">
            <h4 className="mb-4 text-sm font-medium">Product</h4>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a
                href="/about"
                className="transition-colors hover:text-foreground"
              >
                About WorkWay
              </a>
              <a
                href="/domains"
                className="transition-colors hover:text-foreground"
              >
                Browse Domains
              </a>
              <a
                href="/companies"
                className="transition-colors hover:text-foreground"
              >
                Browse Companies
              </a>
              <a
                href="/changelog"
                className="transition-colors hover:text-foreground"
              >
                Changelog
              </a>
              <a
                href="/feedback"
                className="transition-colors hover:text-foreground"
              >
                Feedback
              </a>
              <a
                href="/contact"
                className="transition-colors hover:text-foreground"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Legal Column */}
          <div className="hidden md:flex flex-col items-center md:items-end text-center md:text-right">
            <h4 className="mb-4 text-sm font-medium">Legal</h4>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a
                href="/privacy-policy"
                className="transition-colors hover:text-foreground"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="transition-colors hover:text-foreground"
              >
                Terms of Service
              </a>
              <a
                href="/disclaimer"
                className="transition-colors hover:text-foreground"
              >
                Disclaimer
              </a>
              <a
                href="/guides"
                className="transition-colors hover:text-foreground"
              >
                Guides
              </a>
            </div>
          </div>

          {/* Creator Column */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h4 className="text-sm font-medium mb-4">Creator</h4>

            <div className="text-sm text-muted-foreground mb-3">
              <div className="font-medium text-foreground">Rohit Singh</div>
              <div className="text-xs text-muted-foreground">
                Building WorkWay
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/rohitsingh52/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>

              <a
                href="https://github.com/Enigma-52"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Featured On badges — auto-scrolling marquee */}
      <div className="border-t border-border/40 py-6 overflow-hidden">
        <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-mono text-center mb-4">
          Featured on
        </p>
        <div className="marquee-mask">
          <div className="flex" style={{ animation: "marquee 25s linear infinite", width: "max-content" }}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-12 px-6">
                <a href="https://startupfa.me" target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                  <img src="https://startupfa.me/badges/featured-badge-small.webp" alt="WorkWay - Featured on Startup Fame" width={224} height={40} loading="lazy" />
                </a>
                <a href="https://turbo0.com/item/workway" target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                  <img src="https://img.turbo0.com/badge-listed-dark.svg" alt="Listed on Turbo0" className="h-[40px] w-auto" width={150} height={40} loading="lazy" />
                </a>
                <a href="https://similarlabs.com" target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                  <img src="https://similarlabs.com/similarlabs-embed-badge-dark.svg" alt="Listed on Similarlabs" width={155} height={40} loading="lazy" />
                </a>
                <a href="https://drchecker.net" target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                  <img src="https://drchecker.net/api/badge?domain=workway.dev" alt="DR Checker - Domain Rating" className="h-[40px] w-auto" width={150} height={40} loading="lazy" />
                </a>
                <a href="https://findly.tools/workway?utm_source=workway" target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                  <img src="https://findly.tools/badges/findly-tools-badge-dark.svg" alt="Featured on Findly.tools" width={220} height={40} loading="lazy" />
                </a>
                <a href="https://fazier.com/launches/www.workway.dev" target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                  <img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=dark" alt="Featured on Fazier" className="h-[40px] w-auto" width={150} height={40} loading="lazy" />
                </a>
                <a href="https://wired.business" target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                  <img src="https://wired.business/badge0-dark.svg" alt="Featured on Wired Business" className="h-[40px] w-auto" width={150} height={40} loading="lazy" />
                </a>
                <a href="https://frogdr.com/workway.dev?utm_source=workway.dev" target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                  <img src="https://frogdr.com/workway.dev/badge-dark.svg?badge=1" alt="Monitor your Domain Rating with FrogDR" className="h-[40px] w-auto" width={150} height={40} loading="lazy" />
                </a>
                <a href="https://ufind.best/products/workway?utm_source=ufind.best" target="_blank" rel="noopener" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                  <img src="https://ufind.best/badges/ufind-best-badge-light.svg" alt="Featured on ufind.best" width={150} height={40} loading="lazy" />
                </a>
                <a href="https://dang.ai" target="_blank" rel="dofollow noopener" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                  <img src="https://assets.dang.ai/badges/dang-verified-dark.png" alt="Verified on DANG!" width={260} height={40} className="h-[40px] w-auto" loading="lazy" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-border/60">
        <div className="mx-auto max-w-8xl px-6 py-5 font-display italic text-center text-[14vw] sm:text-[10vw] leading-none text-gradient opacity-20 select-none -mb-4">
          workway.dev
        </div>
      </div>
    </footer>
  );
};

export default Footer;
