/**
 * Utilitário para extrair parâmetros da URL sem depender do Router
 */
export function getUrlParams(): URLSearchParams {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
}

export function getUrlParam(key: string): string | null {
  return getUrlParams().get(key);
}

export function getAllUrlParams(): Record<string, string> {
  const params: Record<string, string> = {};
  const urlParams = getUrlParams();
  
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}
