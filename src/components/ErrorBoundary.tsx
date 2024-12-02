import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { ApiError, DatabaseError } from '../types/error';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });

    // You could also log to an error reporting service here
    // reportError(error, errorInfo);
  }

  private getErrorMessage(): string {
    const { error } = this.state;
    
    if (error instanceof ApiError) {
      return `API Error (${error.statusCode}): ${error.message}`;
    }
    
    if (error instanceof DatabaseError) {
      return `Database Error (${error.operation}): ${error.message}`;
    }
    
    if (error instanceof TypeError) {
      return 'A type error occurred. Please refresh the page and try again.';
    }

    return error?.message || 'An unexpected error occurred';
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
            
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                Something went wrong
              </h2>
              <p className="text-gray-400">
                {this.getErrorMessage()}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={this.handleRetry}
                className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg 
                         hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" />
                Try Again
              </button>
              
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 bg-zinc-800 text-white rounded-lg 
                         hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-6 py-3 bg-zinc-800 text-white rounded-lg 
                         hover:bg-zinc-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 text-left bg-zinc-900 rounded-lg p-4">
                <summary className="text-gray-400 cursor-pointer">Error Details</summary>
                <pre className="mt-2 text-sm text-gray-500 overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}