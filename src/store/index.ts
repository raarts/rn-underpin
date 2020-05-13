import { configureStore, combineReducers } from '@reduxjs/toolkit';
import darkModeReducer from './darkmode';

const rootReducer = combineReducers({
  darkMode: darkModeReducer,
});
const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
