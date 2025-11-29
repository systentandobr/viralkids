import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  Eye, 
  Clock, 
  ShoppingCart,
  Search,
  BarChart3,
  Users,
  Target
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { metrics, generateReport } = useAnalytics();
  const report = generateReport();

  const MetricCard = ({ 
    title, 
    value, 
    icon, 
    trend, 
    color = 'blue' 
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    color?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <div className={`text-${color}-600`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Dashboard de Analytics</h2>
        <Badge variant="outline">Tempo Real</Badge>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Produtos Visualizados"
          value={report.summary.totalProductsViewed}
          icon={<Eye className="h-4 w-4" />}
          trend="+12% este mês"
          color="blue"
        />
        
        <MetricCard
          title="Páginas Visitadas"
          value={report.summary.totalPagesVisited}
          icon={<BarChart3 className="h-4 w-4" />}
          trend="+8% esta semana"
          color="green"
        />
        
        <MetricCard
          title="Duração Média da Sessão"
          value={`${report.summary.averageSessionDuration} min`}
          icon={<Clock className="h-4 w-4" />}
          trend="+5% vs último mês"
          color="purple"
        />
        
        <MetricCard
          title="Taxa de Conversão"
          value={`${report.summary.conversionRate}%`}
          icon={<Target className="h-4 w-4" />}
          trend="+2.3% esta semana"
          color="orange"
        />
      </div>

      {/* Produtos Mais Visualizados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Produtos Mais Visualizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-base font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-base text-gray-500">
                      Visualizado {product.viewCount} vezes
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {product.viewCount} views
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Páginas Mais Visitadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Páginas Mais Visitadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.topPages.map((page, index) => (
              <div key={page.path} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-base font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{page.title}</p>
                    <p className="text-base text-gray-500">{page.path}</p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {page.visitCount} visits
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Produtos Recomendados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.recommendations.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-base font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-base text-gray-500">
                      Score: {product.recommendationScore}/100
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ {product.price.toFixed(2)}</p>
                  <Badge variant="outline">
                    {product.recommendationScore}% match
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights de Busca */}
      {report.searchInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Insights de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.searchInsights.map((search, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">"{search.term}"</p>
                      <p className="text-base text-gray-500">
                        Buscado {search.count} vezes
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {search.count} searches
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 