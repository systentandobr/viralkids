// Configurações da API
// Prioridade: VITE_API_BASE_URL > VITE_BACKEND_BASE_URL > localhost:9090 (desenvolvimento)
const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.VITE_BACKEND_BASE_URL) {
    return import.meta.env.VITE_BACKEND_BASE_URL;
  }
  // Em desenvolvimento, usar localhost:9090
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    return 'http://localhost:9090';
  }
  return 'https://api-prd.systentando.com/api';
};

const baseURL = getBaseURL();

// Log da URL base em desenvolvimento
if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
  console.log('[API Config] URL Base configurada:', baseURL);
}

export const API_CONFIG = {
  BASE_URL: baseURL,
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
};

export const runMockMode: boolean = 
  (import.meta.env.VITE_RUN_MOCK_MODE === 'true' || true) as boolean;

// Headers padrão
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Status codes de sucesso (incluindo 304 para compatibilidade, mas preferimos evitar)
export const SUCCESS_STATUS_CODES = [200, 201, 204, 304];

// Status codes de erro
export const ERROR_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
}; 