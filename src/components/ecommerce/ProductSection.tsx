import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Palette, Gift, ShoppingCart } from "lucide-react";
import productBike from "@/assets/product-3d-bike.png";
import productSwing from "@/assets/product-3d-swing.png";

const products = [
  {
    id: 1,
    name: "Miniaturas 3D Personalizadas",
    category: "Impressão 3D",
    description: "Crie miniaturas personalizadas das crianças em diferentes cenários e atividades favoritas",
    image: productBike,
    price: "A partir de R$ 89,90",
    features: ["100% Personalizado", "Alta Qualidade", "Diversos Cenários"],
    badge: "Mais Vendido"
  },
  {
    id: 2,
    name: "Coleção Momentos Especiais",
    category: "Impressão 3D",
    description: "Eternize momentos especiais com miniaturas em cenários como balanço, bicicleta, e muito mais",
    image: productSwing,
    price: "A partir de R$ 99,90",
    features: ["Nome Personalizado", "Base Decorativa", "Acabamento Premium"],
    badge: "Novidade"
  }
];

const customizationSteps = [
  {
    icon: Palette,
    title: "1. Escolha o Cenário",
    description: "Selecione entre diversos cenários: bicicleta, balanço, parquinho e muito mais"
  },
  {
    icon: Sparkles,
    title: "2. Personalize",
    description: "Adicione o nome, escolha as cores, roupas e detalhes da miniatura"
  },
  {
    icon: Gift,
    title: "3. Receba em Casa",
    description: "Produzimos e enviamos sua miniatura 3D personalizada com todo cuidado"
  }
];

const ProductSection = () => {
  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-accent text-white border-0">
              Impressão 3D Personalizada
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Personalização em 3D
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Através de fotos ou desenhos, criamos miniaturas únicas para suas crianças, com muito amor e qualidade
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products-3D" className="py-16 container">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <Card 
              key={product.id}
              className="group overflow-hidden border-2 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20">
                {product.badge && (
                  <Badge className="absolute top-4 right-4 z-10 bg-gradient-to-r from-secondary to-accent text-white border-0">
                    {product.badge}
                  </Badge>
                )}
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-[400px] object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-primary font-semibold mb-2">{product.category}</div>
                <h3 className="text-2xl font-bold mb-3">{product.name}</h3>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="border-primary/30">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-2xl font-bold text-primary">{product.price}</div>
                  <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Encomendar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Customization Process */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como Funciona a Personalização
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Um processo simples e criativo para criar produtos únicos e especiais
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {customizationSteps.map((step, idx) => (
              <Card 
                key={idx}
                className="p-8 text-center border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-accent to-secondary">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para Criar Algo Especial?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Entre em contato e vamos criar juntos produtos personalizados que vão encantar as crianças
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Ver Catálogo Completo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductSection;
