// Configurações da API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
};

// Endpoints da API
export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Usuários
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
    CHANGE_PASSWORD: '/users/change-password',
  },
  
  // Franquias
  FRANCHISE: {
    LIST: '/franchise',
    CREATE: '/franchise',
    DETAILS: (id: string) => `/franchise/${id}`,
    UPDATE: (id: string) => `/franchise/${id}`,
    DELETE: (id: string) => `/franchise/${id}`,
    APPLY: '/franchise/apply',
  },
  
  // Produtos
  PRODUCTS: {
    LIST: '/products',
    DETAILS: (id: string) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    SEARCH: '/products/search',
  },
  
  // Chatbot
  CHATBOT: {
    SEND_MESSAGE: '/chatbot/message',
    GET_HISTORY: '/chatbot/history',
    SUBMIT_LEAD: '/chatbot/lead',
  },
  
  // Leads
  LEADS: {
    CREATE: '/leads',
    LIST: '/leads',
    UPDATE: (id: string) => `/leads/${id}`,
    DELETE: (id: string) => `/leads/${id}`,
  },
  
  // Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    FILE: '/upload/file',
  },
};

// Headers padrão
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Status codes de sucesso
export const SUCCESS_STATUS_CODES = [200, 201, 204];

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