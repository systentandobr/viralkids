import { httpClient } from './api/httpClient';
import { AuthService } from './auth/authService';
import { ChatbotService } from './chatbot/chatbotService';
import { FranchiseService } from './franchise/franchiseService';
import { ProductService } from './products/productService';
import { CustomerService } from './customers/customerService';
import { OrderService } from './orders/orderService';

/**
 * ServiceProvider - Classe centralizada para gerenciar todos os serviços
 * 
 * Fornece acesso estático a todos os serviços e métodos de inicialização/limpeza
 */
export class ServiceProvider {
  static auth = AuthService;
  static chatbot = ChatbotService;
  static franchise = FranchiseService;
  static product = ProductService;
  static customer = CustomerService;
  static order = OrderService;

  /**
   * Inicializa todos os serviços
   * Configura tokens de autenticação se disponíveis
   */
  static initialize(): void {
    try {
      // Usar o método initialize do AuthService que já faz toda a configuração
      AuthService.initialize();
    } catch (error) {
      console.warn('Erro ao inicializar serviços:', error);
    }
  }

  /**
   * Limpa todos os dados locais de todos os serviços
   */
  static clearAllData(): void {
    try {
      // Usar logout que limpa tudo corretamente
      AuthService.logout();
      
      // Limpar token do httpClient
      httpClient.removeAuthToken();
    } catch (error) {
      console.warn('Erro ao limpar dados dos serviços:', error);
    }
  }
}

