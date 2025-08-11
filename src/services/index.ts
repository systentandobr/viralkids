// API Core
export { httpClient } from './api/httpClient';
export type { ApiResponse } from './api/httpClient';
export { API_CONFIG, DEFAULT_HEADERS, SUCCESS_STATUS_CODES, ERROR_STATUS_CODES } from './api/config';
export { API_ENDPOINTS } from './api/endpoints';

// Auth Service
export { AuthService } from './auth/authService';
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
} from './auth/authService';

// Chatbot Service
export { ChatbotService } from './chatbot/chatbotService';
export type {
  ChatMessage,
  ChatHistory,
  LeadData,
  ChatbotResponse,
} from './chatbot/chatbotService';

// Franchise Service
export { FranchiseService } from './franchise/franchiseService';
export type {
  Franchise,
  FranchiseApplication,
  CreateFranchiseData,
  UpdateFranchiseData,
  FranchiseFilters,
  FranchiseStats,
} from './franchise/types';

// Product Service
export { ProductService } from './products/productService';
export type {
  Product,
  ProductCategory,
  ProductFilters,
  CreateProductData,
  UpdateProductData,
  ProductReview,
  ProductStats,
} from './products/types';

// Service Provider - Classe principal para gerenciar todos os serviços
import { AuthService } from './auth/authService';
import { ChatbotService } from './chatbot/chatbotService';
import { FranchiseService } from './franchise/franchiseService';
import { ProductService } from './products/productService';
import { httpClient } from './api/httpClient';

export class ServiceProvider {
  static auth = AuthService;
  static chatbot = ChatbotService;
  static franchise = FranchiseService;
  static product = ProductService;

  // Método para inicializar todos os serviços
  static initialize(): void {
    // Configurar token de autenticação se existir
    const { token } = AuthService.getAuthData();
    if (token) {
      httpClient.setAuthToken(token);
    }
  }

  // Método para limpar dados de todos os serviços
  static clearAllData(): void {
    ServiceProvider.auth.clearAuthData();
    ServiceProvider.chatbot.clearLocalData();
    ServiceProvider.franchise.clearLocalData();
    ServiceProvider.product.clearLocalData();
  }
} 