import { useState } from 'react';
import { Star } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LABELS = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'];

/**
 * Star rating — mouse hover preview, click to set, and full keyboard support
 * via a radiogroup. A classic widget that trips up naive automation because
 * the visual state (hover) differs from the committed value.
 */
export default function RatingPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const display = hover || rating;

  return (
    <PageContainer>
      <PageHeader
        icon={<Star className="h-5 w-5" />}
        title="Star Rating"
        description="Hover to preview, click to commit, or use arrow keys. The hovered value never changes the committed rating until you click."
      />

      <Section title="Rate your experience" id="rating">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <div
              className="flex items-center gap-1"
              role="radiogroup"
              aria-label="Star rating"
              data-testid="rating-stars"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  data-testid={`star-${n}`}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') setRating((r) => Math.min(5, r + 1));
                    if (e.key === 'ArrowLeft') setRating((r) => Math.max(0, r - 1));
                  }}
                  className="rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Star
                    className={cn(
                      'h-9 w-9 transition-colors',
                      n <= display ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40',
                    )}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" data-testid="rating-reset" onClick={() => setRating(0)}>
              Reset
            </Button>
          </CardContent>
        </Card>
      </Section>

      <Section title="Result" id="result">
        <div className="grid gap-3 sm:grid-cols-2">
          <ResultPanel
            label="Rating"
            value={rating ? `${rating} / 5` : ''}
            testId="rating-value"
            tone={rating ? 'success' : 'default'}
          />
          <ResultPanel label="Sentiment" value={LABELS[rating]} testId="rating-label" />
        </div>
      </Section>
    </PageContainer>
  );
}
