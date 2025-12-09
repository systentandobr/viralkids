import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, MapPin } from "lucide-react";
import type { RegionalTrend } from "@/services/franchise/franchiseService";

interface RegionalTrendsCardProps {
  trends: RegionalTrend[];
}

export const RegionalTrendsCard = ({ trends }: RegionalTrendsCardProps) => {
  const getTrendIcon = (trend: RegionalTrend['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-neon-green" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-neon-red" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: RegionalTrend['trend']) => {
    switch (trend) {
      case 'up':
        return 'text-neon-green';
      case 'down':
        return 'text-neon-red';
      case 'stable':
        return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-orange-600" />
          Tendências Regionais
        </CardTitle>
        <CardDescription>
          Análise de performance por região e estado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {trends.map((trend, index) => (
          <div
            key={`${trend.state}-${index}`}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-base">{trend.state}</span>
                  <Badge variant="secondary" className="text-sm">
                    {trend.franchisesCount} {trend.franchisesCount === 1 ? 'unidade' : 'unidades'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {trend.region}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(trend.trend)}
                <span className={`text-base font-semibold ${getTrendColor(trend.trend)}`}>
                  {trend.growthRate > 0 ? '+' : ''}{trend.growthRate.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Vendas Totais</div>
                <div className="text-base font-semibold text-neon-cyan">
                  R$ {(trend.totalSales / 1000).toFixed(0)}k
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Ticket Médio</div>
                <div className="text-base font-semibold">
                  R$ {trend.averageTicket.toFixed(2)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Leads</div>
                <div className="text-base font-semibold text-orange-600">
                  {trend.leadsCount}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Conversão</div>
                <div className="text-base font-semibold">
                  {trend.conversionRate.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Barra de progresso para crescimento */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Crescimento</span>
                <span className={`text-sm font-semibold ${getTrendColor(trend.trend)}`}>
                  {trend.growthRate > 0 ? '+' : ''}{trend.growthRate.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${trend.trend === 'up'
                      ? 'bg-neon-green'
                      : trend.trend === 'down'
                        ? 'bg-neon-red'
                        : 'bg-gray-400'
                    }`}
                  style={{
                    width: `${Math.min(Math.abs(trend.growthRate), 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        {trends.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-base">Nenhuma tendência regional disponível</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

