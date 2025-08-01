import { httpClient, ApiResponse } from '../api/httpClient';
import { API_ENDPOINTS } from '../api/config';

// Interfaces para produtos
export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  features: string[];
  specifications: Record<string, string>;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order';
  stockQuantity: number;
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  rating: number;
  reviewCount: number;
  isPersonalizable: boolean;
  personalizationOptions?: {
    colors: string[];
    sizes: string[];
    materials: string[];
    customText?: boolean;
    customImage?: boolean;
  };
  franchiseId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  parentId?: string;
  children?: ProductCategory[];
  productCount: number;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  availability?: string;
  isPersonalizable?: boolean;
  tags?: string[];
  search?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  franchiseId?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  features: string[];
  specifications: Record<string, string>;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order';
  stockQuantity: number;
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isPersonalizable: boolean;
  personalizationOptions?: {
    colors: string[];
    sizes: string[];
    materials: string[];
    customText?: boolean;
    customImage?: boolean;
  };
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  originalPrice?: number;
  images?: string[];
  category?: string;
  subcategory?: string;
  tags?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  availability?: 'in_stock' | 'out_of_stock' | 'pre_order';
  stockQuantity?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isPersonalizable?: boolean;
  personalizationOptions?: {
    colors: string[];
    sizes: string[];
    materials: string[];
    customText?: boolean;
    customImage?: boolean;
  };
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductStats {
  total: number;
  inStock: number;
  outOfStock: number;
  preOrder: number;
  personalizable: number;
  byCategory: Record<string, number>;
  averagePrice: number;
  topRated: Product[];
}

// Classe do serviço de produtos
export class ProductService {
  // Listar produtos
  static async listProducts(filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
    const params = filters ? { ...filters } : {};
    return httpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.LIST, { params });
  }

  // Obter detalhes de um produto
  static async getProduct(id: string): Promise<ApiResponse<Product>> {
    return httpClient.get<Product>(API_ENDPOINTS.PRODUCTS.DETAILS(id));
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
  static async searchProducts(query: string, filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
    const params = { q: query, ...filters };
    return httpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.SEARCH, { params });
  }

  // Obter categorias
  static async getCategories(): Promise<ApiResponse<ProductCategory[]>> {
    return httpClient.get<ProductCategory[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES);
  }

  // Obter produtos por categoria
  static async getProductsByCategory(categoryId: string, filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
    const params = { categoryId, ...filters };
    return httpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.LIST, { params });
  }

  // Obter produtos personalizáveis
  static async getPersonalizableProducts(filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
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
  static async getProductsByFranchise(franchiseId: string, filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
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
  static async exportProducts(format: 'csv' | 'excel' = 'csv', filters?: ProductFilters): Promise<ApiResponse<{ downloadUrl: string }>> {
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
      { value: 'brinquedos', label: 'Brinquedos', icon: '🎮' },
      { value: 'roupas', label: 'Roupas', icon: '👕' },
      { value: 'acessorios', label: 'Acessórios', icon: '🎒' },
      { value: 'decoracao', label: 'Decoração', icon: '🏠' },
      { value: 'personalizados', label: 'Personalizados', icon: '✨' },
    ];
  }
} 