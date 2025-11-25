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

