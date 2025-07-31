"use client"

import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/5584999999999?text=Olá! Gostaria de saber mais sobre o Viral Kids!', '_blank');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-bronze/20 sticky top-0 z-50">
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
              <p className="text-xs text-muted-foreground">Franquia Digital</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('inicio')}
              className="text-foreground hover:text-bronze transition-colors"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection('produtos')}
              className="text-foreground hover:text-bronze transition-colors"
            >
              Produtos
            </button>
            <button 
              onClick={() => scrollToSection('franquia')}
              className="text-foreground hover:text-bronze transition-colors"
            >
              Franquia
            </button>
            <button 
              onClick={() => scrollToSection('contato')}
              className="text-foreground hover:text-bronze transition-colors"
            >
              Contato
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" onClick={() => scrollToSection('franquia')}>
              Seja Franqueado
            </Button>
            <Button variant="whatsapp" onClick={openWhatsApp}>
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-bronze/20">
            <nav className="flex flex-col space-y-4 mt-4">
              <button 
                onClick={() => scrollToSection('inicio')}
                className="text-left text-foreground hover:text-bronze transition-colors"
              >
                Início
              </button>
              <button 
                onClick={() => scrollToSection('produtos')}
                className="text-left text-foreground hover:text-bronze transition-colors"
              >
                Produtos
              </button>
              <button 
                onClick={() => scrollToSection('franquia')}
                className="text-left text-foreground hover:text-bronze transition-colors"
              >
                Franquia
              </button>
              <button 
                onClick={() => scrollToSection('contato')}
                className="text-left text-foreground hover:text-bronze transition-colors"
              >
                Contato
              </button>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" onClick={() => scrollToSection('franquia')}>
                  Seja Franqueado
                </Button>
                <Button variant="whatsapp" onClick={openWhatsApp}>
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;