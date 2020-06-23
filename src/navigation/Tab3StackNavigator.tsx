import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ReactElement } from 'react';
import TemplateLoginScreen from '../screens/TemplateLoginScreen';

const Stack = createStackNavigator();

const Tab3StackNavigator = (): ReactElement => {
  return (
    <Stack.Navigator headerMode="none" mode="modal">
      <Stack.Screen name="TemplateLoginScreen" component={TemplateLoginScreen} />
    </Stack.Navigator>
  );
};

export default Tab3StackNavigator;
