// Configurações de ambiente
export const ENV_CONFIG = {
  // API de Segurança
  SYS_SEGURANCA_API_KEY: import.meta.env.VITE_SYS_SEGURANCA_API_KEY || 'development-local-test-key',
  SYS_SEGURANCA_BASE_URL: import.meta.env.VITE_SYS_SEGURANCA_BASE_URL || 'http://localhost:8888',
  SYS_SEGURANCA_DOMAIN: import.meta.env.VITE_SYS_SEGURANCA_DOMAIN || 'viralkids-web',
  
  // API Principal
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api-prd.systentando.com/api',
  BACKEND_BASE_URL: import.meta.env.VITE_BACKEND_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://api-prd.systentando.com/api',
  RUN_MOCK_MODE: import.meta.env.VITE_RUN_MOCK_MODE === 'true' || false,
} as const;
