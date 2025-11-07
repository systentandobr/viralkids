import { Button } from "@/components/ui/button";
import { MessageCircle, Play, Star } from "lucide-react";
import { Chatbot } from "@/features/chatbot";
import { useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { TrendingUp, Users, Store, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";


const benefits = [
  {
    icon: TrendingUp,
    title: "Crescimento Garantido",
    description: "Marca consolidada com forte presença digital e excelente retorno sobre investimento"
  },
  {
    icon: Users,
    title: "Suporte Completo",
    description: "Treinamento, marketing e suporte operacional contínuo para franqueados"
  },
  {
    icon: Store,
    title: "Layouts Exclusivos",
    description: "Projetos de loja modernos e atrativos que encantam crianças e pais"
  },
  {
    icon: Heart,
    title: "Propósito",
    description: "Faça parte de um negócio que leva alegria e qualidade para famílias"
  }
];

// Vídeo na pasta public - servido diretamente sem processamento do bundler
const heroVideo = "/videos/apresentando_viral_kids.mp4";
const Hero = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile  = useIsMobile();
  const openChatbot = () => {
    setIsChatbotOpen(true);
  };

  const scrollToProducts = () => {
    const element = document.getElementById('produtos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section id="inicio" className="min-h-screen bg-gradient-to-br from-background via-bronze/5 to-gold/10 flex items-center">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-bronze">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-md font-medium">Franquia #1 de Marketplace infantil do Nordeste</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Invista num modelo
                  <span className="text-transparent bg-gradient-hero bg-clip-text"> Comprovado </span>
                  no segmento
                  <span className="text-transparent bg-gradient-hero bg-clip-text">  infantil</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Venha ser mais um franqueado Viral Kids
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={openChatbot}
                  className="group"
                >
                  <MessageCircle className="h-5 w-5 group-hover:animate-pulse" />
                  Falar com Nosso Assistente
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={scrollToProducts}
                  className="group"
                >
                  <Play className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Ver Produtos
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-8 border-t border-bronze/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-bronze">5+</div>
                  <div className="text-md text-muted-foreground">Franquias Ativas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bronze">100+</div>
                  <div className="text-md text-muted-foreground">Produtos Únicos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bronze">1k+</div>
                  <div className="text-md text-muted-foreground">Crianças Felizes</div>
                </div>
              </div>
            </div>

            

            {/* Hero Video */}
            <div className="relative">
              <div className="relative z-10">
                {!isVideoLoaded && (
                  <Skeleton className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl shadow-card" />
                )}
                <video
                  ref={videoRef}
                  src={heroVideo}
                  className={`w-full h-auto rounded-2xl shadow-card animate-float ${
                    isVideoLoaded ? 'block' : 'hidden'
                  }`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onLoadedData={() => setIsVideoLoaded(true)}
                  onCanPlay={() => setIsVideoLoaded(true)}
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-hero text-white px-4 py-2 rounded-full text-md font-medium animate-pulse-glow">
                🎉 Produtos Virais!
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white shadow-bronze px-4 py-2 rounded-full text-md font-medium">
                ✨ 100% Personalizável
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
              <div className="container">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                  Por Que Escolher a ViralKids?
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {benefits.map((benefit, idx) => (
                    <Card
                      key={idx}
                      className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2"
                    >
                      <benefit.icon className="h-12 w-12 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

      {/* Chatbot */}
      {isChatbotOpen && <Chatbot position={isMobile ? "relative" : "fixed"} isChatbotOpen={isChatbotOpen} />}
    </>
  );
};

export default Hero;
