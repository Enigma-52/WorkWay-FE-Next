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
                <img src="/logo.png" alt="WorkWay" className="w-10 h-10" />
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
    </footer>
  );
};

export default Footer;
