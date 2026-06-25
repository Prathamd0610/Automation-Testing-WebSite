import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';
type UiMode = 'classic' | 'modern';

interface UiState {
  sidebarOpen: boolean;
  theme: Theme;
  uiMode: UiMode;
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

function initialUiMode(): UiMode {
  try {
    const stored = localStorage.getItem('atp_ui_mode');
    if (stored === 'classic' || stored === 'modern') return stored;
  } catch {
    /* ignore */
  }
  return 'classic';
}

const initialState: UiState = {
  sidebarOpen: false,
  theme: initialTheme(),
  uiMode: initialUiMode(),
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
    setUiMode(state, action: PayloadAction<UiMode>) {
      state.uiMode = action.payload;
      try {
        localStorage.setItem('atp_ui_mode', action.payload);
      } catch {
        /* ignore */
      }
    },
  },
});

export const { toggleSidebar, setSidebar, setTheme, setUiMode } = uiSlice.actions;
export default uiSlice.reducer;
