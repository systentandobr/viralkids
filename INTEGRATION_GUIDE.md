# Guia de Integração - API de Segurança

## ✅ Implementações Realizadas

### 1. Instalação da Biblioteca
- ✅ Instalado `systentando-security-client` via pnpm
- ✅ Configurado cliente de segurança com API auth.systentando.com

### 2. Remoção de Mocks
- ✅ Removido `MOCK_USERS` do `useAuth.ts`
- ✅ Removido credenciais de teste do `LoginForm.tsx`
- ✅ Removidas funções `generateMockToken` e `generateMockRefreshToken`

### 3. Integração com API Real
- ✅ Implementado login usando `securityClient.login()`
- ✅ Implementado registro usando `securityClient.register()`
- ✅ Implementado logout usando `securityClient.logout()`
- ✅ Implementado forgotPassword usando `securityClient.forgotPassword()`
- ✅ Implementado resetPassword usando `securityClient.resetPassword()`
- ✅ Implementado updateProfile usando `securityClient.updateProfile()`
- ✅ Implementado verifyEmail usando `securityClient.verifyEmail()`
- ✅ Implementado verificação de permissões usando `securityClient.hasPermission()`

### 4. Configuração
- ✅ Criado `src/config/env.ts` para configurações de ambiente
- ✅ Criado `src/services/auth/securityClient.ts` para cliente de segurança
- ✅ Configurado gerenciamento automático de tokens

## 🔧 Configuração Necessária

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com:

```env
# API de Segurança
VITE_SYS_SEGURANCA_API_KEY=sua-api-key-aqui
VITE_SYS_SEGURANCA_BASE_URL=https://auth.systentando.com

# API Principal
VITE_API_BASE_URL=http://localhost:3001/api
VITE_RUN_MOCK_MODE=false
```

### Dependências
A biblioteca `systentando-security-client` já foi instalada e está configurada.

## 🚀 Funcionalidades Implementadas

### Autenticação
- **Login**: Integrado com API real usando `securityClient.login()`
- **Registro**: Integrado com API real usando `securityClient.register()`
- **Logout**: Integrado com API real usando `securityClient.logout()`
- **Verificação de Sessão**: Usando `securityClient.isTokenValid()`

### Gerenciamento de Senha
- **Esqueci a Senha**: Usando `securityClient.forgotPassword()`
- **Reset de Senha**: Usando `securityClient.resetPassword()`

### Perfil do Usuário
- **Atualização de Perfil**: Usando `securityClient.updateProfile()`
- **Verificação de Email**: Usando `securityClient.verifyEmail()`

### Autorização
- **Verificação de Permissões**: Usando `securityClient.hasPermission()`
- **Verificação de Roles**: Usando `securityClient.hasRole()`

## 🔄 Gerenciamento de Tokens

A biblioteca `systentando-security-client` gerencia automaticamente:
- ✅ Armazenamento de tokens (localStorage)
- ✅ Renovação automática de tokens
- ✅ Verificação de validade de tokens
- ✅ Limpeza de tokens no logout

## 📝 Próximos Passos

1. **Configurar variáveis de ambiente** com as credenciais reais da API
2. **Testar integração** com a API auth.systentando.com
3. **Configurar CORS** se necessário
4. **Implementar tratamento de erros** específicos da API
5. **Adicionar logs** para debugging

## 🐛 Troubleshooting

### Erro de CORS
Se houver problemas de CORS, verifique se a API auth.systentando.com está configurada para aceitar requisições do seu domínio.

### Erro de API Key
Verifique se a `VITE_SYS_SEGURANCA_API_KEY` está configurada corretamente.

### Erro de Conexão
Verifique se a `VITE_SYS_SEGURANCA_BASE_URL` está apontando para o endpoint correto.

## 📚 Documentação

Para mais informações sobre a biblioteca `systentando-security-client`, consulte:
- [Documentação Oficial](https://github.com/systentandobr/sys-seguranca-client)
- [Exemplos de Uso](./src/services/auth/securityClient.ts)
