import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { ReactElement } from 'react';
import TabBarIcon from './TabBarIcon';
import TemplateScreen from '../screens/TemplateScreen';
import ThemesProvider, { useWithTheme } from '../underpin/ThemesProvider';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator(): ReactElement {
  const styles = useWithTheme(baseStyles);

  return (
    <BottomTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{ style: styles.tabBarStyle, labelStyle: styles.tabBarStyle }}
    >
      <BottomTab.Screen
        name="Contact"
        component={TemplateScreen}
        options={{
          title: 'Contacts',
          tabBarIcon: ({ focused }): ReactElement => <TabBarIcon focused={focused} name="user" />,
        }}
      />
      <BottomTab.Screen
        name="Recent"
        component={TemplateScreen}
        options={{
          title: 'Recent Calls',
          tabBarIcon: ({ focused }): ReactElement => <TabBarIcon focused={focused} name="clock-o" />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={TemplateScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }): ReactElement => <TabBarIcon focused={focused} name="cog" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

const styles = ThemesProvider.create({
  tabBarStyle: {
    backgroundColor: '$backgroundColor',
  },
});
const baseStyles = styles;
