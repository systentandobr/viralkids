import { httpClient, ApiResponse } from './httpClient';
import { API_ENDPOINTS } from './endpoints';

export interface TrainingResource {
    type: string;
    url: string;
    title: string;
}

export interface Training {
    _id: string; // Mongoose ID
    id?: string; // Virtual ID
    title: string;
    description: string;
    category: 'onboarding' | 'marketing' | 'sales' | 'operations' | 'other';
    type: 'video' | 'pdf' | 'article' | 'interactive';
    videoUrl?: string;
    thumbnailUrl?: string;
    duration?: number;
    resources: TrainingResource[];
    isGlobal: boolean;
    franchiseId?: string;
    order?: number;
    viewCount: number;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTrainingDto {
    title: string;
    description: string;
    category: string;
    type: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    duration?: number;
    resources?: TrainingResource[];
    isGlobal?: boolean;
    franchiseId?: string;
    order?: number;
    metadata?: any;
}

export interface UpdateTrainingDto extends Partial<CreateTrainingDto> { }

export const trainingsService = {
    findAll: async (query?: any): Promise<ApiResponse<Training[]>> => {
        return httpClient.get(API_ENDPOINTS.TRAININGS.LIST, { params: query });
    },

    findOne: async (id: string): Promise<ApiResponse<Training>> => {
        return httpClient.get(API_ENDPOINTS.TRAININGS.DETAIL(id));
    },

    findAllByFranchise: async (franchiseId: string): Promise<ApiResponse<Training[]>> => {
        // This endpoint seems to be missing in endpoints.ts or I used a generic LIST with query params?
        // Checking controller: @Get('franchise/:franchiseId')
        // I need to add this specific endpoint or just use it manually.
        // Let's assume I can append to URL or add to endpoints.ts later if strictly needed, 
        // but better to stick to endpoints.ts map.
        // I added endpoints based on User request but I might have missed 'findAllByFranchise' specific route matching controller.
        // Controller: @Get('franchise/:franchiseId'). 
        // Let's use the path directly here for now to be safe or update endpoints.ts.
        // Easier to just use string concatenation here since I already edited endpoints.ts and don't want to double edit.
        return httpClient.get(`/trainings/franchise/${franchiseId}`);
    },

    create: async (data: CreateTrainingDto): Promise<ApiResponse<Training>> => {
        return httpClient.post(API_ENDPOINTS.TRAININGS.CREATE, data);
    },

    update: async (id: string, data: UpdateTrainingDto): Promise<ApiResponse<Training>> => {
        return httpClient.patch(API_ENDPOINTS.TRAININGS.UPDATE(id), data);
    },

    remove: async (id: string): Promise<ApiResponse<void>> => {
        return httpClient.delete(API_ENDPOINTS.TRAININGS.DELETE(id));
    },

    incrementViewCount: async (id: string): Promise<ApiResponse<void>> => {
        return httpClient.post(API_ENDPOINTS.TRAININGS.INCREMENT_VIEW(id));
    }
};
