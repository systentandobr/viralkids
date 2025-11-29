import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductImageGalleryProps, ZoomImageProps } from '../types/product-detail.types';

// Componente de zoom da imagem
const ZoomModal: React.FC<ZoomImageProps> = ({ src, alt, isOpen, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(scale + delta, 0.5), 4);
    setScale(newScale);
  }, [scale]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [scale, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart, scale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => setScale(Math.min(scale * 1.5, 4));
  const zoomOut = () => setScale(Math.max(scale / 1.5, 0.5));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      {/* Controles */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={zoomOut}
          disabled={scale <= 0.5}
        >
          -
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={resetZoom}
        >
          {Math.round(scale * 100)}%
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={zoomIn}
          disabled={scale >= 4}
        >
          +
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Instruções */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-base bg-black/50 px-4 py-2 rounded-lg">
        Use a roda do mouse para zoom • Arraste para mover • ESC para fechar
      </div>

      {/* Imagem */}
      <div 
        className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="max-w-none transition-transform duration-200"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
          draggable={false}
        />
      </div>
    </div>
  );
};

// Componente principal da galeria
export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  selectedVariation,
  productName
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState('');

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = (imageSrc: string) => {
    setZoomImage(imageSrc);
    setIsZoomOpen(true);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <div className="text-4xl mb-2">📷</div>
          <p>Imagem não disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Imagem Principal */}
      <div className="relative group">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={images[currentIndex]}
            alt={`${productName} - Imagem ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
            onClick={() => handleImageClick(images[currentIndex])}
          />
          
          {/* Overlay com ícone de zoom */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
              <ZoomIn className="h-6 w-6 text-gray-800" />
            </div>
          </div>

          {/* Botão de fullscreen */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => handleImageClick(images[currentIndex])}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Navegação */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Indicadores */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 8).map((image, index) => (
            <button
              key={index}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          
          {/* Mostrar "+X mais" se houver mais de 8 imagens */}
          {images.length > 8 && (
            <button
              className="aspect-square rounded-lg bg-gray-100 border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center transition-colors"
              onClick={() => handleImageClick(images[8])}
            >
              <div className="text-center">
                <div className="text-base font-medium text-gray-600">
                  +{images.length - 8}
                </div>
                <div className="text-sm text-gray-500">mais</div>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Modal de Zoom */}
      <ZoomModal
        src={zoomImage}
        alt={productName}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </div>
  );
};