import { Platform } from 'react-native';
import { NavigationContainer, NavigationContainerRef, InitialState } from '@react-navigation/native';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ReactElement, Ref } from 'react';
import ThemeProvider, { useTheme } from '../underpin/ThemeProvider';
import TemplateScreen from '../screens/TemplateScreen';

export type RootStackNavigatorParamList = {
  Root: undefined;
};

type Props = {
  initialNavigationState: InitialState | undefined;
};

const Stack = createStackNavigator<RootStackNavigatorParamList>();

const Navigator = ({ initialNavigationState }: Props, ref: Ref<NavigationContainerRef> | null): ReactElement => {
  const styles = useTheme(baseStyles);
  return (
    <NavigationContainer ref={ref} initialState={initialNavigationState}>
      <Stack.Navigator
        headerMode="none"
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
      >
        <Stack.Screen name="Root" component={TemplateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const RootStackNavigator = React.forwardRef(Navigator);

const styles = ThemeProvider.create({
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
