import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Printer, Gift, Sparkles, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import showCase from "@/assets/products-showcase.jpg";
import banner01 from "@/assets/banner01.png";
import banner02 from "@/assets/banner02.png";
import banner03 from "@/assets/banner03.png";
import banner04 from "@/assets/banner04.png";

const Products = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const openWhatsApp = (product: string) => {
    const message = `Olá! Gostaria de saber mais sobre: ${product}`;
    window.open(`https://wa.me/5584999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleImageError = (index: number) => {
    console.error('Erro ao carregar imagem:', productsImage[index].src);
    setImageErrors(prev => new Set(prev).add(index));
  };

  const productsImage = [
    {
      src: showCase,
      alt: "Tecnologia 3D + Criatividade",
      description: "Produtos únicos que não existem em lugar nenhum"
    },
    {
      src: banner01,
      alt: "Produtos Exclusivos",
      description: "Produtos únicos e exclusivos"
    },
    {
      src: banner02,
      alt: "Decorativos Especiais",
      description: "Decorativos para tornar o ambiente do seu filho mais especial"
    },
    {
      src: banner03,
      alt: "Action Figures e Miniaturas",
      description: "Actions Figures e Miniaturas"
    },
    {
      src: banner04,
      alt: "Fantasias e Cosplay",
      description: "Fantasias e Cosplay"
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const nextImage = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex((prev) => (prev + 1) % productsImage.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevImage = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex((prev) => (prev - 1 + productsImage.length) % productsImage.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToImage = (index: number) => {
    if (!isTransitioning && index !== currentImageIndex) {
      setIsTransitioning(true);
      setCurrentImageIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const productCategories = [
    {
      icon: Printer,
      title: "Impressão 3D Exclusiva",
      description: "Produtos únicos criados especialmente para seu filho",
      items: ["Super-heróis personalizados", "Miniaturas de família", "Brinquedos educativos", "Chaveiros personalizados"],
      price: "A partir de R$ 25",
      badge: "Exclusivo",
      color: "bg-gradient-bronze"
    },
    {
      icon: Gift,
      title: "Kits Festa Temáticos",
      description: "Tudo para uma festa inesquecível",
      items: ["Decoração completa", "Lembrancinhas", "Convites personalizados", "Jogos e atividades"],
      price: "A partir de R$ 89",
      badge: "Completo",
      color: "bg-gradient-to-br from-gold to-bronze"
    },
    {
      icon: Sparkles,
      title: "Produtos Virais",
      description: "O que está bombando na internet",
      items: ["Fidget toys", "Slimes especiais", "Pop its colecionáveis", "Trending toys"],
      price: "A partir de R$ 15",
      badge: "Viral",
      color: "bg-gradient-to-br from-bronze to-copper"
    },
    {
      icon: Heart,
      title: "Fantasias & Cosplay",
      description: "Para despertar a imaginação",
      items: ["Personagens famosos", "Profissões", "Animais fofos", "Super-heróis"],
      price: "A partir de R$ 45",
      badge: "Popular",
      color: "bg-gradient-to-br from-copper to-bronze-light"
    }
  ];

  return (
    <section id="produtos" className="py-20 bg-gradient-to-b from-background to-bronze/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-bronze/10 text-bronze border-bronze/20 hover:bg-bronze/20">
            🎯 Produtos Únicos
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Produtos que Fazem a 
            <span className="text-transparent bg-gradient-hero bg-clip-text"> Diferença</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mais de 500 produtos únicos, desde impressão 3D personalizada até os produtos mais virais da internet. 
            Tudo pensado para criar momentos mágicos na vida das crianças.
          </p>
        </div>

        {/* Carousel de Imagens */}
        <div className="mb-16">
          <div className="relative max-w-4xl mx-auto">
            {/* Container do Carousel */}
            <div className="relative overflow-hidden rounded-2xl shadow-card" style={{ height: '400px' }}>
              {/* Imagens */}
              <div 
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentImageIndex * (100 / productsImage.length)}%)`,
                  width: `${productsImage.length * 100}%`
                }}
              >
                {productsImage.map((image, index) => (
                  <div 
                    key={index}
                    className="relative h-full flex-shrink-0"
                    style={{ 
                      width: `${100 / productsImage.length}%`
                    }}
                  >
                    {imageErrors.has(index) ? (
                      // Fallback quando imagem não carrega
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <div className="text-center text-gray-600">
                          <div className="text-4xl mb-2">🖼️</div>
                          <div className="text-md font-medium">Imagem não disponível</div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full">
                        <img 
                          src={image.src} 
                          alt={image.alt}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(index)}
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white z-10">
                      <h3 className="text-2xl font-bold mb-2">{image.alt}</h3>
                      <p className="text-lg opacity-90">{image.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botões de Navegação */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm z-20"
                disabled={isTransitioning}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm z-20"
                disabled={isTransitioning}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Indicadores */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {productsImage.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    disabled={isTransitioning}
                  />
                ))}
              </div>

              {/* Contador */}
              <div className="absolute top-4 right-4 bg-black/30 text-white px-3 py-1 rounded-full text-md backdrop-blur-sm z-20">
                {currentImageIndex + 1} / {productsImage.length}
              </div>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {productCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="group hover:shadow-bronze transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-bronze/20">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg ${category.color} text-white shadow-bronze`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.badge}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {category.title}
                      </h3>
                      <p className="text-md text-muted-foreground mb-4">
                        {category.description}
                      </p>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center text-md text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-bronze mr-2"></div>
                          {item}
                        </div>
                      ))}
                    </div>

                    {/* Price & CTA */}
                    <div className="pt-4 border-t border-bronze/20">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-bronze">{category.price}</span>
                        <span className="text-xs text-muted-foreground">Em até 12x</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-bronze group-hover:text-white"
                        onClick={() => openWhatsApp(category.title)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Consultar Preços
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-card rounded-2xl p-8 shadow-card border border-bronze/20">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Não encontrou o que procura?
          </h3>
          <p className="text-muted-foreground mb-6">
            Criamos produtos personalizados sob demanda! Fale conosco e vamos realizar o sonho do seu filho.
          </p>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => openWhatsApp("Produto Personalizado")}
            className="group"
          >
            <MessageCircle className="h-5 w-5 group-hover:animate-pulse" />
            Solicitar Produto Personalizado
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;