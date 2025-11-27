/**
 * Tipos TypeScript para o módulo de Franquias
 */

export type FranchiseStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type FranchiseType = 'standard' | 'premium' | 'express';
export type LocationType = 'physical' | 'digital';

export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: LocationType;
}

export interface Territory {
  city: string;
  state: string;
  exclusive: boolean;
  radius?: number;
}

export interface CreateFranchiseDto {
  unitId: string;
  name: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  location: Location;
  status?: FranchiseStatus;
  type?: FranchiseType;
  territory?: Territory;
}

export interface FranchiseResponse {
  id: string;
  unitId: string;
  name: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  location: Location;
  status: FranchiseStatus;
  type: FranchiseType;
  territory?: Territory;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FranchiseMetrics {
  totalSales: number;
  totalOrders: number;
  totalLeads: number;
  customerCount: number;
  averageTicket: number;
  conversionRate: number;
  growthRate: number;
}

