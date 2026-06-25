import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  /** Duration of the count-up in milliseconds. */
  duration?: number;
  className?: string;
  'data-testid'?: string;
}

/**
 * Counts up from 0 to `value` the first time it scrolls into view
 * (viewport-triggered animation). Falls back to the final value instantly when
 * reduced motion is preferred.
 */
export function AnimatedCounter({
  value,
  duration = 1200,
  className,
  'data-testid': testId,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic for a lively but settling count.
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduceMotion, value, duration]);

  return (
    <span ref={ref} className={className} data-testid={testId}>
      {display}
    </span>
  );
}
