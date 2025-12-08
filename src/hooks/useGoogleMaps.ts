import { useState, useEffect } from "react";

interface UseGoogleMapsReturn {
  isLoaded: boolean;
  loadError: Error | null;
}

export function useGoogleMaps(): UseGoogleMapsReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setLoadError(new Error("Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your environment."));
      return;
    }

    // Verifica se já foi carregado
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Verifica se já está carregando
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkLoaded = setInterval(() => {
        if (window.google?.maps) {
          setIsLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      return;
    }

    // Carrega o script com o novo loader (loading=async permite usar importLibrary)
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setLoadError(new Error("Failed to load Google Maps API"));
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup não remove o script para evitar recarregar
    };
  }, []);

  return { isLoaded, loadError };
}

declare global {
  interface Window {
    google: any;
  }
}
