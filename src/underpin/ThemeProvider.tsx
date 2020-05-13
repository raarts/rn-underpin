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

export const rebuildTheme = (theme: string, darkMode: string): void => {
  const styleSheet: AnyObject = Object.assign(themes[theme][darkMode], {
    $theme: `${theme}/${darkMode}`,
  });
  EStyleSheet.build(styleSheet);
};

const ThemeProvider = ({ children }: Props): React.ReactElement => {
  const { viewportWidth, viewportHeight, viewportOrientation, viewportScale } = useViewport();
  const { theme, darkMode } = useSelector((state: RootState) => state.theme);

  React.useEffect(() => {
    const styleSheet: AnyObject = Object.assign(themes[theme][darkMode ? 'dark' : 'light'], {
      $theme: `${theme}/${darkMode ? 'dark' : 'light'}`,
    });
    EStyleSheet.build(styleSheet);
  }, [viewportWidth, viewportHeight, viewportOrientation, viewportScale, darkMode]);

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
};

const useTheme = (spec: AnyObject): AnyObject => {
  const { viewportFormFactor, viewportOrientation, viewportScale } = useViewport();

  const layoutDataWithScale = { ...styles, $scale: viewportScale, ...spec };
  return useMemo(() => {
    return EStyleSheet.create(layoutDataWithScale);
  }, [viewportFormFactor, viewportOrientation, viewportScale, spec]);
};

export default ThemeProvider;
export { useTheme };
