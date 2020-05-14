// eslint-disable-file react/jsx-key
import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { ReactElement } from 'react';
import MenuBar from './MenuBar';
import TemplateScreen from '../screens/TemplateScreen';
import { useViewport } from '../underpin/ViewportProvider';

const TopMenu = createMaterialTopTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function MenuBarNavigator(): React.ReactElement {
  const { viewportWidth } = useViewport();

  return (
    <TopMenu.Navigator
      lazy
      initialLayout={{ width: viewportWidth }}
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBar={(props): ReactElement => <MenuBar {...props} />}
      timingConfig={{
        duration: 1, // milliseconds
      }}
    >
      <TopMenu.Screen
        name="Home"
        component={TemplateScreen}
        options={{
          title: 'Contacts',
        }}
      />
      <TopMenu.Screen
        name="Recent"
        component={TemplateScreen}
        options={{
          title: 'Recent',
        }}
      />
      <TopMenu.Screen
        name="Settings"
        component={TemplateScreen}
        options={{
          title: 'Settings',
        }}
      />
    </TopMenu.Navigator>
  );
}
