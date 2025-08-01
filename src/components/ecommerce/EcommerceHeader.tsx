import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Heart, 
  ShoppingCart, 
  User,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useChatbot } from "@/features/chatbot/hooks/useChatbot";
import { useRouter } from "@/router";

const EcommerceHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openChatbot } = useChatbot();
  const { navigate } = useRouter();

  const handleChatbotClick = () => {
    openChatbot();
    setIsMenuOpen(false);
  };

  const handleFranchiseClick = () => {
    navigate('/franchisees');
    setIsMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleProductsClick = () => {
    navigate('/ecomm');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-bronze/20 sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-bronze to-gold text-white py-2 text-center text-sm">
        <div className="container mx-auto px-4">
          <p className="font-medium">
            🎉 Produtos Especiais para seu Pequeno - Frete Grátis acima de R$ 150!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/b97e3ab2-d896-4aff-9fdf-47c3d4ba590f.png" 
              alt="Viral Kids Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-bronze">VIRAL KIDS</h1>
              <p className="text-xs text-muted-foreground">Produtos Únicos</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={handleHomeClick}
              className="text-foreground hover:text-bronze transition-colors font-medium bg-transparent border-none cursor-pointer"
            >
              Início
            </button> 
            <button 
              onClick={handleProductsClick}
              className="text-foreground hover:text-bronze transition-colors font-medium bg-transparent border-none cursor-pointer"
            >
              Produtos
            </button>
            <button 
              onClick={handleFranchiseClick}
              className="text-foreground hover:text-bronze transition-colors font-medium bg-transparent border-none cursor-pointer"
            >
              Franquia
            </button>
            <a href="#" className="text-foreground hover:text-bronze transition-colors font-medium">
              Contato
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" onClick={handleChatbotClick} className="relative">
              <MessageCircle className="h-4 w-4" />
              Assistente Virtual
            </Button>
            
            <Button variant="ghost" size="sm" className="relative">
              <Heart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                3
              </Badge>
            </Button>
            
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 bg-bronze text-white text-xs px-1.5 py-0.5 rounded-full">
                2
              </Badge>
            </Button>
            
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center space-x-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Button variant="ghost" size="sm" className="relative mr-2">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 bg-bronze text-white text-xs px-1.5 py-0.5 rounded-full">
                2
              </Badge>
            </Button>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-bronze/20">
            <nav className="flex flex-col space-y-4 mt-4">
              <a href="#" className="text-foreground hover:text-bronze transition-colors font-medium">
                Início
              </a>
              <a href="#" className="text-foreground hover:text-bronze transition-colors font-medium">
                Produtos
              </a>
              <button 
                onClick={handleFranchiseClick}
                className="text-left text-foreground hover:text-bronze transition-colors font-medium bg-transparent border-none cursor-pointer"
              >
                Franquia
              </button>
              <a href="#" className="text-foreground hover:text-bronze transition-colors font-medium">
                Contato
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" onClick={handleChatbotClick}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Assistente Virtual
                </Button>
                <Button variant="ghost" className="justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoritos (3)
                </Button>
                <Button variant="ghost" className="justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Minha Conta
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default EcommerceHeader;