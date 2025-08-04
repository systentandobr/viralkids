import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, DEFAULT_HEADERS, SUCCESS_STATUS_CODES, ERROR_STATUS_CODES } from './config';

// Interface para resposta padrão da API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Interface para configuração do cliente
interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  getAuthToken?: () => string | null;
  onAuthError?: () => void;
}

// Classe principal do cliente HTTP
export class HttpClient {
  private client: AxiosInstance;
  private getAuthToken?: () => string | null;
  private onAuthError?: () => void;

  constructor(config: HttpClientConfig = {}) {
    this.client = axios.create({
      baseURL: config.baseURL || API_CONFIG.BASE_URL,
      timeout: config.timeout || API_CONFIG.TIMEOUT,
      headers: {
        ...DEFAULT_HEADERS,
        ...config.headers,
      },
    });

    this.getAuthToken = config.getAuthToken;
    this.onAuthError = config.onAuthError;

    this.setupInterceptors();
  }

  // Configurar interceptors para requisições e respostas
  private setupInterceptors() {
    // Interceptor para requisições
    this.client.interceptors.request.use(
      (config) => {
        // Adicionar token de autenticação se disponível
        const token = this.getAuthToken?.();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para respostas
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Tratar erros de autenticação
        if (error.response?.status === ERROR_STATUS_CODES.UNAUTHORIZED) {
          this.onAuthError?.();
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos HTTP
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Upload de arquivos
  async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.client.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Tratamento de erros
  private handleError(error: any): ApiResponse {
    if (error.response) {
      // Erro da API
      return {
        success: false,
        error: error.response.data?.message || error.response.data?.error || 'Erro na requisição',
        statusCode: error.response.status,
      };
    } else if (error.request) {
      // Erro de rede
      return {
        success: false,
        error: 'Erro de conexão. Verifique sua internet.',
        statusCode: 0,
      };
    } else {
      // Erro geral
      return {
        success: false,
        error: error.message || 'Erro desconhecido',
        statusCode: 0,
      };
    }
  }

  // Atualizar token de autenticação
  setAuthToken(token: string) {
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  // Remover token de autenticação
  removeAuthToken() {
    delete this.client.defaults.headers.common.Authorization;
  }

  // Configurar callbacks de autenticação
  setAuthCallbacks(getToken: () => string | null, onError: () => void) {
    this.getAuthToken = getToken;
    this.onAuthError = onError;
  }
}

// Instância padrão do cliente HTTP
export const httpClient = new HttpClient();

// Exportar tipos úteis
export type { AxiosRequestConfig, AxiosResponse }; 