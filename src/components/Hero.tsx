import { Button } from "@/components/ui/button";
import { MessageCircle, Play, Star } from "lucide-react";
import { Chatbot } from "@/features/chatbot";
import { useState } from "react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

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
                  <span className="text-sm font-medium">Franquia Digital #1 do Nordeste</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Transforme 
                  <span className="text-transparent bg-gradient-hero bg-clip-text"> Sonhos </span>
                  em 
                  <span className="text-transparent bg-gradient-hero bg-clip-text"> Realidade</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Produtos únicos e personalizados para o universo infantil. 
                  Impressão 3D exclusiva, kits temáticos e tudo que está viral na internet!
                </p>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <span>4.9/5 • Mais de 500 famílias satisfeitas</span>
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
                  <div className="text-2xl font-bold text-bronze">25+</div>
                  <div className="text-sm text-muted-foreground">Franquias Ativas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bronze">500+</div>
                  <div className="text-sm text-muted-foreground">Produtos Únicos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bronze">10k+</div>
                  <div className="text-sm text-muted-foreground">Crianças Felizes</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={heroImage} 
                  alt="Produtos Viral Kids"
                  className="w-full h-auto rounded-2xl shadow-card animate-float"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-hero text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse-glow">
                🎉 Produtos Virais!
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white shadow-bronze px-4 py-2 rounded-full text-sm font-medium">
                ✨ 100% Personalizável
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      {isChatbotOpen && <Chatbot position="fixed" />}
    </>
  );
};

export default Hero;
