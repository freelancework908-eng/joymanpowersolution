import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F5F8] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#DDD0F3] p-8 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#26075D]">
                Unable to Display Page
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                An unexpected interface issue occurred. Our services are running and your session is safe.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#321078] hover:bg-[#26075D] text-white font-bold text-xs sm:text-sm transition-colors shadow-sm active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-[#FFC900]" />
                <span>Reload Page</span>
              </button>

              <a
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
