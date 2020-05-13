import React, { ReactElement } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor, RootState } from './store';
import { setDarkMode } from './store/darkmode';
import { _ } from './i18n';

const DarkModeSwitch = (): ReactElement => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.darkMode);

  return (
    <Switch
      value={darkMode}
      onValueChange={(v): void => {
        dispatch(setDarkMode(v));
      }}
    />
  );
};

export default function App(): ReactElement {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          <Text>{_('openAppAndStart')}</Text>
          <DarkModeSwitch />
        </View>
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
