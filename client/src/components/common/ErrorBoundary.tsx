import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

/** Catches render-time errors so a single broken module never blanks the app. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="max-w-md text-sm text-muted-foreground">{this.state.message}</p>
          <button
            type="button"
            onClick={this.handleReset}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
