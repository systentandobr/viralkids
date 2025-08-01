// Tipos para o sistema de fornecedores

export interface Supplier {
  id: string;
  name: string;
  description: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  email?: string;
  phone?: string;
  location: SupplierLocation;
  businessInfo: BusinessInfo;
  products: ProductCategory[];
  policies: SupplierPolicies;
  rating: SupplierRating;
  verified: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierLocation {
  state: string;
  city: string;
  neighborhood?: string;
  fullAddress?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface BusinessInfo {
  cnpj?: string;
  requiresCNPJ: boolean;
  businessType: 'fabricante' | 'distribuidor' | 'atacado' | 'varejo';
  establishedYear?: number;
  employeeCount?: number;
  certifications: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  subCategories: string[];
  gender: 'meninos' | 'meninas' | 'unissex';
  ageGroups: AgeGroup[];
  sizes: string[];
  style: string[];
  priceRange: PriceRange;
}

export type AgeGroup = 
  | '0-6m' 
  | '6-12m' 
  | '1-2a' 
  | '2-4a' 
  | '4-6a' 
  | '6-8a' 
  | '8-10a' 
  | '10-12a' 
  | '12-14a' 
  | '14-16a';

export interface PriceRange {
  min: number;
  max: number;
  currency: 'BRL';
}

export interface SupplierPolicies {
  minimumOrder: number;
  paymentMethods: PaymentMethod[];
  deliveryTime: number; // dias
  exchangePolicy: boolean;
  warrantyMonths: number;
  bulkDiscounts: BulkDiscount[];
}

export type PaymentMethod = 
  | 'pix' 
  | 'credit_card' 
  | 'debit_card' 
  | 'bank_transfer' 
  | 'cash' 
  | 'check';

export interface BulkDiscount {
  minQuantity: number;
  discountPercentage: number;
}

export interface SupplierRating {
  overall: number;
  quality: number;
  delivery: number;
  service: number;
  value: number;
  totalReviews: number;
}

export interface SupplierReview {
  id: string;
  supplierId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  verified: boolean;
  createdAt: Date;
  helpfulVotes: number;
}

export interface SupplierFilter {
  states?: string[];
  cities?: string[];
  categories?: string[];
  genders?: string[];
  ageGroups?: AgeGroup[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  verified?: boolean;
  featured?: boolean;
  requiresCNPJ?: boolean;
  paymentMethods?: PaymentMethod[];
}

export interface SupplierContact {
  id: string;
  supplierId: string;
  franchiseeId: string;
  type: 'inquiry' | 'order' | 'support' | 'partnership';
  subject: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  respondedAt?: Date;
  notes: ContactNote[];
}

export interface ContactNote {
  id: string;
  authorId: string;
  authorType: 'supplier' | 'franchisee' | 'admin';
  message: string;
  isInternal: boolean;
  createdAt: Date;
}

export interface SupplierMetrics {
  totalSuppliers: number;
  verifiedSuppliers: number;
  averageRating: number;
  topStates: StateMetric[];
  topCategories: CategoryMetric[];
  recentContacts: number;
  activePartnerships: number;
}

export interface StateMetric {
  state: string;
  count: number;
  percentage: number;
}

export interface CategoryMetric {
  category: string;
  count: number;
  averageRating: number;
}

export interface SupplierImport {
  id: string;
  fileName: string;
  source: 'json' | 'csv' | 'xlsx' | 'manual';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: ImportError[];
  createdAt: Date;
  completedAt?: Date;
}

export interface ImportError {
  row: number;
  field: string;
  value: any;
  error: string;
  suggestion?: string;
}
