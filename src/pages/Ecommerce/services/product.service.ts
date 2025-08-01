import { 
  Product, 
  ProductCategory, 
  ProductFilters, 
  ProductSort, 
  ProductSearchResult,
  ApiResponse,
  PaginatedResponse
} from '../types/ecommerce.types';

// Simulação de dados (será substituído por API real)
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Vestido Infantil Princesa',
    description: 'Lindo vestido infantil com tema de princesa, perfeito para festas e ocasiões especiais.',
    price: 89.90,
    originalPrice: 119.90,
    discount: 25,
    category: 'roupas',
    brand: 'Little Princess',
    images: [
      '/api/placeholder/400/400',
      '/api/placeholder/400/400',
      '/api/placeholder/400/400'
    ],
    thumbnail: '/api/placeholder/300/300',
    inStock: true,
    stockQuantity: 15,
    minAge: 2,
    maxAge: 8,
    colors: ['Rosa', 'Azul', 'Lilás'],
    sizes: ['2 anos', '4 anos', '6 anos', '8 anos'],
    tags: ['festa', 'princesa', 'elegante'],
    rating: 4.8,
    reviewCount: 24,
    isFeatured: true,
    isNew: false,
    franchiseId: 'franchise-1',
    franchiseName: 'Kids Fashion Store',
    franchiseLocation: 'São Paulo, SP',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z'
  },
  {
    id: '2',
    name: 'Conjunto Menino Aventureiro',
    description: 'Conjunto completo para meninos aventureiros, com camiseta e bermuda em tecido confortável.',
    price: 65.50,
    originalPrice: 85.00,
    discount: 23,
    category: 'roupas',
    brand: 'Adventure Kids',
    images: [
      '/api/placeholder/400/400',
      '/api/placeholder/400/400'
    ],
    thumbnail: '/api/placeholder/300/300',
    inStock: true,
    stockQuantity: 8,
    minAge: 3,
    maxAge: 10,
    colors: ['Verde', 'Azul Marinho', 'Cinza'],
    sizes: ['3 anos', '4 anos', '6 anos', '8 anos', '10 anos'],
    tags: ['aventura', 'confortável', 'casual'],
    rating: 4.5,
    reviewCount: 18,
    isFeatured: false,
    isNew: true,
    franchiseId: 'franchise-2',
    franchiseName: 'Mundo Kids',
    franchiseLocation: 'Rio de Janeiro, RJ',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-22T16:20:00Z'
  },
  {
    id: '3',
    name: 'Boneca Educativa Inteligente',
    description: 'Boneca interativa que ensina números, letras e cores através de jogos divertidos.',
    price: 159.90,
    category: 'brinquedos',
    brand: 'Smart Toys',
    images: [
      '/api/placeholder/400/400',
      '/api/placeholder/400/400',
      '/api/placeholder/400/400',
      '/api/placeholder/400/400'
    ],
    thumbnail: '/api/placeholder/300/300',
    inStock: true,
    stockQuantity: 12,
    minAge: 3,
    maxAge: 7,
    tags: ['educativo', 'interativo', 'aprendizado'],
    rating: 4.9,
    reviewCount: 35,
    isFeatured: true,
    isNew: true,
    franchiseId: 'franchise-3',
    franchiseName: 'Brinquedos Educativos',
    franchiseLocation: 'Belo Horizonte, MG',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-25T13:30:00Z'
  },
  {
    id: '4',
    name: 'Mochila Escolar Colorida',
    description: 'Mochila resistente e colorida, ideal para a escola com compartimentos organizadores.',
    price: 78.90,
    originalPrice: 95.00,
    discount: 17,
    category: 'acessorios',
    brand: 'School Bags',
    images: [
      '/api/placeholder/400/400',
      '/api/placeholder/400/400'
    ],
    thumbnail: '/api/placeholder/300/300',
    inStock: true,
    stockQuantity: 20,
    minAge: 5,
    maxAge: 12,
    colors: ['Rosa', 'Azul', 'Verde', 'Roxo'],
    tags: ['escola', 'organizador', 'resistente'],
    rating: 4.3,
    reviewCount: 12,
    isFeatured: false,
    isNew: false,
    franchiseId: 'franchise-1',
    franchiseName: 'Kids Fashion Store',
    franchiseLocation: 'São Paulo, SP',
    createdAt: '2024-01-10T08:45:00Z',
    updatedAt: '2024-01-15T10:20:00Z'
  },
  {
    id: '5',
    name: 'Kit de Arte Criativa',
    description: 'Kit completo com lápis de cor, giz de cera, canetinhas e papel para desenvolver a criatividade.',
    price: 45.90,
    category: 'brinquedos',
    brand: 'Arte Kids',
    images: [
      '/api/placeholder/400/400',
      '/api/placeholder/400/400',
      '/api/placeholder/400/400'
    ],
    thumbnail: '/api/placeholder/300/300',
    inStock: true,
    stockQuantity: 25,
    minAge: 4,
    maxAge: 12,
    tags: ['arte', 'criatividade', 'educativo'],
    rating: 4.6,
    reviewCount: 28,
    isFeatured: false,
    isNew: true,
    franchiseId: 'franchise-2',
    franchiseName: 'Mundo Kids',
    franchiseLocation: 'Rio de Janeiro, RJ',
    createdAt: '2024-01-22T14:30:00Z',
    updatedAt: '2024-01-25T09:15:00Z'
  }
];

const mockCategories: ProductCategory[] = [
  {
    id: 'roupas',
    name: 'Roupas',
    slug: 'roupas',
    description: 'Roupas infantis para todas as idades',
    image: '/api/placeholder/200/200',
    icon: '👕',
    productCount: 2,
    isActive: true
  },
  {
    id: 'brinquedos',
    name: 'Brinquedos',
    slug: 'brinquedos',
    description: 'Brinquedos educativos e divertidos',
    image: '/api/placeholder/200/200',
    icon: '🧸',
    productCount: 2,
    isActive: true
  },
  {
    id: 'acessorios',
    name: 'Acessórios',
    slug: 'acessorios',
    description: 'Acessórios e utilitários para crianças',
    image: '/api/placeholder/200/200',
    icon: '🎒',
    productCount: 1,
    isActive: true
  }
];

export class ProductService {
  // Obter todos os produtos
  static async getAllProducts(): Promise<ApiResponse<Product[]>> {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        data: mockProducts,
        statusCode: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error.message,
        statusCode: 500
      };
    }
  }

  // Obter produto por ID
  static async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const product = mockProducts.find(p => p.id === id);
      
      if (!product) {
        return {
          success: false,
          data: {} as Product,
          error: 'Produto não encontrado',
          statusCode: 404
        };
      }

      return {
        success: true,
        data: product,
        statusCode: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Product,
        error: error.message,
        statusCode: 500
      };
    }
  }

  // Buscar produtos
  static async searchProducts(
    query: string,
    filters?: ProductFilters,
    sort?: ProductSort,
    page: number = 1,
    limit: number = 12
  ): Promise<ApiResponse<ProductSearchResult>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      // Aplicar filtros se fornecidos
      if (filters) {
        filteredProducts = this.applyFilters(filteredProducts, filters);
      }

      // Aplicar ordenação se fornecida
      if (sort) {
        filteredProducts = this.applySorting(filteredProducts, sort);
      }

      // Aplicar paginação
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      const result: ProductSearchResult = {
        products: paginatedProducts,
        total: filteredProducts.length,
        page,
        limit,
        hasMore: endIndex < filteredProducts.length,
        filters: filters || {},
        sort: sort || { field: 'name', direction: 'asc' }
      };

      return {
        success: true,
        data: result,
        statusCode: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as ProductSearchResult,
        error: error.message,
        statusCode: 500
      };
    }
  }

  // Obter produtos por categoria
  static async getProductsByCategory(categoryId: string): Promise<ApiResponse<Product[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const products = mockProducts.filter(product => product.category === categoryId);
      
      return {
        success: true,
        data: products,
        statusCode: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error.message,
        statusCode: 500
      };
    }
  }

  // Obter categorias
  static async getCategories(): Promise<ApiResponse<ProductCategory[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        success: true,
        data: mockCategories,
        statusCode: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error.message,
        statusCode: 500
      };
    }
  }

  // Obter produtos em destaque
  static async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const featuredProducts = mockProducts.filter(product => product.isFeatured);
      
      return {
        success: true,
        data: featuredProducts,
        statusCode: 200
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error.message,
        statusCode: 500
      };
    }
  }

  // Aplicar filtros
  private static applyFilters(products: Product[], filters: ProductFilters): Product[] {
    return products.filter(product => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;
      if (filters.brand && product.brand !== filters.brand) return false;
      if (filters.inStock === true && !product.inStock) return false;
      if (filters.minAge && product.minAge && product.minAge < filters.minAge) return false;
      if (filters.maxAge && product.maxAge && product.maxAge > filters.maxAge) return false;
      if (filters.rating && product.rating < filters.rating) return false;
      if (filters.isNew === true && !product.isNew) return false;
      if (filters.isFeatured === true && !product.isFeatured) return false;
      if (filters.franchiseId && product.franchiseId !== filters.franchiseId) return false;
      
      return true;
    });
  }

  // Aplicar ordenação
  private static applySorting(products: Product[], sort: ProductSort): Product[] {
    const sorted = [...products].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sort.field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'popularity':
          aValue = a.reviewCount;
          bValue = b.reviewCount;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }
}