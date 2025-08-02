import React from 'react';
import { Product } from '@/pages/Ecommerce/types/ecommerce.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ShoppingCart, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from '@/router';

interface RelatedProductsProps {
  currentProductId: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

// Mock data para produtos relacionados
const mockRelatedProducts: Product[] = [
  {
    id: '2',
    name: 'Conjunto Infantil Aventureiro',
    description: 'Conjunto completo para aventuras ao ar livre',
    price: 65.50,
    originalPrice: 85.00,
    discount: 23,
    category: 'roupas',
    brand: 'Adventure Kids',
    images: ['/api/placeholder/300/300'],
    thumbnail: '/api/placeholder/300/300',
    inStock: true,
    stockQuantity: 8,
    rating: 4.5,
    reviewCount: 18,
    isFeatured: false,
    isNew: true,
    franchiseId: 'franchise-2',
    franchiseName: 'Mundo Kids',
    franchiseLocation: 'Rio de Janeiro, RJ',
    tags: ['aventura', 'confortável'],
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-22T16:20:00Z'
  },
  {
    id: '3',
    name: 'Boneca Educativa Inteligente',
    description: 'Boneca interativa que ensina números e letras',
    price: 159.90,
    category: 'brinquedos',
    brand: 'Smart Toys',
    images: ['/api/placeholder/300/300'],
    thumbnail: '/api/placeholder/300/300',
    inStock: true,
    stockQuantity: 12,
    rating: 4.9,
    reviewCount: 35,
    isFeatured: true,
    isNew: true,
    franchiseId: 'franchise-3',
    franchiseName: 'Brinquedos Educativos',
    franchiseLocation: 'Belo Horizonte, MG',
    tags: ['educativo', 'interativo'],
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-25T13:30:00Z'
  },
  {
    id: '4',
    name: 'Mochila Escolar Colorida',
    description: 'Mochila resistente para escola',
    price: 78.90,
    originalPrice: 95.00,
    discount: 17,
    category: 'acessorios',
    brand: 'School Bags',
    images: ['/api/placeholder/300/300'],
    thumbnail: '/api/placeholder/300/300',
    inStock: true,
    stockQuantity: 20,
    rating: 4.3,
    reviewCount: 12,
    isFeatured: false,
    isNew: false,
    franchiseId: 'franchise-1',
    franchiseName: 'Kids Fashion Store',
    franchiseLocation: 'São Paulo, SP',
    tags: ['escola', 'organizador'],
    createdAt: '2024-01-10T08:45:00Z',
    updatedAt: '2024-01-15T10:20:00Z'
  },
  {
    id: '5',
    name: 'Kit de Arte Criativa',
    description: 'Kit completo para desenvolver criatividade',
    price: 45.90,
    category: 'brinquedos',
    brand: 'Arte Kids',
    images: ['/api/placeholder/300/300'],
    thumbnail: '/api/placeholder/300/300',
    inStock: true,
    stockQuantity: 25,
    rating: 4.6,
    reviewCount: 28,
    isFeatured: false,
    isNew: true,
    franchiseId: 'franchise-2',
    franchiseName: 'Mundo Kids',
    franchiseLocation: 'Rio de Janeiro, RJ',
    tags: ['arte', 'criatividade'],
    createdAt: '2024-01-22T14:30:00Z',
    updatedAt: '2024-01-25T09:15:00Z'
  }
];

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  products = mockRelatedProducts,
  onAddToCart
}) => {
  const { navigate } = useRouter();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Filtrar produtos relacionados (excluir o produto atual)
  const relatedProducts = products.filter(product => product.id !== currentProductId);
  
  // Configuração do carrossel
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, relatedProducts.length - itemsPerPage);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + itemsPerPage));
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product?id=${productId}`);
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
        className={`h-3 w-3 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  const visibleProducts = relatedProducts.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">
            Produtos Relacionados
          </CardTitle>
          
          {relatedProducts.length > itemsPerPage && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <p className="text-gray-600">
          Outros produtos que podem interessar você
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleProductClick(product.id)}
            >
              {/* Imagem do Produto */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
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
                </div>

                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.id);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </div>
              </div>

              {/* Informações do Produto */}
              <div className="p-3 space-y-2">
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-xs text-gray-500">
                  por {product.franchiseName}
                </p>

                {/* Avaliação */}
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Preço */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary text-sm">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Status do Estoque */}
                <div className="text-xs">
                  {product.inStock ? (
                    <span className="text-green-600">✓ Em estoque</span>
                  ) : (
                    <span className="text-red-500">✗ Indisponível</span>
                  )}
                </div>

                {/* Botão de Adicionar */}
                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAddToCart) {
                      onAddToCart(product);
                    }
                  }}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {product.inStock ? 'Adicionar' : 'Indisponível'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Indicadores de página */}
        {relatedProducts.length > itemsPerPage && (
          <div className="flex justify-center mt-4">
            <div className="flex gap-2">
              {Array.from({ 
                length: Math.ceil(relatedProducts.length / itemsPerPage) 
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * itemsPerPage)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(currentIndex / itemsPerPage) === index
                      ? 'bg-primary'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Link para ver todos */}
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Ver Todos os Produtos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};