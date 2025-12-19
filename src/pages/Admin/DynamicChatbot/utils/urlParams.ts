/**
 * Utilitário para extrair parâmetros da URL sem depender do Router
 * Suporta tanto query strings normais quanto hash-based routing
 */
export function getUrlParams(): URLSearchParams {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }
  
  // Primeiro, tentar buscar parâmetros do hash (para hash-based routing)
  // Exemplo: #/messages?unitId=value
  const hash = window.location.hash;
  const hashQueryIndex = hash.indexOf('?');
  
  if (hashQueryIndex !== -1) {
    const hashQuery = hash.substring(hashQueryIndex + 1);
    if (hashQuery) {
      return new URLSearchParams(hashQuery);
    }
  }
  
  // Fallback para query string normal (window.location.search)
  return new URLSearchParams(window.location.search);
}

export function getUrlParam(key: string): string | null {
  const value = getUrlParams().get(key);
  // Decodificar o valor para lidar com caracteres especiais como #
  // O URLSearchParams já faz decodeURIComponent automaticamente
  return value ? decodeURIComponent(value) : null;
}

export function getAllUrlParams(): Record<string, string> {
  const params: Record<string, string> = {};
  const urlParams = getUrlParams();
  
  urlParams.forEach((value, key) => {
    // Decodificar valores para lidar com caracteres especiais
    params[key] = decodeURIComponent(value);
  });
  
  return params;
}
