import { httpClient, ApiResponse } from './httpClient';
import { API_ENDPOINTS } from './endpoints';

export interface TaskStep {
    order: number;
    title: string;
    description: string;
    required: boolean;
}

export interface TaskResource {
    type: 'video' | 'pdf' | 'link' | 'template' | 'document';
    url: string;
    title: string;
    description?: string;
}

export interface TaskValidation {
    type: 'link' | 'upload' | 'text' | 'none';
    required: boolean;
    instructions: string;
    acceptedFormats?: string[];
}

export interface TaskTemplate {
    _id: string; // Mongoose ID
    id?: string; // Virtual ID
    name: string;
    description: string;
    category: 'onboarding' | 'marketing' | 'sales' | 'operations' | 'compliance' | 'other' | 'setup' | 'social_media';
    type: 'checklist' | 'form' | 'upload' | 'video_verification' | 'profile_setup' | 'instagram_creation' | 'follow_suppliers' | 'first_post' | 'market_research' | 'single' | 'multi-step';
    steps: TaskStep[];

    // New Enhanced Fields
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    dependencies: string[]; // IDs of other tasks
    instructions: string;
    icon: string; // Lucide icon name or emoji
    color: string;
    validation?: TaskValidation;

    formTemplate?: any;
    videoUrl?: string;
    resources?: TaskResource[];
    estimatedTime?: number;
    isDefault: boolean;
    order?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskTemplateDto {
    name: string;
    description: string;
    category: string;
    type: string;
    steps: TaskStep[];

    difficulty?: string;
    points?: number;
    dependencies?: string[];
    instructions?: string;
    icon?: string;
    color?: string;
    validation?: any;

    formTemplate?: any;
    videoUrl?: string;
    resources?: any[];
    estimatedTime?: number;
    isDefault?: boolean;
    order?: number;
    metadata?: any;
}

export interface UpdateTaskTemplateDto extends Partial<CreateTaskTemplateDto> { }

export const taskTemplatesService = {
    findAll: async (): Promise<ApiResponse<TaskTemplate[]>> => {
        return httpClient.get(API_ENDPOINTS.TASK_TEMPLATES.LIST);
    },

    findDefaults: async (): Promise<ApiResponse<TaskTemplate[]>> => {
        return httpClient.get(API_ENDPOINTS.TASK_TEMPLATES.DEFAULTS);
    },

    findOne: async (id: string): Promise<ApiResponse<TaskTemplate>> => {
        return httpClient.get(API_ENDPOINTS.TASK_TEMPLATES.DETAIL(id));
    },

    create: async (data: CreateTaskTemplateDto): Promise<ApiResponse<TaskTemplate>> => {
        return httpClient.post(API_ENDPOINTS.TASK_TEMPLATES.CREATE, data);
    },

    update: async (id: string, data: UpdateTaskTemplateDto): Promise<ApiResponse<TaskTemplate>> => {
        return httpClient.patch(API_ENDPOINTS.TASK_TEMPLATES.UPDATE(id), data);
    },

    remove: async (id: string): Promise<ApiResponse<void>> => {
        return httpClient.delete(API_ENDPOINTS.TASK_TEMPLATES.DELETE(id));
    }
};
