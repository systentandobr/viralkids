'use client';

import React from 'react';

interface CoordinatesInputProps {
  lat: number | undefined;
  lng: number | undefined;
  onLatChange: (lat: number) => void;
  onLngChange: (lng: number) => void;
  latError?: string;
  lngError?: string;
  required?: boolean;
}

/**
 * Componente para entrada de coordenadas geográficas (latitude e longitude)
 */
export const CoordinatesInput: React.FC<CoordinatesInputProps> = ({
  lat,
  lng,
  onLatChange,
  onLngChange,
  latError,
  lngError,
  required = false,
}) => {
  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onLatChange(value);
    }
  };

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onLngChange(value);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="lat" className="block text-base font-medium text-gray-700">
          Latitude {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="number"
          step="any"
          id="lat"
          value={lat ?? ''}
          onChange={handleLatChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            latError ? 'border-red-300' : ''
          }`}
          placeholder="Ex: -23.5505"
          min={-90}
          max={90}
        />
        {latError && <p className="mt-1 text-base text-red-600">{latError}</p>}
        <p className="mt-1 text-sm text-gray-500">Valor entre -90 e 90</p>
      </div>

      <div>
        <label htmlFor="lng" className="block text-base font-medium text-gray-700">
          Longitude {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="number"
          step="any"
          id="lng"
          value={lng ?? ''}
          onChange={handleLngChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            lngError ? 'border-red-300' : ''
          }`}
          placeholder="Ex: -46.6333"
          min={-180}
          max={180}
        />
        {lngError && <p className="mt-1 text-base text-red-600">{lngError}</p>}
        <p className="mt-1 text-sm text-gray-500">Valor entre -180 e 180</p>
      </div>
    </div>
  );
};

export default CoordinatesInput;

