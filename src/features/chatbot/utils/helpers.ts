// Utilitários para o chatbot

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const formatPhone = (phone: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Aplica máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};

export const getGreetingMessage = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Bom dia! ☀️';
  } else if (hour < 18) {
    return 'Boa tarde! 😊';
  } else {
    return 'Boa noite! 🌙';
  }
};

export const detectIntent = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custa')) {
    return 'pricing';
  }
  
  if (lowerMessage.includes('franquia') || lowerMessage.includes('franqueado')) {
    return 'franchise';
  }
  
  if (lowerMessage.includes('produto') || lowerMessage.includes('catálogo')) {
    return 'products';
  }
  
  if (lowerMessage.includes('ajuda') || lowerMessage.includes('suporte')) {
    return 'help';
  }
  
  if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('ola')) {
    return 'greeting';
  }
  
  return 'unknown';
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const typingDelay = (text: string): number => {
  // Simula tempo de digitação baseado no tamanho do texto
  const baseDelay = 500;
  const charDelay = 30;
  return baseDelay + (text.length * charDelay);
};

export const scrollToBottom = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
};

export const getRandomResponse = (responses: string[]): string => {
  return responses[Math.floor(Math.random() * responses.length)];
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const getFranchiseInfo = (type: 'starter' | 'premium' | 'master') => {
  const info = {
    starter: {
      name: 'Starter',
      price: 2997,
      products: 50,
      training: '20h',
      support: '3 meses',
      description: 'Ideal para quem está começando',
    },
    premium: {
      name: 'Premium',
      price: 4997,
      products: 100,
      training: '40h',
      support: '6 meses',
      description: 'Para empreendedores em crescimento',
    },
    master: {
      name: 'Master',
      price: 7997,
      products: 200,
      training: '60h',
      support: '12 meses',
      description: 'Para quem quer o máximo de recursos',
    },
  };
  
  return info[type];
};

export class LocalStorageManager {
  static save(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }
  
  static load<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
      return null;
    }
  }
  
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  }
}
