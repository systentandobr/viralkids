import { useQuery } from '@tanstack/react-query';
import { BrandService } from '../brandService';
import { Brand } from '../types';

export const useFeaturedBrands = () => {
  return useQuery({
    queryKey: ['featured-brands'],
    queryFn: async () => {
      const response = await BrandService.getFeaturedBrands();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useBrandsByPartnershipLevel = (level: 'gold' | 'silver' | 'bronze') => {
  return useQuery({
    queryKey: ['brands-by-level', level],
    queryFn: async () => {
      const response = await BrandService.getBrandsByPartnershipLevel(level);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useBrandsByCategory = (category: Brand['category']) => {
  return useQuery({
    queryKey: ['brands-by-category', category],
    queryFn: async () => {
      const response = await BrandService.getBrandsByCategory(category);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useBrandStats = () => {
  return useQuery({
    queryKey: ['brand-stats'],
    queryFn: async () => {
      const response = await BrandService.getBrandStats();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
}; 