import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import productsImage from "@/assets/products-showcase.jpg";
import productsVideo from "@/assets/videos/andando_de_patinete.mp4";

const FeaturedBanner = () => {
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageTimeoutRef = useRef<number | null>(null);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVideoEnd = () => {
    // Transição suave para a imagem
    setShowVideo(false);
    
    // Limpar timeout anterior se existir
    if (imageTimeoutRef.current) {
      clearTimeout(imageTimeoutRef.current);
    }
    
    // Após 5 segundos mostrando a imagem, voltar ao vídeo
    imageTimeoutRef.current = window.setTimeout(() => {
      setShowVideo(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (imageTimeoutRef.current) {
        clearTimeout(imageTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-bronze/10 via-gold/5 to-copper/10 py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-bronze to-gold text-white px-4 py-2 text-md font-medium">
                🎯 Impressão 3D Personalizada
              </Badge>
              
              <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                Produtos que Inspiram 
                <span className="text-transparent bg-gradient-hero bg-clip-text"> Momentos Únicos</span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Onde criatividade e qualidade se encontram para mostrar um universo de possibilidades
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-2 text-md text-muted-foreground">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <span>4.9/5 • Mais de 100+ famílias satisfeitas</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={() => scrollToSection('principal-produtos')}
                className="group"
              >
                <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
                Explorar Produtos
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                onClick={() => scrollToSection('products-3D')}
                variant="outline" 
                size="lg"
                className="group border-bronze/20 hover:bg-bronze/10"
              >
                Ver Produtos Exclusivos 3D
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-bronze/20">
              <div className="text-center">
                <div className="text-xl font-bold text-bronze">100+</div>
                <div className="text-xs text-muted-foreground">Produtos Únicos</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-bronze">5+</div>
                <div className="text-xs text-muted-foreground">Franquias</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-bronze">100%</div>
                <div className="text-xs text-muted-foreground">Personalizável</div>
              </div>
            </div>
          </div>

          {/* Featured Image/Video */}
          <div className="relative">
            <div className="relative z-10">
              {/* Container para manter o layout */}
              <div className="relative w-full">
                {/* Imagem */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                    showVideo 
                      ? 'opacity-0 pointer-events-none z-0' 
                      : 'opacity-100 pointer-events-auto z-10'
                  }`}
                >
                  <img 
                    src={productsImage} 
                    alt="Produtos em destaque"
                    className="w-full h-auto rounded-2xl shadow-card animate-float"
                  />
                </div>
                
                {/* Vídeo */}
                <div
                  className={`relative transition-opacity duration-300 ease-in-out ${
                    showVideo 
                      ? 'opacity-100 pointer-events-auto z-10' 
                      : 'opacity-0 pointer-events-none z-0'
                  }`}
                >
                  <video
                    ref={videoRef}
                    src={productsVideo}
                    className="w-full h-auto rounded-2xl shadow-card animate-float"
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleVideoEnd}
                  />
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-gradient-hero text-white px-4 py-2 rounded-full text-md font-medium animate-pulse-glow">
              🎉 Novidades!
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white shadow-bronze px-4 py-2 rounded-full text-md font-medium">
              ✨ Entrega Rápida
            </div>
            
            <div className="absolute top-1/2 -left-6 bg-gradient-to-r from-bronze to-gold text-white px-3 py-2 rounded-full text-xs font-medium transform -rotate-12">
              Frete Grátis
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-bronze/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gold/10 to-transparent rounded-full blur-2xl"></div>
    </section>
  );
};

export default FeaturedBanner;