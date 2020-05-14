import React, { useEffect, ReactElement, ReactNode } from 'react';
import { Image, Switch, Text, View } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SplashScreen } from 'expo';
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
      <Image source={require('./assets/images/robot-dev.png')} style={styles.welcomeImage} />
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

const imageList: number[] | string[] = [require('./assets/images/robot-dev.png')];

const fontList: (string | { [fontFamily: string]: Font.FontSource })[] = [
  {
    ...Ionicons.font,
  },
];

export default function App(): ReactNode {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  useEffect(() => {
    // This is the central function that asynchronously performs all initialization
    async function loadResourcesAndDataAsync(): Promise<void> {
      try {
        SplashScreen.preventAutoHide();

        const appPromises: any[] = [
          // This is the place to put non-Underpin async functions
        ];

        // get and cache images
        const cacheImages = (images: unknown[]): any[] => {
          return images.map((image) => {
            if (typeof image === 'string') {
              return Image.prefetch(image);
            }
            return Asset.fromModule(image as string | number).downloadAsync();
          });
        };
        const imageAssets = cacheImages(imageList);

        // get and cache fonts
        const cacheFonts = (fonts: (string | { [fontFamily: string]: Font.FontSource })[]): Promise<void>[] => {
          return fonts.map(
            (font: string | { [fontFamily: string]: Font.FontSource }): Promise<void> => Font.loadAsync(font),
          );
        };
        const fontAssets = cacheFonts(fontList);

        // wait for all promises to resolve
        await Promise.all(appPromises.concat([...imageAssets, ...fontAssets]));
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        // eslint-disable-next-line no-console
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete) {
    return null;
  }
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

const styles = ThemeProvider.create({
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
