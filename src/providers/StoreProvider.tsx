import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useMigration } from '@/hooks/useMigration';

interface StoreProviderContextType {
  isInitialized: boolean;
  migrationStatus: 'pending' | 'completed' | 'error';
  error: string | null;
}

const StoreProviderContext = createContext<StoreProviderContextType | undefined>(undefined);

interface StoreProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ 
  children, 
  fallback = (<div>Carregando...</div>) 
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { migrationStatus, migrateData, clearLegacyData } = useMigration();

  useEffect(() => {
    const initializeStores = async () => {
      try {
        // Se há migração pendente, executar
        if (migrationStatus === 'pending') {
          console.log('Executando migração de dados...');
          const result = await migrateData();
          
          if (result.success) {
            clearLegacyData();
            console.log('Migração concluída com sucesso');
          } else {
            console.warn('Migração com alguns erros:', result.errors);
            // Mesmo com erros, continuamos - alguns dados podem ter sido migrados
          }
        }

        // Stores estão prontas
        setIsInitialized(true);
        setError(null);
        
      } catch (err) {
        console.error('Erro ao inicializar stores:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setIsInitialized(true); // Mesmo com erro, deixamos a app carregar
      }
    };

    initializeStores();
  }, [migrationStatus, migrateData, clearLegacyData]);

  const contextValue: StoreProviderContextType = {
    isInitialized,
    migrationStatus,
    error,
  };

  // Mostrar fallback enquanto inicializa
  if (!isInitialized) {
    return <>{fallback}</>;
  }

  return (
    <StoreProviderContext.Provider value={contextValue}>
      {children}
    </StoreProviderContext.Provider>
  );
};

// Hook para usar o contexto
export const useStoreProvider = (): StoreProviderContextType => {
  const context = useContext(StoreProviderContext);
  if (context === undefined) {
    throw new Error('useStoreProvider deve ser usado dentro de um StoreProvider');
  }
  return context;
};

// Hook para verificar se as stores estão prontas
export const useStoresReady = (): boolean => {
  const { isInitialized } = useStoreProvider();
  return isInitialized;
};
