import { ApiResponse, httpClient } from "@/services/api/httpClient";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import { Brand } from "./types";
import { featuredBrands } from "./mockData";

export class BrandService {
    static async getBrands(): Promise<ApiResponse<Brand[]>> {
        return await httpClient.get(API_ENDPOINTS.BRANDS.LIST);
    }

    // Método para obter marcas em destaque (usando dados mock por enquanto)
    static async getFeaturedBrands(): Promise<ApiResponse<Brand[]>> {
        // Simula uma chamada de API com delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: featuredBrands.filter(brand => brand.isActive),
                    success: true,
                    message: 'Marcas em destaque carregadas com sucesso'
                });
            }, 500);
        });
    }

    // Método para obter marcas por nível de parceria
    static async getBrandsByPartnershipLevel(level: 'gold' | 'silver' | 'bronze'): Promise<ApiResponse<Brand[]>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const filteredBrands = featuredBrands.filter(
                    brand => brand.isActive && brand.partnershipLevel === level
                );
                resolve({
                    data: filteredBrands,
                    success: true,
                    message: `Marcas ${level} carregadas com sucesso`
                });
            }, 300);
        });
    }

    // Método para obter marcas por categoria
    static async getBrandsByCategory(category: Brand['category']): Promise<ApiResponse<Brand[]>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const filteredBrands = featuredBrands.filter(
                    brand => brand.isActive && brand.category === category
                );
                resolve({
                    data: filteredBrands,
                    success: true,
                    message: `Marcas da categoria ${category} carregadas com sucesso`
                });
            }, 300);
        });
    }

    // Método para obter estatísticas das marcas
    static async getBrandStats(): Promise<ApiResponse<{
        totalBrands: number;
        totalProducts: number;
        goldPartners: number;
        silverPartners: number;
        bronzePartners: number;
    }>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const activeBrands = featuredBrands.filter(brand => brand.isActive);
                const stats = {
                    totalBrands: activeBrands.length,
                    totalProducts: activeBrands.reduce((sum, brand) => sum + brand.productCount, 0),
                    goldPartners: activeBrands.filter(brand => brand.partnershipLevel === 'gold').length,
                    silverPartners: activeBrands.filter(brand => brand.partnershipLevel === 'silver').length,
                    bronzePartners: activeBrands.filter(brand => brand.partnershipLevel === 'bronze').length,
                };
                resolve({
                    data: stats,
                    success: true,
                    message: 'Estatísticas carregadas com sucesso'
                });
            }, 200);
        });
    }
}

