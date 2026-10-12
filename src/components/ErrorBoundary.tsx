import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Disc, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Subculture Uncaught Application Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      window.history.replaceState({}, '', '/');
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0c10] text-zinc-100 flex items-center justify-center p-6 selection:bg-amber-400 selection:text-black">
          <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-center shadow-2xl">
            <Disc className="w-12 h-12 text-amber-400 mx-auto mb-4 opacity-80" />
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              Subculture // System Notice
            </div>
            <h1 className="font-display font-black text-2xl text-zinc-100 mb-2">
              Dispatch Interface Anomaly
            </h1>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              An unexpected render interruption occurred while loading this archive entry. Returning to the main index will restore the journal view.
            </p>

            {this.state.error && (
              <pre className="p-3 mb-6 rounded-lg bg-zinc-900 border border-zinc-800 text-left text-[11px] font-mono text-zinc-400 overflow-x-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <Home className="w-4 h-4" />
                <span>Return to Journal</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
