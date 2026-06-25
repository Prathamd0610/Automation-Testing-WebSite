import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, Search, LogOut, User as UserIcon, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch } from '@/store/hooks';
import { toggleSidebar } from '@/store/uiSlice';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { CommandPalette } from './CommandPalette';
import { FeedbackDialog } from '@/components/common/FeedbackDialog';
import { UiModeToggle } from '@/components/common/UiModeToggle';

export function Topbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut().catch(() => undefined);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
      <button
        type="button"
        className="rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle navigation"
        aria-controls="app-sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        data-testid="open-search"
        className="flex h-9 flex-1 items-center gap-2 rounded-lg border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted sm:max-w-xs"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span>Search modules…</span>
        <kbd className="ml-auto hidden rounded border bg-background px-1.5 text-[10px] font-medium sm:inline">
          /
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          data-testid="theme-toggle"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <UiModeToggle className="hidden sm:inline-flex" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFeedbackOpen(true)}
          aria-label="Share feedback"
          data-testid="open-feedback"
          className="gap-1.5"
        >
          <MessageSquarePlus className="h-5 w-5" />
          <span className="hidden sm:inline">Feedback</span>
        </Button>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account menu" data-testid="user-menu">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
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
          <Button asChild size="sm" data-testid="topbar-login">
            <Link to="/login">Sign in</Link>
          </Button>
        )}
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </header>
  );
}
