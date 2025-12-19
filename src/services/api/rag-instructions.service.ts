import { httpClient, ApiResponse } from './httpClient';
import { API_ENDPOINTS } from './endpoints';

export interface RagInstruction {
  id: string;
  unitId: string;
  instructions: string[];
  sourceType?: 'text' | 'url' | 'pdf';
  sourceUrl?: string;
  sourceFileName?: string;
  sourceFileId?: string;
  rawContent?: string;
  context?: {
    products?: any[];
    campaigns?: any[];
    customers?: any[];
    trainings?: any[];
    [key: string]: any;
  };
  metadata?: {
    version?: string;
    author?: string;
    description?: string;
    title?: string;
    tags?: string[];
    processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
    processingError?: string;
    indexedInRAG?: boolean;
    ragIndexedAt?: Date;
    [key: string]: any;
  };
  active: boolean;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRagInstructionFromTextDto {
  content: string;
  title?: string;
  context?: any;
  metadata?: any;
  active?: boolean;
  indexInRAG?: boolean;
}

export interface CreateRagInstructionFromUrlDto {
  url: string;
  title?: string;
  context?: any;
  metadata?: any;
  active?: boolean;
  indexInRAG?: boolean;
}

export interface CreateRagInstructionFromPdfDto {
  title?: string;
  context?: any;
  metadata?: any;
  active?: boolean;
  indexInRAG?: boolean;
}

export interface UpdateRagInstructionDto {
  instructions?: string[];
  context?: any;
  metadata?: any;
  active?: boolean;
}

export const ragInstructionsService = {

  /**
   * Busca uma instrução por ID
   */
  findOne: async (id: string): Promise<ApiResponse<RagInstruction>> => {
    return httpClient.get(API_ENDPOINTS.RAG_INSTRUCTIONS.DETAIL(id));
  },

  /**
   * Busca instruções por unitId
   */
  findByUnitId: async (unitId: string): Promise<ApiResponse<RagInstruction[]>> => {
    return httpClient.get(API_ENDPOINTS.RAG_INSTRUCTIONS.BY_UNIT(unitId));
  },

  /**
   * Cria instrução a partir de texto
   */
  createFromText: async (
    data: CreateRagInstructionFromTextDto
  ): Promise<ApiResponse<RagInstruction>> => {
    return httpClient.post(API_ENDPOINTS.RAG_INSTRUCTIONS.CREATE_FROM_TEXT, data);
  },

  /**
   * Cria instrução a partir de URL
   */
  createFromUrl: async (
    data: CreateRagInstructionFromUrlDto
  ): Promise<ApiResponse<RagInstruction>> => {
    return httpClient.post(API_ENDPOINTS.RAG_INSTRUCTIONS.CREATE_FROM_URL, data);
  },

  /**
   * Cria instrução a partir de PDF
   */
  createFromPdf: async (
    file: File,
    data: CreateRagInstructionFromPdfDto
  ): Promise<ApiResponse<RagInstruction>> => {
    const formData = new FormData();
    formData.append('file', file);
    if (data.title) formData.append('title', data.title);
    if (data.context) formData.append('context', JSON.stringify(data.context));
    if (data.metadata) formData.append('metadata', JSON.stringify(data.metadata));
    if (data.active !== undefined) formData.append('active', String(data.active));
    if (data.indexInRAG !== undefined) formData.append('indexInRAG', String(data.indexInRAG));

    return httpClient.post(API_ENDPOINTS.RAG_INSTRUCTIONS.CREATE_FROM_PDF, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Atualiza uma instrução
   */
  update: async (
    id: string,
    data: UpdateRagInstructionDto
  ): Promise<ApiResponse<RagInstruction>> => {
    return httpClient.put(API_ENDPOINTS.RAG_INSTRUCTIONS.UPDATE(id), data);
  },

  /**
   * Deleta uma instrução
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return httpClient.delete(API_ENDPOINTS.RAG_INSTRUCTIONS.DELETE(id));
  },

  /**
   * Reindexa uma instrução no RAG
   */
  reindex: async (id: string): Promise<ApiResponse<RagInstruction>> => {
    return httpClient.post(API_ENDPOINTS.RAG_INSTRUCTIONS.REINDEX(id));
  },

  /**
   * Obtém contexto adicional das instruções
   */
  getContext: async (unitId: string): Promise<ApiResponse<any>> => {
    return httpClient.get(API_ENDPOINTS.RAG_INSTRUCTIONS.CONTEXT(unitId));
  },
};
