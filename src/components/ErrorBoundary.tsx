import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center space-y-4 max-w-4xl mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Algo deu errado
            </h2>
            <p className="text-gray-600">
              Ocorreu um erro inesperado. Por favor, recarregue a página.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-gray-100 p-6 rounded-lg">
                <summary className="cursor-pointer font-medium text-gray-700 text-lg mb-3">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="mb-4">
                    <h4 className="font-semibold text-red-700 mb-2">Mensagem do Erro:</h4>
                    <pre className="text-base text-red-600 whitespace-pre-wrap bg-red-50 p-3 rounded">
                      {this.state.error.message}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">Stack Trace:</h4>
                    <pre className="text-base text-red-600 whitespace-pre-wrap bg-red-50 p-3 rounded max-h-96 overflow-y-auto">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </div>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 