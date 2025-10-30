
// Interfaces para franquias
export interface Franchise {
    id: string;
    name: string;
    owner: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
    location: {
      city: string;
      state: string;
      address: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    type: 'standard' | 'premium' | 'express';
    createdAt: Date;
    updatedAt: Date;
    metrics?: {
      totalSales: number;
      totalOrders: number;
      averageRating: number;
      customerCount: number;
    };
  }
  
  export interface FranchiseApplication {
    id: string;
    applicant: {
      name: string;
      email: string;
      phone: string;
      city: string;
      state: string;
    };
    franchiseType: 'standard' | 'premium' | 'express';
    experience: string;
    budget: string;
    timeToStart: string;
    status: 'pending' | 'approved' | 'rejected' | 'interviewed';
    createdAt: Date;
    updatedAt: Date;
    notes?: string;
  }
  
  export interface CreateFranchiseData {
    name: string;
    ownerId: string;
    location: {
      city: string;
      state: string;
      address: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    type: 'standard' | 'premium' | 'express';
  }
  
  export interface UpdateFranchiseData {
    name?: string;
    location?: {
      city: string;
      state: string;
      address: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    status?: 'active' | 'inactive' | 'suspended';
  }
  
  export interface FranchiseFilters {
    status?: string;
    type?: string;
    state?: string;
    city?: string;
    search?: string;
  }
  
  export interface FranchiseStats {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    suspended: number;
    byType: {
      standard: number;
      premium: number;
      express: number;
    };
    byState: Record<string, number>;
    topPerformers: Franchise[];
  }