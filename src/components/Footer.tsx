import { MessageCircle, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useChatbot } from "@/features/chatbot/hooks/useChatbot";
import { useRouter } from "@/router";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { openChatbot } = useChatbot();
  const { navigate } = useRouter();

  const handleChatbotClick = () => {
    openChatbot();
  };

  const openInstagram = () => {
    window.open('https://instagram.com/viral.kids', '_blank');
  };

  const handleFranchiseClick = () => {
    navigate('/franchisees');
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b97e3ab2-d896-4aff-9fdf-47c3d4ba590f.png" 
                alt="Viral Kids Logo" 
                className="h-10 w-auto brightness-200"
              />
              <div>
                <h3 className="text-xl font-bold text-bronze">VIRAL KIDS</h3>
                <p className="text-sm text-background/70">Franquia Digital</p>
              </div>
            </div>
            <p className="text-base text-background/70">
              Transformando sonhos infantis em realidade através de produtos únicos e personalizados.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={handleChatbotClick}
                className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-colors"
                title="Falar com nosso assistente"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              <button 
                onClick={openInstagram}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-2 rounded-lg transition-colors"
                title="Siga-nos no Instagram"
              >
                <Instagram className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-bronze">Produtos</h4>
            <div className="space-y-2 text-base text-background/70">
              <p>Impressão 3D Exclusiva</p>
              <p>Kits Festa Temáticos</p>
              <p>Produtos Virais</p>
              <p>Fantasias & Cosplay</p>
              <p>Brinquedos Educativos</p>
              <p>Personalizações</p>
            </div>
          </div>

          {/* Franchise */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-bronze">Franquia</h4>
            <div className="space-y-2 text-base text-background/70">
              <button 
                onClick={handleFranchiseClick}
                className="text-left hover:text-bronze transition-colors"
              >
                Plano Starter
              </button>
              <button 
                onClick={handleFranchiseClick}
                className="text-left hover:text-bronze transition-colors"
              >
                Plano Premium
              </button>
              <button 
                onClick={handleFranchiseClick}
                className="text-left hover:text-bronze transition-colors"
              >
                Plano Master
              </button>
              <p>Suporte Completo</p>
              <p>Treinamentos</p>
              <p>Material de Marketing</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-bronze">Contato</h4>
            <div className="space-y-3 text-base text-background/70">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-bronze" />
                <span>(84) 98741-4238</span>
              </div>
              <div className="flex items-center space-x-2">
                <Instagram className="h-4 w-4 text-bronze" />
                <span>@viral.kids</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-bronze" />
                <span>contato@viralkids.com.br</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-bronze" />
                <span>Natal/RN - Cobertura Nacional</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-background/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-base text-background/70">
              © {currentYear} Viral Kids. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-base text-background/70">
              <a href="#" className="hover:text-bronze transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-bronze transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-bronze transition-colors">FAQ</a>
            </div>
          </div>
          <div className="text-center mt-4 text-sm text-background/50">
            Desenvolvido com ❤️ para transformar sonhos em realidade
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;