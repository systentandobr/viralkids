import React from 'react';
import { ProductFilters, ProductCategory } from '../types/ecommerce.types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, RotateCcw } from 'lucide-react';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFilterChange: (key: keyof ProductFilters, value: any) => void;
  onResetFilters: () => void;
  categories: ProductCategory[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  categories
}) => {
  const priceRange = [filters.minPrice || 0, filters.maxPrice || 500];

  const handlePriceRangeChange = (values: number[]) => {
    onFilterChange('minPrice', values[0]);
    onFilterChange('maxPrice', values[1]);
  };

  const brands = ['Little Princess', 'Adventure Kids', 'Smart Toys', 'School Bags', 'Arte Kids'];
  const colors = ['Rosa', 'Azul', 'Verde', 'Vermelho', 'Amarelo', 'Roxo', 'Branco', 'Preto'];
  const sizes = ['RN', '3 meses', '6 meses', '1 ano', '2 anos', '4 anos', '6 anos', '8 anos', '10 anos'];

  const toggleArrayFilter = (key: keyof ProductFilters, value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    onFilterChange(key, newArray.length > 0 ? newArray : undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Limpar
        </Button>
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Categoria
        </label>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={filters.category === category.id}
                onChange={(e) => onFilterChange('category', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">
                {category.icon} {category.name} ({category.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Faixa de Preço */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Faixa de Preço
        </label>
        <div className="px-3">
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            max={500}
            min={0}
            step={10}
            className="mb-3"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Marcas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Marca
        </label>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center">
              <input
                type="radio"
                name="brand"
                value={brand}
                checked={filters.brand === brand}
                onChange={(e) => onFilterChange('brand', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cores */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Cores
        </label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => toggleArrayFilter('colors', color)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                (filters.colors || []).includes(color)
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Tamanhos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tamanhos
        </label>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleArrayFilter('sizes', size)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                (filters.sizes || []).includes(size)
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Avaliação Mínima */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Avaliação Mínima
        </label>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating}
                onChange={(e) => onFilterChange('rating', Number(e.target.value))}
                className="mr-2"
              />
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {rating}+ estrelas
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Filtros Especiais */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Especiais
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStock === true}
              onChange={(e) => onFilterChange('inStock', e.target.checked || undefined)}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">Apenas em estoque</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isNew === true}
              onChange={(e) => onFilterChange('isNew', e.target.checked || undefined)}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">Produtos novos</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isFeatured === true}
              onChange={(e) => onFilterChange('isFeatured', e.target.checked || undefined)}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">Em destaque</span>
          </label>
        </div>
      </div>
    </div>
  );
};