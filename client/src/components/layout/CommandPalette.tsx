import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { searchModules } from '@/config/modules';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => searchModules(query), [query]);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keep the highlighted result visible while navigating with the keyboard.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) go(target.path);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[20%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl" data-testid="command-palette">
        <DialogHeader className="sr-only">
          <DialogTitle>Search modules</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2 border-b px-4">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search modules and challenges…"
            aria-label="Search modules"
            data-testid="command-input"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ul
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-2"
          role="listbox"
          aria-label="Module results"
        >
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No modules found.</li>
          ) : (
            results.map((module, index) => {
              const Icon = module.icon;
              return (
                <li key={module.id} role="option" aria-selected={index === activeIndex}>
                  <button
                    type="button"
                    onClick={() => go(module.path)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                      index === activeIndex ? 'bg-accent text-accent-foreground' : 'text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{module.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{module.description}</span>
                    </span>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {module.category}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
        <div className="flex items-center justify-between border-t px-4 py-2 text-[11px] text-muted-foreground">
          <span data-testid="command-result-count">
            {results.length} result{results.length === 1 ? '' : 's'}
          </span>
          <span className="hidden sm:inline">↑↓ navigate · ↵ open · esc close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
