import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw,
} from 'lucide-react';
import { ReferralMetricsCards } from './components/ReferralMetricsCards';
import { ReferralAnalyticsService, type ReferralAnalytics } from '@/services/referral/referralAnalytics.service';
import { useAuthContext } from '@/features/auth';

export const ReferralAnalyticsDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const [analytics, setAnalytics] = useState<ReferralAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange, user?.unitId]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const endDate = new Date().toISOString();
      const startDate = new Date();
      
      switch (dateRange) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case 'all':
          startDate.setFullYear(2020); // Data inicial do sistema
          break;
      }

      const response = await ReferralAnalyticsService.getAnalytics({
        startDate: startDate.toISOString(),
        endDate,
        franchiseId: user?.unitId,
      });

      if (response.success && response.data) {
        setAnalytics(response.data);
      } else {
        // Mock data para desenvolvimento
        setAnalytics({
          landingPageConversionRate: 8.5,
          leadConversionRate: 25.3,
          referralConversionRate: 72.1,
          cac: 45.50,
          ltv: 850.00,
          ltvCacRatio: 18.7,
          averageCampaignROI: 285.5,
          totalCampaigns: 12,
          activeCampaigns: 8,
          totalReferrals: 1250,
          completedReferrals: 890,
          totalRewardsPaid: 35600,
          totalRewardsValue: 35600,
          averageRewardValue: 40.00,
          pendingRewards: 12,
          averageReferralsPerCustomer: 3.2,
          topIndicatorsCount: 45,
          reactivationRate: 15.3,
          dailyMetrics: [],
          campaignComparison: [],
          rewardDistribution: {
            cashback: 60,
            points: 25,
            discount: 10,
            physical: 5,
          },
        });
      }
    } catch (err) {
      console.error('Erro ao carregar analytics:', err);
      setError('Erro ao carregar dados de analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Implementar exportação de dados
    console.log('Exportar analytics');
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadAnalytics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics de Indicações</h2>
          <p className="text-muted-foreground">
            Métricas completas do sistema de vendas por indicação
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant={dateRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('7d')}
            >
              7 dias
            </Button>
            <Button
              variant={dateRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('30d')}
            >
              30 dias
            </Button>
            <Button
              variant={dateRange === '90d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('90d')}
            >
              90 dias
            </Button>
            <Button
              variant={dateRange === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange('all')}
            >
              Todos
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={loadAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <ReferralMetricsCards analytics={analytics!} isLoading={isLoading} />

      {/* Métricas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campanhas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalCampaigns || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.activeCampaigns || 0} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Indicações</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalReferrals || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.completedReferrals || 0} completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recompensas Pagas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(analytics?.totalRewardsValue || 0).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.pendingRewards || 0} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Indicadores</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.topIndicatorsCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Média: {analytics?.averageReferralsPerCustomer.toFixed(1) || '0'} por cliente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com análises detalhadas */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="rewards">Recompensas</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral do Funil</CardTitle>
              <CardDescription>
                Métricas principais do funil de conversão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {analytics?.landingPageConversionRate.toFixed(1) || '0'}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Visitas → Leads
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {analytics?.leadConversionRate.toFixed(1) || '0'}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Leads → Clientes
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {analytics?.referralConversionRate.toFixed(1) || '0'}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Indicações → Clientes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Campanhas</CardTitle>
              <CardDescription>
                Performance de todas as campanhas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.campaignComparison && analytics.campaignComparison.length > 0 ? (
                <div className="space-y-2">
                  {analytics.campaignComparison.map((campaign) => (
                    <div
                      key={campaign.campaignId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{campaign.campaignName}</div>
                        <div className="text-sm text-muted-foreground">
                          {campaign.completedReferrals} de {campaign.totalReferrals} indicações
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {campaign.conversionRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ROI: {campaign.roi.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma campanha encontrada no período selecionado
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Recompensas</CardTitle>
              <CardDescription>
                Tipos de recompensas mais utilizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.rewardDistribution && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cashback</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${analytics.rewardDistribution.cashback}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {analytics.rewardDistribution.cashback}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pontos</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600"
                          style={{ width: `${analytics.rewardDistribution.points}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {analytics.rewardDistribution.points}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Desconto</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600"
                          style={{ width: `${analytics.rewardDistribution.discount}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {analytics.rewardDistribution.discount}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Físico</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-600"
                          style={{ width: `${analytics.rewardDistribution.physical}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {analytics.rewardDistribution.physical}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução Temporal</CardTitle>
              <CardDescription>
                Tendências dos últimos dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.dailyMetrics && analytics.dailyMetrics.length > 0 ? (
                <div className="space-y-2">
                  {analytics.dailyMetrics.slice(-7).map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {new Date(metric.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {metric.leads} leads, {metric.referrals} indicações
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          R$ {metric.revenue.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {metric.completedReferrals} completadas
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Dados de evolução temporal não disponíveis
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

