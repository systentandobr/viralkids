import { Product } from '@/pages/Ecommerce/types/ecommerce.types';

// Tipos específicos para a página de detalhes do produto

export interface ProductVariation {
  id: string;
  type: 'color' | 'size' | 'material' | 'style';
  name: string;
  value: string;
  displayValue: string;
  available: boolean;
  price?: number; // Preço diferente se aplicável
  images?: string[]; // Imagens específicas da variação
  stock: number;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
  unit: 'cm' | 'mm' | 'in';
  weightUnit: 'g' | 'kg' | 'lb';
}

export interface SizeGuide {
  id: string;
  category: string; // 'clothing', 'shoes', 'accessories'
  sizes: SizeChart[];
  instructions: string[];
  videoUrl?: string;
}

export interface SizeChart {
  size: string;
  chest?: number;
  waist?: number;
  hips?: number;
  length?: number;
  sleeve?: number;
  inseam?: number;
  foot?: number;
  head?: number;
  age?: string;
  weight?: string;
  unit: 'cm' | 'in';
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  videos?: string[];
  pros?: string[];
  cons?: string[];
  verified: boolean;
  helpful: number;
  notHelpful: number;
  size?: string;
  color?: string;
  fit?: 'small' | 'perfect' | 'large';
  quality?: number;
  delivery?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQuestion {
  id: string;
  userId: string;
  userName: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  helpful: number;
  createdAt: string;
}

export interface ProductDetailData extends Product {
  variations: ProductVariation[];
  dimensions?: ProductDimensions;
  sizeGuide?: SizeGuide;
  reviews: ProductReview[];
  questions: ProductQuestion[];
  specifications: { [key: string]: string };
  materials: string[];
  careInstructions: string[];
  warranty: string;
  origin: string;
  shipping: {
    freeShipping: boolean;
    minOrderValue?: number;
    estimatedDays: number;
    methods: string[];
  };
  relatedProducts: string[]; // Product IDs
  categoryPath: string[];
  brandInfo: {
    name: string;
    logo: string;
    description: string;
    website?: string;
  };
  availability: {
    inStock: boolean;
    quantity: number;
    preOrder?: {
      available: boolean;
      estimatedDate?: string;
    };
    restockDate?: string;
  };
}

export interface SelectedVariations {
  [key: string]: string; // type -> value
}

export interface ZoomImageProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export interface ProductImageGalleryProps {
  images: string[];
  selectedVariation?: SelectedVariations;
  productName: string;
}

export interface ReviewsProps {
  reviews: ProductReview[];
  productId: string;
  onAddReview?: (review: Omit<ProductReview, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export interface SizeGuideProps {
  sizeGuide?: SizeGuide;
  selectedSize?: string;
  onSizeSelect: (size: string) => void;
}

export interface ProductInfoProps {
  product: ProductDetailData;
  selectedVariations: SelectedVariations;
  onVariationChange: (type: string, value: string) => void;
  onAddToCart: (quantity: number) => void;
}

export interface RelatedProductsProps {
  productIds: string[];
  currentProductId: string;
}

// Tipos para analytics e tracking
export interface ProductViewEvent {
  productId: string;
  productName: string;
  category: string;
  brand: string;
  price: number;
  userId?: string;
  sessionId: string;
  timestamp: string;
  source: string; // 'search', 'category', 'related', 'direct'
}

export interface ProductInteractionEvent {
  type: 'image_zoom' | 'variation_change' | 'size_guide_open' | 'review_helpful' | 'question_ask';
  productId: string;
  details: { [key: string]: any };
  timestamp: string;
}

// Tipos para filtros e ordenação de reviews
export interface ReviewFilters {
  rating?: number;
  verified?: boolean;
  withImages?: boolean;
  size?: string;
  color?: string;
  fit?: 'small' | 'perfect' | 'large';
}

export interface ReviewSort {
  field: 'date' | 'rating' | 'helpful';
  direction: 'asc' | 'desc';
}

// Interface para o hook de produto
export interface UseProductDetailReturn {
  product: ProductDetailData | null;
  loading: boolean;
  error: string | null;
  selectedVariations: SelectedVariations;
  selectedQuantity: number;
  availableStock: number;
  currentPrice: number;
  selectedImages: string[];
  setSelectedVariations: (variations: SelectedVariations) => void;
  setSelectedQuantity: (quantity: number) => void;
  addToCart: () => void;
  addToWishlist: () => void;
  shareProduct: (method: string) => void;
  trackView: () => void;
  trackInteraction: (event: ProductInteractionEvent) => void;
}

// Interface para estados da UI
export interface ProductDetailUIState {
  imageGalleryIndex: number;
  isZoomOpen: boolean;
  zoomImage: string;
  activeTab: 'description' | 'reviews' | 'questions' | 'specifications';
  isSizeGuideOpen: boolean;
  isShareModalOpen: boolean;
  showAllReviews: boolean;
  reviewFilters: ReviewFilters;
  reviewSort: ReviewSort;
}