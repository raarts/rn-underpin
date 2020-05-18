import React, { ErrorInfo, ReactNode } from 'react';
import ErrorComponent, { ErrorComponentProps } from './ErrorComponent';

type State = {
  error: Error | null;
};
type Props = {
  errorComponent?: ({ forceReload }: ErrorComponentProps) => ReactNode;
  forceReload: () => void;
  children: ReactNode;
};
const initialState = {
  error: null,
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  static getDerivedStateFromError(error: Error): State {
    // eslint-disable-next-line no-console
    console.log('getDerivedStateFromError', error);
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.log('componentDidCatch', info.componentStack);
  }

  restoreAndForceReload = (): void => {
    const { forceReload } = this.props;

    this.setState({ error: null });
    forceReload();
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children, errorComponent } = this.props;

    if (error) {
      // You can render any custom fallback UI
      if (errorComponent) {
        return errorComponent({ error, forceReload: this.restoreAndForceReload });
      }
      return ErrorComponent({ error, forceReload: this.restoreAndForceReload });
    }

    return children;
  }
}

export default ErrorBoundary;
