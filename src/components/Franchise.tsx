import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, TrendingUp, Users, MapPin, Clock, DollarSign, Smartphone, Headphones } from "lucide-react";
import franchiseImage from "@/assets/franchise-team.jpg";
import StoreLayoutGallery from "@/components/StoreLayoutGallery";

const Franchise = () => {
  const openWhatsAppFranchise = () => {
    const message = "Olá! Gostaria de saber mais sobre a franquia Viral Kids e como me tornar um franqueado.";
    window.open(`https://wa.me/5584999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  const franchisePackages = [
    {
      name: "Pé no chão",
      price: "R$ 4.997",
      description: "Ideal para começar no mercado",
      features: [
        "Kit aproximado de 100 produtos (para começar a vender)",
        "Selecione os produtos que deseja vender",
        "Serviço de consultoria para redes sociais (Instagram)",
        "Gestão de estoque (online)",
        "Gestão de pedidos e clientes",
        "Marketplace de vendas (online)",
        "Treinamento online (16h)",
        "Catálogo completo (400+ fornecedores)",
        "Suporte via WhatsApp",
        "Material de marketing (ebook e vídeo)",
        "Territorialidade garantida"
      ],
      badge: "Mais Popular",
      popular: false
    },
    {
      name: "Bom para começar",
      price: "R$ 7.997",
      description: "Para quem quer escalar rapidamente",
      features: [
        "Tudo do plano Pé no chão",
        "200 produtos no catálogo",
        "Vendas pelo MarketPlace (integrado)",
        "Sistema completo + automações (online)",
        "Treinamento online (24h)",
        "Suporte prioritário",
        "Consultoria Mensal e replanejamento",
        "Campanhas exclusivas (online)"
      ],
      badge: "Recomendado",
      popular: true
    },
    {
      name: "Voa alto",
      price: "R$ 17.997",
      description: "Solução completa para empreendedores",
      features: [
        "Tudo do plano (Bom para começar)",
        "Catálogo com 300+ produtos (para escalar ainda mais)",
        "Consultoria Premium para vendas (Instagram e Tiktok Shop)",        
        "Treinamento completo (40h)",
        "Consultor dedicado",
        "Kit impressão 3D (para personalizar os produtos)",
        "Mentoria estratégica",
      ],
      badge: "Completo",
      popular: false
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Mercado em Crescimento",
      description: "Setor infantil cresce 15% ao ano no Brasil"
    },
    {
      icon: Users,
      title: "Produtos Exclusivos",
      description: "Mais de 500 produtos únicos e personalizáveis"
    },
    {
      icon: MapPin,
      title: "Territorialidade",
      description: "Exclusividade garantida na sua região"
    },
    {
      icon: Clock,
      title: "Horário Flexível",
      description: "Trabalhe no seu tempo, 100% digital"
    },
    {
      icon: DollarSign,
      title: "Margem Alta",
      description: "Até 60% de margem nos produtos"
    },
    {
      icon: Smartphone,
      title: "Tecnologia Completa",
      description: "Plataforma integrada com automações"
    },
    {
      icon: Headphones,
      title: "Suporte Completo",
      description: "Treinamento e suporte contínuo"
    }
  ];

  return (
    <section id="franquia" className="py-20 bg-gradient-to-b from-bronze/5 to-background">
      {/* Store Layouts Gallery */}
      <StoreLayoutGallery />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-bronze/10 text-bronze border-bronze/20 hover:bg-bronze/20">
            🚀 Oportunidade de Negócio
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Seja um 
            <span className="text-transparent bg-gradient-hero bg-clip-text"> Franqueado </span>
            Viral Kids
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transforme sua paixão pelo universo infantil em um negócio lucrativo. 
            Franquia digital com produtos únicos e suporte completo.
          </p>
        </div>
        
        
        {/* Hero Image */}
        <div className="mb-16">
          <div className="relative max-w-4xl mx-auto">
            <img 
              src={franchiseImage} 
              alt="Franqueados Viral Kids"
              className="w-full h-auto rounded-2xl shadow-card"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Junte-se aos Nossos Franqueados</h3>
              <p className="text-lg opacity-90">Mais de 5 empreendedores já transformaram suas vidas</p>
            </div>
          </div>
        </div>


        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.slice(0, 4).map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="text-center hover:shadow-bronze transition-all duration-300 bg-gradient-card border-bronze/20">
                <CardContent className="p-6">
                  <div className="bg-gradient-bronze text-white p-3 rounded-lg w-fit mx-auto mb-4 shadow-bronze">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-md text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {benefits.slice(4).map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="text-center hover:shadow-bronze transition-all duration-300 bg-gradient-card border-bronze/20">
                <CardContent className="p-6">
                  <div className="bg-gradient-bronze text-white p-3 rounded-lg w-fit mx-auto mb-4 shadow-bronze">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-md text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Franchise Packages */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Escolha o Plano Ideal para Você
            </h3>
            <p className="text-muted-foreground">
              Diferentes opções para diferentes perfis de empreendedores
            </p>
          </div>

          
          <div className="grid md:grid-cols-3 gap-8">
            {franchisePackages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative hover:shadow-bronze transition-all duration-300 ${
                  pkg.popular ? 'ring-2 ring-bronze shadow-bronze' : ''
                } bg-gradient-card border-bronze/20`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-hero text-white px-4 py-1">
                      {pkg.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl text-foreground">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-bronze mb-2">{pkg.price}</div>
                  <p className="text-md text-muted-foreground">{pkg.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full bg-bronze mr-3 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant={pkg.popular ? "hero" : "outline"} 
                    className="w-full mt-6"
                    onClick={openWhatsAppFranchise}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Falar com Consultor
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-hero rounded-2xl p-8 shadow-glow text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Pronto para Começar sua Jornada?
          </h3>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Nosso time está pronto para te ajudar a escolher o melhor plano e começar seu negócio ainda hoje.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={openWhatsAppFranchise}
              className="bg-white text-bronze hover:bg-white/90"
            >
              <MessageCircle className="h-5 w-5" />
              Falar com Consultor
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Download do Material
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Franchise;