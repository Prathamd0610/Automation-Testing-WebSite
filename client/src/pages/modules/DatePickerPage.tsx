import { useMemo, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MS_PER_DAY = 86_400_000;

export default function DatePickerPage() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [datetime, setDatetime] = useState('');
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');

  const rangeError = useMemo(() => {
    if (!rangeStart || !rangeEnd) return null;
    return new Date(rangeEnd) < new Date(rangeStart) ? 'End date must be on or after the start date.' : null;
  }, [rangeStart, rangeEnd]);

  const dayCount = useMemo<number | null>(() => {
    if (!rangeStart || !rangeEnd || rangeError) return null;
    const start = new Date(rangeStart).getTime();
    const end = new Date(rangeEnd).getTime();
    if (Number.isNaN(start) || Number.isNaN(end)) return null;
    return Math.round((end - start) / MS_PER_DAY) + 1;
  }, [rangeStart, rangeEnd, rangeError]);

  const summary = useMemo(
    () =>
      [
        `date: ${date || '—'}`,
        `time: ${time || '—'}`,
        `datetime: ${datetime || '—'}`,
        `range: ${rangeStart || '—'} → ${rangeEnd || '—'}`,
        `days: ${dayCount ?? '—'}`,
      ].join(' · '),
    [date, time, datetime, rangeStart, rangeEnd, dayCount],
  );

  return (
    <PageContainer>
      <PageHeader
        icon={<CalendarClock className="h-5 w-5" />}
        title="Date & Time Picker"
        description="Native date, time and datetime inputs plus a validated date range."
      />

      <Section title="Single pickers" id="single">
        <Card>
          <CardContent className="grid gap-5 pt-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="date-input">Date</Label>
              <Input
                id="date-input"
                type="date"
                data-testid="date-input"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-input">Time</Label>
              <Input
                id="time-input"
                type="time"
                data-testid="time-input"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="datetime-input">Date &amp; time</Label>
              <Input
                id="datetime-input"
                type="datetime-local"
                data-testid="datetime-input"
                value={datetime}
                onChange={(event) => setDatetime(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Date range" id="range" description="The end date must be on or after the start date.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="range-start">Start date</Label>
                <Input
                  id="range-start"
                  type="date"
                  data-testid="range-start"
                  value={rangeStart}
                  max={rangeEnd || undefined}
                  onChange={(event) => setRangeStart(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="range-end">End date</Label>
                <Input
                  id="range-end"
                  type="date"
                  data-testid="range-end"
                  value={rangeEnd}
                  min={rangeStart || undefined}
                  onChange={(event) => setRangeEnd(event.target.value)}
                  aria-invalid={Boolean(rangeError)}
                  aria-describedby={rangeError ? 'range-error' : undefined}
                />
              </div>
            </div>
            {rangeError ? (
              <p id="range-error" role="alert" className="text-xs text-destructive" data-testid="range-error">
                {rangeError}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </Section>

      <ResultPanel
        label="Selected values"
        value={summary}
        testId="date-result"
        tone={rangeError ? 'danger' : 'success'}
      />
    </PageContainer>
  );
}
