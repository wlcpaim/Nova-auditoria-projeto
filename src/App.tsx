import React, { Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/admin/Dashboard';
import { Login } from './pages/admin/Login';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-neutral-200 rounded-2xl p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Algo deu errado</h2>
            <p className="text-sm text-neutral-600 mb-6">Ocorreu um erro inesperado ao carregar a aplicação.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-black text-white font-medium rounded-xl text-sm hover:bg-neutral-800 transition"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;