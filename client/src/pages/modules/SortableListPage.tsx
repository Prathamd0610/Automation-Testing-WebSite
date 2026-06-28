import { useState } from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const INITIAL = ['Design review', 'Write tests', 'Fix bugs', 'Ship release', 'Retrospective'];

/**
 * Reorderable list — move items up/down to change their order. Keyboard- and
 * button-driven (no native drag) so it is deterministic to automate, while
 * still exercising "assert the new order" scenarios.
 */
export default function SortableListPage() {
  const [items, setItems] = useState<string[]>(INITIAL);

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      const a = next[index];
      const b = next[target];
      if (a === undefined || b === undefined) return prev;
      next[index] = b;
      next[target] = a;
      return next;
    });
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<ArrowUpDown className="h-5 w-5" />}
        title="Reorderable List"
        description="Move tasks up and down to reorder them, then assert on the final sequence. The position of each item updates live."
      />

      <Section title="Sprint backlog" id="list">
        <Card>
          <CardContent className="pt-4">
            <ul className="divide-y divide-border" data-testid="sortable-list">
              {items.map((item, index) => (
                <li
                  key={item}
                  data-testid={`item-${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary" data-testid={`position-${index}`}>
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground">{item}</span>
                  </span>
                  <span className="flex gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      aria-label={`Move ${item} up`}
                      data-testid={`move-up-${index}`}
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      aria-label={`Move ${item} down`}
                      data-testid={`move-down-${index}`}
                      disabled={index === items.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Section>

      <Section title="Result" id="result">
        <ResultPanel label="Order" value={items.join(' → ')} testId="sortable-order" />
      </Section>
    </PageContainer>
  );
}
