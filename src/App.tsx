import React, { ReactElement } from 'react';
import { Switch, Text, View } from 'react-native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor, RootState } from './store';
import { setDarkMode, setThemeBuild } from './store/theme';
import ViewportProvider, { useViewport } from './underpin/ViewportProvider';
import ThemeProvider, { useTheme } from './underpin/ThemeProvider';
import { _ } from './i18n';

const Page = (): ReactElement => {
  const dispatch = useDispatch();
  const styles = useTheme(baseStyles);
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { viewportWidth, viewportHeight, viewportOrientation, viewportFormFactor } = useViewport();

  return (
    <View style={styles.container}>
      <Text style={styles.color}>{_('openAppAndStart')}</Text>
      <Text style={styles.color}>{`screen: ${viewportWidth} x ${viewportHeight}`}</Text>
      <Text style={styles.color}>{`This looks like a ${viewportFormFactor} in ${viewportOrientation} mode`}</Text>
      <Switch
        value={darkMode === 'dark'}
        onValueChange={(v): void => {
          dispatch(setDarkMode(v));
        }}
      />
    </View>
  );
};

export default function App(): ReactElement {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        onBeforeLift={(): void => {
          store.dispatch(setThemeBuild());
        }}
        persistor={persistor}
      >
        <ViewportProvider>
          <ThemeProvider>
            <Page />
          </ThemeProvider>
        </ViewportProvider>
      </PersistGate>
    </Provider>
  );
}

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: '$backgroundColor',
    alignItems: 'center',
    justifyContent: 'center',
  },
  color: {
    color: '$textColor',
  },
};
