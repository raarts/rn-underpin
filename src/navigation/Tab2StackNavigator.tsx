import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ReactElement } from 'react';
import TemplateScreen from '../screens/TemplateScreen';

const Stack = createStackNavigator();

const Tab2StackNavigator = (): ReactElement => {
  return (
    <Stack.Navigator headerMode="none" mode="modal">
      <Stack.Screen name="TemplateScreen" component={TemplateScreen} />
    </Stack.Navigator>
  );
};

export default Tab2StackNavigator;
