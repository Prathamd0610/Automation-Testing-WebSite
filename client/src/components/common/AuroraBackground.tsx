import { type RefObject } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';

interface AuroraBackgroundProps {
  /** The scrolling container the blobs gently react to. */
  containerRef?: RefObject<HTMLElement>;
}

/**
 * Decorative animated gradient orbs that drift on their own and shift subtly
 * with scroll, giving the modern skin a sense of depth (Microsoft Loop style).
 * Renders nothing in classic mode; purely decorative (aria-hidden).
 */
export function AuroraBackground({ containerRef }: AuroraBackgroundProps) {
  const uiMode = useAppSelector((state) => state.ui.uiMode);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll(
    containerRef ? { container: containerRef } : undefined,
  );
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -90]);

  if (uiMode !== 'modern') return null;

  const drift = reduceMotion ? '' : 'animate-aurora-drift';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        style={{ y: reduceMotion ? 0 : y1 }}
        className={`aurora-blob ${drift} -left-32 -top-24 h-[28rem] w-[28rem]`}
      >
        <div className="h-full w-full rounded-full bg-[hsl(28_95%_55%/0.50)]" />
      </motion.div>
      <motion.div
        style={{ y: reduceMotion ? 0 : y2 }}
        className={`aurora-blob ${drift} right-[-10rem] top-32 h-[32rem] w-[32rem]`}
      >
        <div className="h-full w-full rounded-full bg-[hsl(40_95%_55%/0.42)]" />
      </motion.div>
      <motion.div
        style={{ y: reduceMotion ? 0 : y3 }}
        className={`aurora-blob ${drift} bottom-[-8rem] left-1/3 h-[26rem] w-[26rem]`}
      >
        <div className="h-full w-full rounded-full bg-[hsl(14_90%_58%/0.38)]" />
      </motion.div>
    </div>
  );
}
