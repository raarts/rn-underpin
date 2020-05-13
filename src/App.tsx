import React, { ReactElement } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store, { RootState } from './store';
import { setDarkMode } from './store/darkmode';

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
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <DarkModeSwitch />
      </View>
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
