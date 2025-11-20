// Exportações centralizadas de serviços
export * from './api/httpClient';
export * from './api/config';
export * from './api/endpoints';
export * from './auth/authService';
export * from './chatbot/chatbotService';
export * from './franchise/franchiseService';
export * from './products/productService';
export * from './customers/customerService';
export * from './orders/orderService';
export * from './leads/leadService';

// Exportações de queries React Query
export * from './queries/products';
export * from './queries/customers';
export * from './queries/orders';
export * from './queries/franchises';
export * from './queries/leads';

// ServiceProvider - Classe centralizada para gerenciar serviços
export { ServiceProvider } from './serviceProvider';
