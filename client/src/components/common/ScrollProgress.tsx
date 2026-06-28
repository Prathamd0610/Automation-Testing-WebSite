import { motion, useScroll, useSpring } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';

/**
 * A thin progress bar pinned to the top of the viewport whose width is linked
 * to overall scroll progress (scroll-linked animation). Modern skin only.
 */
export function ScrollProgress() {
  const uiMode = useAppSelector((state) => state.ui.uiMode);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  if (uiMode !== 'modern') return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500"
    />
  );
}
