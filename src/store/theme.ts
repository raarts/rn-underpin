import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native-appearance';
import { rebuildTheme } from '../underpin/ThemeProvider';

interface CurrentTheme {
  theme: string;
  darkMode: string;
}

type CurrentThemeState = {
  // other parameters here
} & CurrentTheme;

const initialState: CurrentThemeState = {
  theme: 'default',
  darkMode: Appearance.getColorScheme(),
};

rebuildTheme(initialState.theme, initialState.darkMode);

// noinspection JSUnusedLocalSymbols
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // example of a plain PayLoad action creator. Could just as well have been
    // setTheme(state, action: PayloadAction<CurrentTheme>) but then you would
    // invoke the action creator as setTheme({ true }).
    setTheme(state, action: PayloadAction<string>): void {
      state.theme = action.payload;
      rebuildTheme(state.theme, state.darkMode);
    },
    setDarkMode(state, action: PayloadAction<boolean>): void {
      state.darkMode = action.payload ? 'dark' : 'light';
      rebuildTheme(state.theme, state.darkMode);
    },
    setThemeBuild(state): void {
      rebuildTheme(state.theme, state.darkMode);
    },
  },
});

export const { setTheme, setDarkMode, setThemeBuild } = themeSlice.actions;

export default themeSlice.reducer;
