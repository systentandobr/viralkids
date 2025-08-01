import React from 'react';
import { ProductCategory } from '../types/ecommerce.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCategoriesProps {
  categories: ProductCategory[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

// Ícones SVG inline como fallback
const CategoryIcons = {
  all: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  brinquedos: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  roupas: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  livros: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  bebes: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  arte: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M15 7l3-3m0 0h-3m3 0v3" />
    </svg>
  ),
  musica: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  saude: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  default: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
};

export const ProductCategories: React.FC<ProductCategoriesProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
  };

  // Função para obter o ícone da categoria
  const getCategoryIcon = (category: ProductCategory) => {
    const iconKey = category.slug.toLowerCase();
    return CategoryIcons[iconKey as keyof typeof CategoryIcons] || CategoryIcons.default;
  };

  // Categorias padrão caso não haja dados
  const defaultCategories: ProductCategory[] = [
    {
      id: 'all',
      name: 'Todos',
      slug: 'all',
      description: 'Todos os produtos',
      image: '',
      icon: 'star',
      productCount: categories.reduce((total, cat) => total + cat.productCount, 0),
      isActive: true
    },
    {
      id: 'brinquedos',
      name: 'Brinquedos',
      slug: 'brinquedos',
      description: 'Brinquedos educativos e divertidos',
      image: '',
      icon: 'gamepad',
      productCount: 45,
      isActive: true
    },
    {
      id: 'roupas',
      name: 'Roupas',
      slug: 'roupas',
      description: 'Roupas confortáveis para crianças',
      image: '',
      icon: 'shirt',
      productCount: 32,
      isActive: true
    },
    {
      id: 'livros',
      name: 'Livros',
      slug: 'livros',
      description: 'Livros infantis e educativos',
      image: '',
      icon: 'book',
      productCount: 28,
      isActive: true
    },
    {
      id: 'bebes',
      name: 'Bebês',
      slug: 'bebes',
      description: 'Produtos especiais para bebês',
      image: '',
      icon: 'baby',
      productCount: 23,
      isActive: true
    },
    {
      id: 'arte',
      name: 'Arte & Criatividade',
      slug: 'arte',
      description: 'Materiais para artesanato e pintura',
      image: '',
      icon: 'palette',
      productCount: 19,
      isActive: true
    }
  ];

  // Usar categorias reais se disponíveis, senão usar as padrão
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Explore por Categoria
        </h2>
        <p className="text-gray-600">
          Encontre produtos organizados por categoria
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const IconComponent = getCategoryIcon(category);

          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5 border-primary' 
                  : 'hover:border-primary/30'
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center space-y-3">
                  {/* Ícone da categoria */}
                  <div className={`p-3 rounded-full ${
                    isSelected 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {IconComponent}
                  </div>

                  {/* Nome da categoria */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-gray-900">
                      {category.name}
                    </h3>
                    
                    {/* Contador de produtos */}
                    <Badge 
                      variant={isSelected ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {category.productCount} produtos
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Versão mobile com scroll horizontal */}
      <div className="md:hidden mt-6">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {displayCategories.map((category) => {
            const isSelected = selectedCategory === category.id;
            const IconComponent = getCategoryIcon(category);

            return (
              <div
                key={category.id}
                className={`flex-shrink-0 w-24 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary text-white' 
                    : 'bg-white border border-gray-200 hover:border-primary/30'
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="flex flex-col items-center space-y-2">
                  {React.cloneElement(IconComponent, { className: "h-5 w-5" })}
                  <span className="text-xs font-medium text-center">
                    {category.name}
                  </span>
                  <Badge 
                    variant={isSelected ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {category.productCount}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}; 