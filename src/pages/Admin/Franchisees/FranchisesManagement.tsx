import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Building, 
  Plus, 
  Search, 
  Edit,
  Filter,
  Download,
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  Activity
} from "lucide-react";
import React from "react";
import { useState, useMemo } from "react";
import { useFranchises, useRegionalTrends } from "@/services/queries/franchises";
import { FranchiseMap } from "./components/FranchiseMap";
import { FranchisePerformanceCard } from "./components/FranchisePerformanceCard";
import { RegionalTrendsCard } from "./components/RegionalTrendsCard";
import { FranchiseUsersManager } from "./components/FranchiseUsersManager";
import type { Franchise, RegionalTrend } from "@/services/franchise/franchiseService";
import { CreateFranchiseForm } from "@/components/franchises/CreateFranchiseForm";
import { FranchiseResponse } from "@/types/franchise.types";
// Exemplo de componente de modal/drawer (ajuste conforme sua biblioteca de UI)
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Fechar</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

const FranchisesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Buscar franquias da API
  const { data: franchisesData, isLoading, error } = useFranchises({
    search: searchTerm || undefined,
    status: selectedStatus.length === 1 ? selectedStatus[0] as any : undefined,
    type: selectedType.length === 1 ? selectedType[0] as any : undefined,
    state: selectedState.length > 0 ? selectedState : undefined,
  });

  const { data: regionalTrends, isLoading: isLoadingTrends } = useRegionalTrends();

  const franchises = franchisesData?.data || [];
  const filteredFranchises = franchises; // Já filtrado pela API

  // Calcular métricas agregadas
  const aggregatedMetrics = useMemo(() => {
    const activeFranchises = filteredFranchises.filter(f => f.status === 'active');
    return {
      totalFranchises: filteredFranchises.length,
      activeFranchises: activeFranchises.length,
      totalSales: activeFranchises.reduce((sum, f) => sum + (f.metrics?.totalSales || 0), 0),
      totalOrders: activeFranchises.reduce((sum, f) => sum + (f.metrics?.totalOrders || 0), 0),
      totalLeads: activeFranchises.reduce((sum, f) => sum + (f.metrics?.totalLeads || 0), 0),
      averageGrowthRate: activeFranchises.length > 0
        ? activeFranchises.reduce((sum, f) => sum + (f.metrics?.growthRate || 0), 0) / activeFranchises.length
        : 0
    };
  }, [filteredFranchises]);

  
  // Handler para sucesso na criação
  const handleCreateSuccess = () => {
    // Fechar modal
    setIsCreateModalOpen(false);
    
    // Recarregar lista
    setRefreshTrigger((prev) => prev + 1);
  };

  // Handler para cancelar criação
  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Carregando franquias...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <p className="text-red-600">Erro ao carregar franquias: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: Franchise['status']) => {
    switch (status) {
      case 'active':
        return "bg-neon-green/10 text-neon-green border-neon-green/20";
      case 'pending':
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case 'suspended':
        return "bg-neon-red/10 text-neon-red border-neon-red/20";
      case 'inactive':
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
      default:
        return "bg-muted border-border/50";
    }
  };

  const getTypeBadgeClass = (type: Franchise['type']) => {
    switch (type) {
      case 'premium':
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case 'express':
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case 'standard':
        return "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20";
      default:
        return "bg-muted border-border/50";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Carregando franquias...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <p className="text-red-600">Erro ao carregar franquias: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-neon">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Franquias</h1>
            <p className="text-muted-foreground">
              Sistema de gestão das franquias ativas e seus desempenhos
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
            className="gap-2"
          >
            <Building className="h-4 w-4" />
            Tabela
          </Button>
          <Button 
            variant={viewMode === 'map' ? 'default' : 'outline'}
            onClick={() => setViewMode('map')}
            className="gap-2"
          >
            <MapPin className="h-4 w-4" />
            Mapa
          </Button>
          <Button
             className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity shadow-neon"
             onClick={() => { setIsCreateModalOpen(true); }}
             >
            <Plus className="h-4 w-4 mr-2" />
            Nova Franquia
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Building className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Total Franquias</p>
              <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {aggregatedMetrics.totalFranchises}
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-neon-green/10 to-emerald-500/10 border-neon-green/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-emerald-500 flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Franquias Ativas</p>
              <h2 className="text-2xl font-bold text-neon-green">
                {aggregatedMetrics.activeFranchises}
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-neon-cyan/10 to-neon-blue/10 border-neon-cyan/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Vendas Totais</p>
              <h2 className="text-2xl font-bold text-neon-cyan">
                R$ {(aggregatedMetrics.totalSales / 1000).toFixed(0)}k
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Crescimento Médio</p>
              <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {aggregatedMetrics.averageGrowthRate.toFixed(1)}%
              </h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, proprietário, cidade ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border/50 focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 border-border/50 hover:border-purple-500">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" className="gap-2 border-border/50 hover:border-pink-500">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </Card>

      {/* View Mode Content */}
      {viewMode === 'map' ? (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FranchiseMap franchises={filteredFranchises} />
          </div>
          <div className="space-y-6">
            <FranchisePerformanceCard franchises={filteredFranchises} />
            <RegionalTrendsCard trends={regionalTrends || []} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="grid lg:grid-cols-2 gap-6">
            <FranchisePerformanceCard franchises={filteredFranchises} />
            <RegionalTrendsCard trends={regionalTrends || []} />
          </div>

          {/* Gerenciamento de Usuários - Mostrar quando uma franquia estiver selecionada */}
          {selectedFranchise && (
            <FranchiseUsersManager
              franchise={selectedFranchise}
              onUserAllocated={() => {
                // Recarregar dados se necessário
              }}
            />
          )}

          {/* Franchises Table */}
          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-muted/50">
                  <TableHead className="text-foreground font-semibold">ID</TableHead>
                  <TableHead className="text-foreground font-semibold">Franquia</TableHead>
                  <TableHead className="text-foreground font-semibold">Proprietário</TableHead>
                  <TableHead className="text-foreground font-semibold">Localização</TableHead>
                  <TableHead className="text-foreground font-semibold text-center">Tipo</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">Vendas</TableHead>
                  <TableHead className="text-foreground font-semibold text-center">Pedidos</TableHead>
                  <TableHead className="text-foreground font-semibold text-center">Leads</TableHead>
                  <TableHead className="text-foreground font-semibold text-center">Status</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFranchises.map((franchise) => (
                  <TableRow key={franchise.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-base text-muted-foreground">
                      {franchise.id}
                    </TableCell>
                    <TableCell className="font-medium">{franchise.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <span className="text-base">{franchise.owner.name}</span>
                        <span className="text-sm">{franchise.owner.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <span className="text-base flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {franchise.location.city}, {franchise.location.state}
                        </span>
                        <span className="text-sm">{franchise.location.type === 'physical' ? 'Física' : 'Digital'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={getTypeBadgeClass(franchise.type)}>
                        {franchise.type === 'premium' ? 'Premium' : franchise.type === 'express' ? 'Express' : 'Standard'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-neon-cyan">
                      R$ {franchise.metrics ? (franchise.metrics.totalSales / 1000).toFixed(0) + 'k' : '0'}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {franchise.metrics?.totalOrders || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-muted border-border/50">
                        {franchise.metrics?.totalLeads || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={getStatusBadgeClass(franchise.status)}>
                        {franchise.status === 'active' ? 'Ativa' : 
                         franchise.status === 'pending' ? 'Pendente' :
                         franchise.status === 'suspended' ? 'Suspensa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`h-8 w-8 p-0 hover:bg-purple-500/10 hover:text-purple-500 ${
                            selectedFranchise?.id === franchise.id ? "bg-purple-500/20" : ""
                          }`}
                          title="Gerenciar usuários"
                          onClick={() => setSelectedFranchise(
                            selectedFranchise?.id === franchise.id ? null : franchise
                          )}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-neon-blue/10 hover:text-neon-blue"
                          title="Editar franquia"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}  

       {/* Modal de criação */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={handleCreateCancel}
          title="Criar Nova Franquia"
        >
          <CreateFranchiseForm
            onSuccess={handleCreateSuccess}
            onCancel={handleCreateCancel}
          />
        </Modal>  
    </div>
  );
};

export default FranchisesManagement;

