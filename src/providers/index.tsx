// Export all providers
export { StoreProvider, useStoreProvider, useStoresReady } from './StoreProvider';
export { QueryProvider, queryClient } from './QueryProvider';

// Provider principal que combina todos os providers
import React, { ReactNode } from 'react';
import { StoreProvider } from './StoreProvider';
import { QueryProvider } from './QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryProvider>
      <StoreProvider 
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Inicializando aplicação...</p>
            </div>
          </div>
        }
      >
        {children}
      </StoreProvider>
    </QueryProvider>
  );
};
