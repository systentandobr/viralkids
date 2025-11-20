import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  DollarSign, 
  Target,
  Users,
  Activity
} from "lucide-react";
import type { Franchise } from "@/services/franchise/franchiseService";

interface FranchisePerformanceCardProps {
  franchises: Franchise[];
}

export const FranchisePerformanceCard = ({ franchises }: FranchisePerformanceCardProps) => {
  const activeFranchises = franchises.filter(f => f.status === 'active');
  
  // Calcular métricas agregadas
  const metrics = {
    totalSales: activeFranchises.reduce((sum, f) => sum + (f.metrics?.totalSales || 0), 0),
    totalOrders: activeFranchises.reduce((sum, f) => sum + (f.metrics?.totalOrders || 0), 0),
    totalLeads: activeFranchises.reduce((sum, f) => sum + (f.metrics?.totalLeads || 0), 0),
    totalCustomers: activeFranchises.reduce((sum, f) => sum + (f.metrics?.customerCount || 0), 0),
    averageConversionRate: activeFranchises.length > 0
      ? activeFranchises.reduce((sum, f) => sum + (f.metrics?.conversionRate || 0), 0) / activeFranchises.length
      : 0,
    averageGrowthRate: activeFranchises.length > 0
      ? activeFranchises.reduce((sum, f) => sum + (f.metrics?.growthRate || 0), 0) / activeFranchises.length
      : 0,
    averageTicket: activeFranchises.length > 0
      ? activeFranchises.reduce((sum, f) => sum + (f.metrics?.averageTicket || 0), 0) / activeFranchises.length
      : 0
  };

  // Top 3 franquias por vendas
  const topFranchises = [...activeFranchises]
    .sort((a, b) => (b.metrics?.totalSales || 0) - (a.metrics?.totalSales || 0))
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-600" />
          Performance Geral
        </CardTitle>
        <CardDescription>
          Visão consolidada de todas as franquias ativas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Vendas Totais
            </div>
            <div className="text-2xl font-bold text-neon-cyan">
              R$ {(metrics.totalSales / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingCart className="h-4 w-4" />
              Pedidos Totais
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {metrics.totalOrders}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Leads Totais
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {metrics.totalLeads}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Clientes Totais
            </div>
            <div className="text-2xl font-bold text-neon-green">
              {metrics.totalCustomers}
            </div>
          </div>
        </div>

        {/* Taxa de Conversão e Crescimento */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Taxa de Conversão Média</span>
              <span className="text-sm font-semibold">{metrics.averageConversionRate.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.averageConversionRate} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Crescimento Médio</span>
              <div className="flex items-center gap-1">
                {metrics.averageGrowthRate > 0 ? (
                  <TrendingUp className="h-4 w-4 text-neon-green" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-neon-red" />
                )}
                <span className="text-sm font-semibold">{metrics.averageGrowthRate.toFixed(1)}%</span>
              </div>
            </div>
            <Progress 
              value={Math.abs(metrics.averageGrowthRate)} 
              className="h-2"
            />
          </div>
        </div>

        {/* Top 3 Franquias */}
        {topFranchises.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">Top 3 Franquias por Vendas</h4>
            <div className="space-y-2">
              {topFranchises.map((franchise, index) => (
                <div
                  key={franchise.id}
                  className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Badge variant="secondary" className="w-6 h-6 flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{franchise.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {franchise.location.city}, {franchise.location.state}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-neon-cyan">
                      R$ {franchise.metrics ? ((franchise.metrics.totalSales / 1000).toFixed(0) + 'k') : '0'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {franchise.metrics && franchise.metrics.growthRate > 0 ? (
                        <span className="text-neon-green flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {franchise.metrics.growthRate.toFixed(1)}%
                        </span>
                      ) : franchise.metrics ? (
                        <span className="text-neon-red flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          {Math.abs(franchise.metrics.growthRate).toFixed(1)}%
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

