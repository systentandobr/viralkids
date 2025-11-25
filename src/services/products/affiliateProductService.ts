import { httpClient } from '../api/httpClient';
import { ApiResponse } from '../api/types';
import {
  AffiliateProduct,
  CreateAffiliateProductData,
  UpdateAffiliateProductData,
  ProcessingMetrics,
  QueryAffiliateProductDto,
  ScraperPreviewResponse,
  ScraperPreviewData,
} from '@/pages/Admin/Products/types';

const API_BASE = '/affiliate-products';

export class AffiliateProductService {
  /**
   * Obter preview dos dados do scraper sem criar produto
   */
  static async preview(
    data: CreateAffiliateProductData
  ): Promise<ApiResponse<ScraperPreviewResponse>> {
    return httpClient.post<ScraperPreviewResponse>(`${API_BASE}/preview`, data);
  }

  /**
   * Criar novo produto afiliado com dados editados do preview
   */
  static async createFromPreview(
    affiliateProductId: string,
    editedData: ScraperPreviewData
  ): Promise<ApiResponse<AffiliateProduct>> {
    return httpClient.post<AffiliateProduct>(
      `${API_BASE}/${affiliateProductId}/create-product`,
      editedData
    );
  }

  /**
   * Criar novo produto afiliado
   */
  static async create(
    data: CreateAffiliateProductData
  ): Promise<ApiResponse<AffiliateProduct>> {
    return httpClient.post<AffiliateProduct>(API_BASE, data);
  }

  /**
   * Listar produtos afiliados
   */
  static async list(
    query?: QueryAffiliateProductDto
  ): Promise<ApiResponse<{ items: AffiliateProduct[]; total: number; page: number; limit: number }>> {
    return httpClient.get<{ items: AffiliateProduct[]; total: number; page: number; limit: number }>(
      API_BASE,
      { params: query }
    );
  }

  /**
   * Buscar produto afiliado por ID
   */
  static async getById(id: string): Promise<ApiResponse<AffiliateProduct>> {
    return httpClient.get<AffiliateProduct>(`${API_BASE}/${id}`);
  }

  /**
   * Atualizar produto afiliado
   */
  static async update(
    id: string,
    data: UpdateAffiliateProductData
  ): Promise<ApiResponse<AffiliateProduct>> {
    return httpClient.patch<AffiliateProduct>(`${API_BASE}/${id}`, data);
  }

  /**
   * Deletar produto afiliado
   */
  static async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return httpClient.delete<{ success: boolean }>(`${API_BASE}/${id}`);
  }

  /**
   * Retentar processamento de produto que falhou
   */
  static async retry(id: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return httpClient.post<{ success: boolean; message: string }>(`${API_BASE}/${id}/retry`);
  }

  /**
   * Obter métricas de processamento
   */
  static async getMetrics(): Promise<ApiResponse<ProcessingMetrics>> {
    return httpClient.get<ProcessingMetrics>(`${API_BASE}/metrics`);
  }
}

