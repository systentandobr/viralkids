/**
 * Utilitários para formatação de dados em formulários
 */

/**
 * Formata CEP (00000-000)
 */
export const formatCEP = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};

/**
 * Formata telefone brasileiro
 * (00) 00000-0000 ou (00) 0000-0000
 */
export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

/**
 * Remove formatação de CEP
 */
export const unformatCEP = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Remove formatação de telefone
 */
export const unformatPhone = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Valida formato de CEP
 */
export const isValidCEP = (cep: string): boolean => {
  const cleaned = unformatCEP(cep);
  return /^\d{8}$/.test(cleaned);
};

/**
 * Valida formato de telefone brasileiro
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = unformatPhone(phone);
  return /^\d{10,11}$/.test(cleaned);
};

/**
 * Valida coordenadas geográficas
 */
export const isValidLatitude = (lat: number): boolean => {
  return lat >= -90 && lat <= 90;
};

export const isValidLongitude = (lng: number): boolean => {
  return lng >= -180 && lng <= 180;
};

