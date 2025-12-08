
// Interfaces para produtos
export interface ProductImageReference {
  hashId: string;
  url: string;
  thumbnailUrl?: string;
  isThumbnail: boolean;
  order: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    price: number;
    originalPrice?: number;
    images: ProductImageReference[]; // Array de referências de imagens com hashId
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
  
  export interface CreateProductData {
    name: string;
    description: string;
    shortDescription: string;
    price: number;
    originalPrice?: number;
    images: Array<{ hashId: string }>; // Array de hashIds das imagens já enviadas
    category: string;
    supplierId?: string; // ID do fornecedor (obrigatório para catalog-products)
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
    images?: Array<{ hashId: string }>;
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