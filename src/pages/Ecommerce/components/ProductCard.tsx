import React, { useState } from 'react';
import { Product } from '../types/ecommerce.types';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star, MapPin, Badge, Eye, Image } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  onAddToCart
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Função para renderizar imagem com fallback
  const renderImage = (src: string, alt: string, className: string) => {
    if (imageError) {
      return (
        <div className={`${className} bg-gray-200 flex items-center justify-center`}>
          <Image className="h-12 w-12 text-gray-400" />
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleImageError}
      />
    );
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
        <div className="flex gap-6">
          {/* Imagem do Produto */}
          <div className="relative flex-shrink-0">
            {renderImage(
              product.thumbnail,
              product.name,
              "w-32 h-32 object-cover rounded-lg"
            )}
            {product.discount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                -{product.discount}%
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Novo
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                {product.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWishlistToggle}
                className="text-gray-400 hover:text-red-500"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
              </Button>
            </div>

            <p className="text-gray-600 text-md mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
                <span className="text-xs text-gray-500 ml-1">
                  ({product.reviewCount})
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                {product.franchiseLocation}
              </div>
            </div>

            {/* Preço */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-md text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button onClick={onAddToCart} size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Imagem do Produto */}
      <div className="relative aspect-square overflow-hidden">
        {renderImage(
          product.images[selectedImageIndex] || product.thumbnail,
          product.name,
          "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              -{product.discount}%
            </div>
          )}
          {product.isNew && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Novo
            </div>
          )}
          {product.isFeatured && (
            <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <Badge className="h-3 w-3 mr-1" />
              Destaque
            </div>
          )}
        </div>

        {/* Botão de Wishlist */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full p-2"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
        </Button>

        {/* Indicadores de Imagem */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Overlay de Ações */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="secondary" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </div>

      {/* Informações do Produto */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            por {product.franchiseName}
          </p>
        </div>

        {/* Avaliação */}
        <div className="flex items-center gap-1 mb-3">
          {renderStars(product.rating)}
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviewCount})
          </span>
        </div>

        {/* Preço */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-md text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Cores disponíveis */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xs text-gray-500 mr-2">Cores:</span>
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Ver
          </Button>
          <Button onClick={onAddToCart} size="sm" className="flex-1">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};