import React, { ReactElement } from 'react';
import { Dimensions, Platform, ScaledSize } from 'react-native';

const IPHONE7_WIDTH = 375;
const IPHONE7_HEIGHT = 667;
const IPAD_WIDTH = 768;
const IPAD_HEIGHT = 1024;
const IPAD_PRO_WIDTH = 1024;
const IPAD_PRO_HEIGHT = 1366; // eslint-disable-line no-unused-vars

const MIN_TABLET_WIDTH = IPHONE7_WIDTH + (IPAD_WIDTH - IPHONE7_WIDTH) / 2;
const MIN_MONITOR_WIDTH = IPAD_PRO_HEIGHT + 1 - 1;
// (circumvent Warning:(12, 7) 'IPAD_PRO_HEIGHT' should probably not be assigned to 'MIN_MONITOR_WIDTH')

type ViewportFormFactor = 'phone' | 'tablet' | 'monitor';
type ViewportOrientation = 'portrait' | 'landscape';

export interface Viewport {
  viewportWidth: number;
  viewportHeight: number;
  viewportFormFactor: ViewportFormFactor;
  viewportOrientation: ViewportOrientation;
  viewportScale: number;
}

interface Props {
  children: ReactElement;
}

type DimensionType = {
  window: ScaledSize;
  screen: ScaledSize;
};

const calculateViewport = (dim: DimensionType): Viewport => {
  let orientation: ViewportOrientation;
  let screenFormFactor: ViewportFormFactor = 'phone';
  let scale: number;

  // https://stackoverflow.com/questions/1726630/formatting-a-number-with-exactly-two-decimals-in-javascript/48850944#48850944
  const Round = (num: number, precision = 2): number => {
    // half epsilon to correct edge cases.
    const c = 0.5 * Number.EPSILON * num;
    //	var p = Math.pow(10, precision); //slow
    let p = 1;
    let prec = precision;
    while (prec-- > 0) p *= 10;
    if (num < 0) p *= -1;
    return Math.round((num + c) * p) / p;
  };

  let width = Math.round(dim.screen.width);
  let height = Math.round(dim.screen.height);
  if (Platform.OS === 'web') {
    width = Math.round(dim.window.width);
    height = Math.round(dim.window.height);
  }
  if (width > height) {
    // LANDSCAPE MODE
    orientation = 'landscape';
    scale = width / IPHONE7_HEIGHT;
    if (height > MIN_TABLET_WIDTH) {
      screenFormFactor = 'tablet';
      scale = width / IPAD_HEIGHT;
    }
    if (width > MIN_MONITOR_WIDTH) {
      screenFormFactor = 'monitor';
      scale = width / IPAD_PRO_HEIGHT;
    }
  } else {
    // PORTRAIT MODE
    orientation = 'portrait';
    scale = width / IPHONE7_WIDTH;
    if (width > MIN_TABLET_WIDTH) {
      screenFormFactor = 'tablet';
      scale = width / IPAD_WIDTH;
    }
    if (width > MIN_MONITOR_WIDTH) {
      screenFormFactor = 'monitor';
      scale = width / IPAD_PRO_WIDTH;
    }
  }
  return {
    viewportWidth: width,
    viewportHeight: height,
    viewportFormFactor: screenFormFactor,
    viewportOrientation: orientation,
    viewportScale: Round(scale, 3),
  };
};
const initialViewport = calculateViewport({ window: Dimensions.get('window'), screen: Dimensions.get('screen') });

const ViewportContext = React.createContext(initialViewport);

const ViewportProvider = ({ children }: Props): React.ReactElement => {
  const renderCounter = React.useRef(1);
  const [viewport, setViewport] = React.useState(initialViewport);

  // Handle dimension change, i.e. device rotation, browser resizes, split windows on devices
  const onDimensionChange = (dim: { window: ScaledSize; screen: ScaledSize }): void => {
    const newViewport = calculateViewport(dim);
    setViewport(newViewport);
  };

  React.useEffect(() => {
    Dimensions.addEventListener('change', onDimensionChange);

    const removeEventListeners = (): void => {
      Dimensions.removeEventListener('change', onDimensionChange);
    };
    return (): void => removeEventListeners();
  }, []);

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(
      `${renderCounter.current++} ViewportProvider.tsx: ${viewport.viewportWidth}x${viewport.viewportHeight}`,
      viewport.viewportFormFactor,
      viewport.viewportOrientation,
      viewport.viewportScale,
    );
  }
  return <ViewportContext.Provider value={viewport}>{children}</ViewportContext.Provider>;
};

const useViewport = (): Viewport => {
  const viewport = React.useContext(ViewportContext);
  return viewport as Viewport;
};

export default ViewportProvider;
export { useViewport };
