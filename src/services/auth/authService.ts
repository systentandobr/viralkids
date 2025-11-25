import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { useAuthStore } from '@/stores/auth.store';

// Interfaces para autenticação
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'franchisee' | 'admin' | 'supplier';
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Classe do serviço de autenticação
export class AuthService {
  // Obter store state diretamente
  private static getAuthStore() {
    return useAuthStore.getState();
  }

  // Login
  static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    if (response.success && response.data) {
      // Usar store ao invés de localStorage
      const authStore = this.getAuthStore();
      const tokens = {
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24h
      };
      
      authStore.login(response.data.user as any, tokens, false);
      
      // Configurar token no cliente HTTP (tanto no header padrão quanto no interceptor)
      httpClient.setAuthToken(response.data.token);
      
      // Garantir que o token está sendo usado
      console.debug('[AuthService] Token configurado após login');
    }
    
    return response;
  }

  // Registro
  static async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    
    if (response.success && response.data) {
      // Auto-login após registro usando store
      const authStore = this.getAuthStore();
      const tokens = {
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
      };
      
      authStore.login(response.data.user as any, tokens, false);
      httpClient.setAuthToken(response.data.token);
    }
    
    return response;
  }

  // Refresh token
  static async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    
    if (response.success && response.data) {
      // Atualizar tokens na store
      const authStore = this.getAuthStore();
      const newTokens = {
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
      };
      
      authStore.refreshTokens(newTokens);
      httpClient.setAuthToken(response.data.token);
    }
    
    return response;
  }

  // Logout
  static async logout(): Promise<ApiResponse<void>> {
    const response = await httpClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
    
    // Sempre limpar store, mesmo se a API falhar
    const authStore = this.getAuthStore();
    authStore.logout();
    httpClient.removeAuthToken();
    
    return response;
  }

  // Esqueci minha senha
  static async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse<void>> {
    return httpClient.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  }

  // Resetar senha
  static async resetPassword(data: ResetPasswordData): Promise<ApiResponse<void>> {
    return httpClient.post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }

  // Alterar senha
  static async changePassword(data: ChangePasswordData): Promise<ApiResponse<void>> {
    return httpClient.post<void>(API_ENDPOINTS.USERS.CHANGE_PASSWORD, data);
  }

  // Obter perfil do usuário
  static async getProfile(): Promise<ApiResponse<AuthResponse['user']>> {
    return httpClient.get<AuthResponse['user']>(API_ENDPOINTS.USERS.PROFILE);
  }

  // Atualizar perfil
  static async updateProfile(data: Partial<AuthResponse['user']>): Promise<ApiResponse<AuthResponse['user']>> {
    const response = await httpClient.put<AuthResponse['user']>(API_ENDPOINTS.USERS.UPDATE, data);
    
    if (response.success && response.data) {
      // Atualizar usuário na store
      const authStore = this.getAuthStore();
      authStore.updateUser(response.data as any);
    }
    
    return response;
  }

  // Verificar se o token é válido
  static async validateToken(): Promise<ApiResponse<boolean>> {
    try {
      const response = await httpClient.get(API_ENDPOINTS.USERS.PROFILE);
      return {
        success: true,
        data: true,
        statusCode: 200,
      };
    } catch (error: any) {
      return {
        success: false,
        data: false,
        error: error.message,
        statusCode: error.response?.status || 401,
      };
    }
  }

  // Verificar se o usuário está autenticado (usando store)
  static isAuthenticated(): boolean {
    const authStore = this.getAuthStore();
    return authStore.isAuthenticated && authStore.isTokenValid();
  }

  // Obter token atual (usando store)
  static getToken(): string | null {
    const authStore = this.getAuthStore();
    return authStore.tokens?.token || null;
  }

  // Obter usuário atual (usando store)
  static getCurrentUser(): AuthResponse['user'] | null {
    const authStore = this.getAuthStore();
    return authStore.user;
  }

  // Obter header de autorização (usando store)
  static getAuthHeader(): string | null {
    const authStore = this.getAuthStore();
    return authStore.getAuthHeader();
  }

  // Inicializar serviço (configurar token se existe)
  static initialize(): void {
    const authStore = this.getAuthStore();
    const token = authStore.tokens?.token;
    
    if (token && authStore.isTokenValid()) {
      httpClient.setAuthToken(token);
    } else if (token && !authStore.isTokenValid()) {
      // Token expirado, tentar refresh
      const refreshToken = authStore.tokens?.refreshToken;
      if (refreshToken) {
        this.refreshToken(refreshToken).catch(() => {
          // Se refresh falhar, fazer logout
          authStore.logout();
        });
      } else {
        authStore.logout();
      }
    }
  }

  // Limpar sessão (para casos de erro)
  static clearSession(): void {
    const authStore = this.getAuthStore();
    authStore.clearSession();
    httpClient.removeAuthToken();
  }

  // DEPRECATED METHODS - Mantidos para compatibilidade, mas delegam para store

  /** @deprecated Use AuthService.getCurrentUser() */
  static getAuthData(): {
    token: string | null;
    refreshToken: string | null;
    user: AuthResponse['user'] | null;
  } {
    const authStore = this.getAuthStore();
    return {
      token: authStore.tokens?.token || null,
      refreshToken: authStore.tokens?.refreshToken || null,
      user: authStore.user,
    };
  }

  /** @deprecated Dados são salvos automaticamente na store */
  static saveAuthData(authData: AuthResponse): void {
    console.warn('AuthService.saveAuthData é deprecated. Use AuthService.login() que salva automaticamente.');
    const authStore = this.getAuthStore();
    const tokens = {
      token: authData.token,
      refreshToken: authData.refreshToken,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000),
    };
    
    authStore.login(authData.user as any, tokens, false);
    httpClient.setAuthToken(authData.token);
  }

  /** @deprecated Dados são limpos automaticamente na store */
  static clearAuthData(): void {
    console.warn('AuthService.clearAuthData é deprecated. Use AuthService.logout().');
    this.logout();
  }
} 