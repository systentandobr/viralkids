// Tipos para o sistema de gerenciamento de unidades

export interface FranchiseLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'physical' | 'digital';
}

export interface FranchiseMetrics {
  totalOrders: number;
  totalSales: number;
  totalLeads: number;
  conversionRate: number;
  averageTicket: number;
  customerCount: number;
  growthRate: number;
  lastMonthSales: number;
  lastMonthOrders: number;
  lastMonthLeads: number;
}

export interface RegionalTrend {
  region: string;
  state: string;
  franchisesCount: number;
  totalSales: number;
  growthRate: number;
  averageTicket: number;
  leadsCount: number;
  conversionRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Franchise {
  id: string;
  name: string;
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  location: FranchiseLocation;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  type: 'standard' | 'premium' | 'express';
  createdAt: Date;
  updatedAt: Date;
  metrics: FranchiseMetrics;
  territory?: {
    city: string;
    state: string;
    exclusive: boolean;
    radius?: number; // em km
  };
}

export interface FranchiseFilter {
  status?: Franchise['status'][];
  type?: Franchise['type'][];
  state?: string[];
  city?: string[];
  search?: string;
}

