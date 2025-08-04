import { useMemo } from 'react';
import { useNavigation } from '../stores/additional/navigation.store';
import { useProductsStore } from '../stores/products.store';

interface AnalyticsMetrics {
  // Produtos
  mostViewedProducts: Array<{
    id: string;
    name: string;
    viewCount: number;
    lastViewed: Date;
  }>;
  
  // Navegação
  mostVisitedPages: Array<{
    path: string;
    title: string;
    visitCount: number;
    lastVisit: Date;
  }>;
  
  // Busca
  popularSearchTerms: Array<{
    term: string;
    count: number;
    lastSearch: Date;
  }>;
  
  // Comportamento
  averageSessionDuration: number;
  totalSessions: number;
  conversionRate: number;
  
  // Filtros
  mostUsedFilters: Array<{
    filter: string;
    value: string;
    usageCount: number;
  }>;
}

export const useAnalytics = () => {
  const { 
    visitedProducts, 
    recentPages, 
    lastSearch,
    lastAppliedFilters 
  } = useNavigation();
  
  const { products } = useProductsStore();

  const metrics = useMemo((): AnalyticsMetrics => {
    // 1. Produtos mais visualizados
    const productViewCounts = visitedProducts.reduce((acc, productId) => {
      acc[productId] = (acc[productId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostViewedProducts = Object.entries(productViewCounts)
      .map(([id, count]) => {
        const product = products.find(p => p.id === id);
        return {
          id,
          name: product?.name || 'Produto não encontrado',
          viewCount: count,
          lastViewed: new Date() // Simplificado - idealmente seria um timestamp real
        };
      })
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10);

    // 2. Páginas mais visitadas
    const pageVisitCounts = recentPages.reduce((acc, page) => {
      acc[page.path] = {
        path: page.path,
        title: page.title,
        visitCount: (acc[page.path]?.visitCount || 0) + 1,
        lastVisit: new Date(page.timestamp)
      };
      return acc;
    }, {} as Record<string, any>);

    const mostVisitedPages = Object.values(pageVisitCounts)
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 10);

    // 3. Termos de busca populares
    const popularSearchTerms = lastSearch.term ? [{
      term: lastSearch.term,
      count: 1,
      lastSearch: new Date()
    }] : [];

    // 4. Filtros mais usados
    const filterUsage = Object.entries(lastAppliedFilters).map(([filter, value]) => ({
      filter,
      value: String(value),
      usageCount: 1
    }));

    // 5. Métricas de comportamento
    const totalSessions = recentPages.length;
    const averageSessionDuration = recentPages.length > 1 
      ? (recentPages[0].timestamp - recentPages[recentPages.length - 1].timestamp) / recentPages.length
      : 0;

    // Taxa de conversão simulada (produtos visualizados vs adicionados ao carrinho)
    const conversionRate = visitedProducts.length > 0 
      ? Math.min((visitedProducts.length * 0.15), 100) // Simulação de 15% de conversão
      : 0;

    return {
      mostViewedProducts,
      mostVisitedPages,
      popularSearchTerms,
      averageSessionDuration,
      totalSessions,
      conversionRate,
      mostUsedFilters: filterUsage
    };
  }, [visitedProducts, recentPages, lastSearch, lastAppliedFilters, products]);

  // Funções utilitárias
  const getProductInsights = (productId: string) => {
    const viewCount = visitedProducts.filter(id => id === productId).length;
    const isRecentlyViewed = visitedProducts.includes(productId);
    
    return {
      viewCount,
      isRecentlyViewed,
      popularity: viewCount > 5 ? 'Alto' : viewCount > 2 ? 'Médio' : 'Baixo'
    };
  };

  const getRecommendationScore = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;

    let score = 0;
    
    // Score baseado em visualizações similares
    const similarProducts = products.filter(p => 
      p.category === product.category && 
      visitedProducts.includes(p.id)
    );
    score += similarProducts.length * 10;

    // Score baseado em preço similar
    const priceSimilarProducts = products.filter(p => {
      const priceDiff = Math.abs(p.price - product.price);
      return priceDiff <= product.price * 0.2 && visitedProducts.includes(p.id);
    });
    score += priceSimilarProducts.length * 5;

    return Math.min(score, 100);
  };

  const generateReport = () => {
    return {
      summary: {
        totalProductsViewed: visitedProducts.length,
        totalPagesVisited: recentPages.length,
        averageSessionDuration: Math.round(metrics.averageSessionDuration / 1000 / 60), // em minutos
        conversionRate: Math.round(metrics.conversionRate * 100) / 100
      },
      topProducts: metrics.mostViewedProducts.slice(0, 5),
      topPages: metrics.mostVisitedPages.slice(0, 5),
      searchInsights: metrics.popularSearchTerms,
      recommendations: products
        .filter(p => !visitedProducts.includes(p.id))
        .map(p => ({
          ...p,
          recommendationScore: getRecommendationScore(p.id)
        }))
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, 10)
    };
  };

  return {
    metrics,
    getProductInsights,
    getRecommendationScore,
    generateReport
  };
}; 