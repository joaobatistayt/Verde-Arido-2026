import React from 'react';

type State = {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
};

type Props = { children?: React.ReactNode };

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console and persist a small trace to localStorage for later inspection
    // (catch errors silently if localStorage isn't available)
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, errorInfo);
    try {
      localStorage.setItem(
        'lastError',
        JSON.stringify({ message: error.message, stack: error.stack, info: errorInfo.componentStack })
      );
    } catch (e) {}
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20 }}>
          <h2>Ocorreu um erro na aplicação</h2>
          <p style={{ color: '#b00' }}>{this.state.error?.message}</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.errorInfo?.componentStack}
          </details>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => window.location.reload()}>Recarregar</button>
          </div>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

export default ErrorBoundary;
