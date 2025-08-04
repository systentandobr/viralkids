// Centralização de endpoints da API
export const API_ENDPOINTS = {
  // Produtos
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
    FEATURED: '/products/featured',
  },
  
  // Usuário
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/profile',
    PREFERENCES: '/user/preferences',
    ORDERS: '/user/orders',
    ADDRESSES: '/user/addresses',
  },
  
  // Pedidos
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    STATUS: (id: string) => `/orders/${id}/status`,
    TRACKING: (id: string) => `/orders/${id}/tracking`,
  },
  
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Carrinho
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (id: string) => `/cart/items/${id}`,
    REMOVE_ITEM: (id: string) => `/cart/items/${id}`,
    CLEAR: '/cart/clear',
  },

  // Franquias
  FRANCHISE: {
    LIST: '/franchise',
    DETAIL: (id: string) => `/franchise/${id}`,
    APPLY: '/franchise/apply',
    CONTACT: '/franchise/contact',
  },

  // Chatbot
  CHATBOT: {
    MESSAGE: '/chatbot/message',
    HISTORY: '/chatbot/history',
    RESET: '/chatbot/reset',
  },

  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    ORDERS: '/admin/orders',
    PRODUCTS: '/admin/products',
    ANALYTICS: '/admin/analytics',
  },

  // Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    FILE: '/upload/file',
  },
} as const;

// Tipos para os endpoints
export type ApiEndpoint = typeof API_ENDPOINTS;
export type ProductEndpoint = typeof API_ENDPOINTS.PRODUCTS;
export type UserEndpoint = typeof API_ENDPOINTS.USER;
export type OrderEndpoint = typeof API_ENDPOINTS.ORDERS;
export type AuthEndpoint = typeof API_ENDPOINTS.AUTH; 