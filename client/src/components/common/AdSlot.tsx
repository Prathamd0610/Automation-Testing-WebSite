import { useEffect, useRef } from 'react';
import { appEnv } from '@/lib/env';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

interface AdSlotProps {
  /** The ad unit "slot" id from your AdSense dashboard (digits only). */
  slot: string;
  /** AdSense ad format, e.g. 'auto', 'horizontal', 'rectangle'. */
  format?: string;
  /** Let Google use the full responsive width. */
  responsive?: boolean;
  className?: string;
  testId?: string;
}

/**
 * Google AdSense ad unit.
 *
 * Real ads load only when `VITE_ADSENSE_CLIENT` (your `ca-pub-…` id) is set AND
 * the AdSense loader script is present in `index.html`. Until then a neutral
 * placeholder keeps the layout intentional (and avoids errors in development).
 */
export function AdSlot({
  slot,
  format = 'auto',
  responsive = true,
  className,
  testId = 'ad-slot',
}: AdSlotProps) {
  const client = appEnv.adsenseClient;
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
      pushed.current = true;
    } catch {
      // Loader not ready yet or blocked by an ad blocker — fail silently.
    }
  }, [client, slot]);

  if (!client) {
    return (
      <div
        data-testid={testId}
        aria-hidden="true"
        className={cn(
          'flex min-h-[100px] w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground',
          className,
        )}
      >
        Advertisement
      </div>
    );
  }

  return (
    <ins
      className={cn('adsbygoogle', className)}
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
      data-testid={testId}
    />
  );
}
