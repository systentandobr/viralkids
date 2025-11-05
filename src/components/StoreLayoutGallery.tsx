import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import storeLayoutA from "@/assets/store-layout-a.png";
import storeLayoutB from "@/assets/store-layout-b.png";
import layoutAnimation from "@/assets/layout-animation.gif";

const layouts = [
  {
    id: 1,
    title: "Layout Clássico com Amarelinha",
    description: "Design acolhedor com parede destaque em vinho e elementos lúdicos interativos.",
    image: storeLayoutA,
    features: ["Amarelinha interativa", "Prateleiras laranja vibrantes", "Área de impressão 3D", "Iluminação focada"]
  },
  {
    id: 2,
    title: "Layout Moderno Tech",
    description: "Ambiente contemporâneo com elementos digitais e design arrojado.",
    image: storeLayoutB,
    features: ["Decoração pixel art", "Mesa central funcional", "Iluminação pendente", "Estações de produto"]
  },
  {
    id: 3,
    title: "Animação dos Layouts",
    description: "Visualize a transformação e dinâmica dos espaços em movimento.",
    image: layoutAnimation,
    features: ["Animação completa", "Transições suaves", "Visão 360°", "Elementos dinâmicos"],
    isGif: true
  }
];

const StoreLayoutGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = layouts.length - 1;
      if (newIndex >= layouts.length) newIndex = 0;
      return newIndex;
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Conheça Nossos Layouts de Loja
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Espaços criativos e modernos desenvolvidos para encantar crianças e pais
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="w-full"
            >
              <Card className="overflow-hidden shadow-2xl border-2">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-muted group">
                    <img
                      src={layouts[currentIndex].image}
                      alt={layouts[currentIndex].title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {layouts[currentIndex].isGif && (
                      <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                        GIF Animado
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-4 right-4"
                      >
                        <Maximize2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col justify-center bg-card">
                    <h3 className="text-3xl font-bold mb-3 text-foreground">
                      {layouts[currentIndex].title}
                    </h3>
                    <p className="text-muted-foreground mb-6 text-lg">
                      {layouts[currentIndex].description}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-primary">
                        Características
                      </h4>
                      <ul className="grid grid-cols-2 gap-3">
                        {layouts[currentIndex].features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                        Solicitar Orçamento
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full w-12 h-12 shadow-lg bg-background/80 backdrop-blur"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full w-12 h-12 shadow-lg bg-background/80 backdrop-blur"
            onClick={() => paginate(1)}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {layouts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex
                    ? "bg-gradient-to-r from-primary to-accent w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreLayoutGallery;
