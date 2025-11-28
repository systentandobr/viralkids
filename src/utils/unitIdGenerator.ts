/**
 * Gera um Unit ID único no formato: #PAÍS#UF#CIDADE#BAIRRO#NUMERO
 * Exemplo: #BR#SP#SAO_PAULO#CENTRO#123
 */

interface AddressData {
    country?: string;
    state?: string;
    city?: string;
    neighborhood?: string;
    number?: string;
  }
  
  function normalizeText(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .toUpperCase()
      .replace(/\s+/g, "_") // Espaços viram underscore
      .replace(/[^A-Z0-9_]/g, ""); // Remove caracteres especiais
  }
  
  export function generateUnitId(address: AddressData): string {
    const country = normalizeText(address.country || "BR");
    const state = normalizeText(address.state || "");
    const city = normalizeText(address.city || "");
    const neighborhood = normalizeText(address.neighborhood || "");
    const number = address.number || "000";
  
    // Pega primeira palavra da cidade se tiver múltiplas palavras
    const cityFirstWord = city.split("_")[0];
  
    return `#${country}#${state}#${cityFirstWord}#${neighborhood}#${number}`;
  }
  
  export function validateUnitIdFormat(unitId: string): boolean {
    // Formato esperado: #PAIS#UF#CIDADE#BAIRRO#NUMERO
    const regex = /^#[A-Z0-9_]+#[A-Z0-9_]+#[A-Z0-9_]+#[A-Z0-9_]+#[A-Z0-9_]+$/;
    return regex.test(unitId);
  }
  