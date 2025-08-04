import React from 'react';
import { useNavigation } from '../stores/additional/navigation.store';
import { useProductsStore } from '../stores/products.store';
import { Link } from '../router';
import { Button } from './ui/button';
import { ShoppingCart, Heart, Star } from 'lucide-react';

interface RelatedProductsProps {
  currentProductId: string;
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  onAddToCart,
  onAddToWishlist
}) => {
  const { visitedProducts, lastSearchResults, lastAppliedFilters } = useNavigation();
  const { products } = useProductsStore();

  // Algoritmo de recomendação inteligente
  const getRelatedProducts = () => {
    const currentProduct = products.find(p => p.id === currentProductId);
    if (!currentProduct) return [];

    const relatedProducts = [];

    // 1. Produtos da mesma categoria que o usuário visitou
    const sameCategoryVisited = products.filter(product => 
      product.category === currentProduct.category &&
      product.id !== currentProductId &&
      visitedProducts.includes(product.id)
    );

    // 2. Produtos similares por preço (±20%)
    const similarPrice = products.filter(product => {
      const priceDiff = Math.abs(product.price - currentProduct.price);
      const priceThreshold = currentProduct.price * 0.2;
      return product.id !== currentProductId && priceDiff <= priceThreshold;
    });

    // 3. Produtos da última busca
    const fromLastSearch = lastSearchResults.filter(product => 
      product.id !== currentProductId
    );

    // 4. Produtos baseados nos filtros aplicados
    const fromFilters = products.filter(product => 
      product.id !== currentProductId &&
      Object.entries(lastAppliedFilters).some(([key, value]) => 
        product[key] === value
      )
    );

    // Combinar e remover duplicatas
    const allRelated = [
      ...sameCategoryVisited,
      ...similarPrice,
      ...fromLastSearch,
      ...fromFilters
    ];

    // Remover duplicatas por ID
    const uniqueProducts = allRelated.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );

    return uniqueProducts.slice(0, 4);
  };

  const relatedProducts = getRelatedProducts();

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Produtos Relacionados
        </h3>
        <div className="text-sm text-gray-500">
          Baseado no seu histórico
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <div key={product.id} className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <Link to={`/produto/${product.id}`} className="block">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {product.images && product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                )}
              </div>
            </Link>
            
            <div className="p-4">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`h-3 w-3 ${
                      index < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">
                  ({product.reviewCount || 0})
                </span>
              </div>
              
              <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                {product.name}
              </h4>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-primary">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onAddToCart?.(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAddToWishlist?.(product)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 