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
    window.open(`https://wa.me/5584987414238?text=${encodeURIComponent(message)}`, '_blank');
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
      title: "Impressão 3D Personalizada",
      description: "Criados especialmente para a sua criança",
      items: ["Seu Pequeno super-herói", "Miniaturas de família", "Brinquedos customizados"],
      price: "A partir de R$ 89",
      badge: "Exclusivo",
      color: "bg-gradient-bronze"
    },
    {
      icon: Gift,
      title: "Kits Festa",
      description: "Tudo para uma festa inesquecível (Kits de Festa)",
      items: ["Itens de Decoração", "Kit de Lembrancinhas", "Jogos e atividades"],
      price: "A partir de R$ 59",
      badge: "Completo",
      color: "bg-gradient-to-br from-gold to-bronze"
    },
    {
      icon: Sparkles,
      title: "Produtos Virais",
      description: "O que está bombando na internet",
      items: ["Trending Toys (bombando no momento)", "Fidgets", "Brinquedos articulados",  "Pop its colecionáveis"],
      price: "A partir de R$ 29",
      badge: "Viral",
      color: "bg-gradient-to-br from-bronze to-copper"
    },
    {
      icon: Heart,
      title: "Espaço Kids",
      description: "Para despertar a imaginação",
      items: ["Espaço de brincadeiras", "Artigos para sua festa", "Animais fofinhos", "Super-heróis"],
      price: "Falar com Consultor",
      badge: "Popular",
      color: "bg-gradient-to-br from-copper to-bronze-light"
    }
  ];

  return (
    <section id="produtos" className="py-20 bg-gradient-to-b from-background to-bronze/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        {/* <div className="text-center space-y-4 mb-16">
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