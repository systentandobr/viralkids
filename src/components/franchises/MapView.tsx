import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';

interface MapViewProps {
  latitude: number;
  longitude: number;
  onCoordinatesChange?: (lat: number, lng: number) => void;
  draggable?: boolean;
}

export function MapView({
  latitude,
  longitude,
  onCoordinatesChange,
  draggable = true,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Inicializa o mapa
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom: 16,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;

    // Adiciona marcador
    const marker = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      draggable: draggable,
      animation: window.google.maps.Animation.DROP,
    });

    markerRef.current = marker;

    // Listener para quando o marcador é arrastado
    if (draggable && onCoordinatesChange) {
      marker.addListener('dragend', () => {
        const position = marker.getPosition();
        onCoordinatesChange(position.lat(), position.lng());
      });
    }

    setIsLoaded(true);

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, []);

  // Atualiza posição quando coordenadas mudam
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !markerRef.current) return;

    const newPosition = { lat: latitude, lng: longitude };
    markerRef.current.setPosition(newPosition);
    mapInstanceRef.current.setCenter(newPosition);
  }, [latitude, longitude, isLoaded]);

  return (
    <Card className='overflow-hidden'>
      <div
        ref={mapRef}
        className='w-full h-[400px] bg-muted'
        style={{ minHeight: '400px' }}
      />
      {draggable && (
        <div className='p-4 bg-card border-t'>
          <p className='text-base text-muted-foreground'>
            📍 Arraste o marcador para ajustar a localização precisa
          </p>
        </div>
      )}
    </Card>
  );
}
