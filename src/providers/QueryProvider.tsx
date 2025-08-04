import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Configuração do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry logic
      retry: (failureCount, error: any) => {
        // Não retenta em erros 4xx (exceto 408, 429)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Cache settings
      staleTime: 5 * 60 * 1000, // 5 minutos padrão
      cacheTime: 10 * 60 * 1000, // 10 minutos padrão
      
      // Refetch settings
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      
      // Error handling
      throwOnError: false,
    },
    mutations: {
      retry: false,
      throwOnError: false,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Exportar o queryClient para uso em outros lugares se necessário
export { queryClient }; 