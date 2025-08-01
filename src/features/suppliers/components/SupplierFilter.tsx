import React from 'react';
import { SupplierFilter as SupplierFilterType } from '../types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SupplierFilterProps {
  currentFilter: SupplierFilterType;
  onFilterChange: (filter: Partial<SupplierFilterType>) => void;
  onClearFilters: () => void;
}

const STATES = [
  { value: 'pernambuco', label: 'Pernambuco' },
  { value: 'ceara', label: 'Ceará' },
  { value: 'rio_grande_do_norte', label: 'Rio Grande do Norte' },
  { value: 'paraiba', label: 'Paraíba' },
  { value: 'alagoas', label: 'Alagoas' },
  { value: 'sergipe', label: 'Sergipe' },
  { value: 'bahia', label: 'Bahia' }
];

const CITIES = {
  pernambuco: ['Petrolina', 'Recife', 'Jaboatão', 'Olinda', 'Caruaru'],
  ceara: ['Fortaleza', 'Itapipoca', 'Sobral', 'Juazeiro do Norte', 'Caucaia'],
  rio_grande_do_norte: ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo', 'Currais Novos'],
  paraiba: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos'],
  alagoas: ['Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios'],
  sergipe: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana'],
  bahia: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari']
};

const CATEGORIES = [
  'Roupas Infantis',
  'Calçados',
  'Acessórios',
  'Brinquedos',
  'Artigos para Bebê',
  'Decoração',
  'Material Escolar'
];

const PAYMENT_METHODS = [
  { value: 'pix', label: 'PIX' },
  { value: 'credit_card', label: 'Cartão de Crédito' },
  { value: 'debit_card', label: 'Cartão de Débito' },
  { value: 'bank_transfer', label: 'Transferência' },
  { value: 'cash', label: 'Dinheiro' },
  { value: 'check', label: 'Cheque' }
];

export const SupplierFilter: React.FC<SupplierFilterProps> = ({
  currentFilter,
  onFilterChange,
  onClearFilters
}) => {
  const handleStateChange = (state: string, checked: boolean) => {
    const currentStates = currentFilter.states || [];
    const newStates = checked
      ? [...currentStates, state]
      : currentStates.filter(s => s !== state);
    
    onFilterChange({ 
      states: newStates.length > 0 ? newStates : undefined,
      cities: undefined // Reset cities when states change
    });
  };

  const handleCityChange = (city: string, checked: boolean) => {
    const currentCities = currentFilter.cities || [];
    const newCities = checked
      ? [...currentCities, city]
      : currentCities.filter(c => c !== city);
    
    onFilterChange({ cities: newCities.length > 0 ? newCities : undefined });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = currentFilter.categories || [];
    const newCategories = checked
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category);
    
    onFilterChange({ categories: newCategories.length > 0 ? newCategories : undefined });
  };

  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    const currentMethods = currentFilter.paymentMethods || [];
    const newMethods = checked
      ? [...currentMethods, method]
      : currentMethods.filter(m => m !== method);
    
    onFilterChange({ paymentMethods: newMethods.length > 0 ? newMethods : undefined });
  };

  const handleRatingChange = (value: number[]) => {
    onFilterChange({ rating: value[0] > 0 ? value[0] : undefined });
  };

  const getAvailableCities = () => {
    if (!currentFilter.states || currentFilter.states.length === 0) {
      return [];
    }
    
    const allCities: string[] = [];
    currentFilter.states.forEach(state => {
      const stateCities = CITIES[state as keyof typeof CITIES] || [];
      allCities.push(...stateCities);
    });
    
    return [...new Set(allCities)].sort();
  };

  const availableCities = getAvailableCities();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          disabled={Object.keys(currentFilter).length === 0}
        >
          <X className="h-4 w-4 mr-2" />
          Limpar Tudo
        </Button>
      </div>

      {/* Estados */}
      <div className="space-y-3">
        <Label className="text-md font-medium">Estados</Label>
        <div className="grid grid-cols-2 gap-2">
          {STATES.map(state => (
            <div key={state.value} className="flex items-center space-x-2">
              <Checkbox
                id={`state-${state.value}`}
                checked={currentFilter.states?.includes(state.value) || false}
                onCheckedChange={(checked) => 
                  handleStateChange(state.value, checked as boolean)
                }
              />
              <Label 
                htmlFor={`state-${state.value}`}
                className="text-md cursor-pointer"
              >
                {state.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Cidades */}
      {availableCities.length > 0 && (
        <div className="space-y-3">
          <Label className="text-md font-medium">Cidades</Label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {availableCities.map(city => (
              <div key={city} className="flex items-center space-x-2">
                <Checkbox
                  id={`city-${city}`}
                  checked={currentFilter.cities?.includes(city) || false}
                  onCheckedChange={(checked) => 
                    handleCityChange(city, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`city-${city}`}
                  className="text-md cursor-pointer"
                >
                  {city}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avaliação Mínima */}
      <div className="space-y-3">
        <Label className="text-md font-medium">
          Avaliação Mínima: {currentFilter.rating?.toFixed(1) || '0.0'} ⭐
        </Label>
        <Slider
          value={[currentFilter.rating || 0]}
          onValueChange={handleRatingChange}
          max={5}
          min={0}
          step={0.5}
          className="w-full"
        />
      </div>

      {/* Categorias */}
      <div className="space-y-3">
        <Label className="text-md font-medium">Categorias</Label>
        <div className="grid grid-cols-1 gap-2">
          {CATEGORIES.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={currentFilter.categories?.includes(category) || false}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category, checked as boolean)
                }
              />
              <Label 
                htmlFor={`category-${category}`}
                className="text-md cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Formas de Pagamento */}
      <div className="space-y-3">
        <Label className="text-md font-medium">Formas de Pagamento</Label>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map(method => (
            <div key={method.value} className="flex items-center space-x-2">
              <Checkbox
                id={`payment-${method.value}`}
                checked={currentFilter.paymentMethods?.includes(method.value) || false}
                onCheckedChange={(checked) => 
                  handlePaymentMethodChange(method.value, checked as boolean)
                }
              />
              <Label 
                htmlFor={`payment-${method.value}`}
                className="text-md cursor-pointer"
              >
                {method.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Opções Especiais */}
      <div className="space-y-3">
        <Label className="text-md font-medium">Opções Especiais</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={currentFilter.verified || false}
              onCheckedChange={(checked) => 
                onFilterChange({ verified: checked ? true : undefined })
              }
            />
            <Label htmlFor="verified" className="text-md cursor-pointer">
              Apenas Verificados
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={currentFilter.featured || false}
              onCheckedChange={(checked) => 
                onFilterChange({ featured: checked ? true : undefined })
              }
            />
            <Label htmlFor="featured" className="text-md cursor-pointer">
              Apenas em Destaque
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="no-cnpj"
              checked={currentFilter.requiresCNPJ === false}
              onCheckedChange={(checked) => 
                onFilterChange({ requiresCNPJ: checked ? false : undefined })
              }
            />
            <Label htmlFor="no-cnpj" className="text-md cursor-pointer">
              Não Requer CNPJ
            </Label>
          </div>
        </div>
      </div>

      {/* Resumo dos Filtros Ativos */}
      {Object.keys(currentFilter).length > 0 && (
        <div className="border-t pt-4">
          <Label className="text-md font-medium mb-2 block">Filtros Ativos:</Label>
          <div className="flex flex-wrap gap-1">
            {currentFilter.states?.map(state => (
              <Badge key={state} variant="secondary" className="text-xs">
                {STATES.find(s => s.value === state)?.label}
              </Badge>
            ))}
            {currentFilter.cities?.map(city => (
              <Badge key={city} variant="secondary" className="text-xs">
                {city}
              </Badge>
            ))}
            {currentFilter.categories?.map(category => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
            {currentFilter.verified && (
              <Badge variant="secondary" className="text-xs">Verificados</Badge>
            )}
            {currentFilter.featured && (
              <Badge variant="secondary" className="text-xs">Destaque</Badge>
            )}
            {currentFilter.requiresCNPJ === false && (
              <Badge variant="secondary" className="text-xs">Sem CNPJ</Badge>
            )}
            {currentFilter.rating && (
              <Badge variant="secondary" className="text-xs">
                ⭐ {currentFilter.rating.toFixed(1)}+
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
