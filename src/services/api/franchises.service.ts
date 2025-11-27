import { httpClient } from './httpClient';
import { API_ENDPOINTS } from './endpoints';
import { CreateFranchiseDto, FranchiseResponse } from '../../types/franchise.types';

/**
 * Serviço para operações relacionadas a franquias
 * Utiliza o httpClient centralizado para garantir autenticação e tratamento de erros consistentes
 */
export const franchisesService = {
  /**
   * Cria uma nova franquia
   */
  async createFranchise(data: CreateFranchiseDto): Promise<FranchiseResponse> {
    try {
      const response = await httpClient.post<FranchiseResponse>(
        API_ENDPOINTS.FRANCHISES.CREATE,
        data
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erro ao criar franquia');
      }

      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar franquia:', error);
      // Se o erro já tem uma mensagem, propagar diretamente
      if (error instanceof Error) {
        throw error;
      }
      // Se for um erro do httpClient (ApiResponse com success: false), criar Error
      if (error && typeof error === 'object' && 'error' in error) {
        throw new Error(error.error || 'Erro ao criar franquia');
      }
      // Caso padrão
      throw new Error(error?.message || 'Erro ao criar franquia');
    }
  },

  /**
   * Lista todas as franquias com filtros opcionais
   */
  async getFranchises(filters?: {
    search?: string;
    status?: string;
    state?: string;
    city?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: FranchiseResponse[]; total: number }> {
    try {
      const response = await httpClient.get<{ data: FranchiseResponse[]; total: number }>(
        API_ENDPOINTS.FRANCHISES.LIST,
        { params: filters }
      );

      if (!response.success) {
        throw new Error(response.error || 'Erro ao listar franquias');
      }

      // Se a resposta já tem a estrutura esperada { data: [], total: number }, retornar diretamente
      if (
        response.data &&
        typeof response.data === 'object' &&
        'data' in response.data &&
        'total' in response.data &&
        Array.isArray((response.data as any).data)
      ) {
        return response.data as { data: FranchiseResponse[]; total: number };
      }

      // Se for um array direto, envolver na estrutura esperada
      if (Array.isArray(response.data)) {
        return {
          data: response.data as FranchiseResponse[],
          total: response.data.length,
        };
      }

      // Caso padrão: retornar estrutura vazia ou com dados únicos
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        // Verificar se é um único objeto FranchiseResponse (tem propriedades como id, name, etc)
        const dataObj = response.data as any;
        if ('id' in dataObj && 'name' in dataObj && 'unitId' in dataObj) {
          // É um único FranchiseResponse
          return {
            data: [dataObj as FranchiseResponse],
            total: 1,
          };
        }
      }

      // Retornar estrutura vazia se não houver dados
      return {
        data: [],
        total: 0,
      };
    } catch (error: any) {
      console.error('Erro ao listar franquias:', error);
      if (error instanceof Error) {
        throw error;
      }
      if (error && typeof error === 'object' && 'error' in error) {
        throw new Error(error.error || 'Erro ao listar franquias');
      }
      throw new Error(error?.message || 'Erro ao listar franquias');
    }
  },

  /**
   * Obtém uma franquia por ID
   */
  async getFranchiseById(id: string): Promise<FranchiseResponse> {
    try {
      const response = await httpClient.get<FranchiseResponse>(
        API_ENDPOINTS.FRANCHISES.DETAIL(id)
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erro ao obter franquia');
      }

      return response.data;
    } catch (error: any) {
      console.error('Erro ao obter franquia:', error);
      if (error instanceof Error) {
        throw error;
      }
      if (error && typeof error === 'object' && 'error' in error) {
        throw new Error(error.error || 'Erro ao obter franquia');
      }
      throw new Error(error?.message || 'Erro ao obter franquia');
    }
  },

  /**
   * Atualiza uma franquia
   */
  async updateFranchise(
    id: string,
    data: Partial<CreateFranchiseDto>
  ): Promise<FranchiseResponse> {
    try {
      const response = await httpClient.patch<FranchiseResponse>(
        API_ENDPOINTS.FRANCHISES.UPDATE(id),
        data
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erro ao atualizar franquia');
      }

      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar franquia:', error);
      if (error instanceof Error) {
        throw error;
      }
      if (error && typeof error === 'object' && 'error' in error) {
        throw new Error(error.error || 'Erro ao atualizar franquia');
      }
      throw new Error(error?.message || 'Erro ao atualizar franquia');
    }
  },

  /**
   * Remove uma franquia
   */
  async deleteFranchise(id: string): Promise<void> {
    try {
      const response = await httpClient.delete<void>(
        API_ENDPOINTS.FRANCHISES.DELETE(id)
      );

      if (!response.success) {
        throw new Error(response.error || 'Erro ao deletar franquia');
      }
    } catch (error: any) {
      console.error('Erro ao deletar franquia:', error);
      if (error instanceof Error) {
        throw error;
      }
      if (error && typeof error === 'object' && 'error' in error) {
        throw new Error(error.error || 'Erro ao deletar franquia');
      }
      throw new Error(error?.message || 'Erro ao deletar franquia');
    }
  },

  /**
   * Obtém métricas de uma franquia
   */
  async getFranchiseMetrics(id: string): Promise<any> {
    try {
      const response = await httpClient.get<any>(
        API_ENDPOINTS.FRANCHISES.METRICS(id)
      );

      if (!response.success) {
        throw new Error(response.error || 'Erro ao obter métricas da franquia');
      }

      return response.data;
    } catch (error: any) {
      console.error('Erro ao obter métricas da franquia:', error);
      if (error instanceof Error) {
        throw error;
      }
      if (error && typeof error === 'object' && 'error' in error) {
        throw new Error(error.error || 'Erro ao obter métricas da franquia');
      }
      throw new Error(error?.message || 'Erro ao obter métricas da franquia');
    }
  },
};

export default franchisesService;
