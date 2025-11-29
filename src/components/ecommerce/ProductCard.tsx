import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  originalPrice: number;
  salePrice: number;
  image: string;
  rating: number;
  reviews: number;
  badge: string;
  badgeColor: string;
  isExclusive: boolean;
  category: string;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  className?: string;
}

const ProductCard = ({ product, viewMode = 'grid', className }: ProductCardProps) => {
  const openWhatsApp = (productName: string) => {
    const message = `Olá! Gostaria de saber mais sobre: ${productName}`;
    window.open(`https://wa.me/5584999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  const discount = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);

  if (viewMode === 'list') {
    return (
      <Card className={cn(
        "group hover:shadow-bronze transition-all duration-300 bg-gradient-card border-bronze/20",
        product.isExclusive && "ring-2 ring-bronze/30 shadow-bronze",
        className
      )}>
        <CardContent className="p-0">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="relative w-48 h-48 flex-shrink-0">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover rounded-l-lg"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <Badge className={cn("text-white text-sm font-medium", product.badgeColor)}>
                  {product.badge}
                </Badge>
                {discount > 0 && (
                  <Badge className="bg-red-500 text-white text-sm font-medium">
                    -{discount}%
                  </Badge>
                )}
              </div>

              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
              >
                <Heart className="h-4 w-4" />
              </Button>

              {product.isExclusive && (
                <div className="absolute bottom-2 left-2 bg-gradient-to-r from-bronze to-gold text-white px-2 py-1 rounded text-sm font-medium animate-pulse-glow">
                  ✨ Exclusivo 3D
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-base text-muted-foreground mb-1">{product.category}</p>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-bronze transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "h-3 w-3",
                            i < Math.floor(product.rating) 
                              ? "fill-gold text-gold" 
                              : "text-gray-300"
                          )} 
                        />
                      ))}
                    </div>
                    <span className="text-base text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="text-bronze hover:bg-bronze/10">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-bronze">
                      R$ {product.salePrice.toFixed(2).replace('.', ',')}
                    </span>
                    {product.originalPrice > product.salePrice && (
                      <span className="text-base text-muted-foreground line-through">
                        R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Em até 12x sem juros</p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="group-hover:bg-bronze group-hover:text-white"
                    onClick={() => openWhatsApp(product.name)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "group hover:shadow-bronze transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-bronze/20",
      product.isExclusive && "ring-2 ring-bronze/30 shadow-bronze",
      className
    )}>
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge className={cn("text-white text-sm font-medium", product.badgeColor)}>
              {product.badge}
            </Badge>
            {discount > 0 && (
              <Badge className="bg-red-500 text-white text-sm font-medium">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
          >
            <Heart className="h-4 w-4" />
          </Button>

          {product.isExclusive && (
            <div className="absolute bottom-2 left-2 bg-gradient-to-r from-bronze to-gold text-white px-2 py-1 rounded text-sm font-medium animate-pulse-glow">
              ✨ Exclusivo 3D
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
            <h3 className="text-base font-semibold text-foreground group-hover:text-bronze transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-3 w-3",
                    i < Math.floor(product.rating) 
                      ? "fill-gold text-gold" 
                      : "text-gray-300"
                  )} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-bronze">
                R$ {product.salePrice.toFixed(2).replace('.', ',')}
              </span>
              {product.originalPrice > product.salePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Em até 12x sem juros</p>
          </div>

          {/* Action Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full group-hover:bg-bronze group-hover:text-white"
            onClick={() => openWhatsApp(product.name)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Adicionar ao Carrinho
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;