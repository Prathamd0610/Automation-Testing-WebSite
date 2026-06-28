import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Lightweight learning/practice progress, persisted to local storage. Powers
 * the progress rings and "continue" affordances across both navigation shells.
 */
interface ProgressState {
  /** Completed lessons, keyed as `${trackId}/${lessonId}`. */
  lessons: string[];
  /** Practice module ids the user has marked as done. */
  modules: string[];
}

const LESSONS_KEY = 'atp_progress_lessons';
const MODULES_KEY = 'atp_progress_modules';

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function writeList(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function lessonKey(trackId: string, lessonId: string): string {
  return `${trackId}/${lessonId}`;
}

const initialState: ProgressState = {
  lessons: readList(LESSONS_KEY),
  modules: readList(MODULES_KEY),
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    toggleLessonComplete(state, action: PayloadAction<string>) {
      const key = action.payload;
      state.lessons = state.lessons.includes(key)
        ? state.lessons.filter((l) => l !== key)
        : [...state.lessons, key];
      writeList(LESSONS_KEY, state.lessons);
    },
    setLessonComplete(state, action: PayloadAction<{ key: string; done: boolean }>) {
      const { key, done } = action.payload;
      const has = state.lessons.includes(key);
      if (done && !has) state.lessons = [...state.lessons, key];
      if (!done && has) state.lessons = state.lessons.filter((l) => l !== key);
      writeList(LESSONS_KEY, state.lessons);
    },
    toggleModuleComplete(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.modules = state.modules.includes(id)
        ? state.modules.filter((m) => m !== id)
        : [...state.modules, id];
      writeList(MODULES_KEY, state.modules);
    },
    resetProgress(state) {
      state.lessons = [];
      state.modules = [];
      writeList(LESSONS_KEY, state.lessons);
      writeList(MODULES_KEY, state.modules);
    },
  },
});

export const { toggleLessonComplete, setLessonComplete, toggleModuleComplete, resetProgress } =
  progressSlice.actions;

export default progressSlice.reducer;
