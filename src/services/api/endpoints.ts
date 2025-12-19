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
    BULK: '/products/bulk',
    IMPORT: '/products/import',
    VALIDATE_BULK: '/products/validate-bulk',
    UPLOAD_IMAGE: '/products/upload-image',
    UPLOAD_IMAGES: '/products/upload-images',
    UPDATE_IMAGE_ORDER: (id: string) => `/products/${id}/images/order`,
    UPDATE_MARKETPLACE: (id: string) => `/products/${id}/marketplace`,
  },

  // Produtos Afiliados
  AFFILIATE_PRODUCTS: {
    LIST: '/affiliate-products',
    CREATE: '/affiliate-products',
    PREVIEW: '/affiliate-products/preview',
    CREATE_FROM_PREVIEW: (id: string) => `/affiliate-products/${id}/create-product`,
    DETAIL: (id: string) => `/affiliate-products/${id}`,
    UPDATE: (id: string) => `/affiliate-products/${id}`,
    DELETE: (id: string) => `/affiliate-products/${id}`,
    RETRY: (id: string) => `/affiliate-products/${id}/retry`,
    METRICS: '/affiliate-products/metrics',
  },

  // Inventory / Estoque
  INVENTORY: {
    AVAILABILITY: '/inventory/availability',
    REPLENISH_PLAN: '/inventory/replenish/plan',
  },

  // Usuário
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    LIST_BY_UNIT: '/users/by-unit',
    SEARCH_AVAILABLE: '/users/available',
    UPDATE_UNIT: (id: string) => `/users/${id}/unit`,
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
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
    UPDATE_PROFILE: '/auth/profile',
    VALIDATE: '/auth/validate',
    USERS_BY_DOMAIN: (domain: string) => `/auth/users/domain/${domain}`,
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
    DETAIL: (id: string) => `/leads/${id}`,
    UPDATE: (id: string) => `/leads/${id}`,
    DELETE: (id: string) => `/leads/${id}`,
    PIPELINE_STATS: '/leads/pipeline/stats',
    CONVERT: (id: string) => `/leads/${id}/convert`,
    CONVERSATIONS: (id: string) => `/leads/${id}/conversations`,
  },

  // Clientes
  CUSTOMERS: {
    LIST: '/customers',
    DETAIL: (id: string) => `/customers/${id}`,
    CREATE: '/customers',
    UPDATE: (id: string) => `/customers/${id}`,
    DELETE: (id: string) => `/customers/${id}`,
    STATS: '/customers/stats',
    REFERRAL_HISTORY: (id: string) => `/customers/${id}/referrals`,
    CONVERSATIONS: (id: string) => `/customers/${id}/conversations`,
  },

  // Franquias
  FRANCHISES: {
    LIST: '/franchises',
    DETAIL: (id: string) => `/franchises/${id}`,
    CREATE: '/franchises',
    UPDATE: (id: string) => `/franchises/${id}`,
    DELETE: (id: string) => `/franchises/${id}`,
    METRICS: (id: string) => `/franchises/${id}/metrics`,
    REGIONAL_TRENDS: '/franchises/regional-trends',
  },

  // Sistema de Indicação (Member Get Member)
  REFERRAL_CAMPAIGNS: {
    LIST: '/referral-campaigns',
    ACTIVE: '/referral-campaigns/active',
    DETAIL: (id: string) => `/referral-campaigns/${id}`,
    BY_SLUG: (slug: string) => `/referral-campaigns/slug/${slug}`,
    BY_FRANCHISE: (franchiseId: string) => `/referral-campaigns/franchise/${franchiseId}`,
    CREATE: '/referral-campaigns',
    UPDATE: (id: string) => `/referral-campaigns/${id}`,
    DELETE: (id: string) => `/referral-campaigns/${id}`,
    ACTIVATE: (id: string) => `/referral-campaigns/${id}/activate`,
    PAUSE: (id: string) => `/referral-campaigns/${id}/pause`,
    STATS: (id: string) => `/referral-campaigns/${id}/stats`,
  },

  REFERRALS: {
    LIST: '/referrals',
    MY: '/referrals/my',
    DETAIL: (id: string) => `/referrals/${id}`,
    BY_CODE: (code: string) => `/referrals/code/${code}`,
    BY_USER: (userId: string) => `/referrals/user/${userId}`,
    CREATE: '/referrals',
    COMPLETE: (id: string) => `/referrals/${id}/complete`,
    CANCEL: (id: string) => `/referrals/${id}/cancel`,
    CAMPAIGN_STATS: (campaignId: string) => `/referrals/campaign/${campaignId}/stats`,
  },

  REWARDS: {
    PROCESS: '/rewards/process',
    MY: '/rewards/my',
    BY_USER: (userId: string) => `/rewards/user/${userId}`,
    PENDING: '/rewards/pending',
    DETAIL: (id: string) => `/rewards/${id}`,
    APPROVE: (id: string) => `/rewards/${id}/approve`,
    CANCEL: (id: string) => `/rewards/${id}/cancel`,
  },

  // Analytics de Referrals
  REFERRAL_ANALYTICS: {
    ANALYTICS: '/admin/referrals/analytics',
    FUNNEL: '/admin/referrals/funnel',
    COHORTS: '/admin/referrals/cohorts',
    LEAD_STATS: '/admin/leads/referral-stats',
  },

  // Treinamentos
  TRAININGS: {
    LIST: '/trainings',
    DETAIL: (id: string) => `/trainings/${id}`,
    CREATE: '/trainings',
    UPDATE: (id: string) => `/trainings/${id}`,
    DELETE: (id: string) => `/trainings/${id}`,
    INCREMENT_VIEW: (id: string) => `/trainings/${id}/view`,
  },
  // Templates de Tarefas (Admin)
  TASK_TEMPLATES: {
    LIST: '/task-templates',
    DEFAULTS: '/task-templates/defaults',
    DETAIL: (id: string) => `/task-templates/${id}`,
    CREATE: '/task-templates',
    UPDATE: (id: string) => `/task-templates/${id}`,
    DELETE: (id: string) => `/task-templates/${id}`,
  },

  // Tarefas da Unidade (Franchisee)
  FRANCHISE_TASKS: {
    LIST_BY_FRANCHISE: (franchiseId: string) => `/franchise-tasks/franchise/${franchiseId}`,
    LIST_BY_USER: (userId: string) => `/franchise-tasks/user/${userId}`,
    DETAIL: (id: string) => `/franchise-tasks/${id}`,
    CREATE: '/franchise-tasks',
    UPDATE: (id: string) => `/franchise-tasks/${id}`,
    COMPLETE_STEP: (id: string) => `/franchise-tasks/${id}/complete-step`,
    INITIALIZE: (franchiseId: string) => `/franchise-tasks/initialize/${franchiseId}`,
    STATS: (franchiseId: string) => `/franchise-tasks/franchise/${franchiseId}/stats`,
  },

  // Instruções RAG
  RAG_INSTRUCTIONS: {
    LIST: '/rag-instructions',
    DETAIL: (id: string) => `/rag-instructions/by-id/${id}`,
    BY_UNIT: (unitId: string) => `/rag-instructions/${unitId}`,
    CREATE: '/rag-instructions',
    CREATE_FROM_TEXT: '/rag-instructions/from-text',
    CREATE_FROM_URL: '/rag-instructions/from-url',
    CREATE_FROM_PDF: '/rag-instructions/from-pdf',
    UPDATE: (id: string) => `/rag-instructions/${id}`,
    DELETE: (id: string) => `/rag-instructions/${id}`,
    REINDEX: (id: string) => `/rag-instructions/${id}/reindex`,
    CONTEXT: (unitId: string) => `/rag-instructions/${unitId}/context`,
  },
} as const;



// Tipos para os endpoints
export type ApiEndpoint = typeof API_ENDPOINTS;
export type ProductEndpoint = typeof API_ENDPOINTS.PRODUCTS;
export type UserEndpoint = typeof API_ENDPOINTS.USERS;
export type OrderEndpoint = typeof API_ENDPOINTS.ORDERS;
export type AuthEndpoint = typeof API_ENDPOINTS.AUTH; 