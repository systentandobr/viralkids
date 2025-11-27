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
    getAuthToken?: () => Promise<string | null>;
    getDomain?: () => Promise<string | null>;
    onAuthError?: () => void;
  }

  // Classe principal do cliente HTTP
  export class HttpClient {
    private client: AxiosInstance;
    private getAuthToken?: () => Promise<string | null>;
    private getDomain?: () => Promise<string | null>;
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

      this.getAuthToken = async () => {
        const token = await config.getAuthToken?.();
        return token || null;
      };
      this.getDomain = async () => {
        const domain = await config.getDomain?.();
        return domain || null;
      };
      this.onAuthError = config.onAuthError;

      this.setupInterceptors();
    }

    // Configurar interceptors para requisições e respostas
    private setupInterceptors() {
      // Interceptor para requisições
      this.client.interceptors.request.use(
        async (config) => {
          // Desabilitar cache para requisições de API (evitar 304 Not Modified)
          config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
          config.headers['Pragma'] = 'no-cache';
          config.headers['Expires'] = '0';
          
          // Sempre buscar o token mais recente do store para garantir que está atualizado
          if (this.getAuthToken) {
            try {
              const token = await this.getAuthToken();
              if (token && typeof token === 'string' && token.trim().length > 0) {
                // Garantir que o header Authorization seja definido explicitamente
                // Usar tanto Authorization quanto authorization para garantir compatibilidade
                const bearerToken = `Bearer ${token.trim()}`;
                config.headers.Authorization = bearerToken;
                config.headers['authorization'] = bearerToken;
              } else {
                // Se não encontrou token, verificar se há um Authorization já configurado
                const existingAuth = config.headers.Authorization || config.headers.authorization;
                if (!existingAuth) {
                  console.warn('[HttpClient] ⚠️ Token não encontrado para requisição:', config.url);
                  console.warn('[HttpClient] Token recebido:', token ? 'existe mas está vazio' : 'null/undefined');
                  console.warn('[HttpClient] Verifique se o usuário está autenticado');
                }
              }
            } catch (error) {
              console.error('[HttpClient] Erro ao buscar token:', error);
              // Em caso de erro, tentar usar Authorization existente se houver
              const existingAuth = config.headers.Authorization || config.headers.authorization;
              if (!existingAuth) {
                console.warn('[HttpClient] Não foi possível buscar token e nenhum Authorization encontrado');
              }
            }
          } else {
            console.warn('[HttpClient] ⚠️ Função getAuthToken não configurada');
          }

          // Buscar e adicionar domain do usuário logado
          if (this.getDomain) {
            try {
              const domain = await this.getDomain();
              if (domain && typeof domain === 'string' && domain.trim().length > 0) {
                config.headers['X-Domain'] = domain.trim();
              }
            } catch (error) {
              console.error('[HttpClient] Erro ao buscar domain:', error);
              // Não bloquear a requisição se houver erro ao buscar domain
            }
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
          // Se receber 304, tratar como sucesso mas logar para debug
          if (response.status === 304) {
            console.warn('[HttpClient] Recebido 304 Not Modified para:', response.config.url);
            console.warn('[HttpClient] Isso pode indicar cache. Verifique os headers de cache.');
          }
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
        // Garantir que não use cache (evitar 304 Not Modified)
        const requestConfig: AxiosRequestConfig = {
          ...config,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            ...config?.headers,
          },
        };
        
        const response = await this.client.get<T | ApiResponse<T>>(url, requestConfig);
        
        // Se receber 304, fazer nova requisição forçando sem cache
        if (response.status === 304) {
          console.warn('[HttpClient] 304 recebido, fazendo nova requisição sem cache');
          const freshResponse = await this.client.get<T | ApiResponse<T>>(url, {
            ...requestConfig,
            headers: {
              ...requestConfig.headers,
              'If-None-Match': '',
              'If-Modified-Since': '',
            },
          });
          // Verificar se a resposta já está no formato ApiResponse
          const freshData = freshResponse.data as any;
          if (freshData && typeof freshData === 'object' && 'success' in freshData) {
            return freshData as ApiResponse<T>;
          }
          // Se for array ou objeto direto, envolver no formato ApiResponse
          if (Array.isArray(freshData)) {
            return {
              success: true,
              data: freshData as T,
            };
          }
          return {
            success: true,
            data: freshData as T,
          };
        }
        
        // Verificar se a resposta já está no formato ApiResponse
        const data = response.data as any;
        
        // Se já tem a estrutura ApiResponse (success, data, error)
        if (data && typeof data === 'object' && 'success' in data) {
          return data as ApiResponse<T>;
        }
        
        // Se for um array ou objeto direto (API do NestJS retorna dados diretamente)
        // Verificar se é um array
        if (Array.isArray(data)) {
          return {
            success: true,
            data: data as T,
          };
        }
        
        // Se for um objeto, pode ser que já seja o dado ou pode ser ApiResponse sem 'success'
        // Verificar se tem campos típicos de ApiResponse sem 'success'
        if (data && typeof data === 'object' && ('error' in data || 'message' in data)) {
          // Pode ser um erro ou resposta sem success
          return {
            success: !('error' in data),
            data: data as T,
            error: (data as any).error || (data as any).message,
          };
        }
        
        // Caso padrão: envolver no formato ApiResponse
        return {
          success: true,
          data: data as T,
        };
      } catch (error: any) {
        return this.handleError(error);
      }
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      try {
        const response = await this.client.post<T | ApiResponse<T>>(url, data, config);
        // Verificar se a resposta já está no formato ApiResponse
        const responseData = response.data as any;
        if (responseData && typeof responseData === 'object' && 'success' in responseData) {
          return responseData as ApiResponse<T>;
        }
        // Se não, envolver no formato ApiResponse (API do NestJS retorna dados diretamente)
        return {
          success: true,
          data: responseData as T,
        };
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
        const response = await this.client.patch<T | ApiResponse<T>>(url, data, config);
        // Verificar se a resposta já está no formato ApiResponse
        const responseData = response.data as any;
        if (responseData && typeof responseData === 'object' && 'success' in responseData) {
          return responseData as ApiResponse<T>;
        }
        // Se não, envolver no formato ApiResponse (API do NestJS retorna dados diretamente)
        return {
          success: true,
          data: responseData as T,
        };
      } catch (error: any) {
        return this.handleError(error);
      }
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      try {
        const response = await this.client.delete<T | ApiResponse<T>>(url, config);
        // Verificar se a resposta já está no formato ApiResponse
        const responseData = response.data as any;
        if (responseData && typeof responseData === 'object' && 'success' in responseData) {
          return responseData as ApiResponse<T>;
        }
        // Se não, envolver no formato ApiResponse (API do NestJS retorna dados diretamente)
        return {
          success: true,
          data: responseData as T,
        };
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
      const bearerToken = `Bearer ${token.trim()}`;
      this.client.defaults.headers.common.Authorization = bearerToken;
      this.client.defaults.headers.common['authorization'] = bearerToken;
    }

    // Remover token de autenticação
    removeAuthToken() {
      delete this.client.defaults.headers.common.Authorization;
      delete this.client.defaults.headers.common['authorization'];
    }

    // Configurar callbacks de autenticação
    setAuthCallbacks(getToken: () => Promise<string | null>, onError: () => void) {
      this.getAuthToken = async () => {
        const token = await getToken();
        return token || null;
      };
      this.onAuthError = onError;
    }
  }

  // Instância padrão do cliente HTTP configurada com autenticação
  // Usando função lazy para evitar dependência circular
  let getAuthStore: (() => any) | null = null;

  // Função para configurar o store (chamada após o store estar disponível)
  export const configureHttpClientAuth = (storeGetter: () => any) => {
    getAuthStore = storeGetter;
  };

  export const httpClient = new HttpClient({
    getAuthToken: async () => {
      try {
        // Sempre tentar buscar do store diretamente primeiro
        const { useAuthStore } = await import('@/stores/auth.store');
        const store = useAuthStore.getState();
        
        // Verificar se há token no store
        const token = store?.tokens?.token;
        
        if (token && typeof token === 'string' && token.trim().length > 0) {
          return token.trim();
        }
        
        // Se não encontrou no store, tentar usar getAuthStore se disponível
        if (getAuthStore) {
          const storeFromGetter = getAuthStore();
          const tokenFromGetter = storeFromGetter?.tokens?.token;
          if (tokenFromGetter && typeof tokenFromGetter === 'string' && tokenFromGetter.trim().length > 0) {
            return tokenFromGetter.trim();
          }
        }
        
        // Log de debug apenas se realmente não encontrou token
        console.warn('[HttpClient] Token não encontrado no store. Estado:', {
          hasTokens: !!store?.tokens,
          isAuthenticated: store?.isAuthenticated,
          hasUser: !!store?.user,
          tokenExists: !!token,
          tokenType: typeof token,
          tokenLength: token ? token.length : 0
        });
        
        return null;
      } catch (error) {
        console.error('[HttpClient] Erro ao buscar token:', error);
        return null;
      }
    },
    getDomain: async () => {
      try {
        // Sempre tentar buscar do store diretamente primeiro
        const { useAuthStore } = await import('@/stores/auth.store');
        const store = useAuthStore.getState();
        
        // Verificar se há domain no store
        const domain = store?.user?.domain;
        
        if (domain && typeof domain === 'string' && domain.trim().length > 0) {
          return domain.trim();
        }
        
        // Se não encontrou no store, tentar usar getAuthStore se disponível
        if (getAuthStore) {
          const storeFromGetter = getAuthStore();
          const domainFromGetter = storeFromGetter?.user?.domain;
          if (domainFromGetter && typeof domainFromGetter === 'string' && domainFromGetter.trim().length > 0) {
            return domainFromGetter.trim();
          }
        }
        
        return null;
      } catch (error) {
        console.error('[HttpClient] Erro ao buscar domain:', error);
        return null;
      }
    },
    onAuthError: async () => {
      try {
        if (getAuthStore) {
          const store = getAuthStore();
          store?.logout?.();
          return;
        }
        // Fallback: tentar importar dinamicamente
        const { useAuthStore } = await import('@/stores/auth.store');
        useAuthStore.getState().logout();
      } catch {
        // Ignorar erro se store não estiver disponível
      }
    },
  });

  // Exportar tipos úteis
  export type { AxiosRequestConfig, AxiosResponse }; 