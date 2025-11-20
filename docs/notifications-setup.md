# Sistema de Notificações - Telegram e Discord

## Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis no arquivo `.env` do backend:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=seu_token_do_bot_aqui
TELEGRAM_CHAT_ID=seu_chat_id_aqui

# Discord Webhook
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/seu_webhook_url_aqui
```

## Como Obter as Credenciais

### Telegram Bot

1. Abra o Telegram e procure por `@BotFather`
2. Envie `/newbot` e siga as instruções
3. Copie o token fornecido
4. Para obter o Chat ID:
   - Envie uma mensagem para seu bot
   - Acesse: `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates`
   - Procure por `"chat":{"id":...}` no JSON retornado

### Discord Webhook

1. Abra o Discord e vá em Configurações do Servidor > Integrações
2. Clique em "Webhooks" > "Novo Webhook"
3. Configure o nome e canal
4. Copie a URL do Webhook

## Eventos Notificados

O sistema envia notificações automáticas para:

- ✅ **Novo Lead Capturado** - Quando um lead é criado via chatbot ou formulário
- ✅ **Lead Convertido** - Quando um lead é convertido em cliente
- ✅ **Novo Cliente** - Quando um cliente é cadastrado diretamente
- ✅ **Novo Pedido** - Quando um pedido é criado

## Formato das Notificações

### Telegram
- Mensagem formatada em Markdown
- Emojis indicando o tipo de evento
- Metadados estruturados

### Discord
- Embed colorido
- Campos organizados
- Timestamp automático

