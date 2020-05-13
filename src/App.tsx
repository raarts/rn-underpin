import React, { ReactElement } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor, RootState } from './store';
import { setDarkMode } from './store/darkmode';
import ViewportProvider, { useViewport } from './underpin/ViewportProvider';
import { _ } from './i18n';

const Page = (): ReactElement => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.darkMode);
  const { viewportWidth, viewportHeight, viewportOrientation, viewportFormFactor } = useViewport();

  return (
    <View style={styles.container}>
      <Text>{_('openAppAndStart')}</Text>
      <Text>{`screen: ${viewportWidth} x ${viewportHeight}`}</Text>
      <Text>{`This looks like a ${viewportFormFactor} in ${viewportOrientation} mode`}</Text>
      <Switch
        value={darkMode}
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
      <PersistGate loading={null} persistor={persistor}>
        <ViewportProvider>
          <Page />
        </ViewportProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
