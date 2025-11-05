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
  
  // Inventory / Estoque
  INVENTORY: {
    AVAILABILITY: '/inventory/availability',
    REPLENISH_PLAN: '/inventory/replenish/plan',
  },
  
  // Usuário
  USERS: {
    PROFILE: '/user/profile',
    UPDATE: '/user/profile',
    PREFERENCES: '/user/preferences',
    ORDERS: '/user/orders',
    ADDRESSES: '/user/addresses',
    CHANGE_PASSWORD: '/user/change-password',
  },
  
  // Pedidos
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    STATUS: (id: string) => `/orders/${id}/status`,
    TRACKING: (id: string) => `/orders/${id}/tracking`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },
  
  // Delivery
  DELIVERY: {
    QUOTE: '/delivery/quote',
    DISPATCH: '/delivery/dispatch',
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

    CREATE: '/franchise',
    DETAILS: (id: string) => `/franchise/${id}`,
    UPDATE: (id: string) => `/franchise/${id}`,
    DELETE: (id: string) => `/franchise/${id}`,
  },

  // Chatbot
  CHATBOT: {
    RESET: '/chatbot/reset',
    SEND_MESSAGE: '/chatbot/message',
    GET_HISTORY: '/chatbot/history',
    SUBMIT_LEAD: '/chatbot/lead',
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

  // Marcas
  BRANDS: {
    LIST: '/brands',
  },

  // Fornecedores
  SUPPLIERS: {
    LIST: '/suppliers',
  },
  
  // Leads ou potenciais clientes
  LEADS: {
    CREATE: '/leads',
    LIST: '/leads',
    UPDATE: (id: string) => `/leads/${id}`,
    DELETE: (id: string) => `/leads/${id}`,
  },
  

} as const;



// Tipos para os endpoints
export type ApiEndpoint = typeof API_ENDPOINTS;
export type ProductEndpoint = typeof API_ENDPOINTS.PRODUCTS;
export type UserEndpoint = typeof API_ENDPOINTS.USERS;
export type OrderEndpoint = typeof API_ENDPOINTS.ORDERS;
export type AuthEndpoint = typeof API_ENDPOINTS.AUTH; 