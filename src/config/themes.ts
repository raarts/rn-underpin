import { AnyObject } from '@raarts/react-native-extended-stylesheet';
import { Platform } from 'react-native';

const themes: AnyObject = {
  default: {
    light: {
      $backgroundColor: 'white',

      ...Platform.select({
        android: {
          $textColor: 'green',
        },
        ios: {
          $textColor: 'blue',
        },
        web: {
          $textColor: 'purple',
        },
      }),
    },
    dark: {
      $backgroundColor: 'black',

      ...Platform.select({
        android: {
          $textColor: 'green',
        },
        ios: {
          $textColor: 'blue',
        },
        web: {
          $textColor: 'purple',
        },
      }),
    },
  },
};

export default themes;
