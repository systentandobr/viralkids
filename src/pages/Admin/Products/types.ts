// Tipos para gerenciamento de produtos

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  productCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
}

// Tipos para produtos afiliados
export type AffiliatePlatform = 
  | 'shopee' 
  | 'amazon' 
  | 'magalu' 
  | 'mercadolivre' 
  | 'americanas' 
  | 'casasbahia'
  | 'other';

export interface AffiliateProduct {
  id: string;
  categoryId: string;
  categoryName: string;
  affiliateUrl: string;
  platform: AffiliatePlatform;
  userId: string;
  unitId: string;
  processingStatus: ProcessingStatus;
  productId?: string; // ID do produto criado após processamento
  errorMessage?: string;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
}

export interface CreateAffiliateProductData {
  categoryId: string;
  affiliateUrl: string;
  platform: AffiliatePlatform;
}

export type ProcessingStatus = 
  | 'pending'      // Aguardando processamento
  | 'processing'   // Em processamento
  | 'completed'     // Processado com sucesso
  | 'failed'        // Falhou no processamento
  | 'retrying';     // Tentando novamente

export interface ProcessingMetrics {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  retrying: number;
}

export interface ProductProcessingQueue {
  id: string;
  affiliateProductId: string;
  status: ProcessingStatus;
  priority: number;
  attempts: number;
  maxAttempts: number;
  errorMessage?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para preview do scraper
export interface ScraperPreviewData {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category?: string;
  brand?: string;
  specifications?: Record<string, string>;
  tags?: string[];
  features?: string[];
  stockQuantity?: number;
  availability?: 'in_stock' | 'out_of_stock' | 'pre_order';
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ScraperPreviewResponse {
  success: boolean;
  data: ScraperPreviewData;
  platform: AffiliatePlatform;
  affiliateUrl: string;
}

// Tipos para gerenciamento de imagens
export interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isMain: boolean;
  order: number;
  thumbnail?: string;
}

export interface ImageManagerProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  maxImages?: number;
  allowUpload?: boolean;
}

// Tipos para controle de marketplace
export interface MarketplaceSettings {
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  visibleInCategories?: string[];
  hideFromCategories?: string[];
  showInHomepage?: boolean;
  showInCategoryPage?: boolean;
}

// Tipos para cadastro massivo
export interface BulkProductItem {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  images: ImageItem[];
  categoryId: string;
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
  marketplace: MarketplaceSettings;
  errors?: string[];
  isValid?: boolean;
}

export interface BulkProductImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    product: string;
    errors: string[];
  }>;
  products: BulkProductItem[];
}

export interface BulkProductCreateData {
  products: Omit<BulkProductItem, 'id' | 'errors' | 'isValid'>[];
  unitId: string;
}

export interface UpdateAffiliateProductData {
  categoryId?: string;
  affiliateUrl?: string;
  platform?: AffiliatePlatform;
}

export interface QueryAffiliateProductDto {
  page?: number;
  limit?: number;
  status?: ProcessingStatus;
  platform?: AffiliatePlatform;
  categoryId?: string;
}

