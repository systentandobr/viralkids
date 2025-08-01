import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/config';

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
  // Login
  static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  // Registro
  static async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  // Refresh token
  static async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    return httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  }

  // Logout
  static async logout(): Promise<ApiResponse<void>> {
    return httpClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
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
    return httpClient.put<AuthResponse['user']>(API_ENDPOINTS.USERS.UPDATE, data);
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

  // Salvar dados de autenticação no localStorage
  static saveAuthData(authData: AuthResponse): void {
    localStorage.setItem('viralkids_token', authData.token);
    localStorage.setItem('viralkids_refresh_token', authData.refreshToken);
    localStorage.setItem('viralkids_user', JSON.stringify(authData.user));
    
    // Configurar token no cliente HTTP
    httpClient.setAuthToken(authData.token);
  }

  // Remover dados de autenticação do localStorage
  static clearAuthData(): void {
    localStorage.removeItem('viralkids_token');
    localStorage.removeItem('viralkids_refresh_token');
    localStorage.removeItem('viralkids_user');
    
    // Remover token do cliente HTTP
    httpClient.removeAuthToken();
  }

  // Obter dados de autenticação do localStorage
  static getAuthData(): {
    token: string | null;
    refreshToken: string | null;
    user: AuthResponse['user'] | null;
  } {
    const token = localStorage.getItem('viralkids_token');
    const refreshToken = localStorage.getItem('viralkids_refresh_token');
    const userStr = localStorage.getItem('viralkids_user');
    
    let user: AuthResponse['user'] | null = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
      }
    }

    return { token, refreshToken, user };
  }

  // Verificar se o usuário está autenticado
  static isAuthenticated(): boolean {
    const { token } = this.getAuthData();
    return !!token;
  }

  // Obter token atual
  static getToken(): string | null {
    return localStorage.getItem('viralkids_token');
  }

  // Obter usuário atual
  static getCurrentUser(): AuthResponse['user'] | null {
    const { user } = this.getAuthData();
    return user;
  }
} 