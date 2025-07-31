import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Printer, Gift, Sparkles, Heart } from "lucide-react";
import productsImage from "@/assets/products-showcase.jpg";

const Products = () => {
  const openWhatsApp = (product: string) => {
    const message = `Olá! Gostaria de saber mais sobre: ${product}`;
    window.open(`https://wa.me/5584999999999?text=${encodeURIComponent(message)}`, '_blank');
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

        {/* Featured Product Image */}
        <div className="mb-16">
          <div className="relative max-w-4xl mx-auto">
            <img 
              src={productsImage} 
              alt="Produtos em destaque"
              className="w-full h-auto rounded-2xl shadow-card"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Tecnologia 3D + Criatividade</h3>
              <p className="text-lg opacity-90">Produtos únicos que não existem em lugar nenhum</p>
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
                      <p className="text-sm text-muted-foreground mb-4">
                        {category.description}
                      </p>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center text-sm text-muted-foreground">
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