import { Link } from 'react-router-dom';
import { Heart, Linkedin, Globe, ArrowUpRight, FlaskConical, ShieldCheck } from 'lucide-react';

const PORTFOLIO_URL = 'https://portfolio-prathamdhingra.vercel.app/';
const LINKEDIN_URL = 'https://linkedin.com/in/prathamdhingra';

/**
 * Global site footer — rendered on every page in both the classic and modern
 * skins. It is fully token-driven (border / card / muted-foreground / primary)
 * so it automatically adopts the active theme and UI mode.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-16 border-t border-border bg-card/50 backdrop-blur-sm"
      data-testid="site-footer"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand / author */}
          <div className="space-y-3 lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="brand-icon flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FlaskConical className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground" data-testid="footer-author">
                  Pratham Dhingra
                </p>
                <p className="text-xs text-muted-foreground">Automation QA Engineer</p>
              </div>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Automation Testing Practice Platform — a safe, realistic sandbox for mastering UI
              &amp; API automation with Selenium, Playwright and Cypress.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-portfolio"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                Portfolio
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-linkedin"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                LinkedIn
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Footer — Explore" className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Explore</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/modules" className="transition-colors hover:text-primary">
                  Modules
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="transition-colors hover:text-primary">
                  Challenges
                </Link>
              </li>
              <li>
                <Link to="/workflows" className="transition-colors hover:text-primary">
                  Workflows
                </Link>
              </li>
            </ul>
          </nav>

          {/* Connect */}
          <nav aria-label="Footer — Connect" className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Connect</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  Portfolio site
                </a>
              </li>
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  LinkedIn profile
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                WCAG 2.1 AA friendly
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p className="flex flex-wrap items-center justify-center gap-1.5 text-center">
            Made with
            <Heart className="h-3.5 w-3.5 fill-current text-primary" aria-label="love" />
            using the MERN stack — MongoDB, Express, React &amp; Node.js.
          </p>
          <p className="text-center">
            © {year} Pratham Dhingra · Automation QA Engineer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
