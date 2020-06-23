import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { createLogger } from 'redux-logger';
import { AsyncStorage } from 'react-native';
import Constants from 'expo-constants';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';
import themeReducer from './theme';
import identityReducer from './identity';

const rootReducer = combineReducers({
  theme: themeReducer,
  identity: identityReducer,
});

const persistConfig = {
  key: Constants.manifest.slug || 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// build the list of middleware to apply to store actions
const middleware = [
  ...getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
];

// redux-logger. Only activate when needed. This should be the last entry in the middleware array
const { pathname } = window.location || {};
const IS_RUNNING_IN_CHROME = pathname && pathname.indexOf('debugger-ui');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const logger = createLogger({
  // only log if the predicate function returns true
  predicate: (getState, action) => action.type !== '',
});
if (IS_RUNNING_IN_CHROME && !IS_PRODUCTION) {
  middleware.push(logger);
}

const store = configureStore({
  reducer: persistedReducer,
  middleware,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
