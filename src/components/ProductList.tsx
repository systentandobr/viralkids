import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useFiltersStore } from '@/stores/filters.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: any;
  onAddToCart: (product: any) => void;
  isInCart: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isInCart }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {product.name}
          </CardTitle>
          <Badge variant={product.inStock ? "default" : "secondary"}>
            {product.inStock ? "Em estoque" : "Indisponível"}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              R$ {product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <Heart className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock || isInCart}
              size="sm"
              className="flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              {isInCart ? 'No carrinho' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProductList: React.FC = () => {
  // Usar o hook integrado que combina React Query + Zustand
  const { 
    products, 
    isLoading, 
    error, 
    addToCart, 
    isInCart,
    hasProducts,
    productsCount 
  } = useProducts();

  // Filtros do Zustand
  const { filters, updateFilter, resetFilters, getActiveFiltersCount } = useFiltersStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">
            Erro ao carregar produtos: {error.message}
          </p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!hasProducts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Nenhum produto encontrado
          </p>
          <Button onClick={resetFilters}>
            Limpar filtros
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com informações */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Produtos</h2>
          <p className="text-muted-foreground">
            {productsCount} produto{productsCount !== 1 ? 's' : ''} encontrado{productsCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Filtros ativos */}
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary">
              {getActiveFiltersCount()} filtro{getActiveFiltersCount() !== 1 ? 's' : ''} ativo{getActiveFiltersCount() !== 1 ? 's' : ''}
            </Badge>
          )}
          
          <Button
            variant="outline"
            onClick={resetFilters}
            disabled={getActiveFiltersCount() === 0}
          >
            Limpar filtros
          </Button>
        </div>
      </div>

      {/* Grid de produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            isInCart={isInCart(product.id)}
          />
        ))}
      </div>

      {/* Informações de cache */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Dados carregados do servidor e sincronizados automaticamente
        </p>
      </div>
    </div>
  );
}; 