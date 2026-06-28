import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FlaskConical,
  Search,
  Moon,
  Sun,
  MessageSquarePlus,
  Keyboard,
  LayoutGrid,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  BookOpen,
  ShieldCheck,
  Home,
  GraduationCap,
  Boxes,
  Puzzle,
  Workflow,
  Sparkles,
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
import { ShortcutsDialog } from './ShortcutsDialog';
import { FeedbackDialog } from '@/components/common/FeedbackDialog';
import { UiModeToggle } from '@/components/common/UiModeToggle';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { toggleLauncher } from '@/store/uiSlice';
import { cn } from '@/lib/utils';

function MobileLink({ to, label, icon: Icon, onNavigate }: { to: string; label: string; icon: typeof Home; onNavigate: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium',
          isActive ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-accent',
        )
      }
    >
      <Icon className="h-4 w-4" aria-hidden="true" /> {label}
    </NavLink>
  );
}

export function ConsoleHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = ['INPUT', 'TEXTAREA'].includes(t?.tagName ?? '') || t?.isContentEditable;
      if (typing) return;
      if (e.key === '/') {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === '?') {
        e.preventDefault();
        setShortcutsOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSignOut = async () => {
    await signOut().catch(() => undefined);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur sm:px-4" data-testid="console-header">
      {/* Mobile: menu + brand */}
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent lg:hidden"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle navigation"
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <Link to="/" className="flex items-center gap-2 lg:hidden" data-testid="sidebar-logo-mobile">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
          <FlaskConical className="h-4 w-4" aria-hidden="true" />
        </span>
      </Link>

      {/* Search */}
      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        data-testid="open-search"
        className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-xl border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted sm:max-w-md"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="truncate">Search modules, courses &amp; challenges</span>
        <kbd className="ml-auto hidden rounded border bg-background px-1.5 text-[10px] font-medium sm:inline">/</kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-0.5">
        <Button variant="ghost" size="icon" className="rounded-lg" onClick={() => dispatch(toggleLauncher())} data-testid="open-launcher" aria-label="App launcher" title="All apps">
          <LayoutGrid className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-lg" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} data-testid="theme-toggle">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" className="hidden rounded-lg sm:inline-flex" onClick={() => setShortcutsOpen(true)} aria-label="Keyboard shortcuts and progress" data-testid="open-shortcuts" title="Shortcuts & progress (?)">
          <Keyboard className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden rounded-lg sm:inline-flex" onClick={() => setFeedbackOpen(true)} aria-label="Share feedback" data-testid="open-feedback" title="Feedback">
          <MessageSquarePlus className="h-5 w-5" />
        </Button>
        <UiModeToggle className="ml-1 hidden md:inline-flex" />

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1 rounded-full" aria-label="Account menu" data-testid="user-menu">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
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
                <Link to="/modules/auth-demo"><UserIcon className="h-4 w-4" /> Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/learning"><BookOpen className="h-4 w-4" /> My learning</Link>
              </DropdownMenuItem>
              {isAdmin ? (
                <DropdownMenuItem asChild>
                  <Link to="/admin"><ShieldCheck className="h-4 w-4" /> Admin panel</Link>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem onSelect={handleSignOut} data-testid="logout-button">
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm" className="ml-1 rounded-lg" data-testid="topbar-login">
            <Link to="/login">Sign in</Link>
          </Button>
        )}
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-14 max-h-[80vh] overflow-y-auto border-b bg-card p-2 shadow-xl lg:hidden"
            data-testid="mobile-drawer"
          >
            <button
              type="button"
              onClick={() => { setMobileOpen(false); dispatch(toggleLauncher()); }}
              className="mb-1 flex w-full items-center gap-2 rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary"
            >
              <LayoutGrid className="h-4 w-4" /> Open app launcher
            </button>
            <MobileLink to="/" label="Home" icon={Home} onNavigate={() => setMobileOpen(false)} />
            <MobileLink to="/learning" label="Learn" icon={GraduationCap} onNavigate={() => setMobileOpen(false)} />
            <MobileLink to="/modules" label="Practice" icon={Boxes} onNavigate={() => setMobileOpen(false)} />
            <MobileLink to="/challenges" label="Challenges" icon={Puzzle} onNavigate={() => setMobileOpen(false)} />
            <MobileLink to="/workflows" label="Workflows" icon={Workflow} onNavigate={() => setMobileOpen(false)} />
            <MobileLink to="/explore" label="Explore" icon={Sparkles} onNavigate={() => setMobileOpen(false)} />
            {isAdmin ? <MobileLink to="/admin" label="Admin" icon={ShieldCheck} onNavigate={() => setMobileOpen(false)} /> : null}
            <div className="flex items-center justify-between rounded-xl px-3 py-2">
              <span className="text-sm font-medium text-foreground">Interface</span>
              <UiModeToggle />
            </div>

            <div className="my-1 h-px bg-border" aria-hidden="true" />

            <button
              type="button"
              onClick={() => { setMobileOpen(false); setShortcutsOpen(true); }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent"
              data-testid="mobile-open-shortcuts"
            >
              <Keyboard className="h-4 w-4" aria-hidden="true" /> Shortcuts &amp; progress
            </button>
            <button
              type="button"
              onClick={() => { setMobileOpen(false); setFeedbackOpen(true); }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent"
              data-testid="mobile-open-feedback"
            >
              <MessageSquarePlus className="h-4 w-4" aria-hidden="true" /> Feedback
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => { setMobileOpen(false); handleSignOut(); }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent"
                data-testid="mobile-logout"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2.5 text-sm font-semibold text-white"
                data-testid="mobile-login"
              >
                <UserIcon className="h-4 w-4" aria-hidden="true" /> Sign in
              </Link>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </header>
  );
}
