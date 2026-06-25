import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PrefsState {
  /** Module ids the user has starred. */
  favorites: string[];
  /** Module ids most-recently opened (most recent first). */
  recents: string[];
}

const FAVORITES_KEY = 'atp_favorites';
const RECENTS_KEY = 'atp_recents';
const RECENTS_LIMIT = 8;

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

const initialState: PrefsState = {
  favorites: readList(FAVORITES_KEY),
  recents: readList(RECENTS_KEY),
};

const prefsSlice = createSlice({
  name: 'prefs',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.favorites = state.favorites.includes(id)
        ? state.favorites.filter((f) => f !== id)
        : [id, ...state.favorites];
      writeList(FAVORITES_KEY, state.favorites);
    },
    addRecent(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.recents = [id, ...state.recents.filter((r) => r !== id)].slice(0, RECENTS_LIMIT);
      writeList(RECENTS_KEY, state.recents);
    },
    clearRecents(state) {
      state.recents = [];
      writeList(RECENTS_KEY, state.recents);
    },
  },
});

export const { toggleFavorite, addRecent, clearRecents } = prefsSlice.actions;
export default prefsSlice.reducer;
