import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  Search,
  Moon,
  Sun,
  MessageSquarePlus,
  LogOut,
  User as UserIcon,
  BookOpen,
  ShieldCheck,
  Keyboard,
  LayoutGrid,
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

/**
 * Modern top chrome — three floating glass capsules: brand, a prominent
 * "spotlight" search, and quick actions. Primary navigation lives in the dock.
 */
export function SpotlightHeader() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

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

  const capsule = 'pointer-events-auto flex h-12 items-center rounded-2xl border border-border/60 bg-card/80 shadow-apple-lg backdrop-blur-xl';

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex max-w-7xl items-center gap-2 sm:gap-3">
        {/* Brand */}
        <Link to="/" data-testid="sidebar-logo" className={`${capsule} gap-2 px-2.5 font-semibold`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
            <FlaskConical className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden pr-1 text-sm md:inline">Automation Lab</span>
        </Link>

        {/* Spotlight search */}
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          data-testid="open-search"
          className={`${capsule} mx-auto w-full max-w-xl gap-3 px-4 text-sm text-muted-foreground transition-colors hover:text-foreground`}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="truncate">Search or jump to anything…</span>
          <kbd className="ml-auto hidden rounded border bg-background/60 px-1.5 text-[10px] font-medium sm:inline">/</kbd>
        </button>

        {/* Actions */}
        <div className={`${capsule} gap-0.5 px-1.5`}>
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => dispatch(toggleLauncher())} data-testid="open-launcher" aria-label="App launcher" title="All apps">
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden rounded-xl sm:inline-flex" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} data-testid="theme-toggle">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="hidden rounded-xl sm:inline-flex" onClick={() => setShortcutsOpen(true)} aria-label="Keyboard shortcuts and progress" data-testid="open-shortcuts" title="Shortcuts & progress (?)">
            <Keyboard className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative hidden rounded-xl sm:inline-flex" onClick={() => setFeedbackOpen(true)} aria-label="Share feedback" data-testid="open-feedback" title="Feedback">
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
          <UiModeToggle className="hidden md:inline-flex" />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu" data-testid="user-menu">
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
                <DropdownMenuItem onSelect={() => setShortcutsOpen(true)}>
                  <Keyboard className="h-4 w-4" /> Shortcuts &amp; progress
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFeedbackOpen(true)}>
                  <MessageSquarePlus className="h-4 w-4" /> Feedback
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut} data-testid="logout-button">
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="rounded-xl" data-testid="topbar-login">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  );
}
