import { useCallback } from 'react';
import { useAuthStore } from '@/stores/auth.store';

// Tipos re-exportados para compatibilidade
export type User = Parameters<ReturnType<typeof useAuthStore>['setUser']>[0];
export type AuthTokens = Parameters<ReturnType<typeof useAuthStore>['setTokens']>[0];

interface UseAuthReturn {
  // Estado
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;

  // Ações principais
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  forgotPassword: (data: any) => Promise<void>;
  resetPassword: (data: any) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  refreshToken: () => Promise<void>;

  // Utilitários
  hasPermission: (permission: string) => boolean;
  hasRole: (role: User['role']) => boolean;
  canAccess: (resource: string, action: string) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  // Estado da store
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const tokens = useAuthStore(state => state.tokens);
  
  // Ações da store
  const storeLogin = useAuthStore(state => state.login);
  const storeLogout = useAuthStore(state => state.logout);
  const storeUpdateUser = useAuthStore(state => state.updateUser);
  const setLoading = useAuthStore(state => state.setLoading);
  const setError = useAuthStore(state => state.setError);
  const hasPermission = useAuthStore(state => state.hasPermission);
  const hasRole = useAuthStore(state => state.hasRole);
  const refreshTokens = useAuthStore(state => state.refreshTokens);

  // Implementações das funções para manter compatibilidade
  const login = useCallback(async (credentials: any) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implementar chamada real para API
      // Por enquanto, simular como no código original
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Dados simulados - em produção viriam da API
      const mockUser: User = {
        id: 'user_123',
        name: credentials.name || 'Usuário Teste',
        email: credentials.email,
        role: 'franchisee',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: true,
        status: 'active',
        preferences: {
          theme: 'light',
          language: 'pt-BR',
          notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false
          },
          privacy: {
            shareData: false,
            allowAnalytics: true
          }
        }
      };

      const mockTokens: AuthTokens = {
        token: 'mock_token_' + Date.now(),
        refreshToken: 'mock_refresh_' + Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24h
      };

      storeLogin(mockUser, mockTokens, credentials.rememberMe);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [storeLogin, setLoading, setError]);

  const register = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implementar chamada real para API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular criação de usuário
      const newUser: User = {
        id: 'user_' + Date.now(),
        name: data.name,
        email: data.email,
        role: data.role || 'franchisee',
        phone: data.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: false,
        status: 'pending',
        preferences: {
          theme: 'light',
          language: 'pt-BR',
          notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false
          },
          privacy: {
            shareData: false,
            allowAnalytics: true
          }
        }
      };

      const tokens: AuthTokens = {
        token: 'mock_token_' + Date.now(),
        refreshToken: 'mock_refresh_' + Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
      };

      storeLogin(newUser, tokens, false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [storeLogin, setLoading, setError]);

  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  const forgotPassword = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implementar chamada real para API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar email';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const resetPassword = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implementar chamada real para API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao redefinir senha';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Implementar chamada real para API
      await new Promise(resolve => setTimeout(resolve, 1000));

      storeUpdateUser(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, storeUpdateUser, setLoading, setError]);

  const verifyEmail = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implementar chamada real para API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (user) {
        storeUpdateUser({ 
          emailVerified: true, 
          status: 'active' 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao verificar email';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, storeUpdateUser, setLoading, setError]);

  const refreshToken = useCallback(async () => {
    try {
      // TODO: Implementar chamada real para API
      const newTokens: AuthTokens = {
        token: 'new_mock_token_' + Date.now(),
        refreshToken: 'new_mock_refresh_' + Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
      };

      refreshTokens(newTokens);
    } catch (error) {
      setError('Erro ao renovar token');
      storeLogout();
      throw error;
    }
  }, [refreshTokens, setError, storeLogout]);

  const canAccess = useCallback((resource: string, action: string) => {
    if (!user) return false;
    
    // Lógica simplificada para compatibilidade
    const userRole = user.role;
    
    switch (userRole) {
      case 'admin':
        return true;
      case 'franchisee':
        return ['dashboard', 'tasks', 'suppliers', 'profile'].includes(resource);
      case 'support':
        return ['leads', 'support', 'dashboard'].includes(resource);
      default:
        return false;
    }
  }, [user]);

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    error,
    token: tokens?.token || null,

    // Ações
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    verifyEmail,
    refreshToken,

    // Utilitários
    hasPermission,
    hasRole,
    canAccess,
  };
};
