import { ChatFlow } from '../types';

export const franchiseLeadFlow: ChatFlow = {
  id: 'franchise-lead-flow',
  name: 'Captação de Leads para Franquia',
  triggers: ['franquia', 'empreender', 'negócio', 'investir'],
  steps: [
    {
      id: 'greeting',
      type: 'message',
      content: '👋 Olá! Bem-vindo à Viral Kids! \n\nVi que você tem interesse em conhecer nossa oportunidade de franquia. Que incrível! ✨\n\nVou te fazer algumas perguntas rápidas para entender melhor seu perfil e te enviar informações personalizadas. Pode ser?',
      quickReplies: [
        {
          id: 'yes',
          text: '😊 Sim, vamos lá!',
          payload: 'start_questions'
        },
        {
          id: 'info',
          text: '🤔 Quero mais informações primeiro',
          payload: 'more_info'
        }
      ],
      nextStep: 'name-step'
    },
    {
      id: 'more-info',
      type: 'message',
      content: '🌟 A Viral Kids é uma franquia digital focada no universo infantil!\n\n✅ Produtos únicos e personalizados\n✅ Impressão 3D exclusiva\n✅ Suporte completo para empreendedores\n✅ Mercado em crescimento\n✅ Investimento acessível\n\nAgora que você sabe mais sobre nós, posso fazer algumas perguntinhas para te conhecer melhor?',
      quickReplies: [
        {
          id: 'yes',
          text: '✨ Agora sim, vamos!',
          payload: 'start_questions'
        },
        {
          id: 'whatsapp',
          text: '📱 Prefiro falar no WhatsApp',
          payload: 'redirect_whatsapp'
        }
      ],
      nextStep: 'name-step'
    },
    {
      id: 'name-step',
      type: 'question',
      content: '😊 Perfeito! Qual é o seu nome?',
      validation: {
        required: true,
        type: 'text',
        minLength: 2
      },
      nextStep: 'city-step'
    },
    {
      id: 'city-step',
      type: 'question',
      content: '📍 Que legal, {{name}}! De qual cidade você é?',
      validation: {
        required: true,
        type: 'text',
        minLength: 2
      },
      nextStep: 'experience-step'
    },
    {
      id: 'experience-step',
      type: 'question',
      content: '💼 Você já teve alguma experiência com vendas ou empreendedorismo?',
      quickReplies: [
        {
          id: 'none',
          text: '😅 Nenhuma experiência',
          payload: 'none'
        },
        {
          id: 'some',
          text: '🤏 Pouca experiência',
          payload: 'some'
        },
        {
          id: 'experienced',
          text: '💪 Bastante experiência',
          payload: 'experienced'
        }
      ],
      nextStep: 'franchise-type-step'
    },
    {
      id: 'franchise-type-step',
      type: 'question',
      content: '🎯 Que tipo de investimento você tem em mente para começar?\n\n💫 **Starter** (R$ 2.997): 50 produtos, 20h treinamento\n🌟 **Premium** (R$ 4.997): 100 produtos, 40h treinamento  \n🚀 **Master** (R$ 7.997): 200 produtos, 60h treinamento\n\nQual desperta mais seu interesse?',
      quickReplies: [
        {
          id: 'starter',
          text: '💫 Starter - R$ 2.997',
          payload: 'starter'
        },
        {
          id: 'premium',
          text: '🌟 Premium - R$ 4.997',
          payload: 'premium'
        },
        {
          id: 'master',
          text: '🚀 Master - R$ 7.997',
          payload: 'master'
        }
      ],
      nextStep: 'timeToStart-step'
    },
    {
      id: 'timeToStart-step',
      type: 'question',
      content: '⏰ Em quanto tempo você gostaria de começar?',
      quickReplies: [
        {
          id: 'immediately',
          text: '🏃‍♀️ Imediatamente',
          payload: 'immediately'
        },
        {
          id: 'month',
          text: '📅 Em até 1 mês',
          payload: '1_month'
        },
        {
          id: 'months',
          text: '🗓️ Em 2-3 meses',
          payload: '2_3_months'
        },
        {
          id: 'later',
          text: '🤔 Ainda estou decidindo',
          payload: 'still_deciding'
        }
      ],
      nextStep: 'phone-step'
    },
    {
      id: 'phone-step',
      type: 'question',
      content: '📱 Para te enviarmos um material completo e marcarmos uma conversa, qual seu WhatsApp?\n\n*Digite no formato: (00) 00000-0000*',
      validation: {
        required: true,
        type: 'phone'
      },
      nextStep: 'email-step'
    },
    {
      id: 'email-step',
      type: 'question',
      content: '📧 E qual seu e-mail para receber informações detalhadas?',
      validation: {
        required: true,
        type: 'email'
      },
      nextStep: 'final-step'
    },
    {
      id: 'final-step',
      type: 'message',
      content: '🎉 **Perfeito, {{name}}!** \n\nRecebemos suas informações:\n📍 {{city}}\n📱 {{phone}}\n📧 {{email}}\n🎯 Interesse: {{franchiseType}}\n⏰ Prazo: {{timeToStart}}\n\n✅ **Próximos passos:**\n1. Você receberá um e-mail com material completo\n2. Nossa equipe entrará em contato em até 24h\n3. Marcaremos uma apresentação personalizada\n\n🚀 **Bem-vindo à família Viral Kids!**\n\nEm breve você estará transformando sonhos infantis em realidade! ✨',
      nextStep: undefined
    }
  ]
};

export const supportFlow: ChatFlow = {
  id: 'support-flow',
  name: 'Fluxo de Suporte',
  triggers: ['ajuda', 'suporte', 'dúvida', 'problema'],
  steps: [
    {
      id: 'support-greeting',
      type: 'message',
      content: '🛟 Olá! Como posso te ajudar hoje?',
      quickReplies: [
        {
          id: 'products',
          text: '🧸 Dúvidas sobre produtos',
          payload: 'products_help'
        },
        {
          id: 'franchise',
          text: '🏪 Informações sobre franquia',
          payload: 'franchise_help'
        },
        {
          id: 'order',
          text: '📦 Acompanhar pedido',
          payload: 'order_help'
        },
        {
          id: 'other',
          text: '💬 Outro assunto',
          payload: 'other_help'
        }
      ],
      nextStep: 'redirect-human'
    },
    {
      id: 'redirect-human',
      type: 'message',
      content: '👨‍💼 Vou te conectar com nossa equipe especializada!\n\nClique no botão abaixo para falar diretamente conosco via WhatsApp:',
      nextStep: undefined
    }
  ]
};

export const productInfoFlow: ChatFlow = {
  id: 'product-info-flow',
  name: 'Informações sobre Produtos',
  triggers: ['produto', 'catálogo', 'brinquedo', 'preço'],
  steps: [
    {
      id: 'product-greeting',
      type: 'message',
      content: '🧸 Ótima escolha! Nossos produtos são únicos e encantam as crianças!\n\n✨ **Nossos destaques:**\n🎨 Produtos personalizados em 3D\n🎁 Kits festa completos\n👑 Fantasias exclusivas\n🔥 Produtos virais da internet\n🧠 Brinquedos educativos\n\nQue categoria mais te interessa?',
      quickReplies: [
        {
          id: '3d',
          text: '🎨 Impressão 3D',
          payload: '3d_products'
        },
        {
          id: 'kits',
          text: '🎁 Kits Festa',
          payload: 'party_kits'
        },
        {
          id: 'costumes',
          text: '👑 Fantasias',
          payload: 'costumes'
        },
        {
          id: 'viral',
          text: '🔥 Produtos Virais',
          payload: 'viral_products'
        }
      ],
      nextStep: 'product-details'
    },
    {
      id: 'product-details',
      type: 'message',
      content: '💝 Nossos produtos são cuidadosamente selecionados para criar momentos mágicos!\n\nPara ver nosso catálogo completo e fazer pedidos, que tal falar com nossa equipe de vendas?\n\nEles podem te mostrar fotos, vídeos e até fazer orçamentos personalizados!',
      quickReplies: [
        {
          id: 'contact',
          text: '📱 Falar com vendas',
          payload: 'contact_sales'
        },
        {
          id: 'franchise',
          text: '🏪 Quero ser franqueado',
          payload: 'franchise_interest'
        }
      ],
      nextStep: undefined
    }
  ]
};

// Fluxos disponíveis
export const availableFlows = [
  franchiseLeadFlow,
  supportFlow,
  productInfoFlow
];

// Função para selecionar fluxo baseado na mensagem
export const selectFlow = (message: string): ChatFlow => {
  const lowerMessage = message.toLowerCase();
  
  // Verificar cada fluxo
  for (const flow of availableFlows) {
    for (const trigger of flow.triggers) {
      if (lowerMessage.includes(trigger)) {
        return flow;
      }
    }
  }
  
  // Fluxo padrão para captura de franqueados
  return franchiseLeadFlow;
};
