import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Gift,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import type { ReferralAnalytics } from '@/services/referral/referralAnalytics.service';

interface ReferralMetricsCardsProps {
  analytics: ReferralAnalytics;
  isLoading?: boolean;
}

export const ReferralMetricsCards: React.FC<ReferralMetricsCardsProps> = ({
  analytics,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-1/3 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: 'Taxa Conversão Landing Page',
      value: `${analytics.landingPageConversionRate.toFixed(1)}%`,
      description: 'Visitas → Leads',
      icon: TrendingUp,
      trend: analytics.landingPageConversionRate > 5 ? 'up' : 'down',
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Taxa Conversão Leads',
      value: `${analytics.leadConversionRate.toFixed(1)}%`,
      description: 'Leads → Clientes',
      icon: Users,
      trend: analytics.leadConversionRate > 20 ? 'up' : 'down',
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      title: 'Taxa Conversão Indicações',
      value: `${analytics.referralConversionRate.toFixed(1)}%`,
      description: 'Indicações → Novos Clientes',
      icon: Target,
      trend: analytics.referralConversionRate > 70 ? 'up' : 'down',
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      title: 'CAC (Custo Aquisição)',
      value: `R$ ${analytics.cac.toFixed(2)}`,
      description: 'Custo por Cliente',
      icon: DollarSign,
      trend: analytics.cac < 100 ? 'down' : 'up',
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
    {
      title: 'LTV (Lifetime Value)',
      value: `R$ ${analytics.ltv.toFixed(2)}`,
      description: 'Valor Vitalício Cliente',
      icon: BarChart3,
      trend: analytics.ltv > analytics.cac * 3 ? 'up' : 'down',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: 'ROI Médio Campanhas',
      value: `${analytics.averageCampaignROI.toFixed(1)}%`,
      description: 'Retorno sobre Investimento',
      icon: TrendingUp,
      trend: analytics.averageCampaignROI > 200 ? 'up' : 'down',
      color: 'text-pink-600',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;
        
        return (
          <Card
            key={index}
            className={`${metric.bgColor} ${metric.borderColor} border`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
              <div className={`flex items-center mt-2 text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                <TrendIcon className="h-3 w-3 mr-1" />
                {metric.trend === 'up' ? 'Bom' : 'Atenção'}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

