import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from '@/features/auth';
import { Router } from '@/router';
import { ServiceProvider } from '@/services';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Chatbot } from '@/features/chatbot/components/Chatbot';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { routes } from '@/router/main-routes';
import { AppProviders } from '@/providers';

const App: React.FC = () => {
  // Inicializar serviços na montagem do componente
  useEffect(() => {
    ServiceProvider.initialize();
  }, []);

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <ErrorBoundary>
      <AppProviders>
        <TooltipProvider>
          <AuthProvider>
            <Router 
              routes={routes} 
              fallback={<NotFoundPage />}
            />
            {/* <DebugRouter /> */}
            <Chatbot isChatbotOpen={isChatbotOpen} />
            <Toaster />
            <Sonner />
          </AuthProvider>
        </TooltipProvider>
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
