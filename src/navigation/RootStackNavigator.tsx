import { Platform } from 'react-native';
import { NavigationContainer, NavigationContainerRef, InitialState } from '@react-navigation/native';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ReactElement, Ref } from 'react';
import { StackHeaderMode } from '@react-navigation/stack/lib/typescript/src/types.d';
import ThemesProvider, { useWithTheme } from '../underpin/ThemesProvider';
import RootBottomTabNavigator from './BottomTabNavigator';
import RootMenuBarNavigator from './MenuBarNavigator';

export type RootStackNavigatorParamList = {
  Root: undefined;
};

type Props = {
  initialNavigationState: InitialState | undefined;
};

const Stack = createStackNavigator<RootStackNavigatorParamList>();

const Navigator = ({ initialNavigationState }: Props, ref: Ref<NavigationContainerRef> | null): ReactElement => {
  const [MenuOrTabNavigator, headerMode] = chooseMenuOrTab();
  const styles = useWithTheme(baseStyles);
  return (
    <NavigationContainer ref={ref} initialState={initialNavigationState}>
      <Stack.Navigator
        headerMode={headerMode}
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      >
        <Stack.Screen name="Root" component={MenuOrTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const RootStackNavigator = React.forwardRef(Navigator);

function chooseMenuOrTab(): [() => React.ReactElement, StackHeaderMode] {
  if (Platform.OS === 'ios') {
    return [RootBottomTabNavigator, 'none'];
  }
  if (Platform.OS === 'android') {
    return [RootBottomTabNavigator, 'none'];
  }
  return [RootMenuBarNavigator, 'none'];
}

const styles = ThemesProvider.create({
  headerStyle: {
    backgroundColor: '$backgroundColor',
    ...Platform.select({
      android: {
        height: 20,
      },
    }),
  },
  headerTitleStyle: {
    color: '$textColor',
    ...Platform.select({
      android: {
        fontSize: 16,
        paddingBottom: 8,
      },
    }),
  },
});
const baseStyles = styles;

export default RootStackNavigator;
