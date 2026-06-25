import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface ScrollRevealProps {
  children: ReactNode;
  /** Direction the content travels in from. */
  direction?: Direction;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Travel distance in pixels. */
  distance?: number;
  className?: string;
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Reveals its children with a subtle fade/slide as they scroll into view.
 * Only active in the modern UI skin; classic mode renders children untouched,
 * and the animation is skipped entirely when the user prefers reduced motion.
 */
export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  distance = 24,
  className,
}: ScrollRevealProps) {
  const uiMode = useAppSelector((state) => state.ui.uiMode);
  const reduceMotion = useReducedMotion();

  if (uiMode !== 'modern' || reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const { x, y } = offsets[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: x * distance, y: y * distance }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
