import { SysSegurancaClient } from 'systentando-security-client';
import { ENV_CONFIG } from '@/config/env';

// Configuração do cliente de segurança
// Nota: O domain deve ser passado diretamente nas credenciais de login/register,
// não no construtor do cliente
const securityClient = new SysSegurancaClient({
  baseURL: ENV_CONFIG.SYS_SEGURANCA_BASE_URL ?? 'https://auth.systentando.com',
  apiKey: ENV_CONFIG.SYS_SEGURANCA_API_KEY,
  enableTokenStorage: true,
  timeout: 10000,
  retries: 3
});

export { securityClient };
