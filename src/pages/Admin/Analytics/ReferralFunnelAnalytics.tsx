import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { FunnelChart } from '@/components/analytics/FunnelChart';
import { CohortTable } from '@/components/analytics/CohortTable';
import { AttributionChart } from '@/components/analytics/AttributionChart';
import { ReferralAnalyticsService, type ReferralFunnelData } from '@/services/referral/referralAnalytics.service';
import { useAuthContext } from '@/features/auth';

export const ReferralFunnelAnalytics: React.FC = () => {
  const { user } = useAuthContext();
  const [funnelData, setFunnelData] = useState<ReferralFunnelData | null>(null);
  const [cohortData, setCohortData] = useState<any[]>([]);
  const [attributionData, setAttributionData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'30d' | '90d' | '1y' | 'all'>('90d');

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
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        case 'all':
          startDate.setFullYear(2020);
          break;
      }

      const [funnelResponse, cohortResponse] = await Promise.all([
        ReferralAnalyticsService.getFunnelData({
          startDate: startDate.toISOString(),
          endDate,
          franchiseId: user?.unitId,
        }),
        ReferralAnalyticsService.getCohortAnalysis({
          startDate: startDate.toISOString(),
          endDate,
          franchiseId: user?.unitId,
        }),
      ]);

      if (funnelResponse.success && funnelResponse.data) {
        setFunnelData(funnelResponse.data);
      } else {
        // Mock data para desenvolvimento
        setFunnelData({
          visits: 10000,
          leads: 850,
          customers: 215,
          referrals: 645,
          completedReferrals: 465,
          orders: 420,
          rewards: 400,
          conversionRates: {
            visitsToLeads: 8.5,
            leadsToCustomers: 25.3,
            customersToReferrals: 300.0,
            referralsToCompleted: 72.1,
            completedToOrders: 90.3,
            ordersToRewards: 95.2,
          },
        });
      }

      if (cohortResponse.success && cohortResponse.data) {
        setCohortData(cohortResponse.data);
      } else {
        // Mock data para desenvolvimento
        setCohortData([
          {
            cohort: 'Jan 2024',
            customers: 50,
            month0: 100,
            month1: 85,
            month2: 75,
            month3: 68,
            month6: 55,
            month12: 45,
          },
          {
            cohort: 'Fev 2024',
            customers: 65,
            month0: 100,
            month1: 88,
            month2: 78,
            month3: 70,
            month6: 0,
            month12: 0,
          },
        ]);
      }

      // Mock attribution data
      setAttributionData([
        {
          touchpoint: 'Landing Page',
          firstTouch: 45.2,
          lastTouch: 12.5,
          linear: 28.8,
          timeDecay: 22.3,
        },
        {
          touchpoint: 'Indicação',
          firstTouch: 25.8,
          lastTouch: 65.3,
          linear: 45.5,
          timeDecay: 55.2,
        },
        {
          touchpoint: 'Email Marketing',
          firstTouch: 15.3,
          lastTouch: 8.2,
          linear: 11.7,
          timeDecay: 10.5,
        },
        {
          touchpoint: 'Redes Sociais',
          firstTouch: 13.7,
          lastTouch: 14.0,
          linear: 14.0,
          timeDecay: 12.0,
        },
      ]);
    } catch (err) {
      console.error('Erro ao carregar analytics:', err);
      setError('Erro ao carregar dados de analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="text-muted-foreground">Carregando analytics...</p>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold">Analytics Avançado</h2>
          <p className="text-muted-foreground">
            Análises detalhadas do funil de conversão e atribuição
          </p>
        </div>
        <div className="flex items-center gap-2">
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
            variant={dateRange === '1y' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('1y')}
          >
            1 ano
          </Button>
          <Button
            variant={dateRange === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('all')}
          >
            Todos
          </Button>
          <Button variant="outline" size="sm" onClick={loadAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funnel">Funil de Conversão</TabsTrigger>
          <TabsTrigger value="cohort">Análise de Coortes</TabsTrigger>
          <TabsTrigger value="attribution">Atribuição Multi-Touch</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel">
          {funnelData && <FunnelChart data={funnelData} />}
        </TabsContent>

        <TabsContent value="cohort">
          {cohortData.length > 0 && <CohortTable data={cohortData} />}
        </TabsContent>

        <TabsContent value="attribution">
          {attributionData.length > 0 && <AttributionChart data={attributionData} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

