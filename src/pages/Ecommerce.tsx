import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter,
  Grid3X3,
  List,
  Zap,
  Gift,
  Sparkles,
  Bot
} from "lucide-react";
import EcommerceHeader from "@/components/ecommerce/EcommerceHeader";
import ProductCard from "@/components/ecommerce/ProductCard";
import CategoryCard from "@/components/ecommerce/CategoryCard";
import FeaturedBanner from "@/components/ecommerce/FeaturedBanner";
import AssistantButton from "@/components/ecommerce/AssistantButton";
import products01 from "@/assets/products01.png"
import products02 from "@/assets/products02.png"
import products03 from "@/assets/products03.png"
import { useProducts } from "./Ecommerce/hooks/useProducts";


const Ecommerce = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const { categories } = useProducts();

  const featuredProducts = [
    {
      id: 1,
      name: "Vestido Infantil Princesa",
      originalPrice: 89.90,
      salePrice: 69.90,
      image: "/assets/products01.png",
      rating: 4.8,
      reviews: 24,
      badge: "Mais Vendido",
      badgeColor: "bg-red-500",
      isExclusive: false,
      category: "Roupas"
    },
    {
      id: 2,
      name: "Boneca Educativa Inteligente",
      originalPrice: 159.90,
      salePrice: 139.90,
      image: products02,
      rating: 4.9,
      reviews: 18,
      badge: "Novidade",
      badgeColor: "bg-green-500",
      isExclusive: false,
      category: "Brinquedos"
    },
    {
      id: 3,
      name: "Super-Herói Personalizado 3D",
      originalPrice: 89.90,
      salePrice: 79.90,
      image: products03,
      rating: 5.0,
      reviews: 31,
      badge: "Exclusivo 3D",
      badgeColor: "bg-gradient-to-r from-bronze to-gold",
      isExclusive: true,
      category: "Impressão 3D"
    },
    {
      id: 4,
      name: "Conjunto Menino Aventureiro",
      originalPrice: 65.50,
      salePrice: 55.90,
      image: products01,
      rating: 4.7,
      reviews: 15,
      badge: "Promoção",
      badgeColor: "bg-blue-500",
      isExclusive: false,
      category: "Roupas"
    },
    {
      id: 5,
      name: "Boneca Educativa Inteligente",
      originalPrice: 159.90,
      salePrice: 139.90,
      image: products02,
      rating: 4.6,
      reviews: 27,
      badge: "Limitado",
      badgeColor: "bg-purple-500",
      isExclusive: false,
      category: "Educativo"
    },
    {
      id: 6,
      name: "Mochila Escolar Colorida",
      originalPrice: 78.90,
      salePrice: 68.90,
      image: products03,
      rating: 4.5,
      reviews: 12,
      badge: "Volta às Aulas",
      badgeColor: "bg-cyan-500",
      isExclusive: false,
      category: "Acessórios"
    },
    {
      id: 7,
      name: "Kit de Arte Criativa",
      originalPrice: 45.90,
      salePrice: 39.90,
      image: products01,
      rating: 4.8,
      reviews: 33,
      badge: "Best Seller",
      badgeColor: "bg-orange-500",
      isExclusive: false,
      category: "Arte"
    },
    {
      id: 8,
      name: "Miniatura Família Personalizada 3D",
      originalPrice: 120.00,
      salePrice: 99.90,
      image: products03,
      rating: 5.0,
      reviews: 8,
      badge: "Exclusivo 3D",
      badgeColor: "bg-gradient-to-r from-bronze to-gold",
      isExclusive: true,
      category: "Impressão 3D"
    }
  ];

  const exclusiveProducts = featuredProducts.filter(p => p.isExclusive);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-bronze/5">
      <EcommerceHeader />
      
      {/* Hero Banner */}
      <FeaturedBanner />

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Explore por Categoria
            </h2>
            <p className="text-muted-foreground">
              Encontre produtos organizados por categoria
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </div>
        </div>

        {/* Exclusive 3D Products Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <Badge className="bg-gradient-to-r from-bronze to-gold text-white mb-4 px-4 py-2 text-base font-medium">
              ⭐ Produtos Exclusivos
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Criações <span className="text-transparent bg-gradient-hero bg-clip-text">Exclusivas</span> em 3D
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Produtos únicos criados especialmente para você com nossa tecnologia de impressão 3D
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {exclusiveProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="hover:scale-105 transition-all duration-300 hover:shadow-bronze animate-pulse-glow"
              />
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="hero" size="lg" className="group">
              <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
              Ver Todos os Produtos Exclusivos
            </Button>
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge className="bg-bronze/10 text-bronze border-bronze/20 mb-2">
                ⭐ Produtos em Destaque
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Os produtos mais populares selecionados especialmente para você
              </h2>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-base text-muted-foreground">
              <span>8 produto(s) encontrado(s)</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-bronze rounded-full"></div>
                <div className="w-2 h-2 bg-bronze/30 rounded-full"></div>
                <div className="w-2 h-2 bg-bronze/30 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
              />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <Button variant="outline" size="sm">
            Anterior
          </Button>
          <div className="flex gap-2">
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
          </div>
          <Button variant="outline" size="sm">
            Próximo
          </Button>
        </div>
      </div>

      {/* Assistant Button */}
      <AssistantButton />
    </div>
  );
};

export default Ecommerce;