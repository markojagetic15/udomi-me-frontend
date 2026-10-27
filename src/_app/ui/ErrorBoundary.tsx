import { Component, ErrorInfo, ReactNode } from 'react';
import {
  isStaleChunkError,
  reloadForNewBuild,
  reportError,
} from '_shared/lib/monitoring';
import i18n from '../../i18n';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

// Last-resort crash screen. Uses i18n directly (class component, no hooks).
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  private reloading = false;

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Stale build after a deploy: reload instead of showing the crash screen.
    if (isStaleChunkError(error) && reloadForNewBuild()) {
      this.reloading = true;
      this.forceUpdate();
      return;
    }
    console.error('Uncaught error:', error, info.componentStack);
    reportError(error, { componentStack: info.componentStack });
  }

  render() {
    if (!this.state.error) return this.props.children;
    if (this.reloading) return null; // new build is loading
    return (
      <div className='flex min-h-screen items-center justify-center bg-background px-4'>
        <div className='max-w-md text-center'>
          <div className='mb-4 select-none text-7xl'>🙀</div>
          <h1 className='mb-2 font-display text-2xl font-extrabold'>
            {i18n.t('crash.title')}
          </h1>
          <p className='mb-8 text-muted-foreground'>
            {i18n.t('crash.description')}
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className='rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90'
          >
            {i18n.t('crash.home')}
          </button>
          <details className='mt-8 text-left text-xs text-muted-foreground'>
            <summary className='cursor-pointer text-center'>
              {i18n.t('crash.details')}
            </summary>
            <pre className='mt-3 max-h-60 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-muted p-4'>
              {this.state.error.message}
              {'\n\n'}
              {this.state.error.stack?.split('\n').slice(0, 6).join('\n')}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}
