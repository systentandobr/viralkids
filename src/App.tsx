import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from '@/features/auth';
import { Router } from '@/router';
import { ServiceProvider } from '@/services';
import { DebugRouter } from '@/components/DebugRouter';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Chatbot } from '@/features/chatbot/components/Chatbot';

import { NotFoundPage } from '@/pages/NotFoundPage';
import { routes } from '@/router/main-routes';

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
          <Chatbot />
          <Toaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;
