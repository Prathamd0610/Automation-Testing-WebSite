import { useEffect, useState } from 'react';
import { Images, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SLIDES = [
  { title: 'Mountain', color: 'from-sky-500 to-indigo-600' },
  { title: 'Forest', color: 'from-emerald-500 to-teal-600' },
  { title: 'Desert', color: 'from-amber-500 to-orange-600' },
  { title: 'Ocean', color: 'from-cyan-500 to-blue-600' },
];

/**
 * Carousel — next/previous, clickable dots and an autoplay toggle. Autoplay
 * advancing on a timer is a classic source of flaky tests, so pausing it is
 * the recommended first step before asserting.
 */
export default function CarouselPage() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const go = (next: number) => setIndex((next + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 2000);
    return () => window.clearInterval(id);
  }, [playing]);

  const slide = SLIDES[index]!;

  return (
    <PageContainer>
      <PageHeader
        icon={<Images className="h-5 w-5" />}
        title="Carousel / Slider"
        description="Navigate slides with the arrows or dots. Toggle autoplay to practise pausing timers before asserting on the active slide."
      />

      <Section title="Gallery" id="carousel">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="relative overflow-hidden rounded-xl">
              <div
                className={cn('flex h-56 items-center justify-center bg-gradient-to-br text-2xl font-bold text-white', slide.color)}
                data-testid="carousel-slide"
                data-index={index}
              >
                {slide.title}
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                aria-label="Previous slide"
                data-testid="carousel-prev"
                onClick={() => go(index - 1)}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                aria-label="Next slide"
                data-testid="carousel-next"
                onClick={() => go(index + 1)}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2" data-testid="carousel-dots">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    aria-label={`Go to ${s.title}`}
                    aria-current={i === index}
                    data-testid={`carousel-dot-${i}`}
                    onClick={() => setIndex(i)}
                    className={cn('h-2.5 rounded-full transition-all', i === index ? 'w-6 bg-primary' : 'w-2.5 bg-muted-foreground/40')}
                  />
                ))}
              </div>
              <Button variant="outline" size="sm" data-testid="carousel-autoplay" onClick={() => setPlaying((p) => !p)}>
                {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                {playing ? 'Pause' : 'Autoplay'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Result" id="result">
        <div className="grid gap-3 sm:grid-cols-2">
          <ResultPanel label="Active slide" value={`${index + 1} / ${SLIDES.length} — ${slide.title}`} testId="carousel-active" tone="success" />
          <ResultPanel label="Autoplay" value={playing ? 'Running' : 'Paused'} testId="carousel-state" />
        </div>
      </Section>
    </PageContainer>
  );
}
