import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center px-4'>
          <div className='text-center max-w-md'>
            <div className='text-8xl mb-6 select-none'>💥</div>
            <p className='text-6xl font-bold text-primary mb-2'>500</p>
            <h1 className='text-2xl font-bold text-gray-800 mb-3'>Internal Server Error</h1>
            <p className='text-gray-600 mb-8'>
              Something went wrong. Please refresh the page or go back home.
            </p>
            <div className='flex gap-3 justify-center'>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className='px-6 py-2 rounded-xl border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors'
              >
                Try Again
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className='px-6 py-2 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity'
              >
                Go Home
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className='mt-6 text-left text-xs text-gray-500 bg-white/50 rounded-xl p-4'>
                <summary className='cursor-pointer font-medium'>Error details</summary>
                <pre className='mt-2 whitespace-pre-wrap break-all'>{this.state.error.stack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
