import React from 'react';
import { Button } from '@/components/ui/button';
import { useFeaturedBrands, useBrandStats } from '@/services/supplier/brands/hooks';
import { Brand } from '@/services/supplier/brands/types';

interface BrandSelectorProps {
  selectedBrand?: string;
  onBrandSelect: (brandId: string) => void;
  className?: string;
}

export const BrandSelector: React.FC<BrandSelectorProps> = ({
  selectedBrand,
  onBrandSelect,
  className = ''
}) => {
  const { data: brands, isLoading, error } = useFeaturedBrands();
  const { data: stats } = useBrandStats();

  if (isLoading) {
    return (
      <section className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-500">Carregando marcas em destaque...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <div className="text-red-500">Erro ao carregar marcas em destaque</div>
        </div>
      </section>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <section className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-500">Nenhuma marca em destaque encontrada</div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      
      <div className="relative">
        {/* Efeito de desfoque nas bordas para simular carrossel */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        {/* Container scrollável horizontal */}
        <div className="overflow-x-auto scrollbar-hide pb-4">
          <div className="flex gap-4 min-w-max px-0">
            {brands.map((brand: Brand) => (
              <div
                key={brand.id}
                className={`flex-shrink-0 group cursor-pointer transition-all duration-300 ${
                  selectedBrand === brand.id
                    ? 'transform scale-105'
                    : 'hover:transform hover:scale-102'
                }`}
                onClick={() => onBrandSelect(brand.id)}
              >
                <div className={`
                  relative rounded-2xl w-32 h-32 flex flex-col items-center justify-center transition-all duration-300
                  ${selectedBrand === brand.id 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-gray-200 group-hover:border-primary/50 group-hover:bg-primary/2'
                  }
                `}>
                  {/* Logo */}
                  <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center shadow-md">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-32 h-32 object-contain rounded-full"
                    />
                  </div>
                  
                  {/* Indicador de seleção */}
                  {selectedBrand === brand.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  )}

                  {/* Badge de nível de parceria */}
                  <div className={`absolute -top-2 -left-2 px-2 py-1 rounded-full text-xs font-medium ${
                    brand.partnershipLevel === 'gold' ? 'bg-yellow-500 text-white' :
                    brand.partnershipLevel === 'silver' ? 'bg-gray-400 text-white' :
                    'bg-orange-600 text-white'
                  }`}>
                    {brand.partnershipLevel === 'gold' ? '🥇' :
                     brand.partnershipLevel === 'silver' ? '🥈' : '🥉'}
                  </div>
                </div>

                {/* Nome da marca */}
                <p className="text-sm font-medium text-gray-900 text-center mt-2 max-w-40 truncate">
                  {brand.name}
                </p>

                {/* Descrição */}
                <p className="text-xs text-gray-500 text-center mt-1 max-w-40 truncate">
                  {brand.description}
                </p>

                {/* Localização */}
                <p className="text-xs text-gray-400 text-center mt-1 max-w-40 truncate">
                  📍 {brand.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botão Ver Todos (versão desktop) */}
      <div className="hidden md:flex justify-center mt-6">
        <Button
          variant="outline"
          onClick={() => onBrandSelect('all')}
          className="text-primary border-primary hover:bg-primary hover:text-white"
        >
          Ver todos os parceiros
        </Button>
      </div>

      {/* Stats das marcas */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{stats?.totalBrands || 0}</div>
          <div className="text-xs text-gray-600">Marcas Parceiras</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{stats?.totalProducts || 0}</div>
          <div className="text-xs text-gray-600">Produtos Únicos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">100%</div>
          <div className="text-xs text-gray-600">Qualidade</div>
        </div>
      </div>

      {/* Informações adicionais sobre parcerias */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-xs text-gray-500">
          <div>🥇 Parceiros Gold: {stats?.goldPartners || 0}</div>
          <div>🥈 Parceiros Silver: {stats?.silverPartners || 0}</div>
          <div>🥉 Parceiros Bronze: {stats?.bronzePartners || 0}</div>
        </div>
      </div>
    </section>
  );
};

// CSS personalizado para esconder a scrollbar
const styles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
  }
`;

// Injetar CSS
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}