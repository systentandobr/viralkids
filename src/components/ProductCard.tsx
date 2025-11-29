import React from 'react';
import { useRouter } from '@/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    image: string;
    rating: number;
    reviewCount: number;
    brand: string;
    isNew?: boolean;
    isFeatured?: boolean;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate } = useRouter();

  // Função para navegar para a página de detalhes do produto
  const handleProductClick = () => {
    // Método 1: Usando a rota /product/detail/:id
    navigate(`/product/detail/${product.id}`);
    
    // Método 2: Usando a rota /produto/:id (alternativo)
    // navigate(`/produto/${product.id}`);
  };

  // Função para adicionar ao carrinho
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que o clique propague para o card
    console.log('Adicionar ao carrinho:', product.id);
    // Implementar lógica de adicionar ao carrinho
  };

  // Função para adicionar à lista de desejos
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que o clique propague para o card
    console.log('Adicionar à lista de desejos:', product.id);
    // Implementar lógica de adicionar à lista de desejos
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleProductClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-green-500 text-white text-sm">
                Novo
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="outline" className="text-sm">
                Destaque
              </Badge>
            )}
            {product.discount && (
              <Badge variant="destructive" className="text-sm">
                -{product.discount}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="space-y-2">
          {/* Brand */}
          <Badge variant="secondary" className="text-sm">
            {product.brand}
          </Badge>
          
          {/* Title */}
          <CardTitle className="text-base font-medium line-clamp-2">
            {product.name}
          </CardTitle>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className={`h-3 w-3 ${
                    index < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviewCount})
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Comprar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToWishlist}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 