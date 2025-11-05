import React from 'react';
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import Products from '@/components/Products';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Franchise from '@/components/Franchise';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import { useRouter } from '@/router';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const { navigate } = useRouter();

  const handleAuthClick = () => {
    // Redirecionar para página de autenticação usando o hook de roteamento
    console.log('Navigating to auth page...');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Products />
        <Franchise />
        <Contact />
      </main>
      <Footer />
      
      {/* Botão de Autenticação Flutuante */}
      {!isAuthenticated && (
        <div className="fixed bottom-6 left-6 z-50">
          <Button
            onClick={handleAuthClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            size="lg"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Área do Membro
          </Button>
        </div>
      )}
    </div>
  );
};
