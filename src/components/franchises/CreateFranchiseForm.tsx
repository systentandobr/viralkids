'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateFranchiseSchema,
  CreateFranchiseFormData,
} from '../../schemas/franchise.schema';
import { franchisesService } from '../../services/api/franchises.service';
import { FranchiseResponse } from '../../types/franchise.types';

// Estados brasileiros
const BRAZILIAN_STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

interface CreateFranchiseFormProps {
  onSuccess?: (franchise: FranchiseResponse) => void;
  onCancel?: () => void;
  initialData?: Partial<CreateFranchiseFormData>;
}

export const CreateFranchiseForm: React.FC<CreateFranchiseFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTerritory, setShowTerritory] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateFranchiseFormData>({
    resolver: zodResolver(CreateFranchiseSchema),
    defaultValues: {
      status: 'pending',
      type: 'standard',
      location: {
        type: 'physical',
        ...initialData?.location,
      },
      ...initialData,
    },
  });

  const locationType = watch('location.type');

  const onSubmit = async (data: CreateFranchiseFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Limpar campos opcionais vazios
      const submitData = {
        ...data,
        ownerPhone: data.ownerPhone || undefined,
        territory: showTerritory && data.territory ? data.territory : undefined,
      };

      const response = await franchisesService.createFranchise(submitData);
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err: any) {
      console.error('Erro ao criar franquia:', err);
      setError(
        err.message || 'Erro ao criar franquia. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para formatar CEP
  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Seção: Informações Básicas */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informações Básicas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="unitId" className="block text-sm font-medium text-gray-700">
              Unit ID <span className="text-red-500">*</span>
            </label>
            <input
              {...register('unitId')}
              type="text"
              id="unitId"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: FR-001"
            />
            {errors.unitId && (
              <p className="mt-1 text-sm text-red-600">{errors.unitId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome da Franquia <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: Franquia Centro"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              {...register('status')}
              id="status"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="pending">Pendente</option>
              <option value="active">Ativa</option>
              <option value="inactive">Inativa</option>
              <option value="suspended">Suspensa</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              {...register('type')}
              id="type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="express">Express</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Seção: Proprietário */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informações do Proprietário
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">
              ID do Proprietário <span className="text-red-500">*</span>
            </label>
            <input
              {...register('ownerId')}
              type="text"
              id="ownerId"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: USR-123"
            />
            {errors.ownerId && (
              <p className="mt-1 text-sm text-red-600">{errors.ownerId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
              Nome do Proprietário <span className="text-red-500">*</span>
            </label>
            <input
              {...register('ownerName')}
              type="text"
              id="ownerName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: João Silva"
            />
            {errors.ownerName && (
              <p className="mt-1 text-sm text-red-600">{errors.ownerName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register('ownerEmail')}
              type="email"
              id="ownerEmail"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="exemplo@email.com"
            />
            {errors.ownerEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.ownerEmail.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              {...register('ownerPhone')}
              type="tel"
              id="ownerPhone"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="(00) 00000-0000"
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                setValue('ownerPhone', formatted);
              }}
            />
            {errors.ownerPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.ownerPhone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Seção: Localização */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Localização
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="location.address" className="block text-sm font-medium text-gray-700">
              Endereço <span className="text-red-500">*</span>
            </label>
            <input
              {...register('location.address')}
              type="text"
              id="location.address"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: Rua das Flores, 123"
            />
            {errors.location?.address && (
              <p className="mt-1 text-sm text-red-600">{errors.location.address.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="location.city" className="block text-sm font-medium text-gray-700">
              Cidade <span className="text-red-500">*</span>
            </label>
            <input
              {...register('location.city')}
              type="text"
              id="location.city"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: São Paulo"
            />
            {errors.location?.city && (
              <p className="mt-1 text-sm text-red-600">{errors.location.city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="location.state" className="block text-sm font-medium text-gray-700">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              {...register('location.state')}
              id="location.state"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              {BRAZILIAN_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
            {errors.location?.state && (
              <p className="mt-1 text-sm text-red-600">{errors.location.state.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="location.zipCode" className="block text-sm font-medium text-gray-700">
              CEP <span className="text-red-500">*</span>
            </label>
            <input
              {...register('location.zipCode')}
              type="text"
              id="location.zipCode"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="00000-000"
              maxLength={9}
              onChange={(e) => {
                const formatted = formatCEP(e.target.value);
                setValue('location.zipCode', formatted);
              }}
            />
            {errors.location?.zipCode && (
              <p className="mt-1 text-sm text-red-600">{errors.location.zipCode.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="location.type" className="block text-sm font-medium text-gray-700">
              Tipo de Localização <span className="text-red-500">*</span>
            </label>
            <select
              {...register('location.type')}
              id="location.type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="physical">Física</option>
              <option value="digital">Digital</option>
            </select>
            {errors.location?.type && (
              <p className="mt-1 text-sm text-red-600">{errors.location.type.message}</p>
            )}
          </div>

          {locationType === 'physical' && (
            <>
              <div>
                <label htmlFor="location.lat" className="block text-sm font-medium text-gray-700">
                  Latitude <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('location.lat', { valueAsNumber: true })}
                  type="number"
                  step="any"
                  id="location.lat"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ex: -23.5505"
                />
                {errors.location?.lat && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.lat.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="location.lng" className="block text-sm font-medium text-gray-700">
                  Longitude <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('location.lng', { valueAsNumber: true })}
                  type="number"
                  step="any"
                  id="location.lng"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ex: -46.6333"
                />
                {errors.location?.lng && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.lng.message}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Seção: Território (Opcional) */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Território (Opcional)
          </h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showTerritory}
              onChange={(e) => setShowTerritory(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Adicionar território</span>
          </label>
        </div>

        {showTerritory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="territory.city" className="block text-sm font-medium text-gray-700">
                Cidade
              </label>
              <input
                {...register('territory.city')}
                type="text"
                id="territory.city"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ex: São Paulo"
              />
              {errors.territory?.city && (
                <p className="mt-1 text-sm text-red-600">{errors.territory.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="territory.state" className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                {...register('territory.state')}
                id="territory.state"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione...</option>
                {BRAZILIAN_STATES.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
              {errors.territory?.state && (
                <p className="mt-1 text-sm text-red-600">{errors.territory.state.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="territory.radius" className="block text-sm font-medium text-gray-700">
                Raio (km)
              </label>
              <input
                {...register('territory.radius', { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.1"
                id="territory.radius"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ex: 10"
              />
              {errors.territory?.radius && (
                <p className="mt-1 text-sm text-red-600">{errors.territory.radius.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  {...register('territory.exclusive')}
                  type="checkbox"
                  defaultChecked={true}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Território exclusivo</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Salvando...' : 'Criar Franquia'}
        </button>
      </div>
    </form>
  );
};

export default CreateFranchiseForm;

