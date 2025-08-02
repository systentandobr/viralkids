import React from 'react';
import { Button } from '@/components/ui/button';
import logoBrand from '@/assets/logo-brand.avif';

interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  isActive: boolean;
  productCount: number;
}

interface BrandSelectorProps {
  selectedBrand?: string;
  onBrandSelect: (brandId: string) => void;
  className?: string;
}

const mockBrands: Brand[] = [
  {
    id: 'little-princess',
    name: 'Little Princess',
    logo: logoBrand,
    description: 'Roupas elegantes para princesas',
    isActive: true,
    productCount: 15
  },
  {
    id: 'adventure-kids',
    name: 'Adventure Kids',
    logo: logoBrand,
    description: 'Para pequenos aventureiros',
    isActive: true,
    productCount: 12
  },
  {
    id: 'smart-toys',
    name: 'Smart Toys',
    logo: logoBrand,
    description: 'Brinquedos educativos',
    isActive: true,
    productCount: 8
  },
  {
    id: 'school-bags',
    name: 'School Bags',
    logo: logoBrand,
    description: 'Mochilas e acessórios escolares',
    isActive: true,
    productCount: 6
  },
  {
    id: 'arte-kids',
    name: 'Arte Kids',
    logo: logoBrand,
    description: 'Materiais de arte e criatividade',
    isActive: true,
    productCount: 10
  },
  {
    id: 'baby-care',
    name: 'Baby Care',
    logo: logoBrand,
    description: 'Cuidados para bebês',
    isActive: true,
    productCount: 7
  },
  {
    id: 'sports-junior',
    name: 'Sports Junior',
    logo: logoBrand,
    description: 'Artigos esportivos infantis',
    isActive: true,
    productCount: 5
  },
  {
    id: 'eco-kids',
    name: 'Eco Kids',
    logo: logoBrand,
    description: 'Produtos sustentáveis',
    isActive: true,
    productCount: 4
  }
];

export const BrandSelector: React.FC<BrandSelectorProps> = ({
  selectedBrand,
  onBrandSelect,
  className = ''
}) => {
  return (
    <section className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      
      <div className="relative">
        {/* Efeito de desfoque nas bordas para simular carrossel */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        {/* Container scrollável horizontal */}
        <div className="overflow-x-auto scrollbar-hide pb-4">
          <div className="flex gap-4 min-w-max px-0">
            {mockBrands.map((brand) => (
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
                  relative bg-gray-50 rounded-2xl p-6 w-48 h-48 flex flex-col items-center justify-center
                  border-2 transition-all duration-300
                  ${selectedBrand === brand.id 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-gray-200 group-hover:border-primary/50 group-hover:bg-primary/2'
                  }
                `}>
                  {/* Logo */}
                  <div className="w-32 h-32 mb-3 bg-white rounded-full flex items-center justify-center shadow-md">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-16 h-16 object-contain rounded-full"
                    />
                  </div>
                  
                  {/* Indicador de seleção */}
                  {selectedBrand === brand.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  )}
                </div>

                {/* Descrição */}
                <p className="text-xs text-gray-500 text-center mt-3 max-w-40 truncate">
                  {brand.description}
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
          <div className="text-2xl font-bold text-primary">{mockBrands.length}</div>
          <div className="text-xs text-gray-600">Marcas Parceiras</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {mockBrands.reduce((sum, brand) => sum + brand.productCount, 0)}
          </div>
          <div className="text-xs text-gray-600">Produtos Únicos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">100%</div>
          <div className="text-xs text-gray-600">Qualidade</div>
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