import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const handleGoHome = () => {
    window.location.hash = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="p-12">
            {/* Error Code */}
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text mb-4">
                404
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto rounded-full"></div>
            </div>

            {/* Error Message */}
            <div className="mb-8 space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Oops! Página não encontrada
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                A página que você está procurando não existe ou foi movida para outro lugar.
              </p>
            </div>

            {/* Illustration */}
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-16 h-16 text-purple-500" />
              </div>
              <p className="text-md text-gray-500">
                Parece que nos perdemos no mundo da imaginação...
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleGoHome} size="lg" className="flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Voltar ao Início</span>
              </Button>
              
              <Button variant="outline" onClick={handleGoBack} size="lg" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Página Anterior</span>
              </Button>
            </div>

            {/* Help Links */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-md text-gray-600 mb-4">
                Precisa de ajuda? Experimente estas páginas:
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a 
                  href="#/"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Página Inicial
                </a>
                <a 
                  href="#/login"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Login
                </a>
                <a 
                  href="#/register"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Criar Conta
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center mt-8">
          <p className="text-md text-gray-500">
            Se você acha que isso é um erro, entre em contato conosco via{' '}
            <a 
              href="https://wa.me/5584999999999" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
