import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';

interface ParallaxProps {
  children: ReactNode;
  /**
   * How far (in pixels) the element drifts across the full scroll of its
   * nearest scroll container. Positive moves up as you scroll down.
   */
  offset?: number;
  className?: string;
}

/**
 * Moves its children at a different rate than the scroll, creating depth.
 * Only active in the modern UI skin and disabled for reduced-motion users.
 */
export function Parallax({ children, offset = 60, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const uiMode = useAppSelector((state) => state.ui.uiMode);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (uiMode !== 'modern' || reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
