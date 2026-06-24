import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

interface UiState {
  sidebarOpen: boolean;
  theme: Theme;
}

function initialTheme(): Theme {
  try {
    const stored = localStorage.getItem('atp_theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    /* ignore */
  }
  return 'light';
}

const initialState: UiState = {
  sidebarOpen: false,
  theme: initialTheme(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebar(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      try {
        localStorage.setItem('atp_theme', action.payload);
      } catch {
        /* ignore */
      }
    },
  },
});

export const { toggleSidebar, setSidebar, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
