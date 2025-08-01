import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from '@/features/auth';
import { Router, Route } from '@/router';
import { ServiceProvider } from '@/services';
import { DebugRouter } from '@/components/DebugRouter';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Import das páginas
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { FranchiseeDashboard } from '@/pages/FranchiseeDashboard';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Definição das rotas
const routes: Route[] = [
  {
    path: '/',
    component: LandingPage,
    exact: true
  },
  {
    path: '/auth',
    component: AuthPage,
    exact: true
  },
  {
    path: '/login',
    component: () => <AuthPage defaultTab="login" />,
    exact: true
  },
  {
    path: '/register',
    component: () => <AuthPage defaultTab="register" />,
    exact: true
  },
  {
    path: '/admin',
    component: AdminDashboard,
    requireAuth: true,
    allowedRoles: ['admin', 'support']
  },
  {
    path: '/dashboard',
    component: FranchiseeDashboard,
    requireAuth: true,
    allowedRoles: ['franchisee']
  }
];

const App: React.FC = () => {
  // Inicializar serviços na montagem do componente
  useEffect(() => {
    ServiceProvider.initialize();
  }, []);

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <AuthProvider>
          <Router 
            routes={routes} 
            fallback={<NotFoundPage />}
          />
          <DebugRouter />
          <Toaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;
