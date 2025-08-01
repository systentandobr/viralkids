import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth({
    autoLogin: true,
    persistSession: true
  });

  const contextValue: AuthContextType = {
    // Estado
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,

    // Ações
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    forgotPassword: auth.forgotPassword,
    resetPassword: auth.resetPassword,
    updateProfile: auth.updateProfile,
    verifyEmail: auth.verifyEmail,
    refreshToken: auth.refreshToken,

    // Utilitários
    hasPermission: auth.hasPermission,
    hasRole: auth.hasRole,
    canAccess: auth.canAccess
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

// Hook para facilitar o uso
export const useCurrentUser = () => {
  const { user, isAuthenticated } = useAuthContext();
  return { user, isAuthenticated };
};

// Hook para verificar permissões
export const usePermissions = () => {
  const { hasPermission, hasRole, canAccess } = useAuthContext();
  return { hasPermission, hasRole, canAccess };
};
