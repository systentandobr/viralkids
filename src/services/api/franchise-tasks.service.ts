import { httpClient, ApiResponse } from './httpClient';
import { API_ENDPOINTS } from './endpoints';
import { TaskTemplate } from './task-templates.service';

export interface CompletedStep {
    stepOrder: number;
    completedAt: string;
    data?: any;
}

export interface FranchiseTask {
    _id: string;
    id?: string;
    franchiseId: string;
    userId: string;
    templateId: string | TaskTemplate; // Can be populated
    name: string;
    description: string;
    category: string;
    status: 'pending' | 'in-progress' | 'completed' | 'blocked';
    progress: number;
    completedSteps: CompletedStep[];
    formData?: any;
    assignedAt: string;
    completedAt?: string;
    dueDate?: string;
    metadata?: any;
}

export interface CreateFranchiseTaskDto {
    franchiseId: string;
    userId: string;
    templateId: string;
    name: string;
    description: string;
    category: string;
    status?: string;
    progress?: number;
}

export interface CompleteTaskStepDto {
    stepOrder: number;
    data?: any;
}

export const franchiseTasksService = {
    findAllByFranchise: async (franchiseId: string): Promise<ApiResponse<FranchiseTask[]>> => {
        return httpClient.get(API_ENDPOINTS.FRANCHISE_TASKS.LIST_BY_FRANCHISE(franchiseId));
    },

    findAllByUser: async (userId: string): Promise<ApiResponse<FranchiseTask[]>> => {
        return httpClient.get(API_ENDPOINTS.FRANCHISE_TASKS.LIST_BY_USER(userId));
    },

    findOne: async (id: string): Promise<ApiResponse<FranchiseTask>> => {
        return httpClient.get(API_ENDPOINTS.FRANCHISE_TASKS.DETAIL(id));
    },

    create: async (data: CreateFranchiseTaskDto): Promise<ApiResponse<FranchiseTask>> => {
        return httpClient.post(API_ENDPOINTS.FRANCHISE_TASKS.CREATE, data);
    },

    initializeDefaults: async (franchiseId: string, userId: string): Promise<ApiResponse<FranchiseTask[]>> => {
        return httpClient.post(API_ENDPOINTS.FRANCHISE_TASKS.INITIALIZE(franchiseId), { userId });
    },

    completeStep: async (id: string, data: CompleteTaskStepDto): Promise<ApiResponse<FranchiseTask>> => {
        return httpClient.post(API_ENDPOINTS.FRANCHISE_TASKS.COMPLETE_STEP(id), data);
    },

    getStats: async (franchiseId: string): Promise<ApiResponse<any>> => {
        return httpClient.get(API_ENDPOINTS.FRANCHISE_TASKS.STATS(franchiseId));
    }
};
