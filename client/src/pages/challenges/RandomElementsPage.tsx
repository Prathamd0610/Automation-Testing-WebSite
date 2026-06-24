import { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Choice {
  id: number;
  label: string;
  isTarget: boolean;
}

type ResultTone = 'default' | 'success' | 'danger';

const BASE_CHOICES: readonly Choice[] = [
  { id: 1, label: 'Option Alpha', isTarget: false },
  { id: 2, label: 'Option Bravo', isTarget: false },
  { id: 3, label: 'Hidden Target', isTarget: true },
  { id: 4, label: 'Option Charlie', isTarget: false },
  { id: 5, label: 'Option Delta', isTarget: false },
];

/** Non-mutating shuffle that is safe under noUncheckedIndexedAccess. */
function shuffle<T>(list: readonly T[]): T[] {
  return [...list]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function RandomElementsPage() {
  const [order, setOrder] = useState<Choice[]>(() => shuffle(BASE_CHOICES));
  const [result, setResult] = useState<string | null>(null);
  const [tone, setTone] = useState<ResultTone>('default');

  const reshuffle = (): void => {
    setOrder(shuffle(BASE_CHOICES));
  };

  const pick = (choice: Choice): void => {
    if (choice.isTarget) {
      setTone('success');
      setResult('Hit! You selected the target button.');
    } else {
      setTone('danger');
      setResult(`Miss — "${choice.label}" was a decoy. Locate the stable data-testid instead.`);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Shuffle className="h-5 w-5" />}
        title="Random Elements"
        description="The button order reshuffles on every click. Only the target keeps a stable data-testid, so position-based locators will fail."
      />

      <Section title="Find the target" id="random">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <Button variant="outline" onClick={reshuffle} data-testid="shuffle">
              Shuffle
            </Button>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="random-list">
              {order.map((choice) => (
                <Button
                  key={choice.id}
                  variant="secondary"
                  className="w-full justify-center"
                  data-testid={choice.isTarget ? 'random-target' : `decoy-${choice.id}`}
                  onClick={() => pick(choice)}
                >
                  {choice.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </Section>

      <ResultPanel label="Selection result" value={result} testId="random-result" tone={tone} />
    </PageContainer>
  );
}
