import React from 'react';
import { Product } from '../types/ecommerce.types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode,
  onAddToCart
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <div className="text-gray-400 text-6xl mb-4">🛍️</div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="text-gray-500">
          Tente ajustar os filtros ou buscar por outros termos
        </p>
      </div>
    );
  }

  const gridClasses = viewMode === 'grid' 
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    : 'flex flex-col gap-4';

  return (
    <div className={gridClasses}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  );
};