'use client';

import React from 'react';

/**
 * Lista de estados brasileiros
 */
export const BRAZILIAN_STATES = [
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
] as const;

interface BrazilianStatesSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  id?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

/**
 * Componente reutilizável para seleção de estados brasileiros
 */
export const BrazilianStatesSelect: React.FC<BrazilianStatesSelectProps> = ({
  value,
  onChange,
  name,
  id,
  className = '',
  placeholder = 'Selecione o estado',
  required = false,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div>
      <select
        value={value || ''}
        onChange={handleChange}
        name={name}
        id={id}
        required={required}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${className} ${
          error ? 'border-red-300' : ''
        }`}
      >
        <option value="">{placeholder}</option>
        {BRAZILIAN_STATES.map((state) => (
          <option key={state.value} value={state.value}>
            {state.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-base text-red-600">{error}</p>}
    </div>
  );
};

export default BrazilianStatesSelect;

