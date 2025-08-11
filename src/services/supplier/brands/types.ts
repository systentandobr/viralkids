export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  isActive: boolean;
  productCount: number;
  // Novos campos baseados nos dados reais
  location: string;
  instagram?: string;
  website?: string;
  category: 'clothing' | 'accessories' | 'toys' | 'shoes' | 'mixed';
  gender: 'meninas' | 'meninos' | 'unisex';
  partnershipLevel: 'gold' | 'silver' | 'bronze'; // Para rankeamento
  featuredUntil?: string; // Data até quando está em destaque
}