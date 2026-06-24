import { useEffect, useMemo, useState } from 'react';
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

  const results = useMemo(() => searchModules(query).slice(0, 8), [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

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
      <DialogContent className="top-[20%] translate-y-0 gap-0 p-0" data-testid="command-palette">
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
        <ul className="max-h-80 overflow-y-auto p-2" role="listbox" aria-label="Module results">
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
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                      index === activeIndex ? 'bg-accent text-accent-foreground' : 'text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="flex-1">
                      <span className="font-medium">{module.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{module.description}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{module.category}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
