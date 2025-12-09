import React, { useState } from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import { SupplierCard } from './SupplierCard';
import { SupplierFilter } from './SupplierFilter';
import { Supplier, SupplierFilter as SupplierFilterType } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List, MapPin, Star, Shield } from 'lucide-react';

interface SupplierCatalogProps {
  onSupplierContact?: (supplier: Supplier) => void;
  onSupplierDetails?: (supplier: Supplier) => void;
  showFilters?: boolean;
  maxSuppliers?: number;
  setMaxSuppliers?: (maxSuppliers: number) => void;
  title?: string;
  description?: string;
}

export const SupplierCatalog: React.FC<SupplierCatalogProps> = ({
  onSupplierContact,
  onSupplierDetails,
  showFilters = true,
  maxSuppliers,
  setMaxSuppliers,
  title = "Catálogo de Fornecedores",
  description = "Encontre os melhores fornecedores para sua franquia"
}) => {
  const {
    suppliers,
    loading,
    error,
    metrics,
    currentFilter,
    setFilter,
    clearFilters,
    getFeaturedSuppliers
  } = useSuppliers();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtrar por termo de busca
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Limitar número de fornecedores se especificado
  const displaySuppliers = maxSuppliers
    ? filteredSuppliers.slice(0, maxSuppliers)
    : filteredSuppliers;

  const featuredSuppliers = getFeaturedSuppliers();

  const handleFilterChange = (newFilter: Partial<SupplierFilterType>) => {
    setFilter(newFilter);
  };

  const handleContactSupplier = (supplier: Supplier) => {
    if (onSupplierContact) {
      onSupplierContact(supplier);
    } else if (supplier.phone) {
      // Ação padrão - abrir WhatsApp
      const message = `Olá! Vim através da plataforma Viral Kids e gostaria de saber mais sobre seus produtos para Minha AgentSchool.`;
      const whatsappUrl = `https://wa.me/${supplier.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      // Implementar modal ou página de detalhes
      console.log('Ver detalhes:', supplier);
    }
  };

  const handleViewDetails = (supplier: Supplier) => {
    if (onSupplierDetails) {
      onSupplierDetails(supplier);
    } else {
      // Implementar modal ou página de detalhes
      console.log('Ver detalhes:', supplier);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Métricas */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{metrics.totalSuppliers}</div>
                <div className="text-base text-muted-foreground">Fornecedores</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.verifiedSuppliers}</div>
                <div className="text-base text-muted-foreground">Verificados</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {metrics.averageRating.toFixed(1)}
                </div>
                <div className="text-base text-muted-foreground">Avaliação Média</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.topStates.length}</div>
                <div className="text-base text-muted-foreground">Estados</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Fornecedores em Destaque */}
      {featuredSuppliers?.length > 0 && !maxSuppliers && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="text-xl font-semibold">Fornecedores em Destaque</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredSuppliers?.map(supplier => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                onContact={handleContactSupplier}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Controles de Busca e Filtro */}
      {showFilters && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar fornecedores, cidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controles */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
                {Object.keys(currentFilter).length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.keys(currentFilter).length}
                  </Badge>
                )}
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Painel de Filtros */}
          {showFilterPanel && (
            <Card>
              <CardContent className="p-4">
                <SupplierFilter
                  currentFilter={currentFilter}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                />
              </CardContent>
            </Card>
          )}

          {/* Filtros Ativos */}
          {Object.keys(currentFilter).length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-base text-muted-foreground">Filtros ativos:</span>
              {currentFilter.states?.map(state => (
                <Badge key={state} variant="outline">
                  <MapPin className="h-3 w-3 mr-1" />
                  {state}
                </Badge>
              ))}
              {currentFilter.verified && (
                <Badge variant="outline">
                  <Shield className="h-3 w-3 mr-1" />
                  Verificados
                </Badge>
              )}
              {currentFilter.featured && (
                <Badge variant="outline">
                  <Star className="h-3 w-3 mr-1" />
                  Destaque
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-2 text-sm"
              >
                Limpar tudo
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Lista de Fornecedores */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-base text-muted-foreground">
            {displaySuppliers.length} fornecedor(es) encontrado(s)
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>

        {displaySuppliers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-2">
                <Search className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="text-lg font-medium">Nenhum fornecedor encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou termo de busca
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  clearFilters();
                }}>
                  Limpar Busca
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {displaySuppliers.map(supplier => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                onContact={handleContactSupplier}
                onViewDetails={handleViewDetails}
                compact={viewMode === 'list'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Load More */}
      {maxSuppliers && filteredSuppliers.length > maxSuppliers && (
        <div className="text-center">
          <Button variant="outline" size="lg" onClick={() => {
            setMaxSuppliers(maxSuppliers + 10);
          }}>
            Ver Mais Fornecedores ({filteredSuppliers.length - maxSuppliers} restantes)
          </Button>
        </div>
      )}
    </div>
  );
};
