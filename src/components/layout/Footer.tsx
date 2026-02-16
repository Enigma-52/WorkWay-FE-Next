import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
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
            <h4 className="text-sm font-medium mb-4">Product</h4>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a
                href="/about"
                className="hover:text-foreground transition-colors"
              >
                About WorkWay
              </a>
              <a
                href="/domains"
                className="hover:text-foreground transition-colors"
              >
                Browse Domains
              </a>
              <a
                href="/companies"
                className="hover:text-foreground transition-colors"
              >
                Browse Companies
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
