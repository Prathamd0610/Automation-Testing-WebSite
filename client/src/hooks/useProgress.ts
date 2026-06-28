import { useAppSelector } from '@/store/hooks';
import { lessonKey } from '@/store/progressSlice';
import { LEARNING_TRACKS, TOTAL_LESSONS, type LearningTrack } from '@/config/learning';
import { MODULES } from '@/config/modules';

export interface ProgressInfo {
  done: number;
  total: number;
  pct: number;
}

/** Completion of a single learning track. */
export function useTrackProgress(track: LearningTrack): ProgressInfo {
  const lessons = useAppSelector((s) => s.progress.lessons);
  const done = track.lessons.filter((l) => lessons.includes(lessonKey(track.id, l.id))).length;
  const total = track.lessons.length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

/** Completion across every lesson in the curriculum. */
export function useLearningProgress(): ProgressInfo {
  const lessons = useAppSelector((s) => s.progress.lessons);
  const valid = new Set(
    LEARNING_TRACKS.flatMap((t) => t.lessons.map((l) => lessonKey(t.id, l.id))),
  );
  const done = lessons.filter((l) => valid.has(l)).length;
  return { done, total: TOTAL_LESSONS, pct: TOTAL_LESSONS ? Math.round((done / TOTAL_LESSONS) * 100) : 0 };
}

/** Completion across all practice/challenge/workflow modules. */
export function useModuleProgress(): ProgressInfo {
  const modules = useAppSelector((s) => s.progress.modules);
  const valid = new Set(MODULES.map((m) => m.id));
  const done = modules.filter((m) => valid.has(m)).length;
  const total = MODULES.length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}
