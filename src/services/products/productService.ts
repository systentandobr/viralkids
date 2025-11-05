import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { 
  Shirt, 
  Gamepad2, 
  GraduationCap, 
  Home, 
  Sparkles 
} from 'lucide-react';
import { ProductFiltersType } from '@/pages/Ecommerce/types/ecommerce.types';
import { Product, ProductCategory, CreateProductData, UpdateProductData, ProductReview, ProductStats } from './types';
import { InventoryApi, InventoryAvailabilityResponse } from '../inventory/inventory.api';

// Classe do serviço de produtos
export class ProductService {
  // Listar produtos
  static async listProducts(filters?: ProductFiltersType): Promise<ApiResponse<Product[]>> {
    const params = filters ? { ...filters } : {};
    return httpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.LIST, { params });
  }

  // Listar produtos com availability por unidade
  static async listWithAvailability(unitId: string, filters?: ProductFiltersType): Promise<ApiResponse<(Product & { availabilityInfo?: InventoryAvailabilityResponse[number] })[]>> {
    const productsResp = await this.listProducts(filters);
    if (!productsResp.success || !productsResp.data || productsResp.data.length === 0) return productsResp as any;

    const productIds = productsResp.data.map(p => p.id);
    const availabilityResp = await InventoryApi.availability({ productIds, unitId });

    if (!availabilityResp.success || !availabilityResp.data) {
      return { ...productsResp } as any;
    }

    const availabilityMap = new Map(availabilityResp.data.map(item => [item.productId, item]));
    const merged = productsResp.data.map(p => ({
      ...p,
      availabilityInfo: availabilityMap.get(p.id),
    }));

    return { success: true, data: merged } as ApiResponse<any>;
  }

  // Obter detalhes de um produto
  static async getProduct(id: string): Promise<ApiResponse<Product>> {
    return httpClient.get<Product>(API_ENDPOINTS.PRODUCTS.DETAIL(id));
  }

  // Obter detalhe com availability por unidade
  static async getWithAvailability(id: string, unitId: string): Promise<ApiResponse<Product & { availabilityInfo?: InventoryAvailabilityResponse[number] }>> {
    const [productResp, availabilityResp] = await Promise.all([
      this.getProduct(id),
      InventoryApi.availability({ productIds: [id], unitId })
    ]);

    if (!productResp.success || !productResp.data) return productResp as any;
    const info = availabilityResp.success && availabilityResp.data ? availabilityResp.data[0] : undefined;
    return { success: true, data: { ...productResp.data, availabilityInfo: info } } as any;
  }

  // Criar novo produto
  static async createProduct(data: CreateProductData): Promise<ApiResponse<Product>> {
    return httpClient.post<Product>('/products', data);
  }

  // Atualizar produto
  static async updateProduct(id: string, data: UpdateProductData): Promise<ApiResponse<Product>> {
    return httpClient.put<Product>(`/products/${id}`, data);
  }

  // Deletar produto
  static async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`/products/${id}`);
  }

  // Buscar produtos
  static async searchProducts(query: string, filters?: ProductFiltersType): Promise<ApiResponse<Product[]>> {
    const params = { q: query, ...filters };
    return httpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.SEARCH, { params });
  }

  // Obter categorias
  static async getCategories(): Promise<ApiResponse<ProductCategory[]>> {
    return httpClient.get<ProductCategory[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES);
  }

  // Obter produtos por categoria
  static async getProductsByCategory(categoryId: string, filters?: ProductFiltersType): Promise<ApiResponse<Product[]>> {
    const params = { categoryId, ...filters };
    return httpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.LIST, { params });
  }

  // Obter produtos personalizáveis
  static async getPersonalizableProducts(filters?: ProductFiltersType): Promise<ApiResponse<Product[]>> {
    const params = { isPersonalizable: true, ...filters };
    return httpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.LIST, { params });
  }

  // Obter produtos em destaque
  static async getFeaturedProducts(limit: number = 10): Promise<ApiResponse<Product[]>> {
    return httpClient.get<Product[]>(`/products/featured?limit=${limit}`);
  }

  // Obter produtos relacionados
  static async getRelatedProducts(productId: string, limit: number = 6): Promise<ApiResponse<Product[]>> {
    return httpClient.get<Product[]>(`/products/${productId}/related?limit=${limit}`);
  }

  // Obter produtos por franquia
  static async getProductsByFranchise(franchiseId: string, filters?: ProductFiltersType): Promise<ApiResponse<Product[]>> {
    const params = { franchiseId, ...filters };
    return httpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.LIST, { params });
  }

  // Atualizar estoque
  static async updateStock(productId: string, quantity: number): Promise<ApiResponse<Product>> {
    return httpClient.patch<Product>(`/products/${productId}/stock`, { quantity });
  }

  // Obter avaliações de um produto
  static async getProductReviews(productId: string): Promise<ApiResponse<ProductReview[]>> {
    return httpClient.get<ProductReview[]>(`/products/${productId}/reviews`);
  }

  // Adicionar avaliação
  static async addProductReview(productId: string, review: Omit<ProductReview, 'id' | 'productId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ProductReview>> {
    return httpClient.post<ProductReview>(`/products/${productId}/reviews`, review);
  }

  // Obter estatísticas dos produtos
  static async getProductStats(): Promise<ApiResponse<ProductStats>> {
    return httpClient.get<ProductStats>('/products/stats');
  }

  // Upload de imagem de produto
  static async uploadProductImage(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ url: string }>> {
    return httpClient.upload<{ url: string }>('/products/upload-image', file, onProgress);
  }

  // Exportar produtos
  static async exportProducts(format: 'csv' | 'excel' = 'csv', filters?: ProductFiltersType): Promise<ApiResponse<{ downloadUrl: string }>> {
    const params = { format, ...filters };
    return httpClient.get<{ downloadUrl: string }>('/products/export', { params });
  }

  // Validar dados de produto
  static validateProductData(data: Partial<CreateProductData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 3) {
      errors.push('Nome do produto deve ter pelo menos 3 caracteres');
    }

    if (!data.description || data.description.trim().length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }

    if (!data.shortDescription || data.shortDescription.trim().length < 5) {
      errors.push('Descrição curta deve ter pelo menos 5 caracteres');
    }

    if (!data.price || data.price <= 0) {
      errors.push('Preço deve ser maior que zero');
    }

    if (data.originalPrice && data.originalPrice <= data.price) {
      errors.push('Preço original deve ser maior que o preço atual');
    }

    if (!data.category || data.category.trim().length < 2) {
      errors.push('Categoria é obrigatória');
    }

    if (!data.sku || data.sku.trim().length < 3) {
      errors.push('SKU deve ter pelo menos 3 caracteres');
    }

    if (data.stockQuantity < 0) {
      errors.push('Quantidade em estoque não pode ser negativa');
    }

    if (!data.images || data.images.length === 0) {
      errors.push('Pelo menos uma imagem é obrigatória');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Formatar preço
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }

  // Calcular desconto
  static calculateDiscount(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  // Obter status de disponibilidade
  static getAvailabilityStatus(availability: string): { label: string; color: string } {
    switch (availability) {
      case 'in_stock':
        return { label: 'Em estoque', color: 'green' };
      case 'out_of_stock':
        return { label: 'Fora de estoque', color: 'red' };
      case 'pre_order':
        return { label: 'Pré-venda', color: 'blue' };
      default:
        return { label: 'Indisponível', color: 'gray' };
    }
  }

  // Obter categorias principais
  static getMainCategories(): Array<{ value: string; label: string; icon: string }> {
    return [
      { value: 'brinquedos', label: 'Brinquedos', icon: Gamepad2 },
      { value: 'roupas', label: 'Roupas', icon: Shirt },
      { value: 'acessorios', label: 'Acessórios', icon: GraduationCap },
      { value: 'decoracao', label: 'Decoração', icon: Home },
      { value: 'personalizados', label: 'Personalizados', icon: Sparkles },
    ];
  }
} 