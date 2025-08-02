import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AssistantButton from '@/components/ecommerce/AssistantButton';
import { ProductImageGallery } from './components/ProductImageGallery';
import { ProductVariationSelector } from './components/ProductVariationSelector';
import { SizeGuideComponent } from './components/SizeGuideComponent';
import { ProductReviews } from './components/ProductReviews';
import { RelatedProducts } from './components/RelatedProducts';
import { useProductDetail } from './hooks/useProductDetail';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  MapPin,
  Star,
  ChevronLeft,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  Zap,
  Copy,
  Facebook,
  Twitter,
  MessageCircle
} from 'lucide-react';
import { useRouter } from '@/router';
import { toast } from 'sonner';

const ProductDetailPage: React.FC = () => {
  const { navigate } = useRouter();
  const [productId, setProductId] = useState<string>('');
  
  // Estados locais da UI
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Pegar o ID do produto do localStorage
  useEffect(() => {
    const storedProductId = localStorage.getItem('selectedProductId');
    if (storedProductId) {
      setProductId(storedProductId);
    } else {
      // Se não há ID, redirecionar para a página principal
      navigate('/');
    }
  }, [navigate]);

  // Hook customizado para gerencia do produto
  const {
    product,
    loading,
    error,
    selectedVariations,
    selectedQuantity,
    availableStock,
    currentPrice,
    selectedImages,
    setSelectedVariations,
    setSelectedQuantity,
    addToCart,
    addToWishlist,
    shareProduct,
    trackInteraction
  } = useProductDetail(productId);

  useEffect(() => {
    console.log('product', product);
  }, [product]);

  // Verificar se todas as variações obrigatórias foram selecionadas
  const requiredVariationTypes = ['color', 'size'];
  const allRequiredSelected = requiredVariationTypes.every(type => 
    !product?.variations.some(v => v.type === type) || selectedVariations[type]
  );

  // Verificar disponibilidade baseada nas variações selecionadas
  const isAvailable = React.useMemo(() => {
    if (!allRequiredSelected || !product) return false;
    
    return Object.entries(selectedVariations).every(([type, value]) => {
      const variation = product.variations.find(v => v.type === type && v.value === value);
      return variation?.available && variation.stock > 0;
    });
  }, [selectedVariations, product?.variations, allRequiredSelected]);

  // Handlers
  const handleVariationChange = (type: string, value: string) => {
    const newVariations = { ...selectedVariations, [type]: value };
    setSelectedVariations(newVariations);
    
    trackInteraction({
      type: 'variation_change',
      productId: product?.id || '',
      details: { variationType: type, variationValue: value },
      timestamp: new Date().toISOString()
    });
  };

  const handleAddToCart = () => {
    if (!allRequiredSelected || !isAvailable) return;
    
    addToCart();
    
    // TODO: Mostrar toast de sucesso
    toast.success('Produto adicionado ao carrinho!');
  };

  const handleQuantityChange = (newQuantity: number) => {
    const quantity = Math.max(1, Math.min(newQuantity, availableStock));
    setSelectedQuantity(quantity);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      addToWishlist();
    }
  };

  const handleShare = (method: string) => {
    shareProduct(method);
    setShowShareMenu(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Produto não encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'O produto que você está procurando não existe ou foi removido.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={() => navigate('/')}>
              Ver Todos os Produtos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <button onClick={() => navigate('/')} className="hover:text-primary">
              Início
            </button>
            {product.categoryPath.map((category, index) => (
              <React.Fragment key={category}>
                <span>/</span>
                <span className={index === product.categoryPath.length - 1 ? 'text-gray-900 font-medium' : 'hover:text-primary cursor-pointer'}>
                  {category}
                </span>
              </React.Fragment>
            ))}
          </nav>

          {/* Botão Voltar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Galeria de Imagens */}
            <div>
              <ProductImageGallery
                images={selectedImages}
                selectedVariation={selectedVariations}
                productName={product.name}
              />
            </div>

            {/* Informações do Produto */}
            <div className="space-y-6">
              {/* Header do produto */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.brand}
                  </Badge>
                  {product.isNew && (
                    <Badge className="text-xs bg-green-500">
                      <Zap className="h-3 w-3 mr-1" />
                      Novo
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge variant="outline" className="text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Destaque
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>
                
                {/* Avaliações e Localização */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${
                            index < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviewCount} avaliações)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {product.franchiseLocation}
                  </div>
                </div>

                {/* Preços */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(currentPrice)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {product.discount && (
                      <Badge variant="destructive" className="text-sm">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>
                  
                  {currentPrice !== product.price && (
                    <div className="text-sm text-gray-600">
                      Preço base: {formatPrice(product.price)} + variações
                    </div>
                  )}
                </div>
              </div>

              {/* Variações */}
              <ProductVariationSelector
                variations={product.variations}
                selectedVariations={selectedVariations}
                onVariationChange={handleVariationChange}
              />

              {/* Quantidade e Compra */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(selectedQuantity - 1)}
                      disabled={selectedQuantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">
                      {selectedQuantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(selectedQuantity + 1)}
                      disabled={selectedQuantity >= availableStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {availableStock} unidades disponíveis
                  </div>
                </div>

                {/* Status de disponibilidade */}
                <div className="space-y-2">
                  {!allRequiredSelected ? (
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Selecione todas as opções para continuar</span>
                    </div>
                  ) : !isAvailable ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Combinação indisponível</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Disponível para entrega</span>
                    </div>
                  )}
                </div>

                {/* Botões de ação */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={!allRequiredSelected || !isAvailable}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Adicionar ao Carrinho - {formatPrice(currentPrice * selectedQuantity)}
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handleWishlistToggle}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                      {isWishlisted ? 'Na Lista' : 'Lista de Desejos'}
                    </Button>
                    
                    <div className="relative">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowShareMenu(!showShareMenu)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartilhar
                      </Button>
                      
                      {/* Menu de compartilhamento */}
                      {showShareMenu && (
                        <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-[200px]">
                          <button
                            onClick={() => handleShare('whatsapp')}
                            className="flex items-center gap-2 w-full p-2 text-sm hover:bg-gray-50 rounded"
                          >
                            <MessageCircle className="h-4 w-4 text-green-600" />
                            WhatsApp
                          </button>
                          <button
                            onClick={() => handleShare('facebook')}
                            className="flex items-center gap-2 w-full p-2 text-sm hover:bg-gray-50 rounded"
                          >
                            <Facebook className="h-4 w-4 text-blue-600" />
                            Facebook
                          </button>
                          <button
                            onClick={() => handleShare('twitter')}
                            className="flex items-center gap-2 w-full p-2 text-sm hover:bg-gray-50 rounded"
                          >
                            <Twitter className="h-4 w-4 text-blue-400" />
                            Twitter
                          </button>
                          <button
                            onClick={() => handleShare('copy')}
                            className="flex items-center gap-2 w-full p-2 text-sm hover:bg-gray-50 rounded"
                          >
                            <Copy className="h-4 w-4 text-gray-600" />
                            Copiar Link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações de entrega */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">
                        {product.shipping.freeShipping ? 'Frete Grátis' : 'Frete Calculado'}
                      </div>
                      <div className="text-xs text-gray-600">
                        {product.shipping.freeShipping && product.shipping.minOrderValue && 
                          `Em compras acima de ${formatPrice(product.shipping.minOrderValue)}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div className="text-sm">
                      Entrega em até {product.shipping.estimatedDays} dias úteis
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5 text-purple-600" />
                    <div className="text-sm">
                      Troca grátis em {product.warranty}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <div className="text-sm">
                      Compra 100% segura e protegida
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs com informações detalhadas */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="specifications">Especificações</TabsTrigger>
              <TabsTrigger value="size-guide">Guia de Tamanhos</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações ({product.reviewCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Descrição do Produto</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {product.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Materiais</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {product.materials.map((material, index) => (
                          <li key={index}>• {material}</li>
                        ))}
                      </ul>
                    </div>
                     
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Cuidados</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {product.careInstructions.map((instruction, index) => (
                          <li key={index}>• {instruction}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Especificações Técnicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b last:border-b-0">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="size-guide" className="mt-6">
              <SizeGuideComponent
                sizeGuide={product.sizeGuide}
                selectedSize={selectedVariations.size}
                onSizeSelect={(size) => handleVariationChange('size', size)}
              />
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews
                reviews={product.reviews}
                productId={product.id}
              />
            </TabsContent>
          </Tabs>

          {/* Produtos Relacionados */}
          <RelatedProducts
            currentProductId={product.id}
            products={[]} // Será populado com produtos reais
            onAddToCart={(product) => {
              // Implementar lógica de adicionar produto relacionado ao carrinho
              console.log('Adicionar produto relacionado:', product.name);
            }}
          />
        </main>
        
        <Footer />
        <AssistantButton />
      </div>
    </>
  );
};

export default ProductDetailPage;