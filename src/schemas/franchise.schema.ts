import { z } from 'zod';

/**
 * Schema de validação para LocationDto
 */
export const LocationSchema = z.object({
  lat: z
    .number()
    .min(-90, 'Latitude deve estar entre -90 e 90')
    .max(90, 'Latitude deve estar entre -90 e 90'),
  lng: z
    .number()
    .min(-180, 'Longitude deve estar entre -180 e 180')
    .max(180, 'Longitude deve estar entre -180 e 180'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório').max(2, 'Estado deve ter 2 caracteres'),
  zipCode: z
    .string()
    .min(8, 'CEP deve ter pelo menos 8 caracteres')
    .max(10, 'CEP deve ter no máximo 10 caracteres')
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  type: z.enum(['physical', 'digital'], {
    errorMap: () => ({ message: 'Tipo deve ser "physical" ou "digital"' }),
  }),
});

/**
 * Schema de validação para TerritoryDto
 */
export const TerritorySchema = z.object({
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório').max(2, 'Estado deve ter 2 caracteres'),
  exclusive: z.boolean().default(true),
  radius: z
    .number()
    .min(0, 'Raio deve ser maior ou igual a 0')
    .optional(),
});

/**
 * Schema de validação para CreateFranchiseDto
 */
export const CreateFranchiseSchema = z.object({
  unitId: z.string().min(1, 'Unit ID é obrigatório'),
  name: z.string().min(1, 'Nome da franquia é obrigatório'),
  ownerId: z.string().min(1, 'ID do proprietário é obrigatório'),
  ownerName: z.string().min(1, 'Nome do proprietário é obrigatório'),
  ownerEmail: z.string().email('Email inválido'),
  ownerPhone: z
    .string()
    .regex(/^[\d\s()+-]+$/, 'Telefone inválido')
    .optional()
    .or(z.literal('')),
  location: LocationSchema,
  status: z
    .enum(['active', 'inactive', 'pending', 'suspended'], {
      errorMap: () => ({
        message: 'Status deve ser: active, inactive, pending ou suspended',
      }),
    })
    .optional()
    .default('pending'),
  type: z
    .enum(['standard', 'premium', 'express'], {
      errorMap: () => ({
        message: 'Tipo deve ser: standard, premium ou express',
      }),
    })
    .optional()
    .default('standard'),
  territory: TerritorySchema.optional(),
});

/**
 * Tipo TypeScript inferido do schema Zod
 */
export type CreateFranchiseFormData = z.infer<typeof CreateFranchiseSchema>;

/**
 * Tipo para Location
 */
export type LocationFormData = z.infer<typeof LocationSchema>;

/**
 * Tipo para Territory
 */
export type TerritoryFormData = z.infer<typeof TerritorySchema>;

