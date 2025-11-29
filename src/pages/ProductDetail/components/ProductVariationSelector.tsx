import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductVariation, SelectedVariations } from '../types/product-detail.types';
import { Check, AlertCircle } from 'lucide-react';

interface ProductVariationSelectorProps {
  variations: ProductVariation[];
  selectedVariations: SelectedVariations;
  onVariationChange: (type: string, value: string) => void;
  disabled?: boolean;
}

export const ProductVariationSelector: React.FC<ProductVariationSelectorProps> = ({
  variations,
  selectedVariations,
  onVariationChange,
  disabled = false
}) => {
  // Agrupar variações por tipo
  const groupedVariations = variations.reduce((acc, variation) => {
    if (!acc[variation.type]) {
      acc[variation.type] = [];
    }
    acc[variation.type].push(variation);
    return acc;
  }, {} as Record<string, ProductVariation[]>);

  const getVariationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      color: 'Cor',
      size: 'Tamanho',
      material: 'Material',
      style: 'Estilo'
    };
    return labels[type] || type;
  };

  const renderColorVariation = (variation: ProductVariation, isSelected: boolean) => {
    return (
      <button
        key={variation.id}
        onClick={() => onVariationChange(variation.type, variation.value)}
        disabled={disabled || !variation.available}
        className={`
          relative w-12 h-12 rounded-full border-2 transition-all duration-200
          ${isSelected 
            ? 'border-primary ring-2 ring-primary/20 scale-110' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${!variation.available && 'opacity-50 cursor-not-allowed'}
          ${disabled && 'cursor-not-allowed opacity-50'}
        `}
        title={variation.displayValue}
      >
        {/* Cor de fundo */}
        <div 
          className="w-full h-full rounded-full"
          style={{ 
            backgroundColor: variation.value.toLowerCase(),
            backgroundImage: variation.value.includes('gradient') ? variation.value : undefined
          }}
        />
        
        {/* Ícone de selecionado */}
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full p-1">
              <Check className="h-3 w-3 text-primary" />
            </div>
          </div>
        )}

        {/* Indicador de indisponível */}
        {!variation.available && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-red-500 rotate-45" />
          </div>
        )}
      </button>
    );
  };

  const renderSizeVariation = (variation: ProductVariation, isSelected: boolean) => {
    return (
      <Button
        key={variation.id}
        variant={isSelected ? "default" : "outline"}
        size="sm"
        onClick={() => onVariationChange(variation.type, variation.value)}
        disabled={disabled || !variation.available}
        className={`
          min-w-[3rem] relative
          ${!variation.available && 'opacity-50 cursor-not-allowed line-through'}
          ${isSelected && 'ring-2 ring-primary/20'}
        `}
      >
        {variation.displayValue}
        
        {/* Badge de estoque baixo */}
        {variation.available && variation.stock <= 3 && variation.stock > 0 && (
          <div className="absolute -top-1 -right-1">
            <Badge variant="destructive" className="text-sm px-1 py-0">
              {variation.stock}
            </Badge>
          </div>
        )}
      </Button>
    );
  };

  const renderDefaultVariation = (variation: ProductVariation, isSelected: boolean) => {
    return (
      <Button
        key={variation.id}
        variant={isSelected ? "default" : "outline"}
        size="sm"
        onClick={() => onVariationChange(variation.type, variation.value)}
        disabled={disabled || !variation.available}
        className={`
          ${!variation.available && 'opacity-50 cursor-not-allowed line-through'}
          ${isSelected && 'ring-2 ring-primary/20'}
        `}
      >
        {variation.displayValue}
        {variation.price && (
          <span className="ml-2 text-base text-muted-foreground">
            +R$ {variation.price.toFixed(2)}
          </span>
        )}
      </Button>
    );
  };

  const renderVariationGroup = (type: string, variationList: ProductVariation[]) => {
    const selectedValue = selectedVariations[type];
    const availableCount = variationList.filter(v => v.available).length;
    const selectedVariation = variationList.find(v => v.value === selectedValue);

    return (
      <div key={type} className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">
              {getVariationTypeLabel(type)}
            </h3>
            {selectedVariation && (
              <span className="text-base text-gray-600">
                - {selectedVariation.displayValue}
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            {availableCount} de {variationList.length} disponíveis
          </div>
        </div>

        {/* Renderizar variações baseado no tipo */}
        <div className="flex flex-wrap gap-2">
          {variationList.map((variation) => {
            const isSelected = selectedValue === variation.value;

            switch (type) {
              case 'color':
                return renderColorVariation(variation, isSelected);
              case 'size':
                return renderSizeVariation(variation, isSelected);
              default:
                return renderDefaultVariation(variation, isSelected);
            }
          })}
        </div>

        {/* Informações adicionais */}
        {selectedVariation && (
          <div className="space-y-2">
            {/* Estoque */}
            {selectedVariation.stock <= 10 && selectedVariation.stock > 0 && (
              <div className="flex items-center gap-2 text-base">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-orange-600">
                  Apenas {selectedVariation.stock} unidade(s) em estoque
                </span>
              </div>
            )}

            {/* Preço adicional */}
            {selectedVariation.price && selectedVariation.price > 0 && (
              <div className="text-base text-gray-600">
                Valor adicional: +R$ {selectedVariation.price.toFixed(2)}
              </div>
            )}
          </div>
        )}

        {/* Aviso de seleção obrigatória */}
        {!selectedValue && (
          <div className="text-base text-gray-500 italic">
            Selecione uma opção para continuar
          </div>
        )}
      </div>
    );
  };

  if (!variations || variations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Opções Disponíveis
        </h2>
        
        {Object.entries(groupedVariations).map(([type, variationList]) =>
          renderVariationGroup(type, variationList)
        )}
      </div>

      {/* Resumo da seleção */}
      {Object.keys(selectedVariations).length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Seleção atual:</h4>
          <div className="space-y-1 text-base text-gray-600">
            {Object.entries(selectedVariations).map(([type, value]) => {
              const variation = variations.find(v => v.type === type && v.value === value);
              return (
                <div key={type} className="flex justify-between">
                  <span>{getVariationTypeLabel(type)}:</span>
                  <span className="font-medium">
                    {variation?.displayValue || value}
                    {variation?.price && variation.price > 0 && (
                      <span className="text-green-600 ml-1">
                        (+R$ {variation.price.toFixed(2)})
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};