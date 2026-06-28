import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FlaskConical,
  Search,
  Moon,
  Sun,
  MessageSquarePlus,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Home,
  LayoutGrid,
  Puzzle,
  Workflow,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CommandPalette } from './CommandPalette';
import { FeedbackDialog } from '@/components/common/FeedbackDialog';
import { UiModeToggle } from '@/components/common/UiModeToggle';
import { MODULE_CATEGORIES, getModulesByCategory, categorySlug } from '@/config/modules';
import { LEARNING_CATEGORIES, getTracksByCategory, trackPath } from '@/config/learning';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface NavLinkDef {
  to: string;
  label: string;
  icon: LucideIcon;
  testId: string;
  end?: boolean;
}

const HOME_LINK: NavLinkDef = { to: '/', label: 'Home', icon: Home, end: true, testId: 'nav-dashboard' };

const PRIMARY_LINKS: NavLinkDef[] = [
  { to: '/challenges', label: 'Challenges', icon: Puzzle, testId: 'nav-challenges' },
  { to: '/workflows', label: 'Workflows', icon: Workflow, testId: 'nav-workflows' },
];

/** "Modules" dropdown — branches into the Learning courses and Practice sandbox. */
const MODULE_BRANCHES = [
  {
    to: '/learning',
    label: 'Learning',
    description: 'Step-by-step Selenium, TestNG & Cucumber courses',
    icon: GraduationCap,
    testId: 'nav-learning',
  },
  {
    to: '/modules',
    label: 'Practice',
    description: 'Hands-on modules for real automation drills',
    icon: LayoutGrid,
    testId: 'nav-practice',
  },
] as const;


/**
 * Modern-skin top navigation: a floating glass bar with always-visible primary
 * links and a prominent search field — deliberately simple and easy to navigate.
 */
export function ModernNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut().catch(() => undefined);
    navigate('/login');
  };

  const links = isAdmin
    ? [...PRIMARY_LINKS, { to: '/admin', label: 'Admin', icon: ShieldCheck, testId: 'nav-admin' }]
    : PRIMARY_LINKS;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground',
    );

  const home = HOME_LINK;
  const secondaryLinks = links;
  const mobileLinks: NavLinkDef[] = [HOME_LINK, ...links];
  const modulesActive =
    location.pathname.startsWith('/modules') ||
    location.pathname.startsWith('/learning') ||
    location.pathname.startsWith('/category');

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="pointer-events-auto mx-auto w-full max-w-6xl">
        <nav
          aria-label="Primary"
          className="flex h-14 items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-3 shadow-apple-lg backdrop-blur-xl"
        >
          <Link
            to="/"
            data-testid="sidebar-logo"
            className="flex shrink-0 items-center gap-2 rounded-full px-1 py-1 font-semibold"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[hsl(214_85%_52%)] text-white shadow-apple">
              <FlaskConical className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="hidden text-sm sm:inline">Automation Lab</span>
          </Link>

          {/* Always-visible primary navigation (desktop) */}
          <div className="ml-1 hidden items-center gap-0.5 lg:flex">
            <NavLink to={home.to} end={home.end} data-testid={home.testId} className={linkClass}>
              <home.icon className="h-4 w-4" aria-hidden="true" />
              {home.label}
            </NavLink>

            {/* Modules → Learning / Practice */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-testid="nav-modules"
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    modulesActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                  Modules
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <DropdownMenuLabel>Browse modules</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {MODULE_BRANCHES.map((branch) => (
                  <DropdownMenuItem key={branch.to} asChild>
                    <Link to={branch.to} data-testid={branch.testId} className="items-start gap-3">
                      <span className="brand-icon mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <branch.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{branch.label}</span>
                        <span className="text-xs text-muted-foreground">{branch.description}</span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {secondaryLinks.map(({ to, label, icon: Icon, testId }) => (
              <NavLink key={to} to={to} data-testid={testId} className={linkClass}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </div>


          {/* Search — magnifier icon opens the full command palette. */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto rounded-full"
            onClick={() => setPaletteOpen(true)}
            data-testid="open-search"
            aria-label="Search modules and challenges"
            title="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              data-testid="theme-toggle"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <UiModeToggle className="hidden sm:inline-flex" />

            <Button
              variant="ghost"
              size="icon"
              className="hidden rounded-full lg:inline-flex"
              onClick={() => setFeedbackOpen(true)}
              aria-label="Share feedback"
              data-testid="open-feedback"
            >
              <MessageSquarePlus className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Account menu"
                    data-testid="user-menu"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(214_85%_52%)] text-sm font-semibold text-white">
                      {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/modules/auth-demo">
                      <UserIcon className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleSignOut} data-testid="logout-button">
                    <LogOut className="h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="rounded-full" data-testid="topbar-login">
                <Link to="/login">Sign in</Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile / tablet menu */}
        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="mt-2 max-h-[78vh] overflow-y-auto rounded-2xl border border-border/70 bg-card/90 p-2 shadow-apple-lg backdrop-blur-xl lg:hidden"
            >
              {/* UI skin toggle (phones only — shown in the bar on larger screens) */}
              <div className="mb-1 flex items-center justify-between rounded-xl px-3 py-2 sm:hidden">
                <span className="text-sm font-medium text-foreground">Interface</span>
                <UiModeToggle />
              </div>

              {mobileLinks.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </NavLink>
              ))}

              {/* Modules → Learning / Practice */}
              {MODULE_BRANCHES.map((branch) => (
                <NavLink
                  key={branch.to}
                  to={branch.to}
                  data-testid={`${branch.testId}-mobile`}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )
                  }
                >
                  <branch.icon className="h-4 w-4" aria-hidden="true" />
                  {branch.label}
                </NavLink>
              ))}

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setFeedbackOpen(true);
                }}
                data-testid="open-feedback-mobile"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <MessageSquarePlus className="h-4 w-4" aria-hidden="true" /> Share feedback
              </button>

              <div className="my-2 h-px bg-border" aria-hidden="true" />

              {/* Learning courses */}
              <div className="pb-1">
                <Link
                  to="/learning"
                  data-testid="nav-learning-mobile"
                  className="mb-1 flex items-center gap-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-primary"
                >
                  <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" /> Learning
                </Link>
                <ul>
                  <li>
                    <Link
                      to="/learning"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <BookOpen className="h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
                      <span className="truncate">All courses</span>
                    </Link>
                  </li>
                  {LEARNING_CATEGORIES.map((category) => (
                    <li key={category}>
                      <p className="mb-0.5 mt-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        {category}
                      </p>
                      <ul>
                        {getTracksByCategory(category).map((track) => (
                          <li key={track.id}>
                            <Link
                              to={trackPath(track.id)}
                              data-testid={`nav-learning-${track.id}`}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                            >
                              <track.icon className="h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
                              <span className="truncate">{track.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="my-2 h-px bg-border" aria-hidden="true" />

              <p className="mb-1 flex items-center gap-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-primary">
                <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" /> Practice
              </p>

              {/* All practice modules, grouped by category */}
              <div className="space-y-3 pb-1">
                {MODULE_CATEGORIES.map((category) => {
                  const modules = getModulesByCategory(category);
                  if (modules.length === 0) return null;
                  return (
                    <div key={category}>
                      <Link
                        to={`/category/${categorySlug(category)}`}
                        data-testid={`nav-category-${categorySlug(category)}`}
                        className="mb-1 block px-3 text-xs font-semibold uppercase tracking-wider text-primary"
                      >
                        {category}
                      </Link>
                      <ul>
                        {modules.map((module) => (
                          <li key={module.id}>
                            <Link
                              to={module.path}
                              data-testid={`nav-${module.id}`}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                            >
                              <module.icon className="h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
                              <span className="truncate">{module.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  );
}
