import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrentDarkMode {
  darkMode: boolean;
}
type CurrentDarkModeState = {
  // other parameters here
} & CurrentDarkMode;

const initialState: CurrentDarkModeState = {
  darkMode: false,
};

const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    // example of a plain PayLoad action creator. Could just as well have been
    // setDarkMode(state, action: PayloadAction<CurrentDarkMode>) but then you would
    // invoke the action creator as setDarkMode({ true }).
    setDarkMode(state, action: PayloadAction<boolean>): void {
      state.darkMode = action.payload;
    },
  },
});

export const { setDarkMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;
