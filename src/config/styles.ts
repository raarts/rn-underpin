import { AnyObject } from '@raarts/react-native-extended-stylesheet';
import { Platform } from 'react-native';

const styles: AnyObject = {
  theme: {
    fontFamily: '$theme',
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flex4: {
    flex: 4,
  },
  flex5: {
    flex: 5,
  },
  flex6: {
    flex: 6,
  },
  flex7: {
    flex: 7,
  },
  flex8: {
    flex: 8,
  },
  flex9: {
    flex: 9,
  },
  border: {
    ...Platform.select({
      android: {
        borderColor: 'green',
      },
      ios: {
        borderColor: 'blue',
      },
      web: {
        borderColor: 'black',
      },
    }),
  },
};

export default styles;
