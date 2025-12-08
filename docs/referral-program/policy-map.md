# Mapa de Políticas e Regras - Sistema Member Get Member

## 1. Regras de Elegibilidade

### 1.1 Indicadores (Referrers)
- **Requisitos básicos:**
  - Cadastro ativo na plataforma ViralKids
  - E-mail verificado
  - Pelo menos 1 compra realizada (para clientes)
  - Status ativo (para franqueados)

- **Restrições:**
  - Não pode indicar a si mesmo
  - Não pode indicar usuários já cadastrados
  - Limite máximo de indicações simultâneas pendentes: 50
  - Limite de indicações completadas por mês: definido por campanha

### 1.2 Indicados (Referees)
- **Requisitos básicos:**
  - Não ter cadastro prévio na plataforma
  - E-mail válido e não utilizado anteriormente
  - Maioridade legal ou autorização parental

- **Restrições:**
  - Não pode usar código de indicação de si mesmo
  - Apenas 1 código de indicação por cadastro

## 2. Tipos de Campanhas

### 2.1 Single-Tier (Indicação Simples)
- Apenas o indicador recebe recompensa
- Ideal para campanhas de aquisição rápida
- Menor custo por indicação

### 2.2 Multi-Tier (Indicação em Cascata)
- Tanto indicador quanto indicado recebem recompensa
- Maior incentivo para o indicado completar ação
- Exemplo: "Indique e ambos ganham R$20"

### 2.3 Híbrido
- Combinação de recompensas diferentes para indicador e indicado
- Exemplo: Indicador ganha cashback, indicado ganha desconto
- Flexibilidade máxima

## 3. Tipos de Recompensas

### 3.1 Cashback
- Valor em dinheiro creditado na carteira virtual
- Pode ser sacado ou usado em compras futuras
- Sujeito a prazo de liberação (após período de confirmação)

### 3.2 Desconto
- Cupom de desconto para próxima compra
- Pode ser percentual ou valor fixo
- Prazo de validade definido por campanha

### 3.3 Pontos
- Acúmulo no programa de fidelidade
- Conversão em produtos ou benefícios
- Não expira (salvo regras específicas)

### 3.4 Prêmios Físicos
- Produtos do catálogo ViralKids
- Entrega após confirmação da indicação
- Sujeito a disponibilidade

## 4. Regras de Expiração

### 4.1 Campanhas
- **Ativas:** Data de início ≤ hoje < Data de fim
- **Expiradas:** Data de fim < hoje
- **Pausadas:** Temporariamente desativadas pelo admin

### 4.2 Indicações
- Código de indicação válido por: 30 dias (configurável)
- Indicação pendente expira em: 7 dias sem ação
- Recompensa deve ser resgatada em: 90 dias

### 4.3 Recompensas
- Cashback: libera após 7 dias da confirmação do pedido
- Desconto: validade definida no cupom (padrão: 30 dias)
- Pontos: não expiram
- Prêmios: devem ser resgatados em 30 dias

## 5. Limites de Recompensas

### 5.1 Por Período
| Tipo | Limite Diário | Limite Mensal |
|------|---------------|---------------|
| Cashback | R$ 100,00 | R$ 1.000,00 |
| Desconto | 5 cupons | 20 cupons |
| Pontos | 500 pts | 5.000 pts |
| Prêmios | 1 | 3 |

### 5.2 Por Indicador
- Máximo de indicações ativas: 50
- Máximo de indicações completadas/mês: 30
- Acúmulo máximo de cashback não sacado: R$ 5.000,00

## 6. Regras Antifraude

### 6.1 Detecção Automática
- **IP duplicado:** Indicador e indicado com mesmo IP
- **Device fingerprint:** Mesmo dispositivo para múltiplas contas
- **Comportamento suspeito:** Padrões anormais de indicação
- **E-mails temporários:** Bloqueio de domínios descartáveis

### 6.2 Penalidades
- **Alerta:** Primeira ocorrência (notificação)
- **Suspensão:** Segunda ocorrência (30 dias)
- **Banimento:** Terceira ocorrência (permanente)
- **Cancelamento:** Todas as recompensas pendentes são canceladas

### 6.3 Verificações
- Verificação de e-mail obrigatória
- Verificação de telefone (opcional, aumenta confiança)
- Validação de CPF para saques de cashback
- Período de espera para novas indicações após flagging

## 7. Política de Cancelamento e Reembolso

### 7.1 Cancelamento de Indicação
- Pode ser cancelada pelo indicador antes de ser completada
- Cancelamento automático após expiração
- Admin pode cancelar por violação de regras

### 7.2 Cancelamento de Recompensa
- **Antes da liberação:** Cancelamento total
- **Após liberação:** Não pode ser cancelada (exceto fraude)
- **Devolução de produto:** Recompensa é automaticamente cancelada

### 7.3 Reembolso
- Cashback já sacado não é reembolsável
- Cupons usados não são reembolsáveis
- Pontos podem ser estornados em caso de fraude

## 8. Divulgação e Compliance

### 8.1 Termos de Uso
- Usuário deve aceitar termos específicos do programa
- Termos devem estar visíveis antes da participação
- Alterações devem ser comunicadas com 30 dias de antecedência

### 8.2 Comunicação
- E-mail de confirmação de indicação
- Notificação de conclusão de indicação
- Notificação de liberação de recompensa
- Resumo mensal de indicações

### 8.3 LGPD
- Consentimento para compartilhamento de dados
- Direito de exclusão de dados de indicação
- Dados de indicação mantidos por 5 anos

### 8.4 Tributação
- Cashback acima de R$ 600/mês: retenção de IR
- Prêmios: sujeitos a tributação conforme legislação
- Responsabilidade fiscal do usuário

## 9. Métricas e KPIs

### 9.1 Métricas de Campanha
- Taxa de conversão de indicações
- Custo por aquisição (CPA)
- Lifetime Value (LTV) de indicados
- ROI por campanha

### 9.2 Métricas de Fraude
- Taxa de indicações flagged
- Taxa de cancelamento por fraude
- Tempo médio de detecção

### 9.3 Métricas de Engajamento
- Indicações por usuário
- Tempo médio para completar indicação
- Taxa de retenção de indicados

---

*Documento atualizado em: {{DATA_ATUAL}}*
*Versão: 1.0*
