import * as React from 'react';
import { Image, SafeAreaView, Switch, Text, View } from 'react-native';
import { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Constants from 'expo-constants';
import { _ } from '../i18n';
import ThemeProvider, { applyTheme } from '../underpin/ThemeProvider';
import { RootState } from '../store';
import { useViewport } from '../underpin/ViewportProvider';
import { setDarkMode } from '../store/theme';

const TemplateScreen = (): ReactElement => {
  const dispatch = useDispatch();
  const styles = applyTheme(baseStyles);
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { viewportWidth, viewportHeight, viewportOrientation, viewportFormFactor } = useViewport();

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        <Image source={require('../assets/images/robot-dev.png')} style={styles.welcomeImage} />
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
    </SafeAreaView>
  );
};

const styles = ThemeProvider.create({
  safearea: {
    flex: 1,
    backgroundColor: '$backgroundColor',
    marginTop: Constants.statusBarHeight,
  },
  container: {
    flex: 1,
    backgroundColor: '$backgroundColor',
    alignItems: 'center',
    justifyContent: 'center',
  },
  color: {
    color: '$textColor',
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
});
const baseStyles = styles;

export default TemplateScreen;
