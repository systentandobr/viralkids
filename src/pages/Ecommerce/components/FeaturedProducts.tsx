import React from 'react';
import { Product } from '../types/ecommerce.types';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onAddToCart
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const productsPerPage = 4;

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + productsPerPage >= products.length ? 0 : prev + productsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, products.length - productsPerPage) : prev - productsPerPage
    );
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + productsPerPage);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ⭐ Produtos em Destaque
          </h2>
          <p className="text-gray-600">
            Os produtos mais populares selecionados especialmente para você
          </p>
        </div>

        {products.length > productsPerPage && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              disabled={currentIndex + productsPerPage >= products.length}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode="grid"
            onAddToCart={() => onAddToCart(product)}
          />
        ))}
      </div>

      {products.length > productsPerPage && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {Array.from({ 
              length: Math.ceil(products.length / productsPerPage) 
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * productsPerPage)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  Math.floor(currentIndex / productsPerPage) === index
                    ? 'bg-primary-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};