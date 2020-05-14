import { FontAwesome } from '@expo/vector-icons';
import * as React from 'react';
import { ReactElement } from 'react';
import ThemesProvider, { useWithTheme } from '../underpin/ThemesProvider';

interface Props {
  name: string;
  focused?: boolean;
}

const TabBarIcon = ({ name, focused }: Props): ReactElement => {
  const styles = useWithTheme(baseStyles);
  const { color } = styles.selected;
  const { backgroundColor } = styles.default;
  return <FontAwesome name={name} size={26} style={styles.icon} color={focused ? color : backgroundColor} />;
};

const styles = ThemesProvider.create({
  selected: {
    color: '$textColor',
  },
  default: {
    backgroundColor: '$backgroundColor',
  },
  icon: {
    marginBottom: -3,
  },
});
const baseStyles = styles;

export default TabBarIcon;
