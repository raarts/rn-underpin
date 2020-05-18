import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native-appearance';
import { rebuildTheme } from '../underpin/ThemeProvider';

type Theme = typeof initialState;

const initialState = {
  name: 'default',
  darkMode: Appearance.getColorScheme(),
};

rebuildTheme(initialState.name, initialState.darkMode);

// noinspection JSUnusedLocalSymbols
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // example of a plain PayLoad action creator. Could just as well have been
    // setTheme(state, action: PayloadAction<Theme>) but then you would
    // invoke the action creator as setTheme({ true }).
    setTheme(state, action: PayloadAction<string>): void {
      state.name = action.payload;
      rebuildTheme(state.name, state.darkMode);
    },
    setDarkMode(state, action: PayloadAction<boolean>): void {
      state.darkMode = action.payload ? 'dark' : 'light';
      rebuildTheme(state.name, state.darkMode);
    },
    setThemeBuild(state): void {
      rebuildTheme(state.name, state.darkMode);
    },
  },
});

export const { setTheme, setDarkMode, setThemeBuild } = themeSlice.actions;

export default themeSlice.reducer;
