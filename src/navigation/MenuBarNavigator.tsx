// eslint-disable-file react/jsx-key
import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { ReactElement } from 'react';
import MenuBar from './MenuBar';
import Tab1StackNavigator from './Tab1StackNavigator';
import Tab2StackNavigator from './Tab2StackNavigator';
import Tab3StackNavigator from './Tab3StackNavigator';
import { useViewport } from '../underpin/ViewportProvider';

const TopMenu = createMaterialTopTabNavigator();
const INITIAL_ROUTE_NAME = 'Menu1';

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
        name="Menu1"
        component={Tab1StackNavigator}
        options={{
          title: 'Menu1',
        }}
      />
      <TopMenu.Screen
        name="Menu2"
        component={Tab2StackNavigator}
        options={{
          title: 'Menu2',
        }}
      />
      <TopMenu.Screen
        name="Menu3"
        component={Tab3StackNavigator}
        options={{
          title: 'Menu3',
        }}
      />
    </TopMenu.Navigator>
  );
}
