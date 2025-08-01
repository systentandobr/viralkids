// Types for Ecommerce System

import { LucideIcon } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  brand: string;
  images: string[];
  thumbnail: string;
  inStock: boolean;
  stockQuantity: number;
  minAge?: number;
  maxAge?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isExclusive?: boolean;
  colors?: string[];
  sizes?: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  franchiseId: string;
  franchiseName: string;
  franchiseLocation: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: LucideIcon;
  color: string;
  parentId?: string;
  subcategories?: ProductCategory[];
  productCount: number;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  itemCount: number;
}

export interface ProductFiltersType {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  minAge?: number;
  maxAge?: number;
  colors?: string[];
  sizes?: string[];
  rating?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  franchiseId?: string;
  tags?: string[];
}

export interface ProductSort {
  field: 'name' | 'price' | 'rating' | 'createdAt' | 'popularity';
  direction: 'asc' | 'desc';
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  filters: ProductFiltersType;
  sort: ProductSort;
}

export interface Franchise {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  logo?: string;
  description: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
  updatedAt: string;
  products: Product[];
  stats: {
    totalProducts: number;
    totalSales: number;
    rating: number;
    reviewCount: number;
  };
}

export interface Order {
  id: string;
  userId: string;
  franchiseId: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'pix' | 'bank_slip';
  shipping: {
    method: 'pickup' | 'delivery' | 'mail';
    address?: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
    cost: number;
    estimatedDelivery?: string;
    trackingCode?: string;
  };
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: CustomerAddress[];
  defaultAddressId?: string;
  orders: Order[];
  wishlist: string[]; // Product IDs
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    theme: 'light' | 'dark';
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  id: string;
  name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form types
export interface CheckoutFormData {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    method: 'pickup' | 'delivery' | 'mail';
    address?: CustomerAddress;
  };
  payment: {
    method: 'credit_card' | 'debit_card' | 'pix' | 'bank_slip';
    cardData?: {
      number: string;
      holder: string;
      expiry: string;
      cvv: string;
    };
  };
  notes?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  images: File[];
  stockQuantity: number;
  minAge?: number;
  maxAge?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  colors?: string[];
  sizes?: string[];
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
}

// Event types
export interface EcommerceEvent {
  type: 'product_view' | 'add_to_cart' | 'remove_from_cart' | 'purchase' | 'search';
  productId?: string;
  query?: string;
  value?: number;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

// Analytics types
export interface ProductAnalytics {
  productId: string;
  views: number;
  addToCarts: number;
  purchases: number;
  conversionRate: number;
  revenue: number;
  period: 'day' | 'week' | 'month' | 'year';
}

export interface FranchiseAnalytics {
  franchiseId: string;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: { productId: string; sales: number; revenue: number }[];
  period: 'day' | 'week' | 'month' | 'year';
}
