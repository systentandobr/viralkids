import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { securityClient } from '@/services/auth/securityClient';
import { ENV_CONFIG } from '@/config/env';
import {
  User,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  UserRole,
  TokenPayload
} from '../types';
import { getDefaultRedirectPath, getRoleDisplayName, getRoleDescription } from '../utils/roleUtils';

interface UseAuthOptions {
  autoLogin?: boolean;
  persistSession?: boolean;
  autoRedirect?: boolean;
}

// Removido: MOCK_USERS - agora usando API real

export const useAuth = ({ autoLogin = true, persistSession = true, autoRedirect = true }: UseAuthOptions = {}) => {
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
      // Verificar se há token válido usando a biblioteca de segurança
      const isTokenValid = await securityClient.isTokenValid();

      if (isTokenValid) {
        // Obter informações do usuário armazenadas
        const userInfo = await securityClient.getStoredUserInfo();
        if (userInfo) {
          // Converter para o formato esperado pela store
          const user: User = {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            role: userInfo.role as UserRole,
            phone: userInfo.phone,
            avatar: userInfo.avatar,
            createdAt: new Date(userInfo.createdAt),
            updatedAt: new Date(userInfo.updatedAt),
            lastLogin: new Date(userInfo.lastLogin),
            emailVerified: userInfo.emailVerified,
            status: userInfo.status as 'active' | 'pending' | 'inactive',
            unitId: userInfo.unitId || userInfo.profile?.unitId, // Ensure unitId is restored
            preferences: userInfo.preferences
          };

          // Atualizar store com dados do usuário
          storeLogin(user, {
            token: await securityClient.getStoredToken(),
            refreshToken: await securityClient.getStoredRefreshToken(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
          }, false);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao verificar sessão existente:', error);
      setError('Erro ao verificar sessão');
      setLoading(false);
    }
  }, [setError, setLoading, storeLogin]);

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

  // Função para redirecionamento automático baseado no role
  const redirectBasedOnRole = useCallback((userRole: UserRole) => {
    if (!autoRedirect) return;

    const redirectPath = getDefaultRedirectPath(userRole);
    console.log(`Redirecionando usuário com role '${userRole}' para: ${redirectPath}`);

    // Usar setTimeout para garantir que o estado foi atualizado
    setTimeout(() => {
      window.location.hash = redirectPath;
    }, 100);
  }, [autoRedirect]);

  const tryRefreshToken = async (): Promise<void> => {
    try {
      // Usar a biblioteca de segurança para renovar token
      const isRefreshed = await securityClient.ensureValidToken();

      if (!isRefreshed) {
        throw new Error('Failed to refresh token');
      }

      // Obter novos tokens
      const newToken = await securityClient.getStoredToken();
      const newRefreshToken = await securityClient.getStoredRefreshToken();

      if (newToken && newRefreshToken) {
        // Atualizar tokens na store
        const updatedTokens = {
          token: newToken,
          refreshToken: newRefreshToken,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        };

        // Atualizar store com novos tokens
        if (user) {
          storeLogin(user, updatedTokens, false);
        }
      }

    } catch (error) {
      console.error('Erro ao renovar token:', error);
      // Refresh falhou, fazer logout
      storeLogout();
    }
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Usar a biblioteca de segurança para fazer login
      const authResult = await securityClient.login({
        username: credentials.email,
        password: credentials.password,
        domain: ENV_CONFIG.SYS_SEGURANCA_DOMAIN
      });

      // A API retorna os dados diretamente, não em um objeto com 'success'
      // Verificar se temos os dados necessários
      if (!authResult || !authResult.user || !authResult.accessToken) {
        throw new Error('Resposta inválida da API de autenticação');
      }

      // Mapear o role da API para o formato esperado
      // A API retorna um array de roles, vamos pegar o primeiro
      const userRole = authResult.user.roles?.[0]?.name || 'franchisee';

      // Converter dados do usuário para o formato esperado
      const user: User = {
        id: authResult.user.id,
        email: authResult.user.email,
        name: authResult.user.profile?.firstName
          ? `${authResult.user.profile.firstName} ${authResult.user.profile.lastName || ''}`.trim()
          : authResult.user.username,
        role: userRole as UserRole,
        unitId: authResult.user.profile?.unitId,
        phone: authResult.user.profile?.phone,
        avatar: authResult.user.profile?.avatar,
        domain: authResult.user.profile?.domain,
        createdAt: new Date(), // A API não retorna createdAt
        updatedAt: new Date(), // A API não retorna updatedAt
        lastLogin: new Date(),
        emailVerified: true, // Assumir que usuários da API estão verificados
        status: 'active' as const, // Assumir que usuários ativos
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

      // Criar tokens para a store - mapear accessToken para token
      const authTokens = {
        token: authResult.accessToken,
        refreshToken: authResult.refreshToken,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
      };

      // Usar store para login
      storeLogin(user, authTokens, credentials.rememberMe || false);

      // Redirecionar baseado no role do usuário
      redirectBasedOnRole(user.role);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [storeLogin, setLoading, setError, redirectBasedOnRole]);

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

      // Usar a biblioteca de segurança para registrar usuário
      const registerResult = await securityClient.register({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        role: data.role || 'franchisee',
        domain: ENV_CONFIG.SYS_SEGURANCA_DOMAIN
      });

      // A API retorna os dados diretamente, não em um objeto com 'success'
      // Verificar se temos os dados necessários
      if (!registerResult || !registerResult.user || !registerResult.accessToken) {
        throw new Error('Resposta inválida da API de registro');
      }

      // Mapear o role da API para o formato esperado
      const userRole = registerResult.user.roles?.[0]?.name || data.role || 'franchisee';

      // Converter dados do usuário para o formato esperado
      const newUser: User = {
        id: registerResult.user.id,
        email: registerResult.user.email,
        name: registerResult.user.profile?.firstName
          ? `${registerResult.user.profile.firstName} ${registerResult.user.profile.lastName || ''}`.trim()
          : registerResult.user.username,
        role: userRole as UserRole,
        phone: registerResult.user.profile?.phone,
        avatar: registerResult.user.profile?.avatar,
        domain: registerResult.user.profile?.domain,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        emailVerified: true,
        status: 'active' as const,
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

      // Auto-login após registro - mapear accessToken para token
      const authTokens = {
        token: registerResult.accessToken,
        refreshToken: registerResult.refreshToken,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
      };

      storeLogin(newUser, authTokens, false);

      // Redirecionar baseado no role do usuário
      redirectBasedOnRole(newUser.role);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [storeLogin, setLoading, setError, redirectBasedOnRole]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Usar a biblioteca de segurança para fazer logout
      await securityClient.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Sempre limpar a store local
      storeLogout();
    }
  }, [storeLogout]);

  const forgotPassword = useCallback(async (data: ForgotPasswordData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Usar a biblioteca de segurança para solicitar reset de senha
      const result = await securityClient.forgotPassword({
        email: data.email
      });

      if (!result.success) {
        throw new Error(result.message || 'Erro ao enviar email de recuperação');
      }

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

      // Usar a biblioteca de segurança para resetar senha
      const result = await securityClient.resetPassword({
        token: data.token,
        password: data.password
      });

      if (!result.success) {
        throw new Error(result.message || 'Erro ao redefinir senha');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao redefinir senha';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateProfile = useCallback(async (data: Partial<User> & {
    unitId?: string;
    location?: {
      unitName?: string;
      address?: string;
      localNumber?: string;
      complement?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    };
    bio?: string;
    dateOfBirth?: string;
  }): Promise<void> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar dados no formato esperado pela API
      const updateData: {
        unitId?: string;
        location?: any;
        avatar?: string;
        bio?: string;
        phone?: string;
        dateOfBirth?: string;
      } = {};

      // Mapear campos do User para o formato da API
      if (data.unitId !== undefined) {
        updateData.unitId = data.unitId;
      }

      if (data.location) {
        updateData.location = data.location;
      }

      if (data.avatar !== undefined) {
        updateData.avatar = data.avatar;
      }

      if (data.bio !== undefined) {
        updateData.bio = data.bio;
      }

      if (data.phone !== undefined) {
        updateData.phone = data.phone;
      }

      if (data.dateOfBirth !== undefined) {
        updateData.dateOfBirth = data.dateOfBirth;
      }

      // Usar AuthService para atualizar perfil via endpoint /auth/profile
      const { AuthService } = await import('@/services/auth/authService');
      const response = await AuthService.updateProfile(updateData);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erro ao atualizar perfil');
      }

      // Atualizar usuário na store com os dados retornados
      // A store já foi atualizada pelo AuthService, mas garantimos sincronização
      const apiUser = response.data as any;
      const updatedUser = {
        ...user,
        unitId: apiUser?.profile?.unitId || data.unitId || user.unitId,
        phone: updateData.phone || apiUser?.profile?.phone || user.phone,
        avatar: updateData.avatar || apiUser?.profile?.avatar || user.avatar,
        updatedAt: new Date(),
      };

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
      // Usar a biblioteca de segurança para verificar email
      const result = await securityClient.verifyEmail({
        token: token
      });

      if (!result.success) {
        throw new Error(result.message || 'Erro ao verificar email');
      }

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

  // Buscar usuários por domain
  const findUsersByDomain = useCallback(async (domain?: string): Promise<User[]> => {
    setLoading(true);
    setError(null);

    try {
      const { AuthService } = await import('@/services/auth/authService');
      const response = await AuthService.findUsersByDomain(domain || ENV_CONFIG.SYS_SEGURANCA_DOMAIN);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erro ao buscar usuários por domain');
      }

      // Converter dados da API para o formato User
      const users: User[] = (response.data as any[]).map((apiUser: any) => ({
        id: apiUser.id,
        email: apiUser.email,
        name: apiUser.profile?.firstName && apiUser.profile?.lastName
          ? `${apiUser.profile.firstName} ${apiUser.profile.lastName}`.trim()
          : apiUser.username || apiUser.email,
        role: (apiUser.roles?.[0]?.name || 'franchisee') as UserRole,
        unitId: apiUser.profile?.unitId,
        phone: apiUser.profile?.phone,
        avatar: apiUser.profile?.avatar,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        emailVerified: true,
        status: 'active' as const,
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
      }));

      return users;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar usuários por domain';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Utilitários de autorização
  const canAccess = useCallback(async (resource: string, action: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Usar a biblioteca de segurança para verificar permissões
      return await securityClient.hasPermission(`${action}:${resource}`);
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      return false;
    }
  }, [user]);

  // Utilitários para roles
  const getUserRoleDisplayName = useCallback((): string => {
    if (!user) return 'Usuário';
    return getRoleDisplayName(user.role);
  }, [user]);

  const getUserRoleDescription = useCallback((): string => {
    if (!user) return 'Usuário não autenticado';
    return getRoleDescription(user.role);
  }, [user]);

  const getDefaultRedirect = useCallback((): string => {
    if (!user) return '/';
    return getDefaultRedirectPath(user.role);
  }, [user]);

  // Removido: generateMockToken e generateMockRefreshToken - agora usando API real

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
    findUsersByDomain,

    // Utilitários
    hasPermission,
    hasRole,
    canAccess,

    // Utilitários de Role
    getUserRoleDisplayName,
    getUserRoleDescription,
    getDefaultRedirect
  };
};
