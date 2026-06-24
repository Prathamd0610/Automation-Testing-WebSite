import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

const COUNTRIES = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China',
  'Colombia', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Greece', 'India',
  'Indonesia', 'Ireland', 'Italy', 'Japan', 'Mexico', 'Netherlands', 'New Zealand', 'Norway',
  'Poland', 'Portugal', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'United States',
] as const;

const LISTBOX_ID = 'autocomplete-listbox';

export default function AutocompletePage() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selected, setSelected] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 250);
  const blurTimer = useRef<number>();

  useEffect(() => () => window.clearTimeout(blurTimer.current), []);

  const suggestions = useMemo(() => {
    const needle = debouncedQuery.trim().toLowerCase();
    if (!needle) return [] as string[];
    return COUNTRIES.filter((country) => country.toLowerCase().includes(needle));
  }, [debouncedQuery]);

  const listVisible = open && suggestions.length > 0;

  const selectOption = (value: string) => {
    setSelected(value);
    setQuery(value);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setOpen(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      const choice = suggestions[activeIndex];
      if (choice) {
        event.preventDefault();
        selectOption(choice);
      }
    } else if (event.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleBlur = () => {
    blurTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Search className="h-5 w-5" />}
        title="Autocomplete"
        description="A debounced, keyboard-navigable country picker with an ARIA combobox listbox."
      />

      <Section title="Country search" id="autocomplete" description="Type to filter, then use arrow keys and Enter to select.">
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Label htmlFor="autocomplete-input">Country</Label>
            <div className="relative">
              <Input
                id="autocomplete-input"
                data-testid="autocomplete-input"
                role="combobox"
                autoComplete="off"
                aria-autocomplete="list"
                aria-controls={LISTBOX_ID}
                aria-expanded={listVisible}
                aria-activedescendant={activeIndex >= 0 ? `autocomplete-option-${activeIndex}` : undefined}
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setOpen(true)}
                onBlur={handleBlur}
                placeholder="Start typing a country"
              />
              {listVisible ? (
                <ul
                  id={LISTBOX_ID}
                  role="listbox"
                  data-testid="autocomplete-list"
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-popover p-1 shadow-apple-lg"
                >
                  {suggestions.map((country, index) => {
                    const active = index === activeIndex;
                    return (
                      <li
                        key={country}
                        id={`autocomplete-option-${index}`}
                        role="option"
                        aria-selected={active}
                        data-testid={`autocomplete-option-${index}`}
                        className={cn(
                          'cursor-pointer rounded-md px-3 py-1.5 text-sm',
                          active ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent/60',
                        )}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectOption(country)}
                      >
                        {country}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
            <ResultPanel label="Selected country" value={selected} testId="autocomplete-selected" tone="success" />
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
