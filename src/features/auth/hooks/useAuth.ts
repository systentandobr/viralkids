import { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  AuthState, 
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

const STORAGE_KEYS = {
  TOKEN: 'viralkids_auth_token',
  REFRESH_TOKEN: 'viralkids_refresh_token',
  USER: 'viralkids_user_data',
  REMEMBER_ME: 'viralkids_remember_me'
};

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
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    token: null
  });

  // Verificar sessão existente no load
  useEffect(() => {
    if (autoLogin) {
      checkExistingSession();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [autoLogin]);

  const checkExistingSession = useCallback(async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER);

      if (token && userData) {
        // Verificar se o token não expirou
        if (isTokenValid(token)) {
          const user: User = JSON.parse(userData);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            token
          });
        } else {
          // Token expirado, tentar refresh
          await tryRefreshToken();
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Erro ao verificar sessão existente:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Erro ao verificar sessão'
      }));
    }
  }, []);

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
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Em produção, fazer chamada para API
      // Por enquanto, simular renovação bem-sucedida
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular falha (remover em produção)
      throw new Error('Refresh token expired');
      
    } catch (error) {
      // Refresh falhou, fazer logout
      logout();
    }
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

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

      // Atualizar estado
      setState({
        user: { ...user, lastLogin: new Date() },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token
      });

      // Persistir dados se necessário
      if (persistSession || credentials.rememberMe) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        
        if (credentials.rememberMe) {
          localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [persistSession]);

  const register = useCallback(async (data: RegisterData): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

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

      setState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token
      });

      // Persistir dados
      if (persistSession) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [persistSession]);

  const logout = useCallback((): void => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null
    });

    // Limpar storage
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  }, []);

  const forgotPassword = useCallback(async (data: ForgotPasswordData): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Verificar se email existe
      const user = MOCK_USERS.find(u => u.email === data.email);
      if (!user) {
        throw new Error('Email não encontrado');
      }

      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 1000));

      setState(prev => ({ ...prev, isLoading: false }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar email';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (data: ResetPasswordData): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (data.password !== data.confirmPassword) {
        throw new Error('Senhas não coincidem');
      }

      if (data.password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }

      // Simular reset de senha
      await new Promise(resolve => setTimeout(resolve, 1000));

      setState(prev => ({ ...prev, isLoading: false }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao redefinir senha';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>): Promise<void> => {
    if (!state.user) {
      throw new Error('Usuário não autenticado');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simular update
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = { ...state.user, ...data, updatedAt: new Date() };

      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false
      }));

      // Atualizar storage
      if (persistSession) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [state.user, persistSession]);

  const verifyEmail = useCallback(async (token: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simular verificação
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (state.user) {
        const updatedUser = { ...state.user, emailVerified: true, status: 'active' as const };
        setState(prev => ({ ...prev, user: updatedUser, isLoading: false }));
        
        if (persistSession) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao verificar email';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, [state.user, persistSession]);

  const refreshToken = useCallback(async (): Promise<void> => {
    await tryRefreshToken();
  }, []);

  // Utilitários de autorização
  const hasPermission = useCallback((permission: string): boolean => {
    if (!state.user) return false;
    
    // Admins têm todas as permissões
    if (state.user.role === 'admin') return true;
    
    // Implementar lógica de permissões específicas aqui
    return false;
  }, [state.user]);

  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  const canAccess = useCallback((resource: string, action: string): boolean => {
    if (!state.user) return false;
    
    // Lógica simplificada para desenvolvimento
    const userRole = state.user.role;
    
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
  }, [state.user]);

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
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    token: state.token,

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
