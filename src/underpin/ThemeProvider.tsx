import React, { ReactElement, useMemo } from 'react';
import EStyleSheet, { AnyObject } from '@raarts/react-native-extended-stylesheet';
import { useSelector } from 'react-redux';
import { useViewport } from './ViewportProvider';
import { RootState } from '../store';
import themes from '../config/themes';
import styles from '../config/styles';

const ThemeContext = React.createContext({});

interface Props {
  children: ReactElement;
}

export const rebuildTheme = (name: string, darkMode: string): void => {
  const styleSheet: AnyObject = Object.assign(themes[name][darkMode], {
    $theme: `${name}/${darkMode}`,
  });
  EStyleSheet.build(styleSheet);
};

const ThemeProvider = ({ children }: Props): React.ReactElement => {
  const { viewportWidth, viewportHeight, viewportOrientation, viewportScale } = useViewport();
  const { name, darkMode } = useSelector((state: RootState) => state.theme);

  React.useEffect(() => {
    rebuildTheme(name, darkMode);
  }, [viewportWidth, viewportHeight, viewportOrientation, viewportScale, darkMode]);

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
};

const applyTheme = (spec: AnyObject): AnyObject => {
  const { viewportFormFactor, viewportOrientation, viewportScale } = useViewport();

  const layoutDataWithScale = { ...styles, $scale: viewportScale, ...spec };
  return useMemo(() => {
    return EStyleSheet.create(layoutDataWithScale);
  }, [viewportFormFactor, viewportOrientation, viewportScale, spec]);
};

// Dummy function, but it allows checking unused styles with eslint-plugin-react-native/no-unused-styles
// with setting 'react-native/style-sheet-object-names': ['ThemeProvider'],
ThemeProvider.create = (styleObject: object): object => styleObject;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
ThemeProvider.value = (expr: any): any => EStyleSheet.value(expr);

export default ThemeProvider;
export { applyTheme };
