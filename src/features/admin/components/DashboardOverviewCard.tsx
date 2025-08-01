import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target, 
  Calendar,
  Star,
  Building,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { DashboardOverview } from '../types';

interface DashboardOverviewCardProps {
  overview: DashboardOverview;
}

export const DashboardOverviewCard: React.FC<DashboardOverviewCardProps> = ({ overview }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? 
      <ArrowUpRight className="h-4 w-4 text-green-600" /> : 
      <ArrowDownRight className="h-4 w-4 text-red-600" />;
  };

  const metrics = [
    {
      title: 'Total de Leads',
      value: overview.totalLeads.toLocaleString(),
      subtitle: `+${overview.newLeadsToday} hoje`,
      icon: <Users className="h-6 w-6 text-blue-600" />,
      trend: overview.newLeadsToday,
      color: 'blue'
    },
    {
      title: 'Franquias Ativas',
      value: overview.activeFranchises.toLocaleString(),
      subtitle: 'Total operando',
      icon: <Building className="h-6 w-6 text-purple-600" />,
      color: 'purple'
    },
    {
      title: 'Receita Total',
      value: formatCurrency(overview.totalRevenue),
      subtitle: formatPercentage(overview.monthlyGrowth),
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      trend: overview.monthlyGrowth,
      color: 'green'
    },
    {
      title: 'Taxa de Conversão',
      value: `${overview.conversionRate.toFixed(1)}%`,
      subtitle: 'Leads → Franquias',
      icon: <Target className="h-6 w-6 text-orange-600" />,
      color: 'orange'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(overview.averageTicket),
      subtitle: 'Por franquia',
      icon: <TrendingUp className="h-6 w-6 text-teal-600" />,
      color: 'teal'
    },
    {
      title: 'Satisfação',
      value: `${overview.customerSatisfaction.toFixed(1)}⭐`,
      subtitle: 'Avaliação média',
      icon: <Star className="h-6 w-6 text-yellow-600" />,
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Geral</h2>
          <p className="text-muted-foreground">Visão geral das métricas principais</p>
        </div>
        <div className="flex items-center space-x-2 text-md text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Últimos 30 dias</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-2">
                  <span className="text-md text-muted-foreground">
                    {metric.subtitle}
                  </span>
                  {metric.trend !== undefined && (
                    <div className={`flex items-center space-x-1 ${getGrowthColor(metric.trend)}`}>
                      {getGrowthIcon(metric.trend)}
                      <span className="text-xs font-medium">
                        {formatPercentage(Math.abs(metric.trend))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            
            {/* Color accent */}
            <div className={`absolute top-0 left-0 w-1 h-full bg-${metric.color}-500`} />
          </Card>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Metas do Mês</span>
            </CardTitle>
            <CardDescription>
              Progresso das principais metas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Novos Leads</span>
                <span>847 / 1000</span>
              </div>
              <Progress value={84.7} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Conversões</span>
                <span>23 / 30</span>
              </div>
              <Progress value={76.7} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Receita</span>
                <span>{formatCurrency(387500)} / {formatCurrency(450000)}</span>
              </div>
              <Progress value={86.1} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Tendências</span>
            </CardTitle>
            <CardDescription>
              Comparação com período anterior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Leads gerados</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  +18.5%
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Taxa de conversão</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  +2.3%
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Ticket médio</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  +7.8%
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Satisfação</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  +0.2pts
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Ver Leads</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Building className="h-6 w-6" />
              <span className="text-sm">Franquias</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">Relatórios</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
              <Star className="h-6 w-6" />
              <span className="text-sm">Fornecedores</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
