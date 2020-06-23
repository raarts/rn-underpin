import React, { useEffect, ReactNode, SetStateAction, RefObject, useReducer } from 'react';
import { Image } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { Provider } from 'react-redux';
import { SplashScreen } from 'expo';
import { persistStore } from 'redux-persist';
import { NavigationContainerRef } from '@react-navigation/native';
import store from './store';
import { setThemeBuild } from './store/theme';
import { setAnonymousId } from './store/identity';
import { navigationRef } from './store/navigation';
import ViewportProvider from './underpin/ViewportProvider';
import ThemeProvider from './underpin/ThemeProvider';
import RootStackNavigator from './navigation/RootStackNavigator';
import useLinking from './navigation/useLinking';
import ErrorBoundary from './underpin/ErrorBoundary';
import KeycloakAuthentication from './underpin/KeycloakAuthentication';

// How to extend the RootNavigator concept to apply to multiple form factors and orientations
// import PortraitPhoneRootStackNavigator from './navigation/portrait/phone/RootStackNavigator';
// import PortraitTabletRootStackNavigator from './navigation/portrait/tablet/RootStackNavigator';
// import PortraitMonitorRootStackNavigator from './navigation/portrait/monitor/RootStackNavigator';
//
// import LandscapePhoneRootStackNavigator from './navigation/landscape/phone/RootStackNavigator';
// import LandscapeTabletRootStackNavigator from './navigation/landscape/tablet/RootStackNavigator';
// import LandscapeMonitorRootStackNavigator from './navigation/landscape/monitor/RootStackNavigator';
//
// const rootNavMatrix = {
//   portrait: {
//     phone: PortraitPhoneRootStackNavigator,
//     tablet: PortraitTabletRootStackNavigator,
//     monitor: PortraitMonitorRootStackNavigator,
//   },
//   landscape: {
//     phone: LandscapePhoneRootStackNavigator,
//     tablet: LandscapeTabletRootStackNavigator,
//     monitor: LandscapeMonitorRootStackNavigator,
//   },
// };

const imageList: number[] | string[] = [require('./assets/images/robot-dev.png')];

const fontList: (string | { [fontFamily: string]: Font.FontSource })[] = [
  {
    ...Ionicons.font,
  },
];

export default function App(): ReactNode {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const { getInitialState } = useLinking(navigationRef);

  useEffect(() => {
    // This is the central function that asynchronously performs all initialization
    async function loadResourcesAndDataAsync(): Promise<void> {
      try {
        SplashScreen.preventAutoHide();

        const persistStoreAsync = (currentStore: typeof store): Promise<void> => {
          return new Promise((resolve) => {
            persistStore(currentStore, null, () => {
              currentStore.getState();
              resolve();
            });
          });
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const appPromises: (PromiseLike<any> | Promise<void>)[] = [
          // This is the place to put non-Underpin async functions
          getInitialState(),
          persistStoreAsync(store),
        ];

        // get and cache images
        const cacheImages = (images: unknown[]): Promise<void>[] => {
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
        await Promise.all(appPromises.concat([...imageAssets, ...fontAssets])).then(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([navState]): void | PromiseLike<unknown> => {
            setInitialNavigationState(navState as SetStateAction<undefined>);
          },
        );
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        // eslint-disable-next-line no-console
        console.warn(e);
      } finally {
        store.dispatch(setThemeBuild());
        store.dispatch(setAnonymousId());
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }
    loadResourcesAndDataAsync().then();
  }, []);

  if (!isLoadingComplete) {
    return null;
  }

  // How to extend the RootNavigator concept to apply to multiple form factors and orientations
  // const { orientation, screenFormFactor } = useViewport();
  // const RootStackNavigator = rootNavMatrix[orientation][screenFormFactor];
  const urlDiscovery = process.env.KEYCLOAK_DISCOVERY_URL || '';
  const clientId = process.env.CLIENTID || '';
  return (
    <Provider store={store}>
      <ViewportProvider>
        <ThemeProvider>
          <KeycloakAuthentication urlDiscovery={urlDiscovery} clientId={clientId}>
            <ErrorBoundary forceReload={forceUpdate}>
              <RootStackNavigator
                ref={
                  (navigationRef as unknown) as
                    | ((instance: NavigationContainerRef | null) => void)
                    | RefObject<NavigationContainerRef>
                    | null
                    | undefined
                }
                initialNavigationState={initialNavigationState}
              />
            </ErrorBoundary>
          </KeycloakAuthentication>
        </ThemeProvider>
      </ViewportProvider>
    </Provider>
  );
}
