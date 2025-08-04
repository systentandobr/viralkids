import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  ForgotPasswordData, 
  ResetPasswordData,
  UserRole,
  TokenPayload 
} from '../types';

interface UseAuthOptions {
  autoLogin?: boolean;
  persistSession?: boolean;
}

// Mock users para desenvolvimento
const MOCK_USERS: User[] = [
  {
    id: 'admin_001',
    email: 'admin@viralkids.com.br',
    name: 'Administrador',
    role: 'admin',
    avatar: undefined,
    phone: '(84) 99999-9999',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    lastLogin: new Date(),
    emailVerified: true,
    status: 'active',
    preferences: {
      theme: 'light',
      language: 'pt-BR',
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: true
      },
      privacy: {
        shareData: false,
        allowAnalytics: true
      }
    }
  },
  {
    id: 'franchisee_001',
    email: 'franqueado@natal.com',
    name: 'Maria Silva',
    role: 'franchisee',
    phone: '(84) 98888-8888',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    lastLogin: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    emailVerified: true,
    status: 'active',
    preferences: {
      theme: 'light',
      language: 'pt-BR',
      notifications: {
        email: true,
        push: true,
        sms: true,
        marketing: false
      },
      privacy: {
        shareData: true,
        allowAnalytics: true
      }
    }
  }
];

export const useAuth = ({ autoLogin = true, persistSession = true }: UseAuthOptions = {}) => {
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

  // Verificar sessão existente no load
  useEffect(() => {
    if (autoLogin) {
      checkExistingSession();
    } else {
      setLoading(false);
    }
  }, [autoLogin]);

  const checkExistingSession = useCallback(async () => {
    try {
      // A store Zustand com persist já gerencia a sessão automaticamente
      // Não precisamos fazer nada aqui, apenas garantir que loading seja false
      setLoading(false);
    } catch (error) {
      console.error('Erro ao verificar sessão existente:', error);
      setError('Erro ao verificar sessão');
      setLoading(false);
    }
  }, [setError, setLoading]);

  const isTokenValid = (token: string): boolean => {
    try {
      const payload = parseJWT(token);
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const parseJWT = (token: string): TokenPayload => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  const tryRefreshToken = async (): Promise<void> => {
    try {
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      // Em produção, fazer chamada para API
      // Por enquanto, simular renovação bem-sucedida
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular falha (remover em produção)
      throw new Error('Refresh token expired');
      
    } catch (error) {
      // Refresh falhou, fazer logout
      storeLogout();
    }
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validar credenciais (mock)
      const user = MOCK_USERS.find(u => u.email === credentials.email);
      
      if (!user) {
        throw new Error('Email não encontrado');
      }

      // Em produção, validar senha no backend
      if (credentials.password !== '123456') {
        throw new Error('Senha incorreta');
      }

      // Simular geração de token JWT
      const token = generateMockToken(user);
      const refreshToken = generateMockRefreshToken(user);

      // Criar tokens para a store
      const authTokens = {
        token,
        refreshToken,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
      };

      // Usar store para login
      storeLogin({ ...user, lastLogin: new Date() }, authTokens, credentials.rememberMe || false);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [storeLogin, setLoading, setError]);

  const register = useCallback(async (data: RegisterData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Validações básicas
      if (data.password !== data.confirmPassword) {
        throw new Error('Senhas não coincidem');
      }

      if (data.password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }

      if (!data.acceptTerms) {
        throw new Error('Você deve aceitar os termos de uso');
      }

      // Verificar se email já existe
      const existingUser = MOCK_USERS.find(u => u.email === data.email);
      if (existingUser) {
        throw new Error('Este email já está em uso');
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Criar novo usuário
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: data.email,
        name: data.name,
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

      // Adicionar à lista mock (em produção seria salvo no backend)
      MOCK_USERS.push(newUser);

      // Auto-login após registro
      const token = generateMockToken(newUser);
      const refreshToken = generateMockRefreshToken(newUser);

      const authTokens = {
        token,
        refreshToken,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
      };

      storeLogin(newUser, authTokens, false);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [storeLogin, setLoading, setError]);

  const logout = useCallback((): void => {
    storeLogout();
  }, [storeLogout]);

  const forgotPassword = useCallback(async (data: ForgotPasswordData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Verificar se email existe
      const user = MOCK_USERS.find(u => u.email === data.email);
      if (!user) {
        throw new Error('Email não encontrado');
      }

      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar email';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const resetPassword = useCallback(async (data: ResetPasswordData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      if (data.password !== data.confirmPassword) {
        throw new Error('Senhas não coincidem');
      }

      if (data.password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }

      // Simular reset de senha
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao redefinir senha';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateProfile = useCallback(async (data: Partial<User>): Promise<void> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      // Simular update
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = { ...user, ...data, updatedAt: new Date() };
      storeUpdateUser(updatedUser);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, storeUpdateUser, setLoading, setError]);

  const verifyEmail = useCallback(async (token: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Simular verificação
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (user) {
        const updatedUser = { ...user, emailVerified: true, status: 'active' as const };
        storeUpdateUser(updatedUser);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao verificar email';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, storeUpdateUser, setLoading, setError]);

  const refreshToken = useCallback(async (): Promise<void> => {
    await tryRefreshToken();
  }, []);

  // Utilitários de autorização
  const canAccess = useCallback((resource: string, action: string): boolean => {
    if (!user) return false;
    
    // Lógica simplificada para desenvolvimento
    const userRole = user.role;
    
    switch (userRole) {
      case 'admin':
        return true; // Admin pode tudo
      case 'franchisee':
        return ['dashboard', 'tasks', 'suppliers', 'profile'].includes(resource);
      case 'support':
        return ['leads', 'support', 'dashboard'].includes(resource);
      default:
        return false;
    }
  }, [user]);

  const generateMockToken = (user: User): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
      sub: user.id
    }));
    const signature = btoa('mock-signature');
    
    return `${header}.${payload}.${signature}`;
  };

  const generateMockRefreshToken = (user: User): string => {
    return btoa(`refresh_${user.id}_${Date.now()}`);
  };

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
    canAccess
  };
};
