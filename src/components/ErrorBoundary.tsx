import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#f0f4ff] via-white to-[#fff5f0]">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm mx-auto p-8 text-center animate-fade-up">
            <div className="text-5xl mb-4">😵</div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">오류가 발생했습니다.</h1>
            {this.state.error && (
              <p className="text-sm text-gray-500 mb-6 break-words leading-relaxed">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => window.location.replace('/')}
              className="w-full bg-[#3B5BA5] hover:bg-[#2d4a8a] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
