import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import TabBarIcon from './TabBarIcon';
import Tab1StackNavigator from './Tab1StackNavigator';
import Tab2StackNavigator from './Tab2StackNavigator';
import Tab3StackNavigator from './Tab3StackNavigator';
import ThemeProvider, { applyTheme } from '../underpin/ThemeProvider';
import { RootState } from '../store';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Tab1';

export default function BottomTabNavigator(): ReactElement {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, darkMode } = useSelector((state: RootState) => state.theme);
  const styles = applyTheme(baseStyles);

  return (
    <BottomTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{ style: styles.tabBarStyle, labelStyle: styles.tabBarStyle }}
    >
      <BottomTab.Screen
        name="Tab1"
        component={Tab1StackNavigator}
        options={{
          title: 'Tab1',
          tabBarIcon: ({ focused }): ReactElement => <TabBarIcon focused={focused} name="user" />,
        }}
      />
      <BottomTab.Screen
        name="Tab2"
        component={Tab2StackNavigator}
        options={{
          title: 'Tab2',
          tabBarIcon: ({ focused }): ReactElement => <TabBarIcon focused={focused} name="clock-o" />,
        }}
      />
      <BottomTab.Screen
        name="Tab3"
        component={Tab3StackNavigator}
        options={{
          title: 'Tab3',
          tabBarIcon: ({ focused }): ReactElement => <TabBarIcon focused={focused} name="cog" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

const styles = ThemeProvider.create({
  tabBarStyle: {
    backgroundColor: '$backgroundColor',
  },
});
const baseStyles = styles;
