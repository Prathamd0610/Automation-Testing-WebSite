import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';
type UiMode = 'classic' | 'modern';

interface UiState {
  sidebarOpen: boolean;
  /** Classic skin: collapse the sidebar to a slim icon rail. */
  sidebarCollapsed: boolean;
  /** Full-screen app/module launcher overlay. */
  launcherOpen: boolean;
  theme: Theme;
  uiMode: UiMode;
}

function initialCollapsed(): boolean {
  try {
    return localStorage.getItem('atp_sidebar_collapsed') === '1';
  } catch {
    return false;
  }
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
    // One-time migration: older builds could persist "modern" as the active
    // skin. Reset persisted state once so the app reliably opens in classic by
    // default. Explicit toggles after this still persist normally.
    if (localStorage.getItem('atp_ui_mode_reset') !== '1') {
      localStorage.removeItem('atp_ui_mode');
      localStorage.setItem('atp_ui_mode_reset', '1');
      return 'classic';
    }
    const stored = localStorage.getItem('atp_ui_mode');
    if (stored === 'classic' || stored === 'modern') return stored;
  } catch {
    /* ignore */
  }
  return 'classic';
}

const initialState: UiState = {
  sidebarOpen: false,
  sidebarCollapsed: initialCollapsed(),
  launcherOpen: false,
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
    toggleSidebarCollapsed(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      try {
        localStorage.setItem('atp_sidebar_collapsed', state.sidebarCollapsed ? '1' : '0');
      } catch {
        /* ignore */
      }
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
      try {
        localStorage.setItem('atp_sidebar_collapsed', action.payload ? '1' : '0');
      } catch {
        /* ignore */
      }
    },
    setLauncher(state, action: PayloadAction<boolean>) {
      state.launcherOpen = action.payload;
    },
    toggleLauncher(state) {
      state.launcherOpen = !state.launcherOpen;
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

export const {
  toggleSidebar,
  setSidebar,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  setLauncher,
  toggleLauncher,
  setTheme,
  setUiMode,
} = uiSlice.actions;
export default uiSlice.reducer;
