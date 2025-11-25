import { httpClient } from '../api/httpClient';
import { ApiResponse } from '../api/types';
import {
  BulkProductItem,
  BulkProductCreateData,
  BulkProductImportResult,
} from '@/pages/Admin/Products/types';
import { CreateProductData } from './types';

const API_BASE = '/products';

export class BulkProductService {
  /**
   * Criar múltiplos produtos em lote
   */
  static async createBulk(
    data: BulkProductCreateData
  ): Promise<ApiResponse<{ created: number; failed: number; errors: any[] }>> {
    return httpClient.post<{ created: number; failed: number; errors: any[] }>(
      `${API_BASE}/bulk`,
      data
    );
  }

  /**
   * Importar produtos de arquivo CSV/Excel
   */
  static async importFromFile(
    file: File,
    unitId: string
  ): Promise<ApiResponse<BulkProductImportResult>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('unitId', unitId);

    return httpClient.post<BulkProductImportResult>(
      `${API_BASE}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  /**
   * Validar produtos antes de criar
   */
  static async validateProducts(
    products: BulkProductItem[]
  ): Promise<ApiResponse<{ valid: BulkProductItem[]; invalid: BulkProductItem[] }>> {
    return httpClient.post<{ valid: BulkProductItem[]; invalid: BulkProductItem[] }>(
      `${API_BASE}/validate-bulk`,
      { products }
    );
  }

  /**
   * Converter BulkProductItem para CreateProductData
   */
  static convertToCreateProductData(
    item: BulkProductItem,
    unitId: string
  ): CreateProductData {
    return {
      name: item.name,
      description: item.description,
      shortDescription: item.shortDescription,
      price: item.price,
      originalPrice: item.originalPrice,
      images: item.images.map((img) => img.url),
      category: item.categoryId,
      subcategory: item.subcategory,
      tags: item.tags,
      features: item.features,
      specifications: item.specifications,
      availability: item.availability,
      stockQuantity: item.stockQuantity,
      sku: item.sku,
      weight: item.weight,
      dimensions: item.dimensions,
      isPersonalizable: item.isPersonalizable,
      personalizationOptions: item.personalizationOptions,
    };
  }
}

