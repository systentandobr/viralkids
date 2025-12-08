import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ProductImageProps {
  hashId: string;
  alt?: string;
  className?: string;
  thumbnail?: boolean;
  lazy?: boolean;
  fallback?: string;
}

export function ProductImage({
  hashId,
  alt = 'Imagem do produto',
  className = '',
  thumbnail = false,
  lazy = true,
  fallback,
}: ProductImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const imageUrl = thumbnail
    ? `/api/products/images/${hashId}/thumbnail`
    : `/api/products/images/${hashId}`;

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-muted ${className}`}
        style={{ minHeight: '200px' }}
      >
        {fallback ? (
          <img src={fallback} alt={alt} className={className} />
        ) : (
          <div className='flex flex-col items-center gap-2 text-muted-foreground'>
            <ImageIcon className='w-12 h-12' />
            <span className='text-sm'>Erro ao carregar imagem</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center bg-muted animate-pulse'>
          <ImageIcon className='w-8 h-8 text-muted-foreground' />
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        loading={lazy ? 'lazy' : 'eager'}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
      />
    </div>
  );
}

