import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductReview, ReviewFilters, ReviewSort, ReviewsProps } from '../types/product-detail.types';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Verified, 
  Filter,
  ChevronDown,
  Camera,
  MessageSquare,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react';

// Componente para renderizar estrelas
const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ 
  rating, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`${sizeClasses[size]} ${
            index < Math.floor(rating)
              ? 'text-yellow-400 fill-current'
              : index < rating
              ? 'text-yellow-400 fill-current opacity-50'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

// Componente para estatísticas de avaliações
const ReviewStats: React.FC<{ reviews: ProductReview[] }> = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  // Distribuição de estrelas
  const ratingDistribution = Array.from({ length: 5 }, (_, index) => {
    const star = 5 - index;
    const count = reviews.filter(review => review.rating === star).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  const verifiedCount = reviews.filter(review => review.verified).length;
  const withPhotosCount = reviews.filter(review => review.images && review.images.length > 0).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400 fill-current" />
          Avaliações dos Clientes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumo geral */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={averageRating} size="lg" />
            <div className="text-base text-gray-600 mt-1">
              {totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-base text-gray-600 w-8">{star}★</span>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="text-base text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas adicionais */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <Verified className="h-4 w-4" />
              <span className="font-medium">{verifiedCount}</span>
            </div>
            <div className="text-sm text-gray-600">Compras verificadas</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Camera className="h-4 w-4" />
              <span className="font-medium">{withPhotosCount}</span>
            </div>
            <div className="text-sm text-gray-600">Com fotos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para filtros de avaliações
const ReviewFiltersComponent: React.FC<{
  filters: ReviewFilters;
  onFiltersChange: (filters: ReviewFilters) => void;
  onSortChange: (sort: ReviewSort) => void;
  sort: ReviewSort;
}> = ({ filters, onFiltersChange, onSortChange, sort }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros e Ordenação
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Ordenação */}
          <div>
            <label className="text-base font-medium text-gray-700 mb-2 block">
              Ordenar por
            </label>
            <div className="flex gap-2">
              <Button
                variant={sort.field === 'date' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSortChange({ field: 'date', direction: 'desc' })}
              >
                <Calendar className="h-3 w-3 mr-1" />
                Mais recentes
              </Button>
              <Button
                variant={sort.field === 'helpful' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSortChange({ field: 'helpful', direction: 'desc' })}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                Mais úteis
              </Button>
              <Button
                variant={sort.field === 'rating' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSortChange({ field: 'rating', direction: 'desc' })}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Maior nota
              </Button>
            </div>
          </div>

          {/* Filtros por avaliação */}
          <div>
            <label className="text-base font-medium text-gray-700 mb-2 block">
              Filtrar por estrelas
            </label>
            <div className="flex gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={filters.rating === rating ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFiltersChange({ 
                    ...filters, 
                    rating: filters.rating === rating ? undefined : rating 
                  })}
                >
                  {rating}★
                </Button>
              ))}
            </div>
          </div>

          {/* Filtros especiais */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.verified ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltersChange({ ...filters, verified: !filters.verified })}
            >
              <Verified className="h-3 w-3 mr-1" />
              Verificadas
            </Button>
            <Button
              variant={filters.withImages ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltersChange({ ...filters, withImages: !filters.withImages })}
            >
              <Camera className="h-3 w-3 mr-1" />
              Com fotos
            </Button>
          </div>

          {/* Limpar filtros */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFiltersChange({})}
            className="w-full"
          >
            Limpar filtros
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

// Componente individual de avaliação
const ReviewCard: React.FC<{ 
  review: ProductReview;
  onHelpful: (reviewId: string, helpful: boolean) => void;
}> = ({ review, onHelpful }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userVote, setUserVote] = useState<'helpful' | 'not-helpful' | null>(null);

  const handleVote = (helpful: boolean) => {
    if (userVote === (helpful ? 'helpful' : 'not-helpful')) {
      setUserVote(null);
    } else {
      setUserVote(helpful ? 'helpful' : 'not-helpful');
      onHelpful(review.id, helpful);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header da avaliação */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.userAvatar} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{review.userName}</span>
                  {review.verified && (
                    <Badge variant="secondary" className="text-sm">
                      <Verified className="h-3 w-3 mr-1" />
                      Verificado
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Avaliações específicas */}
            {(review.quality || review.delivery || review.fit) && (
              <div className="text-right space-y-1">
                {review.quality && (
                  <div className="text-sm text-gray-600">
                    Qualidade: <StarRating rating={review.quality} size="sm" />
                  </div>
                )}
                {review.delivery && (
                  <div className="text-sm text-gray-600">
                    Entrega: <StarRating rating={review.delivery} size="sm" />
                  </div>
                )}
                {review.fit && (
                  <div className="text-sm">
                    <Badge 
                      variant={review.fit === 'perfect' ? 'default' : 'secondary'}
                      className="text-sm"
                    >
                      Caimento: {
                        review.fit === 'small' ? 'Pequeno' :
                        review.fit === 'perfect' ? 'Perfeito' :
                        'Grande'
                      }
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Título da avaliação */}
          {review.title && (
            <h4 className="font-medium text-gray-900">{review.title}</h4>
          )}

          {/* Comentário */}
          <div className="text-gray-700">
            <p className={!isExpanded && review.comment.length > 200 ? 'line-clamp-3' : ''}>
              {review.comment}
            </p>
            {review.comment.length > 200 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-0 h-auto mt-2 text-primary"
              >
                {isExpanded ? 'Ver menos' : 'Ver mais'}
              </Button>
            )}
          </div>

          {/* Prós e contras */}
          {(review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {review.pros && review.pros.length > 0 && (
                <div>
                  <h5 className="text-base font-medium text-green-700 mb-2">👍 Pontos positivos</h5>
                  <ul className="space-y-1">
                    {review.pros.map((pro, index) => (
                      <li key={index} className="text-base text-gray-600">• {pro}</li>
                    ))}
                  </ul>
                </div>
              )}
              {review.cons && review.cons.length > 0 && (
                <div>
                  <h5 className="text-base font-medium text-red-700 mb-2">👎 Pontos negativos</h5>
                  <ul className="space-y-1">
                    {review.cons.map((con, index) => (
                      <li key={index} className="text-base text-gray-600">• {con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Imagens da avaliação */}
          {review.images && review.images.length > 0 && (
            <div>
              <h5 className="text-base font-medium text-gray-700 mb-2">Fotos do cliente</h5>
              <div className="grid grid-cols-3 gap-2">
                {review.images.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Foto da avaliação ${index + 1}`}
                    className="aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
                {review.images.length > 3 && (
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-base text-gray-600">
                    +{review.images.length - 3} fotos
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Informações da compra */}
          {(review.size || review.color) && (
            <div className="flex gap-4 text-base text-gray-600">
              {review.size && <span>Tamanho: {review.size}</span>}
              {review.color && <span>Cor: {review.color}</span>}
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <span className="text-base text-gray-600">Esta avaliação foi útil?</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(true)}
                className={`text-sm ${userVote === 'helpful' ? 'text-green-600' : 'text-gray-500'}`}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                Sim ({review.helpful})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(false)}
                className={`text-sm ${userVote === 'not-helpful' ? 'text-red-600' : 'text-gray-500'}`}
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
                Não ({review.notHelpful})
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="text-sm">
              <MessageSquare className="h-3 w-3 mr-1" />
              Responder
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente principal de avaliações
export const ProductReviews: React.FC<ReviewsProps> = ({
  reviews,
  productId,
  onAddReview
}) => {
  const [filters, setFilters] = useState<ReviewFilters>({});
  const [sort, setSort] = useState<ReviewSort>({ field: 'date', direction: 'desc' });
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Aplicar filtros e ordenação
  const filteredReviews = reviews
    .filter(review => {
      if (filters.rating && review.rating !== filters.rating) return false;
      if (filters.verified && !review.verified) return false;
      if (filters.withImages && (!review.images || review.images.length === 0)) return false;
      if (filters.size && review.size !== filters.size) return false;
      if (filters.color && review.color !== filters.color) return false;
      if (filters.fit && review.fit !== filters.fit) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sort.field) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'helpful':
          aValue = a.helpful;
          bValue = b.helpful;
          break;
        default:
          return 0;
      }

      if (sort.direction === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 5);

  const handleHelpful = (reviewId: string, helpful: boolean) => {
    // Implementar lógica para marcar como útil
    console.log(`Review ${reviewId} marked as ${helpful ? 'helpful' : 'not helpful'}`);
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <ReviewStats reviews={reviews} />

      {/* Filtros */}
      <ReviewFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        sort={sort}
        onSortChange={setSort}
      />

      {/* Lista de avaliações */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredReviews.length} {filteredReviews.length === 1 ? 'Avaliação' : 'Avaliações'}
          </h3>
          
          {onAddReview && (
            <Button size="sm">
              Escrever avaliação
            </Button>
          )}
        </div>

        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Nenhuma avaliação encontrada
              </h3>
              <p className="text-gray-500">
                {filters.rating || filters.verified || filters.withImages
                  ? 'Tente ajustar os filtros para ver mais avaliações'
                  : 'Seja o primeiro a avaliar este produto!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {displayedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpful={handleHelpful}
              />
            ))}

            {/* Botão para mostrar mais */}
            {filteredReviews.length > 5 && !showAllReviews && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews(true)}
                >
                  Ver todas as {filteredReviews.length} avaliações
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};