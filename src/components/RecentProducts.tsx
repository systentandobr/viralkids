import React from 'react';
import { useNavigation } from '../stores/additional/navigation.store';
import { useProductsStore } from '../stores/products.store';
import { Link } from '../router';

export const RecentProducts: React.FC = () => {
  const { visitedProducts } = useNavigation();
  const { products } = useProductsStore();

  // Filtrar produtos que foram visitados
  const recentProducts = products.filter(product => 
    visitedProducts.includes(product.id)
  ).slice(0, 4); // Mostrar apenas os 4 mais recentes

  if (recentProducts.length === 0) {
    return null; // Não mostrar se não há produtos visitados
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Produtos Vistos Recentemente
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recentProducts.map((product) => (
          <Link 
            key={product.id} 
            to={`/produto/${product.id}`}
            className="group block"
          >
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
              {product.images && product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              )}
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </h4>
              <p className="text-sm text-gray-500">
                R$ {product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}; 