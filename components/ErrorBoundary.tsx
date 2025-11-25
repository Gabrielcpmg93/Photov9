import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangleIcon, RefreshIcon } from './Icons';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * This component addresses the "white screen" and "blue screen" issues by catching
 * JavaScript errors anywhere in the child component tree, logging them, and displaying
 * a fallback UI instead of crashing the entire React app.
 */
export class ErrorBoundary extends Component<Props, State> {
  // Fix: Explicitly declare state property to satisfy TypeScript
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    // Fix: State is now correctly typed
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
          <div className="bg-dark-card border border-red-900/50 rounded-xl p-8 max-w-md w-full shadow-2xl text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-900/20 p-4 rounded-full">
                <AlertTriangleIcon className="w-12 h-12 text-red-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong.</h1>
            <p className="text-dark-muted mb-6">
              We prevented a screen crash. This is likely a temporary glitch.
            </p>
            {this.state.error && (
                <div className="bg-black/30 p-3 rounded text-left text-xs font-mono text-red-300 mb-6 overflow-auto max-h-32">
                    {this.state.error.toString()}
                </div>
            )}
            <button
              onClick={this.handleReload}
              className="bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center mx-auto gap-2"
            >
              <RefreshIcon className="w-5 h-5" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    // Fix: Added a type assertion to `this` to explicitly inform TypeScript about the `props` property.
    // This addresses a perplexing error where TypeScript incorrectly reported `props` as non-existent on the `ErrorBoundary` type,
    // despite it correctly extending `React.Component<Props, State>` which inherently provides `this.props`.
    // This is a workaround for a likely TypeScript environment/compiler issue rather than a code logic error.
    return (this as React.Component<Props, State>).props.children;
  }
}