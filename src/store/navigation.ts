import * as React from 'react';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackNavigatorParamList } from '../navigation/RootStackNavigator';

// eslint-disable-next-line import/prefer-default-export
export const navigationRef: React.RefObject<StackNavigationProp<RootStackNavigatorParamList>> = React.createRef();
