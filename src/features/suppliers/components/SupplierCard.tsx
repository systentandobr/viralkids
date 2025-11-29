import React from 'react';
import { Supplier } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, Shield, Instagram, Globe, Phone } from 'lucide-react';

interface SupplierCardProps {
  supplier: Supplier;
  onContact?: (supplier: Supplier) => void;
  onViewDetails?: (supplier: Supplier) => void;
  compact?: boolean;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  onContact,
  onViewDetails,
  compact = false
}) => {
  const formatRating = (rating: number) => rating.toFixed(1);
  
  const formatLocation = () => {
    return `${supplier.location.city}, ${supplier.location.state}`;
  };

  const getBusinessTypeLabel = (type: string) => {
    const labels = {
      fabricante: 'Fabricante',
      distribuidor: 'Distribuidor',
      atacado: 'Atacado',
      varejo: 'Varejo'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const openInstagram = () => {
    if (supplier.instagram) {
      window.open(supplier.instagram, '_blank');
    }
  };

  const openWebsite = () => {
    if (supplier.website) {
      window.open(supplier.website, '_blank');
    }
  };

  const contactSupplier = () => {
    if (onContact && supplier.phone) {
      onContact(supplier);
    }
  };

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-base">{supplier.name}</h3>
                {supplier.verified && (
                  <Shield className="h-4 w-4 text-blue-600" />
                )}
                {supplier.featured && (
                  <Badge variant="secondary">Destaque</Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                <MapPin className="h-3 w-3" />
                <span>{formatLocation()}</span>
              </div>
              
              <div className="flex items-center space-x-1 mb-2">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-sm">{formatRating(supplier.rating.overall)}</span>
                <span className="text-sm text-gray-500">
                  ({supplier.rating.totalReviews})
                </span>
              </div>
            </div>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onViewDetails?.(supplier)}
            >
              Ver
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className="text-lg">{supplier.name}</CardTitle>
              {supplier.verified && (
                <Shield className="h-5 w-5 text-blue-600" title="Fornecedor Verificado" />
              )}
            </div>
            
            {supplier.featured && (
              <Badge className="mb-2">⭐ Em Destaque</Badge>
            )}
            
            <div className="flex items-center space-x-1 text-gray-600 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-base">{formatLocation()}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{formatRating(supplier.rating.overall)}</span>
              <span className="text-base text-gray-500">
                ({supplier.rating.totalReviews} avaliações)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Descrição */}
        {supplier.description && (
          <p className="text-base text-gray-600 line-clamp-2">
            {supplier.description}
          </p>
        )}

        {/* Informações do Negócio */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            {getBusinessTypeLabel(supplier.businessInfo.businessType)}
          </Badge>
          
          {supplier.businessInfo.requiresCNPJ ? (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Requer CNPJ
            </Badge>
          ) : (
            <Badge variant="outline" className="text-green-600 border-green-200">
              Não requer CNPJ
            </Badge>
          )}
        </div>

        {/* Políticas */}
        <div className="text-base space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">Pedido mínimo:</span>
            <span className="font-medium">{supplier.policies.minimumOrder} peças</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Prazo entrega:</span>
            <span className="font-medium">{supplier.policies.deliveryTime} dias</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pagamento:</span>
            <span className="font-medium">
              {supplier.policies.paymentMethods.slice(0, 2).join(', ')}
              {supplier.policies.paymentMethods.length > 2 && '...'}
            </span>
          </div>
        </div>

        {/* Produtos */}
        {supplier.products.length > 0 && (
          <div>
            <h4 className="text-base font-medium mb-2">Categorias:</h4>
            <div className="flex flex-wrap gap-1">
              {supplier.products.slice(0, 3).map((product, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {product.name}
                </Badge>
              ))}
              {supplier.products.length > 3 && (
                <Badge variant="secondary" className="text-sm">
                  +{supplier.products.length - 3} mais
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex space-x-2 pt-2">
          {supplier.phone && (
            <Button 
              disabled={!supplier.phone}
              className="flex-1" 
              onClick={contactSupplier}
              size="sm"
            >
              <Phone className="h-4 w-4 mr-2" />
              Contatar
            </Button>
          )}
          
          <div className="flex space-x-1">
            {supplier.instagram && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1" 
                onClick={openInstagram}
                title="Instagram do Fornecedor"
              >
                <Instagram className="h-4 w-4" />
              </Button>
            )}
            
            {supplier.website && (
              <Button
                variant="outline"
                size="sm"
                onClick={openWebsite}
                title="Abrir Website do Fornecedor"
              >
                <Globe className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
