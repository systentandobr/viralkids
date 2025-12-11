import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReferralFunnelData } from '@/services/referral/referralAnalytics.service';

interface FunnelChartProps {
  data: ReferralFunnelData;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  const stages = [
    { label: 'Visitas Landing Page', value: data.visits, color: 'bg-blue-500' },
    { label: 'Leads', value: data.leads, color: 'bg-purple-500' },
    { label: 'Clientes', value: data.customers, color: 'bg-green-500' },
    { label: 'Indicações', value: data.referrals, color: 'bg-yellow-500' },
    { label: 'Indicações Completadas', value: data.completedReferrals, color: 'bg-orange-500' },
    { label: 'Pedidos', value: data.orders, color: 'bg-pink-500' },
    { label: 'Recompensas', value: data.rewards, color: 'bg-emerald-500' },
  ];

  const maxValue = Math.max(...stages.map(s => s.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de Conversão</CardTitle>
        <CardDescription>
          Visualização completa do funil de vendas por indicação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const width = maxValue > 0 ? (stage.value / maxValue) * 100 : 0;
            const conversionRate = index > 0 && stages[index - 1].value > 0
              ? (stage.value / stages[index - 1].value) * 100
              : 0;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium w-48">{stage.label}</span>
                    <span className="text-sm font-bold">{stage.value.toLocaleString()}</span>
                  </div>
                  {index > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {conversionRate.toFixed(1)}% conversão
                    </span>
                  )}
                </div>
                <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stage.color} transition-all duration-500 flex items-center justify-end pr-2`}
                    style={{ width: `${width}%` }}
                  >
                    {width > 10 && (
                      <span className="text-xs text-white font-medium">
                        {stage.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Taxas de Conversão */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold mb-3">Taxas de Conversão</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {data.conversionRates.visitsToLeads.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Visitas → Leads</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {data.conversionRates.leadsToCustomers.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Leads → Clientes</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {data.conversionRates.customersToReferrals.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Clientes → Indicações</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">
                {data.conversionRates.referralsToCompleted.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Indicações → Completadas</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-pink-600">
                {data.conversionRates.completedToOrders.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Completadas → Pedidos</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-emerald-600">
                {data.conversionRates.ordersToRewards.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Pedidos → Recompensas</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

